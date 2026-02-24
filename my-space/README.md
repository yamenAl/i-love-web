# My Space — Portfolio · Yamen Al Sharabi

A second-year front-end portfolio built with **SvelteKit 5**, **Three.js**, and **CesiumJS**.
Developed at the Amsterdam University of Applied Sciences (HvA), academic year 2025–26.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — animated hero, GSAP horizontal-scroll cards, Spline 3D scene |
| `/deep` | Second-year portfolio — Locomotive scroll, Three.js WebGL hand, interactive 3D cube projection |
| `/city` | Amsterdam 3D — real LoD 2 building geometry centred on Dam Square, powered by CesiumJS and the 3D BAG dataset, with clickable landmark cards |
| `/sprits` | Sprint archive — grid of sprint cards |
| `/sprits/[slug]` | Individual sprint detail page |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [SvelteKit 5](https://kit.svelte.dev) + Svelte 5 runes (`$state`, `$props`) |
| 3D (WebGL) | [Three.js](https://threejs.org) — custom geometry, OrbitControls, RAF loop |
| 3D City | [CesiumJS v1.122](https://cesium.com) — same engine as 3d.amsterdam.nl, loaded from CDN |
| Building tiles | [3D BAG v2](https://3dbag.nl) (TU Delft) + Amsterdam municipality service — LoD 2 geometry with actual roof shapes, free, no API key |
| Base imagery | [CartoDB Dark Matter](https://carto.com/basemaps) — free raster tiles matching dark navy palette |
| Smooth scroll | [Locomotive Scroll v5](https://locomotivescroll.com) (wraps Lenis) |
| Animations | [GSAP 3](https://gsap.com) + ScrollTrigger — loaded from CDN |
| Spline | [@splinetool/runtime](https://spline.design) — 3D scene in the hero |
| Styling | Vanilla CSS custom properties + [Tailwind CSS v3](https://tailwindcss.com) |
| Build | [Vite 7](https://vitejs.dev) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18

### Install & run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/i-love-web.git
cd i-love-web/my-space

# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
my-space/
├── src/
│   ├── lib/
│   │   ├── assets/
│   │   │   ├── images/          # Parallax layer images
│   │   │   └── styles/
│   │   │       └── styleguide.css   # Global CSS custom properties / design tokens
│   │   └── components/
│   │       ├── atoms/           # Button, Icon, Input, Link
│   │       ├── molecules/       # Card, NavItem
│   │       └── organisms/       # Header, Footer, Navigation
│   └── routes/
│       ├── +layout.svelte       # Root layout — sticky header, theme store
│       ├── +page.svelte         # Home page
│       ├── city/
│       │   ├── +page.server.js  # Static metadata
│       │   └── +page.svelte     # Amsterdam 3D city (CesiumJS + 3D BAG tiles)
│       ├── deep/
│       │   ├── +page.server.js  # Gallery data
│       │   └── +page.svelte     # Second-year portfolio (Three.js + Locomotive)
│       └── sprits/
│           ├── +page.server.js
│           ├── +page.svelte
│           └── [slug]/
│               ├── +page.server.js
│               └── +page.svelte
├── static/                      # Favicon and public assets
├── .gitignore
├── package.json
├── svelte.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Amsterdam 3D City (`/city`)

The city page renders a **true 3D model** of Amsterdam using CesiumJS (the same engine
powering [3d.amsterdam.nl](https://3d.amsterdam.nl)):

1. **CartoDB Dark Matter** — dark navy raster tiles as base imagery. Free, no API key.

2. **Amsterdam municipality tile service** — the city's own 3D Tiles endpoint, identical
   to what 3d.amsterdam.nl serves. Tried first.

3. **3D BAG v2 fallback** (TU Delft) — national Dutch building dataset covering all of the
   Netherlands. Used if the municipality server is unreachable.

Buildings have **LoD 2 geometry** — actual sloped roofs, dormers, and stepped gables,
not flat-topped boxes. A `Cesium3DTileStyle` applies a dark navy → blue-grey colour ramp
based on each building's maximum roof height (`h_dak_max`).

### Landmark cards

Eight landmarks around Dam Square have interactive pins:

- **De Dam** — Dam Square
- **Koninklijk Paleis** — Royal Palace (1648–1665)
- **Nieuwe Kerk** — coronation church (c. 1408)
- **Nationaal Monument** — WWII memorial obelisk
- **Madame Tussauds Amsterdam**
- **De Bijenkorf** — art-deco department store
- **Westerkerk** — Rembrandt's burial church
- **Anne Frank House** — Prinsengracht 263

Click any pin to open an info card. Click the map to close it.

### Controls

| Action | Effect |
|--------|--------|
| Drag | Rotate / pan the camera |
| Scroll | Zoom in / out — more geometry loads as you get closer |
| Right-click drag | Tilt the camera up or down |
| 2D / 3D button | Toggle between tilted 3D (450 m) and flat top-down (1 400 m) |

---

## Design Tokens

All colours, spacing, typography, and shadows are defined as CSS custom properties in
[`src/lib/assets/styles/styleguide.css`](src/lib/assets/styles/styleguide.css).

Key tokens:

```css
--background-color-dark-navy:   hsl(226, 48%, 6%);
--accent-color-blue-primary:    hsl(230, 100%, 76%);   /* #86a0ff */
--accent-color-teal-secondary:  hsl(170,  70%, 58%);   /* #4bd6c8 */
--text-color-white-primary:     hsl(229, 100%, 95%);
--text-color-white-muted:       hsl(230, 100%, 86%);
```

---

## License

This project is for educational purposes at HvA.
Building data © [3D BAG](https://3dbag.nl) by TU Delft / BAG (Kadaster), derived from OpenStreetMap.
Base tiles © [CARTO](https://carto.com), © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
