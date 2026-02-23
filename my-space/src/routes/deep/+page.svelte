<script>
  import { onMount, onDestroy } from "svelte";

  let { data } = $props();

  let locomotiveScroll;
  let zoomSection;
  let featureSection;
  let canvasEl;
  let projSection;
  let projCanvasEl;
  let projHandle;

  // Three.js live scroll value — read by the RAF loop
  let liveScroll = 0;
  let rafId;
  let threeCleanup;

  // Projection switcher state
  let activeProj = $state(0);

  const cards = [
    { n: "01", text: "Component-first UI design" },
    { n: "02", text: "Accessibility by default" },
    { n: "03", text: "Performance budgets & optimisations" },
    { n: "04", text: "Responsive, mobile-first layouts" },
    { n: "05", text: "Animation with Three.js & CSS" },
    { n: "06", text: "Progressive enhancement & offline" },
    { n: "07", text: "Testing, CI and reliable builds" },
    { n: "08", text: "Design systems and tokens" },
    { n: "09", text: "Collaboration & code reviews" },
  ];

  onMount(async () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Load both libraries in parallel
    const [{ default: LocomotiveScroll }, THREE] = await Promise.all([
      import("locomotive-scroll"),
      import("three"),
    ]);
    await import("locomotive-scroll/locomotive-scroll.css");

    // ── Three.js 3D hand (Lenis-website style WebGL background) ──────
    if (!reducedMotion && canvasEl) {
      threeCleanup = initThreeHand(THREE, canvasEl);
    }

    // ── Locomotive Scroll (Lenis smooth scroll) ───────────────────────
    locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      },
      scrollCallback({ scroll }) {
        if (reducedMotion) return;
        liveScroll = scroll;
        updateZoom(scroll);
        updateFeatureCards(scroll);
        updateProjection(scroll);
      },
    });

    // ── Projection cube grid (at end of page) ────────────────────────
    if (!reducedMotion && projCanvasEl) {
      // Wait one rAF so CSS has sized the canvas
      await new Promise((r) => requestAnimationFrame(r));
      projHandle = await initProjectionScene(THREE, projCanvasEl);
    }
  });

  // ── Three.js scene setup (background hand) ─────────────────────────
  function initThreeHand(THREE, canvas) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 10;

    scene.add(new THREE.AmbientLight(0x86a0ff, 0.6));
    const keyLight = new THREE.DirectionalLight(0x4bd6c8, 1.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x86a0ff, 1.0);
    rimLight.position.set(-4, -2, 2);
    scene.add(rimLight);

    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x070b1a,
      transparent: true,
      opacity: 0.85,
      roughness: 0.9,
      metalness: 0.05,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x86a0ff,
      transparent: true,
      opacity: 0.35,
    });

    function boxPart(px, py, pz, bw, bh, bd, rz = 0) {
      const geo = new THREE.BoxGeometry(bw, bh, bd);
      const group = new THREE.Group();
      const solid = new THREE.Mesh(geo, solidMat);
      const lines = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        edgeMat,
      );
      group.add(solid);
      group.add(lines);
      group.position.set(px, py, pz);
      if (rz) group.rotation.z = rz;
      return group;
    }

    const hand = new THREE.Group();
    hand.add(boxPart(0, 0, 0, 1.8, 1.6, 0.3));
    [
      [-0.62, 0.34, 1.9],
      [-0.21, 0.34, 2.1],
      [0.21, 0.32, 1.95],
      [0.6, 0.27, 1.45],
    ].forEach(([fx, fw, fh], i) => {
      const yOff = i === 3 ? 0.15 : 0;
      hand.add(boxPart(fx, 0.8 + fh / 2 + yOff, 0, fw, fh, 0.26));
    });
    hand.add(boxPart(-1.12, -0.05, 0, 0.55, 1.25, 0.26, Math.PI / 5));
    hand.position.set(2.6, -1.6, -0.5);
    hand.rotation.set(-0.15, 0.5, 0.05);
    scene.add(hand);

    const startMs = Date.now();
    function tick() {
      rafId = requestAnimationFrame(tick);
      const t = (Date.now() - startMs) / 1000;
      const maxScroll = Math.max(
        1,
        document.body.scrollHeight - window.innerHeight,
      );
      const scrollNorm = Math.min(1, liveScroll / maxScroll);
      hand.rotation.y = 0.5 + scrollNorm * Math.PI * 1.5;
      hand.rotation.x = -0.15 + scrollNorm * 0.4;
      hand.position.y = -1.6 + Math.sin(t * 0.55) * 0.14;
      hand.rotation.z = 0.05 + Math.sin(t * 0.35) * 0.04;
      renderer.render(scene, camera);
    }
    tick();

    function onResize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }

  // ── Projection cube grid scene — faithful Codrops implementation ───────
  // Reference: https://github.com/Efetivos/video-projection-codrops
  //  • Canvas 2D mask → pixel brightness determines which cubes appear
  //  • Three separate pre-built grid_groups (heart / X / smile)
  //  • BoxGeometry UV array modified per-cube — no custom GLSL shader
  //  • Manual GSAP-style stagger (index * 0.001 s per cube)
  //  • OrbitControls for drag-to-rotate mouse interaction
  async function initProjectionScene(THREE, canvas) {
    const { OrbitControls } = await import(
      "three/examples/jsm/controls/OrbitControls.js"
    );

    const W = Math.max(canvas.offsetWidth, 100);
    const H = Math.max(canvas.offsetHeight, 100);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);

    // Background colour shifts per active projection
    const bgHex = [0x060814, 0x04080a, 0x08060a];
    renderer.setClearColor(bgHex[0], 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(57, W / H, 0.1, 100);
    camera.position.set(0, 0, 12);

    // OrbitControls — drag to rotate; pan and zoom disabled
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;

    // ── Textures ───────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const textures = [
      loader.load(data.gallery[1].src),
      loader.load(data.gallery[2].src),
      loader.load(data.gallery[4].src),
    ];

    // ── Grid parameters — matching Codrops original (24 × 24) ──────────
    const N = 24; // 24 × 24 grid — same as the original repo
    const spacing = 0.55; // centre-to-centre distance
    const cubeSize = 0.46; // cube edge length
    // ── Mask generation via Canvas 2D ──────────────────────────────────
    // White background = no cube; black shape = cube exists.
    // Brightness < 128  →  mask[i] = 1  →  create a cube at that cell.
    function createMask(drawFn) {
      const mc = document.createElement("canvas");
      mc.width = N;
      mc.height = N;
      const ctx = mc.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, N, N);
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#000";
      drawFn(ctx, N);
      const px = ctx.getImageData(0, 0, N, N).data;
      const mask = new Uint8Array(N * N);
      for (let i = 0; i < N * N; i++) {
        mask[i] = (px[i * 4] + px[i * 4 + 1] + px[i * 4 + 2]) / 3 < 128 ? 1 : 0;
      }
      return mask;
    }

    // Heart — standard parametric heart curve
    // x(t) = 16 sin³(t),  y(t) = 13cos(t) − 5cos(2t) − 2cos(3t) − cos(4t)
    // Param bounding box: x ∈ [−16, 16] (span 32), y ∈ [−17, 12] (span 29, centre −2.5)
    // Scale so the x-range fills (n−4) pixels → 2 px margin each side
    const maskHeart = createMask((ctx, n) => {
      const scale = (n - 4) / 32; // uniform scale: 2-px margin on each side in x
      const cx = n / 2; // canvas centre x
      const cy = n / 2; // maps to the parametric y-centre (−2.5)
      const paramCY = -2.5;
      ctx.beginPath();
      for (let i = 0; i <= 628; i++) {
        const t = (i / 628) * Math.PI * 2;
        const px = 16 * Math.pow(Math.sin(t), 3);
        const py =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
        const x = cx + px * scale;
        const y = cy - (py - paramCY) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.fill();
    });

    // X — two diagonal strokes
    const maskX = createMask((ctx, n) => {
      ctx.lineWidth = n * 0.22;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(n * 0.12, n * 0.12);
      ctx.lineTo(n * 0.88, n * 0.88);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(n * 0.88, n * 0.12);
      ctx.lineTo(n * 0.12, n * 0.88);
      ctx.stroke();
    });

    // Smile — outer circle + smile arc + two eyes
    const maskSmile = createMask((ctx, n) => {
      const cx = n / 2,
        cy = n / 2,
        r = n * 0.41;
      ctx.lineWidth = n * 0.11;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.12, r * 0.52, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      const er = n * 0.055;
      ctx.beginPath();
      ctx.arc(cx - r * 0.37, cy - r * 0.22, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.37, cy - r * 0.22, er, 0, Math.PI * 2);
      ctx.fill();
    });

    const shapeMasks = [maskHeart, maskX, maskSmile];

    // ── Build one Three.js grid_group per shape ────────────────────────
    // UV array of each BoxGeometry is remapped so the cube shows only
    // its 1/N × 1/N tile of the projected image — same technique as original.
    function buildGrid(mask, texIdx) {
      const group = new THREE.Group();
      const tex = textures[texIdx];
      const uvW = 1 / N;
      const uvH = 1 / N;

      for (let gy = 0; gy < N; gy++) {
        for (let gx = 0; gx < N; gx++) {
          // Flip Y: canvas row 0 = image top; gy = 0 = bottom of 3D grid
          const maskRow = N - 1 - gy;
          if (!mask[maskRow * N + gx]) continue;

          const geo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const uvAttr = geo.attributes.uv;
          const arr = uvAttr.array;
          const uvX = gx * uvW;
          const uvY = gy * uvH;

          // Remap every UV pair to this cube's tile region
          for (let k = 0; k < arr.length; k += 2) {
            arr[k] = uvX + arr[k] * uvW;
            arr[k + 1] = uvY + arr[k + 1] * uvH;
          }
          uvAttr.needsUpdate = true;

          const mat = new THREE.MeshBasicMaterial({ map: tex });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(
            (gx - (N - 1) / 2) * spacing,
            (gy - (N - 1) / 2) * spacing,
            -3, // starts behind the focal plane; animates to z = 0
          );
          mesh.scale.setScalar(0.001);
          group.add(mesh);
        }
      }
      return group;
    }

    // Pre-build all 3 grids simultaneously — matching original approach
    const grids = shapeMasks.map((mask, i) => buildGrid(mask, i));
    grids.forEach((g) => scene.add(g));

    // ── Stagger animation — manual equivalent of GSAP timeline ─────────
    // Original: tl.to(child.scale, {x:1,y:1,z:1}, index * 0.001)
    //           tl.to(child.position, {z:0}, '<')
    const STAGGER = 0.001; // seconds of delay per cube index
    const CUBE_DUR = 0.4; // duration of each cube's animation

    let activeIdx = 0;
    const revealAt = [Date.now() / 1000, null, null]; // first grid reveals immediately
    const hideAt = [null, null, null];

    // Per-cube hover scaling — cubes near the cursor grow individually
    const HALF_H = Math.tan((57 * Math.PI) / 360) * 12; // half-height of view at z=0 ≈ 6.52
    const HOVER_RADIUS = 2.0; // world-unit radius of the hover bulge
    let mouseWorldX = 0,
      mouseWorldY = 0,
      isHovering = false;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    function easeIn(t) {
      return t * t * t;
    }

    let projRafId;
    function tick() {
      projRafId = requestAnimationFrame(tick);
      const now = Date.now() / 1000;

      controls.update();

      grids.forEach((group, gi) => {
        const rAt = revealAt[gi];
        const hAt = hideAt[gi];

        group.children.forEach((child, idx) => {
          const delay = idx * STAGGER;
          let baseScale = 0.001;

          if (rAt !== null) {
            const elapsed = now - rAt - delay;
            if (elapsed <= 0) {
              child.position.z = -3;
            } else {
              const e = easeOut(Math.min(1, elapsed / CUBE_DUR));
              baseScale = e;
              child.position.z = (1 - e) * -3;
            }
          } else if (hAt !== null) {
            const elapsed = now - hAt - delay;
            if (elapsed <= 0) {
              baseScale = 1;
              child.position.z = 0;
            } else {
              const e = easeIn(Math.min(1, elapsed / CUBE_DUR));
              baseScale = 1 - e;
              child.position.z = e * -3;
            }
          } else {
            child.position.z = -3;
          }

          // Hover bulge — cubes near the cursor grow individually
          let finalScale = baseScale;
          if (gi === activeIdx && isHovering && baseScale > 0.5) {
            const dx = child.position.x - mouseWorldX;
            const dy = child.position.y - mouseWorldY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < HOVER_RADIUS) {
              const proximity = 1 - dist / HOVER_RADIUS;
              finalScale = baseScale * (1 + proximity * proximity * 0.8);
            }
          }

          child.scale.setScalar(Math.max(0.001, finalScale));
        });
      });

      renderer.render(scene, camera);
    }
    projRafId = requestAnimationFrame(tick);

    function onResize() {
      const nw = canvas.offsetWidth,
        nh = canvas.offsetHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    }
    window.addEventListener("resize", onResize);

    return {
      setProgress() {},
      // Convert NDC coords (−1..1) → world space for hover bulge
      setMouse(nx, ny) {
        mouseWorldX = nx * HALF_H;
        mouseWorldY = -ny * HALF_H; // flip: canvas Y down, world Y up
        isHovering = true;
      },
      clearMouse() {
        isHovering = false;
      },
      switchTo(index) {
        if (index === activeIdx) return;
        const now = Date.now() / 1000;
        // Start hiding the current grid
        hideAt[activeIdx] = now;
        revealAt[activeIdx] = null;
        // Start revealing the new grid with a short lead-in
        activeIdx = index;
        hideAt[activeIdx] = null;
        revealAt[activeIdx] = now + 0.15;
        renderer.setClearColor(bgHex[index], 1);
      },
      destroy() {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(projRafId);
        controls.dispose();
        renderer.dispose();
      },
    };
  }

  function updateZoom(scroll) {
    if (!zoomSection) return;
    const top = zoomSection.offsetTop;
    const scrollable = zoomSection.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const p = Math.max(0, Math.min(1, (scroll - top) / scrollable));
    zoomSection.style.setProperty("--p", p);
  }

  function updateFeatureCards(scroll) {
    if (!featureSection) return;
    const top = featureSection.offsetTop;
    const scrollable = featureSection.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const p = Math.max(0, Math.min(1, (scroll - top) / scrollable));
    const revealed = Math.min(cards.length - 1, Math.floor(p * cards.length));
    featureSection.querySelectorAll(".fc").forEach((el, i) => {
      el.classList.toggle("current", i <= revealed);
    });
  }

  function updateProjection(scroll) {
    if (!projSection || !projHandle) return;
    const top = projSection.offsetTop;
    const wh = window.innerHeight;
    const p = Math.max(0, Math.min(1, (scroll - (top - wh)) / (wh * 1.5)));
    projHandle.setProgress(p);
  }

  // Projection mouse handlers
  function handleProjMouse(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    projHandle?.setMouse(nx, ny);
  }

  function handleProjLeave() {
    projHandle?.clearMouse();
  }

  function switchProj(i) {
    activeProj = i;
    projHandle?.switchTo(i);
  }

  onDestroy(() => {
    threeCleanup?.();
    projHandle?.destroy();
    locomotiveScroll?.destroy();
  });
</script>

<svelte:head>
  <title>Second Year — Yamen</title>
  <meta
    name="description"
    content="A second-year portfolio: sprint projects, experiments and growth in front-end development."
  />
</svelte:head>

<!-- ── Three.js WebGL canvas — fixed, behind all content ───────────────── -->
<canvas class="bg-canvas" bind:this={canvasEl} aria-hidden="true"></canvas>
<div class="bg-glow" aria-hidden="true"></div>

<!-- ── HERO ────────────────────────────────────────────────────────────── -->
<section class="hero">
  <div class="hero__bg-wrap">
    <img
      class="hero__bg"
      src={data.hero.src}
      alt={data.hero.alt}
      loading="eager"
      data-scroll
      data-scroll-speed="-4"
    />
    <div class="hero__overlay"></div>
  </div>

  <div class="hero__content">
    <p class="hero__eyebrow reveal" data-scroll data-scroll-class="in-view">
      Second-year portfolio
    </p>
    <h1
      class="hero__title reveal"
      data-scroll
      data-scroll-class="in-view"
      style="--d:0.1s"
    >
      From classroom to code
    </h1>
    <p
      class="hero__sub reveal"
      data-scroll
      data-scroll-class="in-view"
      style="--d:0.22s"
    >
      A collection of sprint projects, experiments, and lessons from my second
      year at university — design, engineering, and growth.
    </p>
  </div>

  <div class="hero__hint" aria-hidden="true">
    <span class="hero__hint-line"></span>
    <span class="hero__hint-label">scroll</span>
  </div>
</section>

<!-- ── ZOOM SECTION ────────────────────────────────────────────────────── -->
<section class="zoom-section" bind:this={zoomSection} style="--p:0">
  <div class="zoom-sticky">
    <div class="zoom-bg">
      <img src={data.gallery[3].src} alt="" loading="eager" />
      <div class="zoom-bg__veil"></div>
    </div>

    <div class="zoom-outer" aria-hidden="true">
      <p class="zoom-outer__line">dive into</p>
      <p class="zoom-outer__line zoom-outer__line--right">the work</p>
    </div>

    <span class="zoom-enter" aria-hidden="true">SPRINTS</span>
    <div class="zoom-sweep" aria-hidden="true"></div>
  </div>
</section>

<!-- ── FEATURE CARDS ──────────────────────────────────────────────────── -->
<section class="feat-section" bind:this={featureSection}>
  <div class="feat-sticky">
    <p class="feat-label reveal" data-scroll data-scroll-class="in-view">
      Nine sprint highlights
    </p>

    {#each cards as card, i}
      <div class="fc" style="--i:{i}">
        <div class="fc__inner">
          <p class="fc__num">{card.n}</p>
          <p class="fc__text">{card.text}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- ── ABOUT SECTION ─────────────────────────────────────────────────── -->
<section class="about section-padding">
  <div class="about__grid">
    <div class="about__sticky">
      <h2 class="about__title" data-scroll data-scroll-class="visible">
        <span class="about__line" style="--i:0"><span>About</span></span>
        <span class="about__line" style="--i:1"><span>the</span></span>
        <span class="about__line" style="--i:2"><span>journey.</span></span>
      </h2>
    </div>

    <aside class="about__items">
      <div class="about__item reveal" data-scroll data-scroll-class="in-view">
        <p class="about__body">
          I'm Yamen Al Sharabi — a front-end developer in training at the
          Amsterdam University of Applied Sciences. This page collects the
          projects I shipped during my second year: sprint-based work,
          experiments, and small prototypes that taught me real-world
          engineering skills. Expect clear UI, performance-minded choices, and
          thoughtful accessibility.
        </p>
      </div>

      <div
        class="about__item reveal"
        data-scroll
        data-scroll-class="in-view"
        style="--d:0s"
      >
        <h3 class="about__item-title">What I build</h3>
        <p class="about__body">
          I build landing pages, web apps, and interactive components. Each
          sprint I focused on a single, shippable outcome — from responsive UIs
          to small WebGL demos — improving architecture, tests, and deployment
          along the way.
        </p>
      </div>

      <div
        class="about__item reveal"
        data-scroll
        data-scroll-class="in-view"
        style="--d:0s"
      >
        <h3 class="about__item-title">How I work</h3>
        <p class="about__body">
          Sketch → prototype → test → iterate. I follow a sprint rhythm: short
          iterations with clear acceptance criteria, demos, and retrospectives.
          I value feedback, readable code, and steady improvement.
        </p>
      </div>

      <div
        class="about__item reveal"
        data-scroll
        data-scroll-class="in-view"
        style="--d:0s"
      >
        <h3 class="about__item-title">What drives me</h3>
        <p class="about__body">
          Accessibility, performance, and pragmatic tooling drive my work. I use
          Svelte, Three.js, and modern CSS with an eye toward fast-loading,
          accessible interfaces. I'm also exploring CI/CD and back-end basics to
          ship end-to-end features.
        </p>
      </div>
    </aside>
  </div>
</section>

<!-- ── FULL-WIDTH PHOTO 1 ──────────────────────────────────────────────── -->
<div class="photo-full">
  <div class="photo-full__wrap">
    <img
      class="photo-full__img"
      src={data.gallery[0].src}
      alt={data.gallery[0].alt}
      loading="lazy"
      data-scroll
      data-scroll-speed="-3"
    />
  </div>
  <p class="photo-full__caption reveal" data-scroll data-scroll-class="in-view">
    {data.gallery[0].caption}
  </p>
</div>

<!-- ── DIPTYCH ─────────────────────────────────────────────────────────── -->
<div class="diptych section-padding">
  <div class="diptych__col">
    <div class="pbox">
      <img
        class="pbox__img"
        src={data.gallery[1].src}
        alt={data.gallery[1].alt}
        loading="lazy"
        data-scroll
        data-scroll-speed="-2"
      />
    </div>
    <p class="caption reveal" data-scroll data-scroll-class="in-view">
      {data.gallery[1].caption}
    </p>
  </div>

  <div class="diptych__col diptych__col--offset">
    <div class="pbox">
      <img
        class="pbox__img"
        src={data.gallery[2].src}
        alt={data.gallery[2].alt}
        loading="lazy"
        data-scroll
        data-scroll-speed="-1"
      />
    </div>
    <p class="caption reveal" data-scroll data-scroll-class="in-view">
      {data.gallery[2].caption}
    </p>
  </div>
</div>

<!-- ── PULL QUOTE ──────────────────────────────────────────────────────── -->
<section class="pullquote section-padding">
  <blockquote
    class="pullquote__text reveal"
    data-scroll
    data-scroll-class="in-view"
  >
    "Code is a practice — it gets better with each sprint."
  </blockquote>
</section>

<!-- ── FULL-WIDTH PHOTO 2 ──────────────────────────────────────────────── -->
<div class="photo-full">
  <div class="photo-full__wrap">
    <img
      class="photo-full__img"
      src={data.gallery[3].src}
      alt={data.gallery[3].alt}
      loading="lazy"
      data-scroll
      data-scroll-speed="-3"
    />
  </div>
  <p class="photo-full__caption reveal" data-scroll data-scroll-class="in-view">
    {data.gallery[3].caption}
  </p>
</div>

<!-- ── TRIPTYCH ────────────────────────────────────────────────────────── -->
<div class="triptych section-padding">
  {#each data.gallery.slice(4) as photo, i}
    <div
      class="triptych__item reveal"
      data-scroll
      data-scroll-class="in-view"
      style="--d:{i * 0.11}s"
    >
      <div class="pbox pbox--square">
        <img
          class="pbox__img"
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          data-scroll
          data-scroll-speed={i === 0 ? "-2" : i === 1 ? "0" : "2"}
        />
      </div>
      <p class="caption">{photo.caption}</p>
    </div>
  {/each}
</div>

<!-- ── PROJECTION SECTION ─────────────────────────────────────────────── -->
<!--
	Inspired by the Codrops / vwlab video-projection effect:
  • 10×10 Three.js cube grid — each cube shows its tile of a project snapshot
	• Mouse hover rotates the grid interactively (±35° Y, ±25° X)
	• 3 numbered buttons switch the projected image with a transition:
	    exit → cubes collapse → texture swaps → cubes rebuild centre-first
	• Scroll into section triggers the initial centre-outward reveal
-->
<section class="proj-section" bind:this={projSection}>
  <header class="proj-header">
    <p class="proj-eyebrow reveal" data-scroll data-scroll-class="in-view">
      Projects in pixels
    </p>
    <p
      class="proj-hint reveal"
      data-scroll
      data-scroll-class="in-view"
      style="--d:0.12s"
    >
      Hover to explore project snapshots — use the buttons below to switch
      views.
    </p>
  </header>

  <!-- Canvas wrapper — captures mouse events for interactive rotation -->
  <div
    class="proj-wrap"
    onmousemove={handleProjMouse}
    onmouseleave={handleProjLeave}
    role="img"
    aria-label="Interactive 3D project projection"
  >
    <canvas class="proj-canvas" bind:this={projCanvasEl} aria-hidden="true"
    ></canvas>
  </div>

  <!-- 3 projection switcher buttons — heart / X / checkmark -->
  <nav class="proj-tabs" aria-label="Projection options">
    <!-- 01 · Heart -->
    <button
      class="proj-tab"
      class:active={activeProj === 0}
      onclick={() => switchProj(0)}
      aria-label="Design Systems projection"
      aria-pressed={activeProj === 0}
    >
      <svg viewBox="0 0 32 30" fill="none" aria-hidden="true">
        <path
          d="M16 28 C16 28 1 17.5 1 9 C1 4.3 4.8 0.5 9.5 0.5
					   C12.3 0.5 14.8 2.1 16 4.2 C17.2 2.1 19.7 0.5 22.5 0.5
					   C27.2 0.5 31 4.3 31 9 C31 17.5 16 28 16 28 Z"
          fill="currentColor"
        />
      </svg>
    </button>

    <!-- 02 · X -->
    <button
      class="proj-tab"
      class:active={activeProj === 1}
      onclick={() => switchProj(1)}
      aria-label="Interactive Experiments projection"
      aria-pressed={activeProj === 1}
    >
      <svg
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <line x1="4" y1="4" x2="24" y2="24" />
        <line x1="24" y1="4" x2="4" y2="24" />
      </svg>
    </button>

    <!-- 03 · Nike swoosh / checkmark -->
    <button
      class="proj-tab"
      class:active={activeProj === 2}
      onclick={() => switchProj(2)}
      aria-label="Visual Studies projection"
      aria-pressed={activeProj === 2}
    >
      <svg
        viewBox="0 0 44 30"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M2 18 Q10 28 19 18 Q28 8 42 2" />
      </svg>
    </button>
  </nav>

  <p
    class="proj-caption reveal"
    data-scroll
    data-scroll-class="in-view"
    style="--d:0.2s"
  >
    Project fragments — one portfolio.
  </p>
</section>

<!-- ── CLOSING ──────────────────────────────────────────────────────────── -->
<footer class="closing section-padding">
  <p class="closing__text reveal" data-scroll data-scroll-class="in-view">
    More to come — the learning never stops.
  </p>
  <a
    class="cta-link closing__link reveal"
    href="/"
    data-scroll
    data-scroll-class="in-view"
    style="--d:0.14s"
  >
    ← Back home
  </a>
</footer>

<style>
  /* ── REVEAL ─────────────────────────────────────────────────────────── */
  .reveal {
    opacity: 0;
    transform: translateY(38px);
    transition:
      opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--d, 0s),
      transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--d, 0s);
  }
  :global(.reveal.in-view) {
    opacity: 1;
    transform: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  /* ── BACKGROUND CANVAS + GLOW ───────────────────────────────────────── */
  .bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    display: block;
  }
  .bg-glow {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse 90% 70% at 72% 68%,
      hsl(230 100% 65% / 0.07) 0%,
      hsl(170 70% 58% / 0.04) 45%,
      transparent 70%
    );
  }

  /* ── HERO ──────────────────────────────────────────────────────────── */
  .hero {
    position: relative;
    z-index: 1;
    height: 100vh;
    height: 100dvh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  .hero__bg-wrap {
    position: absolute;
    inset: -15%;
    z-index: 0;
  }
  .hero__bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      hsl(226 48% 4%) 0%,
      hsl(226 48% 6% / 0.7) 50%,
      hsl(226 48% 6% / 0.2) 100%
    );
  }
  .hero__content {
    position: relative;
    z-index: 1;
    padding: 0 var(--spacing-extra-large) var(--spacing-extra-large);
    max-width: 900px;
  }
  .hero__eyebrow {
    font-size: var(--font-size-small-text);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-color-teal-secondary);
    margin-bottom: var(--spacing-small);
  }
  .hero__title {
    font-size: clamp(72px, 14vw, 180px);
    font-weight: var(--font-weight-bold);
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: var(--text-color-white-primary);
    margin: 0 0 var(--spacing-medium);
  }
  .hero__sub {
    font-size: var(--font-size-hero-subtitle);
    color: var(--text-color-white-muted);
    max-width: 40ch;
  }
  .hero__hint {
    position: absolute;
    bottom: var(--spacing-large);
    right: var(--spacing-extra-large);
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    animation: hintFade 2s ease 1.6s both;
  }
  @keyframes hintFade {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 0.45;
      transform: none;
    }
  }
  .hero__hint-line {
    display: block;
    width: 1px;
    height: 52px;
    background: var(--text-color-white-primary);
    transform-origin: 50% 0%;
    animation: hintPulse 2.2s ease-in-out 1.6s infinite;
  }
  @keyframes hintPulse {
    0%,
    100% {
      transform: scaleY(1);
      opacity: 0.45;
    }
    50% {
      transform: scaleY(0.3);
      opacity: 0.1;
    }
  }
  .hero__hint-label {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-color-white-muted);
    writing-mode: vertical-rl;
  }

  /* ── ZOOM SECTION ──────────────────────────────────────────────────── */
  .zoom-section {
    position: relative;
    z-index: 1;
    height: 600vh;
  }
  .zoom-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(226 48% 4%);
  }
  .zoom-bg {
    position: absolute;
    inset: 0;
    opacity: clamp(0, calc((var(--p, 0) - 0.5) * 2.6), 1);
    transform: scale(calc(1.18 - var(--p, 0) * 0.18));
    will-change: opacity, transform;
  }
  .zoom-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .zoom-bg__veil {
    position: absolute;
    inset: 0;
    background: hsl(226 48% 4% / 0.42);
  }
  .zoom-outer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(24px, 5vw, 60px);
    transform: scale(calc(1 + var(--p, 0) * 4));
    opacity: clamp(0, calc(1 - var(--p, 0) * 3.5), 1);
    will-change: transform, opacity;
    pointer-events: none;
  }
  .zoom-outer__line {
    font-size: clamp(13px, 2vw, 21px);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-color-white-muted);
    margin: 0;
  }
  .zoom-outer__line--right {
    text-align: right;
    align-self: flex-end;
  }
  .zoom-enter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(calc(0.03 + var(--p, 0) * 10));
    transform-origin: 50% 50%;
    opacity: clamp(0, calc(var(--p, 0) * 4.5), 1);
    white-space: nowrap;
    font-size: clamp(80px, 22vw, 240px);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    color: var(--text-color-white-primary);
    will-change: transform, opacity;
    pointer-events: none;
    user-select: none;
  }
  .zoom-sweep {
    position: absolute;
    inset: 0;
    background: hsl(226 48% 4%);
    transform: scaleX(clamp(0, calc((var(--p, 0) - 0.82) * 5.5), 1));
    transform-origin: 50% 50%;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .zoom-section {
      height: auto;
    }
    .zoom-sticky {
      position: static;
    }
    .zoom-outer {
      opacity: 1;
      transform: none;
    }
    .zoom-enter {
      opacity: 0;
      transform: translate(-50%, -50%);
    }
    .zoom-bg {
      opacity: 0;
    }
    .zoom-sweep {
      display: none;
    }
  }

  /* ── FEATURE CARDS ──────────────────────────────────────────────────── */
  .feat-section {
    --card-size: clamp(200px, 34vw, 320px);
    --margin: clamp(16px, 4vw, 48px);
    position: relative;
    z-index: 1;
  }
  .feat-sticky {
    padding: clamp(60px, 10vw, 120px) var(--spacing-extra-large);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-medium);
  }
  .feat-label {
    font-size: var(--font-size-small-text);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-color-teal-secondary);
    margin-bottom: var(--spacing-small);
  }
  .fc {
    width: 100%;
  }
  .fc__inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    aspect-ratio: 1;
    width: 100%;
    max-width: var(--card-size);
    padding: clamp(16px, 3vw, 28px);
    background: hsl(0 0% 100% / 0.07);
    border: 1px solid hsl(0 0% 100% / 0.13);
    border-radius: var(--border-radius-medium);
  }
  .fc__num {
    font-size: clamp(36px, 8vw, 72px);
    font-weight: var(--font-weight-bold);
    line-height: 0.9;
    color: var(--accent-color-blue-primary);
    margin: 0;
  }
  .fc__text {
    font-size: clamp(14px, 2.4vw, 22px);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1.1;
    color: var(--text-color-white-primary);
    margin: 0;
  }
  @media (min-width: 768px) {
    .feat-section {
      height: 900vh;
    }
    .feat-sticky {
      flex-direction: unset;
      gap: unset;
      padding: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }
    .feat-label {
      position: absolute;
      top: var(--margin);
      right: var(--margin);
      z-index: 2;
    }
    .fc {
      position: absolute;
      width: var(--card-size);
      will-change: transform, opacity;
      top: calc(
        var(--i, 0) * (100vh - var(--card-size) - 2 * var(--margin)) / 8
      );
      left: calc(
        var(--i, 0) * (100vw - var(--card-size) - 2 * var(--margin)) / 8
      );
      transition:
        opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1),
        transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .fc:not(.current) {
      transform: translate3d(100%, 100%, 0);
      opacity: 0;
    }
    :global(.fc.current) {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    .fc__inner {
      width: var(--card-size);
      max-width: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fc,
    .fc:not(.current) {
      transform: none;
      opacity: 1;
      transition: none;
    }
    .feat-section {
      height: auto;
    }
    .feat-sticky {
      position: static;
    }
  }

  /* ── ABOUT ──────────────────────────────────────────────────────────── */
  .about {
    position: relative;
    z-index: 1;
    padding-top: clamp(80px, 14vw, 200px);
    padding-bottom: clamp(80px, 14vw, 200px);
  }
  .about__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(48px, 8vw, 80px);
  }
  .about__title {
    font-size: clamp(40px, 9vw, 110px);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--text-color-white-primary);
    margin: 0;
  }
  .about__line {
    display: block;
    overflow: hidden;
    width: 100%;
  }
  .about__line > span {
    display: inline-block;
    transform: translateY(105%);
  }
  :global(.about__title.visible) .about__line > span {
    transform: translateY(0);
    transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)
      calc(200ms * var(--i, 0));
  }
  @media (prefers-reduced-motion: reduce) {
    .about__line > span {
      transform: none;
    }
    :global(.about__title.visible) .about__line > span {
      transition: none;
    }
  }
  .about__items {
    display: flex;
    flex-direction: column;
    gap: clamp(48px, 10vw, 120px);
  }
  .about__item-title {
    font-size: clamp(15px, 2.2vw, 22px);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-color-blue-primary);
    margin: 0 0 var(--spacing-small);
  }
  .about__body {
    font-size: clamp(16px, 2.4vw, 20px);
    line-height: 1.75;
    color: var(--text-color-white-muted);
    margin: 0;
  }
  @media (min-width: 768px) {
    .about__grid {
      grid-template-columns: 1fr 1fr;
      align-items: start;
      gap: clamp(48px, 6vw, 100px);
    }
    .about__sticky {
      position: sticky;
      top: 33%;
      border-left: 3px solid var(--accent-color-blue-primary);
      padding-left: clamp(20px, 2.8vw, 36px);
    }
  }

  /* ── PHOTO / GALLERY ────────────────────────────────────────────────── */
  .photo-full {
    position: relative;
    z-index: 1;
  }
  .photo-full__wrap {
    overflow: hidden;
    height: clamp(280px, 64vh, 720px);
  }
  .photo-full__img {
    width: 100%;
    height: 130%;
    object-fit: cover;
    display: block;
    margin-top: -15%;
  }
  .photo-full__caption {
    padding: var(--spacing-medium) var(--spacing-extra-large);
    font-size: var(--font-size-small-text);
    color: var(--text-color-white-muted);
    font-style: italic;
  }
  .pbox {
    overflow: hidden;
    width: 100%;
    aspect-ratio: 3 / 4;
  }
  .pbox--square {
    aspect-ratio: 1;
  }
  .pbox__img {
    width: 100%;
    height: 130%;
    object-fit: cover;
    display: block;
    margin-top: -15%;
  }
  .diptych {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-large);
    padding-top: clamp(60px, 10vw, 130px);
    padding-bottom: clamp(60px, 10vw, 130px);
  }
  .caption {
    margin-top: var(--spacing-small);
    font-size: var(--font-size-small-text);
    color: var(--text-color-white-muted);
    font-style: italic;
  }
  .pullquote {
    position: relative;
    z-index: 1;
    padding-top: clamp(80px, 14vw, 200px);
    padding-bottom: clamp(80px, 14vw, 200px);
  }
  .pullquote__text {
    font-size: clamp(28px, 6vw, 76px);
    font-weight: var(--font-weight-bold);
    line-height: 1.18;
    color: var(--text-color-white-primary);
    letter-spacing: -0.015em;
    border: none;
    margin: 0;
    padding: 0;
  }
  .triptych {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-large);
    padding-top: clamp(40px, 8vw, 110px);
    padding-bottom: clamp(80px, 12vw, 180px);
  }
  @media (min-width: 768px) {
    .diptych {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
    .diptych__col--offset {
      margin-top: clamp(60px, 10vw, 130px);
    }
    .triptych {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* ── PROJECTION SECTION ─────────────────────────────────────────────
	   Inspired by the Codrops / vwlab video-projection effect.
	   Layout: eyebrow → canvas (mouse-interactive) → 3 tab buttons → caption
	   ─────────────────────────────────────────────────────────────────── */
  .proj-section {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(28px, 4vw, 52px);
    padding: clamp(80px, 12vw, 160px) var(--spacing-extra-large);
    background: hsl(226 48% 3%);
  }
  .proj-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.5vw, 16px);
  }
  .proj-eyebrow {
    font-size: var(--font-size-small-text);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-color-teal-secondary);
    margin: 0;
  }
  .proj-hint {
    font-size: clamp(12px, 1.6vw, 15px);
    color: var(--text-color-white-muted);
    margin: 0;
  }

  /* Canvas wrapper — accepts mouse events, grows on hover */
  .proj-wrap {
    width: min(84vw, 72vh);
    height: min(84vw, 72vh);
    cursor: crosshair;
    border-radius: var(--border-radius-medium);
    outline: 1px solid hsl(0 0% 100% / 0.08);
    transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
  }
  .proj-canvas {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  /* ── 3 projection switcher buttons — heart / X / checkmark ─────────── */
  .proj-tabs {
    display: flex;
    gap: clamp(14px, 2.5vw, 28px);
    align-items: center;
  }
  /* Circular icon button */
  .proj-tab {
    width: clamp(60px, 9vw, 88px);
    height: clamp(60px, 9vw, 88px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(0 0% 100% / 0.05);
    border: 1px solid hsl(0 0% 100% / 0.12);
    border-radius: 50%;
    color: hsl(0 0% 100% / 0.35);
    cursor: pointer;
    transition:
      background 0.35s ease,
      border-color 0.35s ease,
      color 0.35s ease,
      transform 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  }
  .proj-tab svg {
    /* Icon fills ~45% of the button diameter */
    width: 45%;
    height: 45%;
  }
  .proj-tab:hover {
    background: hsl(0 0% 100% / 0.11);
    border-color: hsl(0 0% 100% / 0.28);
    color: var(--text-color-white-primary);
    transform: scale(1.12);
  }
  .proj-tab.active {
    background: hsl(230 100% 65% / 0.15);
    border-color: var(--accent-color-blue-primary);
    color: var(--accent-color-blue-primary);
    transform: scale(1.12);
  }
  .proj-caption {
    font-size: clamp(14px, 2vw, 18px);
    color: var(--text-color-white-muted);
    font-style: italic;
    text-align: center;
    max-width: 40ch;
    margin: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .proj-wrap {
      display: none;
    }
    .proj-canvas {
      display: none;
    }
  }

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  .closing {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-large);
    padding-top: clamp(60px, 10vw, 150px);
    padding-bottom: clamp(80px, 14vw, 200px);
  }
  .closing__text {
    font-size: clamp(20px, 4vw, 38px);
    color: var(--text-color-white-muted);
  }
  .closing__link {
    font-size: var(--font-size-card-body-text);
    align-self: flex-start;
  }
</style>
