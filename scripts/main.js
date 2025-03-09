// Import GSAP for Scroll Effects
document.addEventListener("DOMContentLoaded", function () {
    const script1 = document.createElement("script");
    script1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
    document.body.appendChild(script2);

    script2.onload = function () {
        gsap.registerPlugin(ScrollTrigger);

        // Fade-In Effect on Scroll
        gsap.from("h1, h2, p, .project", {
            opacity: 0,
            y: 50,
            duration: 1.5,
            stagger: 0.3,
            scrollTrigger: {
                trigger: "h1",
                start: "top 90%",
                end: "bottom 80%",
                scrub: true,
            }
        });

        // Video Zoom Effect
        gsap.from("video", {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: "video",
                start: "top 75%",
                end: "bottom 50%",
                scrub: true,
            }
        });

        // Image Slide-in Effect
        gsap.from(".project img", {
            opacity: 0,
            x: -100,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".portfolio",
                start: "top 75%",
                end: "bottom 50%",
                scrub: true,
            }
        });
    };
});
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");

    function autoScroll() {
        if (slider) {
            slider.scrollBy({ left: 150, behavior: "smooth" });
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
                slider.scrollLeft = 0;
            }
        }
    }
    setInterval(autoScroll, 2000);
});

