// ===== Menu toggle =====
const openB = document.querySelector(".menu");
openB?.addEventListener("click", () => {
  document.querySelector("nav")?.classList.toggle("nav-open");
  document.body.classList.toggle("menu-open");
  openB.setAttribute("aria-expanded", document.body.classList.contains("menu-open") ? "true" : "false");
});

// ===== Footer year =====
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

/* ===== HERO: per-letter slide-in (right -> place) ===== */
function splitToLetters(el){
  if (!el || el.dataset.splitted === "1") return;
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.textContent = "";
  [...text].forEach(ch => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });
  el.dataset.splitted = "1";
}
function animateHero(selector, delay = 0){
  const el = document.querySelector(selector);
  if (!el) return;
  splitToLetters(el);
  const chars = el.querySelectorAll(".char");
  gsap.fromTo(chars,
    { x: "1em", opacity: 0 },
    {
      x: "0em",
      opacity: 1,
      ease: "power3.out",
      stagger: 0.035,
      duration: 0.5,
      delay
    }
  );
}

// ===== Horizontal scroll + panel line-in animations =====
function initScroll() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".horizontal-scroll-sec");
  const wrap  = document.querySelector(".scroll-wrap");
  if (!track || !wrap) return;

  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  if (distance() <= 1) return;

  // Move the track to the LEFT so we browse left→right
  const scroller = gsap.to(track, { x: () => -distance(), ease: "none" });

  ScrollTrigger.create({
    trigger: wrap,
    start: "top top",
    end: () => `+=${distance()}`,
    pin: true,
    animation: scroller,
    scrub: 1,
    invalidateOnRefresh: true
    // ,markers:true
  });

  // Each panel's lines slide in from the right, every time it enters
  const panels = gsap.utils.toArray(".article-wrapper");
  panels.forEach((panel) => {
    const lines = panel.querySelectorAll(".line");
    if (!lines.length) return;

    gsap.fromTo(lines,
      { xPercent: 40, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scroller,
          start: "left center",
          end: "center center",
          scrub: true
        }
      }
    );
  });

  ScrollTrigger.refresh();
}

// Run hero letters as soon as DOM is ready, then init scroll after assets
document.addEventListener("DOMContentLoaded", () => {
  animateHero(".home-typer-h1", 0.05);
  animateHero(".home-typer-h2", 0.25);
});
window.addEventListener("load", initScroll);
