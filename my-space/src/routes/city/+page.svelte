<script>
  /**
   * Amsterdam 3D City — /city
   *
   * Two-phase rendering strategy:
   *
   * Phase 1 — "space"  : CesiumJS renders the real spherical Earth from orbit
   *                       and performs a 5-second cinematic fly-in to Dam Square.
   *
   * Phase 2 — "map"    : MapLibre GL JS takes over with dark navy vector tiles,
   *                       3D building extrusions, and clickable landmark pins.
   *
   * Both libraries load in parallel so the crossfade is instant once the
   * fly-in animation finishes.
   */

  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import amsterdamSceneUrl from '$lib/assets/3d/amsterdam_scene.glb?url';

  let { data } = $props();

  // ── DOM refs ─────────────────────────────────────────────────────────────
  let cesiumEl;
  let mapEl;

  // ── Library instances ─────────────────────────────────────────────────────
  let viewer;          // CesiumJS Viewer
  let Cesium;
  let map;             // MapLibre Map
  let markerEls = [];  // MapLibre HTML markers (to remove on destroy)

  // ── State ─────────────────────────────────────────────────────────────────
  // phase: 'space' → globe visible  |  'diving' → fly-in in progress
  //        'transitioning' → crossfade  |  'map' → MapLibre active
  let phase          = $state('space');
  let isLoaded       = $state(false);  // globe rendered → show "Dive In" button
  let isDiving       = $state(false);  // button clicked → hide button, show progress
  let is3D           = $state(true);
  let activeLandmark = $state(null);

  // ── Camera constants — Dam Square ─────────────────────────────────────────
  const DAM_LNG = 4.8932;
  const DAM_LAT = 52.3728;

  // ── MapLibre dark navy palette ────────────────────────────────────────────
  const C = {
    bg:    'hsl(226, 48%,  4%)',
    water: 'hsl(226, 48%,  7%)',
    land:  'hsl(226, 48%,  5%)',
    park:  'hsl(226, 40%,  6%)',
    road:  'hsl(226, 30%, 12%)',
    roadM: 'hsl(226, 30%, 18%)',
    label: 'hsl(230, 80%, 70%)',
  };

  /**
   * Landmark pins around Dam Square.
   * lngLat: [longitude, latitude]
   */
  const LANDMARKS = [
    {
      id: 'dam',
      lngLat: [4.8932, 52.3728],
      pin: '⬟',
      name: 'Dam Square',
      sub: 'Damplein · est. 1270',
      tag: 'Public Square',
      body: 'The beating heart of Amsterdam since the 13th century. A dam on the Amstel river gave the city its name. Today it hosts the Royal Palace, the Nieuwe Kerk, the National Monument, and millions of visitors every year.',
    },
    {
      id: 'palace',
      lngLat: [4.8906, 52.3731],
      pin: '♛',
      name: 'Koninklijk Paleis',
      sub: 'Royal Palace · built 1648–1665',
      tag: 'Royal Palace',
      body: 'Originally Amsterdam\'s City Hall, designed by Jacob van Campen. One of the largest buildings in 17th-century Europe. Napoleon\'s brother turned it into a palace in 1808; it remains an official residence of the Dutch royal family.',
    },
    {
      id: 'kerk',
      lngLat: [4.8919, 52.3737],
      pin: '✦',
      name: 'Nieuwe Kerk',
      sub: 'New Church · c. 1408',
      tag: 'Historic Church',
      body: 'Despite the name, one of Amsterdam\'s oldest churches. The coronation church of Dutch monarchs — King Willem-Alexander was crowned here in 2013. Today hosts state ceremonies and major exhibitions.',
    },
    {
      id: 'monument',
      lngLat: [4.8934, 52.3727],
      pin: '◈',
      name: 'Nationaal Monument',
      sub: 'WWII Memorial · unveiled 1956',
      tag: 'War Memorial',
      body: '22-metre white obelisk commemorating victims of World War II. Unveiled by Queen Juliana on 4 May 1956. Twelve urns embedded in the base hold soil from the wartime provinces and the former Dutch East Indies.',
    },
    {
      id: 'bijenkorf',
      lngLat: [4.8942, 52.3736],
      pin: '▲',
      name: 'De Bijenkorf',
      sub: 'Department Store · 1915',
      tag: 'Shopping',
      body: 'Amsterdam\'s flagship luxury department store — "The Beehive". The striking building faces the Dam and is one of the most recognisable art-deco facades in the city centre.',
    },
    {
      id: 'madame',
      lngLat: [4.8934, 52.3735],
      pin: '◉',
      name: 'Madame Tussauds',
      sub: 'Wax Museum · since 1990',
      tag: 'Museum',
      body: 'Amsterdam branch of the famous wax museum, directly on the Dam. Over 100 lifelike figures of celebrities, royals, and historical icons across multiple themed floors.',
    },
    {
      id: 'westerkerk',
      lngLat: [4.8837, 52.3745],
      pin: '✦',
      name: 'Westerkerk',
      sub: 'West Church · 1631 · 85 m',
      tag: 'Historic Church',
      body: 'Tallest church tower in Amsterdam. Rembrandt van Rijn was buried here in 1669. Anne Frank could hear the Westerkerk bells from her hiding place on Prinsengracht — she wrote about them in her diary.',
    },
    {
      id: 'annefrank',
      lngLat: [4.8840, 52.3752],
      pin: '◆',
      name: 'Anne Frank House',
      sub: 'Prinsengracht 263 · museum',
      tag: 'Museum',
      body: 'The Secret Annexe where Anne Frank and her family hid from 1942 to 1944. Her diary, kept in hiding, became one of the most widely read accounts of the Holocaust. Now a UNESCO-recognised museum.',
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  onMount(async () => {
    // Load both SDKs in parallel so neither blocks the other
    await Promise.all([loadCesiumSDK(), loadMapLibreSDK()]);

    // Show the dark globe from orbit AND pre-load MapLibre in the background.
    // Neither triggers the fly-in yet — that waits for the user to click Dive In.
    await Promise.all([
      initCesiumGlobe(),   // shows globe, sets isLoaded=true → reveals button
      initMapLibre(),      // loads style + tiles silently in background
    ]);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // diveIn — called by the "Dive In" button
  // Hides the button, starts the CesiumJS fly-in, then crossfades to MapLibre
  // ─────────────────────────────────────────────────────────────────────────
  async function diveIn() {
    if (isDiving) return;
    isDiving = true;
    await startFlyIn();   // 5-second animation → resolves on complete
    await switchToMap();  // crossfade CesiumJS → MapLibre
  }

  onDestroy(() => {
    markerEls.forEach(m => m.remove());
    if (map) map.remove();
    if (viewer && !viewer.isDestroyed()) viewer.destroy();
  });

  // ── Phase 1: CesiumJS space view ──────────────────────────────────────────

  async function loadCesiumSDK() {
    const VER  = '1.122';
    const BASE = `https://cesium.com/downloads/cesiumjs/releases/${VER}/Build/Cesium`;
    await Promise.all([
      loadResource(`${BASE}/Cesium.js`,           'script'),
      loadResource(`${BASE}/Widgets/widgets.css`, 'link'),
    ]);
    Cesium = window.Cesium;
  }

  /**
   * initCesiumGlobe
   * Creates the CesiumJS Viewer and shows the dark Earth from orbit.
   * Resolves when the first frame has rendered (globe is visible).
   * Does NOT start the fly-in — that waits for the user to click Dive In.
   */
  function initCesiumGlobe() {
    return new Promise((resolve) => {
      viewer = new Cesium.Viewer(cesiumEl, {
        baseLayerPicker:      false,
        geocoder:             false,
        homeButton:           false,
        sceneModePicker:      false,
        navigationHelpButton: false,
        animation:            false,
        timeline:             false,
        fullscreenButton:     false,
        infoBox:              false,
        selectionIndicator:   false,
      });

      // Replace the default Ion imagery (needs a token) with CartoDB Dark Matter
      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:          'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          credit:       '© CARTO · © OpenStreetMap contributors',
          minimumLevel: 0,
          maximumLevel: 19,
        })
      );

      const scene = viewer.scene;

      // Navy globe base — the Earth looks dark navy from orbit instead of light blue
      scene.globe.baseColor      = Cesium.Color.fromCssColorString('hsl(226, 48%, 6%)');
      scene.skyBox.show          = false;
      scene.sun.show             = false;
      scene.moon.show            = false;
      scene.skyAtmosphere.show   = false;
      scene.globe.enableLighting = false;

      // Reveal the "Dive In" button after the globe renders its first frame
      scene.postRender.addEventListener(function once() {
        isLoaded = true;
        scene.postRender.removeEventListener(once);
        resolve();
      });
    });
  }

  /**
   * startFlyIn
   * Flies the CesiumJS camera from its current space position down to
   * Dam Square over 5 seconds. Resolves when the animation completes.
   */
  function startFlyIn() {
    return new Promise((resolve) => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(DAM_LNG, DAM_LAT, 450),
        orientation: {
          heading: Cesium.Math.toRadians(-18),
          pitch:   Cesium.Math.toRadians(-55),
          roll:    0,
        },
        duration:       5,
        easingFunction: Cesium.EasingFunction.QUARTIC_IN_OUT,
        complete:       resolve,
      });
    });
  }

  // ── Phase 2: MapLibre GL JS ────────────────────────────────────────────────

  async function loadMapLibreSDK() {
    const BASE = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4/dist';
    await Promise.all([
      loadResource(`${BASE}/maplibre-gl.js`,  'script'),
      loadResource(`${BASE}/maplibre-gl.css`, 'link'),
    ]);
  }

  /**
   * initMapLibre
   * Creates the MapLibre map in the background at the same position where
   * CesiumJS lands. Applies the dark navy theme and 3D buildings.
   * Returns a Promise that resolves once the style has fully loaded.
   */
  function initMapLibre() {
    return new Promise((resolve) => {
      const maplibregl = window.maplibregl;

      // Match the position where CesiumJS ends its fly-in so the crossfade
      // is seamless — same center, zoom, pitch, and bearing
      map = new maplibregl.Map({
        container:        mapEl,
        style:            'https://tiles.openfreemap.org/styles/liberty',
        center:           [DAM_LNG, DAM_LAT],
        zoom:             17,
        pitch:            55,
        bearing:          -18,
        antialias:        true,
        attributionControl: false,
      });

      map.on('load', () => {
        applyDarkTheme();
        add3DBuildings();
        addMarkers(maplibregl);
        addBalloon();          // air balloon GLB floating at cloud level
        resolve();
      });

      // Close landmark card when clicking empty map
      map.on('click', () => { activeLandmark = null; });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // switchToMap
  // Crossfades from CesiumJS to MapLibre, then destroys CesiumJS to free GPU.
  // ─────────────────────────────────────────────────────────────────────────
  async function switchToMap() {
    phase = 'transitioning';                       // triggers CSS fade on .cesium-wrap
    await new Promise(r => setTimeout(r, 1400));   // wait for the CSS transition
    phase = 'map';                                 // hide Cesium container

    // Free GPU resources used by CesiumJS — MapLibre owns the GPU now
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy();
      viewer = null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // applyDarkTheme
  // Overrides every layer in the OpenFreeMap liberty style with the site's
  // dark navy palette. Called once after map.on('load').
  // ─────────────────────────────────────────────────────────────────────────
  function applyDarkTheme() {
    map.getStyle().layers.forEach(({ id, type }) => {
      try {
        if (type === 'background') {
          map.setPaintProperty(id, 'background-color', C.bg);
        } else if (type === 'fill') {
          const col = /water|sea|ocean|lake|river|canal/.test(id) ? C.water
                    : /park|green|grass|wood|forest|nature/.test(id) ? C.park
                    : /building/.test(id) ? 'hsl(226, 45%, 9%)'
                    : C.land;
          map.setPaintProperty(id, 'fill-color', col);
          map.setPaintProperty(id, 'fill-opacity', 1);
        } else if (type === 'line') {
          const col = /water|sea|ocean|lake|canal/.test(id) ? C.water
                    : /motorway|trunk|primary/.test(id)      ? C.roadM
                    : C.road;
          map.setPaintProperty(id, 'line-color', col);
        } else if (type === 'symbol') {
          try { map.setPaintProperty(id, 'text-color',      C.label); } catch {}
          try { map.setPaintProperty(id, 'text-halo-color', C.bg);    } catch {}
          try { map.setPaintProperty(id, 'icon-color',      C.label); } catch {}
        }
      } catch { /* some layers reject certain properties — safe to ignore */ }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // add3DBuildings
  // Removes flat building footprint layers and adds a fill-extrusion layer
  // using OSM render_height data with the dark navy → slate blue colour ramp.
  // ─────────────────────────────────────────────────────────────────────────
  function add3DBuildings() {
    ['building', 'building-top', 'buildings', 'building-outline'].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });

    if (!map.getSource('openmaptiles')) return;

    // Height multiplier — makes buildings visually taller and more dramatic.
    const H_MULT = 3;
    // Minimum OSM height before multiplying — prevents buildings with
    // render_height=0 (or missing) from being invisible flat patches.
    const MIN_H  = 4;

    map.addLayer({
      id:             'buildings-3d',
      type:           'fill-extrusion',
      source:         'openmaptiles',
      'source-layer': 'building',
      minzoom:        13,
      // Only render buildings that have valid footprint geometry
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: {
        // Colour ramp — lowest colour is now a visible navy blue, not near-black,
        // so no building ever looks like a transparent/empty hole.
        'fill-extrusion-color': [
          'interpolate', ['linear'],
          ['*', ['max', ['coalesce', ['get', 'render_height'], MIN_H], MIN_H], H_MULT],
             0,  '#1a3560',   // short  — visible navy
            30,  '#1e3e6e',
            75,  '#2a4e88',
           150,  '#2e4f84',
           300,  '#3a5e96',   // tall   — slate blue
        ],
        // max() ensures every building is at least MIN_H metres before scaling
        'fill-extrusion-height': [
          '*',
          ['max', ['coalesce', ['get', 'render_height'], MIN_H], MIN_H],
          H_MULT,
        ],
        // Base stays at 0 for ground-floor buildings; only non-zero for
        // upper parts of split buildings (bridges, overhangs etc.)
        'fill-extrusion-base': [
          '*',
          ['coalesce', ['get', 'render_min_height'], 0],
          H_MULT,
        ],
        'fill-extrusion-opacity': [
          'interpolate', ['linear'], ['zoom'],
          13, 0,
          14, 0.97,
        ],
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // addBalloon
  // Loads amsterdam_scene.glb as a Three.js custom layer inside MapLibre.
  // The balloon floats at cloud level (~400 m) above Dam Square with a
  // gentle bob and slow rotation — rendered every frame via triggerRepaint.
  // ─────────────────────────────────────────────────────────────────────────
  function addBalloon() {
    const maplibregl = window.maplibregl;

    const LNG = DAM_LNG - 0.001;
    const LAT  = DAM_LAT + 0.002;
    const ALT  = 150; // metres above ground

    const origin = maplibregl.MercatorCoordinate.fromLngLat([LNG, LAT], ALT);
    const mpu    = origin.meterInMercatorCoordinateUnits();
    const TARGET_METRES = 60;

    let threeScene, threeCamera, threeRenderer, balloonObj, testBox;
    let modelScale      = TARGET_METRES * mpu;
    const startTime     = performance.now();
    let rotAngle        = 0;
    let loggedOnce      = false;

    const layer = {
      id:            'balloon-3d',
      type:          'custom',
      renderingMode: '3d',

      onAdd(mapRef, gl) {
        console.log('[balloon] onAdd — context:', gl?.constructor?.name);
        console.log('[balloon] GLB url:', amsterdamSceneUrl);

        threeScene  = new THREE.Scene();
        threeCamera = new THREE.Camera();

        threeScene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const sun = new THREE.DirectionalLight(0xffe0a0, 2.5);
        sun.position.set(1, 2, 1);
        threeScene.add(sun);

        // ── Debug cube ────────────────────────────────────────────────────
        // A bright red box visible immediately. Confirms the layer renders.
        // Removed from the scene as soon as the GLB is ready.
        testBox = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0xff2200 }),
        );
        threeScene.add(testBox);

        try {
          threeRenderer = new THREE.WebGLRenderer({
            canvas:    mapRef.getCanvas(),
            context:   gl,
            antialias: true,
          });
          threeRenderer.autoClear = false;
          console.log('[balloon] renderer OK');
        } catch (e) {
          console.error('[balloon] renderer FAILED:', e);
          return;
        }

        new GLTFLoader().load(
          amsterdamSceneUrl,
          (gltf) => {
            balloonObj = gltf.scene;

            const box    = new THREE.Box3().setFromObject(balloonObj);
            const size   = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) modelScale = (TARGET_METRES / maxDim) * mpu;

            const centre = box.getCenter(new THREE.Vector3());
            balloonObj.position.sub(centre);

            threeScene.remove(testBox); // replace debug cube with real balloon
            threeScene.add(balloonObj);
            console.log('[balloon] GLB ready — size:', size, '| scale:', modelScale);
          },
          undefined,
          (err) => console.error('[balloon] GLB load FAILED:', err),
        );
      },

      render(gl, args) {
        // Don't render until the WebGLRenderer is ready
        if (!threeRenderer) return;

        if (!loggedOnce) {
          loggedOnce = true;
          const keys = Object.keys(args || {});
          console.log('[balloon] first render — args keys:', keys);
          console.log('[balloon] mainMatrix present:', !!args?.defaultProjectionData?.mainMatrix);
        }

        // Support multiple MapLibre v4 matrix locations
        const rawMatrix =
          args?.defaultProjectionData?.mainMatrix ??
          args?.projectionMatrix ??
          args?.modelViewProjectionMatrix;

        if (!rawMatrix) {
          console.warn('[balloon] no projection matrix in render args:', args);
          return;
        }

        const t    = (performance.now() - startTime) / 1000;
        rotAngle  += 0.003;
        const bobZ = Math.sin(t * 0.4) * 10 * mpu;

        // GLTF is Y-up; Mercator is Z-up → rotate 90° around X to stand upright
        const rotX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        const rotY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotAngle);

        const l = new THREE.Matrix4()
          .makeTranslation(origin.x, origin.y, origin.z + bobZ)
          .scale(new THREE.Vector3(modelScale, -modelScale, modelScale))
          .multiply(rotX)
          .multiply(rotY);

        const m = new THREE.Matrix4().fromArray(rawMatrix);
        threeCamera.projectionMatrix = m.multiply(l);

        threeRenderer.resetState();
        threeRenderer.render(threeScene, threeCamera);
        map.triggerRepaint();
      },
    };

    map.addLayer(layer);
    console.log('[balloon] layer added');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // addMarkers
  // Places circular HTML button markers for each landmark.
  // ─────────────────────────────────────────────────────────────────────────
  function addMarkers(maplibregl) {
    LANDMARKS.forEach(lm => {
      const el = document.createElement('button');
      el.className   = 'lm-pin';
      el.title       = lm.name;
      el.setAttribute('aria-label', lm.name);
      el.textContent = lm.pin;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        activeLandmark = lm;
        map.flyTo({
          center:   lm.lngLat,
          zoom:     18.5,
          pitch:    65,
          bearing:  map.getBearing(),
          duration: 1600,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(lm.lngLat)
        .addTo(map);

      markerEls.push(marker);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // toggleView — 3D tilted ↔ flat top-down (MapLibre phase only)
  // ─────────────────────────────────────────────────────────────────────────
  function toggleView() {
    if (!map || phase !== 'map') return;
    is3D = !is3D;

    map.flyTo({
      pitch:    is3D ? 55  : 0,
      zoom:     is3D ? 17  : 15.5,
      bearing:  is3D ? -18 : 0,
      duration: 1400,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // loadResource — injects <script> or <link> from CDN
  // ─────────────────────────────────────────────────────────────────────────
  function loadResource(url, tag) {
    return new Promise((resolve, reject) => {
      const attr = tag === 'script' ? 'src' : 'href';
      if (document.querySelector(`${tag}[${attr}="${url}"]`)) return resolve();
      const el = document.createElement(tag);
      if (tag === 'script') { el.src = url; el.defer = true; }
      else                  { el.rel = 'stylesheet'; el.href = url; }
      el.onload  = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
  }
</script>

<svelte:head>
  <title>Amsterdam 3D — Yamen</title>
  <meta
    name="description"
    content="Interactive 3D city of Amsterdam — CesiumJS space zoom into Dam Square, then MapLibre 3D buildings and clickable landmark cards."
  />
</svelte:head>

<div class="city-root">

  <!-- ── Phase 1: CesiumJS globe (fades out after fly-in) ─────────────────── -->
  <div
    class="cesium-wrap"
    class:fading={phase === 'transitioning'}
    class:gone={phase === 'map'}
  >
    <div class="cesium-el" bind:this={cesiumEl}></div>
  </div>

  <!-- ── Phase 2: MapLibre map (revealed after crossfade) ─────────────────── -->
  <div class="map-wrap" bind:this={mapEl}></div>

  <!-- Edge vignette -->
  <div class="vignette" aria-hidden="true"></div>

  <!-- ── Loading screen ──────────────────────────────────────────────────── -->
  {#if !isLoaded}
    <div class="loading" role="status" aria-live="polite">
      <div class="loading__ring"></div>
      <p class="loading__label">Building Amsterdam&hellip;</p>
    </div>
  {/if}

  <!-- ── Dive In button — shown after globe loads, hidden once animation starts ── -->
  {#if isLoaded && !isDiving}
    <div class="dive-wrap">
      <button class="dive-btn" onclick={diveIn} aria-label="Start animation">
        <span class="dive-btn__ring" aria-hidden="true"></span>
        <span class="dive-btn__ring dive-btn__ring--2" aria-hidden="true"></span>
        <span class="dive-btn__label">Dive In</span>
        <span class="dive-btn__sub">Amsterdam from orbit</span>
      </button>
    </div>
  {/if}

  <!-- ── UI overlay — only visible once MapLibre is active ───────────────── -->
  <div class="ui" class:visible={phase === 'map'}>

    <nav class="topbar" aria-label="Page navigation">
      <a class="back-link" href="/">← Back home</a>
      <div class="topbar__right">
        <button
          class="pill-btn"
          onclick={toggleView}
          aria-label={is3D ? 'Switch to top-down view' : 'Switch to 3D view'}
        >
          {is3D ? '2D View' : '3D View'}
        </button>
      </div>
    </nav>

    <div class="city-id">
      <p class="city-id__coords">52°22′N &thinsp; 4°53′E</p>
      <h1 class="city-id__name">Amsterdam</h1>
      <p class="city-id__sub">Dam Square &middot; Grachtengordel &middot; Est. 1270</p>
    </div>

    <ul class="facts" role="list" aria-label="Amsterdam facts">
      <li class="fact">
        <span class="fact__val">165</span>
        <span class="fact__key">canals</span>
      </li>
      <li class="fact">
        <span class="fact__val">1&thinsp;281</span>
        <span class="fact__key">bridges</span>
      </li>
      <li class="fact">
        <span class="fact__val">900+</span>
        <span class="fact__key">years old</span>
      </li>
    </ul>

    <p class="hint" aria-hidden="true">Drag · Scroll · Click pins</p>

  </div>

  <!-- ── Landmark info card ───────────────────────────────────────────────── -->
  {#if activeLandmark}
    <div
      class="landmark-card"
      role="dialog"
      aria-label={activeLandmark.name}
      aria-modal="false"
    >
      <button
        class="landmark-card__close"
        onclick={() => activeLandmark = null}
        aria-label="Close"
      >✕</button>
      <p class="landmark-card__tag">{activeLandmark.tag}</p>
      <h2 class="landmark-card__name">{activeLandmark.name}</h2>
      <p class="landmark-card__sub">{activeLandmark.sub}</p>
      <p class="landmark-card__body">{activeLandmark.body}</p>
    </div>
  {/if}

</div>

<style>
  :global(body) {
    background: hsl(226 48% 4%);
    overflow: hidden;
  }

  .city-root {
    position: fixed;
    inset: 0;
    z-index: 0;
  }

  /* ── CesiumJS wrapper ────────────────────────────────────────────────────
     Sits on top (z-index 2). Fades out after fly-in, then is removed from
     layout entirely so it no longer consumes events or GPU resources.      */
  .cesium-wrap {
    position: absolute;
    inset: 0;
    z-index: 2;
    transition: opacity 1.4s ease;
  }
  .cesium-wrap.fading { opacity: 0; pointer-events: none; }
  .cesium-wrap.gone   { display: none; }

  .cesium-el {
    width: 100%;
    height: 100%;
  }

  :global(.cesium-widget-credits),
  :global(.cesium-credit-container) { display: none !important; }
  :global(.cesium-widget),
  :global(.cesium-widget canvas) {
    width: 100% !important;
    height: 100% !important;
    outline: none;
    touch-action: none;
  }

  /* ── MapLibre wrapper ────────────────────────────────────────────────────
     Always at z-index 1 — visible through the CesiumJS crossfade.          */
  .map-wrap {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  :global(.maplibregl-ctrl-logo),
  :global(.maplibregl-ctrl-attrib) { display: none !important; }
  :global(.maplibregl-canvas)      { outline: none; }

  /* ── Landmark pin markers ─────────────────────────────────────────────── */
  :global(.lm-pin) {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: hsl(226 48% 7% / 0.93);
    border: 2px solid hsl(230 100% 76% / 0.55);
    color: hsl(230 100% 76%);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0 0 4px hsl(230 100% 76% / 0.12),
      0 4px 16px hsl(0 0% 0% / 0.5);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  :global(.lm-pin:hover) {
    border-color: hsl(230 100% 76% / 0.9);
    box-shadow:
      0 0 0 6px hsl(230 100% 76% / 0.2),
      0 4px 20px hsl(0 0% 0% / 0.6);
    transform: scale(1.15);
  }

  /* ── Edge vignette ────────────────────────────────────────────────────── */
  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
    background:
      linear-gradient(to bottom, hsl(226 48% 4%) 0%,  transparent 11%),
      linear-gradient(to top,    hsl(226 48% 4%) 0%,  transparent 16%),
      linear-gradient(to right,  hsl(226 48% 4%) 0%,  transparent 8%),
      linear-gradient(to left,   hsl(226 48% 4%) 0%,  transparent 8%);
  }

  /* ── Loading ─────────────────────────────────────────────────────────── */
  .loading {
    position: absolute;
    inset: 0;
    z-index: 100;
    background: hsl(226 48% 4%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }
  .loading__ring {
    width: 46px;
    height: 46px;
    border: 2px solid hsl(230 100% 76% / 0.1);
    border-top-color: hsl(230 100% 76%);
    border-radius: 50%;
    animation: spin 0.85s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading__label {
    font-size: clamp(11px, 1.3vw, 13px);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: hsl(230 100% 86% / 0.45);
    margin: 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── UI overlay ──────────────────────────────────────────────────────── */
  .ui {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
    transition: opacity 1.2s ease;
  }
  .ui.visible { opacity: 1; }

  .topbar {
    position: absolute;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: clamp(14px, 2.5vh, 26px) clamp(18px, 4vw, 50px);
    pointer-events: auto;
  }
  .back-link {
    font-size: clamp(11px, 1.2vw, 13px);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: hsl(0 0% 100% / 0.38);
    text-decoration: none;
    transition: color 0.3s ease;
    font-family: 'Outfit', sans-serif;
  }
  .back-link:hover { color: hsl(0 0% 100% / 0.9); }
  .topbar__right { display: flex; gap: 10px; }

  .pill-btn {
    font-size: clamp(10px, 1.1vw, 12px);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-family: 'Outfit', sans-serif;
    color: hsl(230 100% 76%);
    background: hsl(226 48% 8% / 0.88);
    border: 1px solid hsl(230 100% 76% / 0.3);
    border-radius: 20px;
    padding: 7px 18px;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: background 0.3s, border-color 0.3s, color 0.3s;
  }
  .pill-btn:hover {
    background: hsl(230 100% 76% / 0.18);
    border-color: hsl(230 100% 76% / 0.65);
    color: #fff;
  }

  .city-id {
    position: absolute;
    bottom: clamp(24px, 5vh, 56px);
    left: clamp(18px, 4vw, 50px);
    pointer-events: none;
  }
  .city-id__coords {
    font-size: clamp(10px, 1.1vw, 12px);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: hsl(170 70% 58%);
    margin: 0 0 0.45rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
  }
  .city-id__name {
    font-size: clamp(42px, 9vw, 116px);
    font-weight: 800;
    line-height: 0.88;
    letter-spacing: -0.025em;
    color: hsl(229 100% 95%);
    margin: 0 0 0.55rem;
    font-family: 'Outfit', sans-serif;
    text-shadow: 0 2px 28px hsl(0 0% 0% / 0.7);
  }
  .city-id__sub {
    font-size: clamp(11px, 1.3vw, 14px);
    color: hsl(0 0% 100% / 0.3);
    letter-spacing: 0.09em;
    margin: 0;
    font-family: 'Outfit', sans-serif;
  }

  .facts {
    position: absolute;
    bottom: clamp(24px, 5vh, 56px);
    right: clamp(18px, 4vw, 50px);
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.45rem;
  }
  .fact {
    display: flex;
    align-items: baseline;
    gap: 0.5ch;
    font-family: 'Outfit', sans-serif;
  }
  .fact__val {
    font-size: clamp(17px, 2.3vw, 26px);
    font-weight: 800;
    color: hsl(229 100% 95%);
    letter-spacing: -0.02em;
    text-shadow: 0 2px 12px hsl(0 0% 0% / 0.5);
  }
  .fact__key {
    font-size: clamp(10px, 1vw, 12px);
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: hsl(0 0% 100% / 0.28);
  }

  .hint {
    position: absolute;
    top: 50%;
    right: clamp(18px, 3.5vw, 48px);
    transform: translateY(-50%);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: hsl(0 0% 100% / 0.16);
    writing-mode: vertical-rl;
    font-family: 'Outfit', sans-serif;
    margin: 0;
  }

  /* ── Landmark info card ───────────────────────────────────────────────── */
  .landmark-card {
    position: absolute;
    bottom: clamp(24px, 5vh, 56px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    width: min(420px, calc(100vw - 36px));
    background: hsl(226 48% 7% / 0.96);
    border: 1px solid hsl(230 100% 76% / 0.2);
    border-radius: 16px;
    padding: clamp(18px, 3vw, 28px) clamp(20px, 3.5vw, 32px);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      0 8px 40px hsl(0 0% 0% / 0.55),
      0 0 0 1px hsl(230 100% 76% / 0.06) inset;
    pointer-events: auto;
    animation: cardIn 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .landmark-card__close {
    position: absolute;
    top: 14px; right: 14px;
    background: hsl(0 0% 100% / 0.07);
    border: none;
    color: hsl(0 0% 100% / 0.45);
    border-radius: 50%;
    width: 28px; height: 28px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .landmark-card__close:hover {
    background: hsl(0 0% 100% / 0.14);
    color: hsl(0 0% 100% / 0.9);
  }
  .landmark-card__tag {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: hsl(170 70% 58%);
    margin: 0 0 0.5rem;
    font-family: 'Outfit', sans-serif;
  }
  .landmark-card__name {
    font-size: clamp(20px, 3.5vw, 28px);
    font-weight: 800;
    color: hsl(229 100% 95%);
    margin: 0 0 0.25rem;
    letter-spacing: -0.015em;
    line-height: 1.1;
    font-family: 'Outfit', sans-serif;
  }
  .landmark-card__sub {
    font-size: clamp(11px, 1.3vw, 13px);
    color: hsl(230 100% 76%);
    letter-spacing: 0.06em;
    margin: 0 0 0.85rem;
    font-family: 'Outfit', sans-serif;
  }
  .landmark-card__body {
    font-size: clamp(13px, 1.5vw, 15px);
    color: hsl(0 0% 100% / 0.55);
    line-height: 1.65;
    margin: 0;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Dive In button ─────────────────────────────────────────────────────── */
  .dive-wrap {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .dive-btn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: hsl(226 48% 6% / 0.7);
    border: 1.5px solid hsl(230 100% 76% / 0.5);
    cursor: pointer;
    pointer-events: auto;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
    animation: dive-appear 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  }
  .dive-btn:hover {
    background: hsl(226 48% 10% / 0.85);
    border-color: hsl(230 100% 76% / 0.9);
    transform: scale(1.06);
  }
  .dive-btn:active {
    transform: scale(0.96);
  }

  /* Two concentric pulsing rings behind the button */
  .dive-btn__ring {
    position: absolute;
    inset: -14px;
    border-radius: 50%;
    border: 1px solid hsl(230 100% 76% / 0.25);
    animation: dive-pulse 2.4s ease-out infinite;
    pointer-events: none;
  }
  .dive-btn__ring--2 {
    inset: -28px;
    border-color: hsl(230 100% 76% / 0.12);
    animation-delay: 0.8s;
  }

  .dive-btn__label {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(18px, 2.5vw, 22px);
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: hsl(229 100% 95%);
    line-height: 1;
  }
  .dive-btn__sub {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(9px, 1vw, 11px);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: hsl(230 100% 76% / 0.65);
  }

  @keyframes dive-appear {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes dive-pulse {
    0%   { transform: scale(1);    opacity: 1; }
    100% { transform: scale(1.55); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading__ring        { animation: none; }
    .ui                   { opacity: 1; }
    .landmark-card        { animation: none; }
    .cesium-wrap          { transition: none; }
    .dive-btn__ring       { animation: none; }
    .dive-btn             { animation: none; }
  }
</style>
