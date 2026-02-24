# How we use Tailwind, PostCSS, media queries, keyframes & GSAP

A short guide to the styling and animation tools in this project. You can read it to understand how we use them and where to learn more.

---

## 1. Tailwind CSS

**What it is:** A CSS framework where you use small utility classes (like `flex`, `p-4`, `text-primary-text`) in your HTML/Svelte instead of one big stylesheet with long class names.

**How we use it:**
- In `app.css` we have `@tailwind base`, `@tailwind components`, `@tailwind utilities`. That tells Tailwind to generate the CSS.
- We use `@apply` inside `@layer base` to use Tailwind classes inside our own CSS (e.g. `@apply h-full bg-transparent`).
- In `tailwind.config.js` we add our own colors (`primary`, `secondary`, `muted`) and font (`sans`). So we can write `text-primary-text` and it uses our color.
- The `content` array tells Tailwind which files to scan for class names. Only classes that appear there end up in the final CSS, so the bundle stays small.

**Learn more:**
- [Tailwind CSS docs – Installation](https://tailwindcss.com/docs/installation)
- [Tailwind CSS – Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
- [Tailwind – Customizing the theme (colors, fonts)](https://tailwindcss.com/docs/theme-configuration)

---

## 2. PostCSS

**What it is:** A tool that runs after you write CSS and transforms it. It doesn’t replace CSS; it runs plugins (like Tailwind and Autoprefixer) on your CSS files.

**How we use it:**
- In `postcss.config.js` we have two plugins:
  - **tailwindcss** – reads our Tailwind directives (`@tailwind base` etc.) and our config, and outputs the utility CSS.
  - **autoprefixer** – adds vendor prefixes (e.g. `-webkit-`, `-ms-`) so older browsers understand things like `backdrop-filter` or `flexbox`. We don’t write those by hand; PostCSS adds them when we build.

So when we run `npm run build`, Vite runs PostCSS on `app.css`, Tailwind generates the classes we use, and Autoprefixer adds prefixes. The result is one (or more) CSS file that works in more browsers.

**Learn more:**
- [PostCSS – What is PostCSS?](https://postcss.org/)
- [PostCSS – Plugins (incl. autoprefixer)](https://postcss.org/docs/postcss-plugins)
- [Autoprefixer on GitHub](https://github.com/postcss/autoprefixer)

---

## 3. Media queries

**What they are:** CSS that only runs when a condition is true. For example `@media (min-width: 768px)` means “when the screen is at least 768px wide”.

**How we use them:**
- We use **mobile first**: the default styles are for small screens (phone). Then we use `@media (min-width: 768px)` to change the layout for tablet and desktop.
- Example: on mobile the horizontal-scroll section stacks and scrolls normally. At 768px and up we use `display: flex`, `overflow: hidden`, and GSAP does the horizontal scroll.
- We also use `@media (prefers-reduced-motion: reduce)` so if the user has “reduce motion” on we don’t animate the hero letters; we just show them.

So: one set of rules by default (mobile), and media queries change things for bigger screens or for accessibility. See also `docs/MOBILE-FIRST.txt`.

**Learn more:**
- [MDN – Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [MDN – prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [web.dev – Responsive design](https://web.dev/articles/responsive-web-design-basics)

---

## 4. Keyframes (CSS animations)

**What they are:** You define a short animation (from one state to another) and attach it to an element with `animation: name duration …`. The browser runs it over time.

**How we use them:**
- **spin:** `@keyframes spin { to { transform: rotate(360deg); } }` – one full rotation. We use it for the Spline loader in `SplineScene.svelte` (the spinner has `animation: spin 1s linear infinite`).
- **nameReveal:** hero letters start a bit to the right and invisible (`translateX(1em)`, `opacity: 0`) and end at normal position and visible (`translateX(0)`, `opacity: 1`). Each letter has a delay based on `--hero-letter-index` so they appear one after another. We define this in `+page.svelte` in a `<style>` block.

So: keyframes live in the component that uses them (SplineScene has spin, +page has nameReveal). No duplicate definitions.

**Learn more:**
- [MDN – @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)
- [MDN – animation (shorthand)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [web.dev – CSS animations](https://web.dev/learn/css/animations/)

---

## 5. GSAP (GreenSock Animation Platform)

**What it is:** A JavaScript library for animations. You change properties (position, opacity, etc.) over time with code. It’s good for scroll-linked animations and things that are hard to do with CSS alone.

**How we use it:**
- We load GSAP and ScrollTrigger from a CDN in `+page.svelte`. We wait up to 8 seconds; if they don’t load we leave horizontal scroll as normal overflow.
- **ScrollTrigger** “pins” the horizontal-scroll container and ties its horizontal movement to the user’s scroll. So when you scroll down, the inner track moves left instead of the page scrolling away.
- For each scroll card we animate the lines inside: they start at `xPercent: 40, opacity: 0` and go to `xPercent: 0, opacity: 1` as the card comes into view, with a small delay between lines.
- We call `ScrollTrigger.refresh()` on window resize so the pinning and distances stay correct.

So: GSAP does the horizontal scroll and the card text animations; CSS does the rest (layout, theme, loader and hero letter keyframes).

**Learn more:**
- [GSAP – Getting started](https://gsap.com/docs/v3/GettingStarted/)
- [ScrollTrigger – docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP – ScrollTrigger demos](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#demo)

---

## Quick reference in this project

| Thing           | Where we use it |
|----------------|------------------|
| Tailwind       | `app.css` (@tailwind, @apply), `tailwind.config.js` (colors, font) |
| PostCSS        | `postcss.config.js` (tailwind + autoprefixer) |
| Media queries  | `+page.svelte` (768px for horizontal scroll, reduced-motion for hero), `Header.svelte` (768px for nav) |
| Keyframes      | `+page.svelte` (nameReveal for hero), `SplineScene.svelte` (spin for loader) |
| GSAP           | `+page.svelte` (load from CDN, initHorizontalScroll, ScrollTrigger) |

**If you want to change:**  
- Colors or fonts → `tailwind.config.js` and styleguide CSS variables.  
- Scroll or card animation → `initHorizontalScroll` in `+page.svelte`.  
- Mobile vs desktop breakpoint → look for `768px` in `+page.svelte` and `Header.svelte`; see `docs/MOBILE-FIRST.txt`.
