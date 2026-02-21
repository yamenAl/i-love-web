<script>
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();

	let locomotiveScroll;
	let zoomSection;
	let featureSection;

	// 9 urban-life cards — same count as the Lenis website
	const cards = [
		{ n: '01', text: 'Every angle tells a new story' },
		{ n: '02', text: 'Light shifts hour by hour' },
		{ n: '03', text: 'Streets breathe at their own pace' },
		{ n: '04', text: 'Architecture holds silent memory' },
		{ n: '05', text: 'Crowds move as one organism' },
		{ n: '06', text: 'Markets show what a city needs' },
		{ n: '07', text: 'Sound maps the invisible city' },
		{ n: '08', text: 'Seasons rewrite every surface' },
		{ n: '09', text: 'Slow down — and it reveals itself' }
	];

	onMount(async () => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const { default: LocomotiveScroll } = await import('locomotive-scroll');
		await import('locomotive-scroll/locomotive-scroll.css');

		locomotiveScroll = new LocomotiveScroll({
			lenisOptions: {
				lerp: 0.08,
				duration: 1.4,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				smoothWheel: true
			},
			scrollCallback({ scroll }) {
				if (reducedMotion) return;
				updateZoom(scroll);
				updateFeatureCards(scroll);
			}
		});
	});

	function updateZoom(scroll) {
		if (!zoomSection) return;
		const top = zoomSection.offsetTop;
		const scrollable = zoomSection.offsetHeight - window.innerHeight;
		if (scrollable <= 0) return;
		const p = Math.max(0, Math.min(1, (scroll - top) / scrollable));
		zoomSection.style.setProperty('--p', p);
	}

	function updateFeatureCards(scroll) {
		if (!featureSection) return;
		const top = featureSection.offsetTop;
		const scrollable = featureSection.offsetHeight - window.innerHeight;
		if (scrollable <= 0) return;
		const p = Math.max(0, Math.min(1, (scroll - top) / scrollable));
		// Reveal one card per equal slice of scroll distance
		const revealed = Math.min(cards.length - 1, Math.floor(p * cards.length));
		featureSection.querySelectorAll('.fc').forEach((el, i) => {
			el.classList.toggle('current', i <= revealed);
		});
	}

	onDestroy(() => {
		locomotiveScroll?.destroy();
	});
</script>

<svelte:head>
	<title>City — Yamen</title>
	<meta name="description" content="A city photo essay with smooth scroll and parallax." />
</svelte:head>

<!-- ── Fixed hand silhouette behind everything ────────────────────────── -->
<div class="bg-hand" aria-hidden="true">
	<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<rect x="48"  y="14"  width="30" height="122" rx="15"/>
		<rect x="84"  y="0"   width="30" height="136" rx="15"/>
		<rect x="120" y="14"  width="28" height="122" rx="14"/>
		<rect x="152" y="36"  width="24" height="100" rx="12"/>
		<rect x="44"  y="108" width="140" height="144" rx="24"/>
		<ellipse cx="28" cy="152" rx="22" ry="44" transform="rotate(-16,28,152)"/>
	</svg>
</div>

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
			Photo essay
		</p>
		<h1 class="hero__title reveal" data-scroll data-scroll-class="in-view" style="--d:0.1s">
			Cities
		</h1>
		<p class="hero__sub reveal" data-scroll data-scroll-class="in-view" style="--d:0.22s">
			Light bends differently in every city.
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
			<p class="zoom-outer__line">scroll into</p>
			<p class="zoom-outer__line zoom-outer__line--right">the city</p>
		</div>

		<span class="zoom-enter" aria-hidden="true">CITY</span>
		<div class="zoom-sweep" aria-hidden="true"></div>
	</div>
</section>

<!-- ── FEATURE CARDS ──────────────────────────────────────────────────── -->
<!--
	Exact same mechanic as the Lenis website:
	• Section is 900 vh tall (scroll space)
	• Inner is position:sticky, height:100vh, overflow:hidden
	• Each card is positioned absolutely on a diagonal using --i
	• JS adds .current as scroll progress crosses each card's threshold
	• Cards without .current sit off-screen at translate3d(100%,100%,0)
-->
<section class="feat-section" bind:this={featureSection}>
	<div class="feat-sticky">
		<p class="feat-label reveal" data-scroll data-scroll-class="in-view">
			Nine things about cities
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

<!-- ── ABOUT SECTION (sticky title + scrolling info) ─────────────────── -->
<!--
	Exact same pattern as the Lenis "Why smooth scroll?" section:
	• Left column: h2 title is position:sticky (stays pinned while right scrolls)
	• Left border accent (same as Lenis site)
	• Title lines use appear-title: each line clips and slides up on enter
	• Right column: 4 info items that scroll past the pinned title
-->
<section class="about section-padding">
	<div class="about__grid">

		<!-- ── Sticky left: animated title ── -->
		<div class="about__sticky">
			<h2
				class="about__title"
				data-scroll
				data-scroll-class="visible"
			>
				<span class="about__line" style="--i:0"><span>About</span></span>
				<span class="about__line" style="--i:1"><span>the</span></span>
				<span class="about__line" style="--i:2"><span>maker.</span></span>
			</h2>
		</div>

		<!-- ── Scrolling right: info items ── -->
		<aside class="about__items">

			<div class="about__item reveal" data-scroll data-scroll-class="in-view">
				<p class="about__body">
					I'm Yamen Al Sharabi — a front-end developer in training at the
					Amsterdam University of Applied Sciences. I build for the web
					because the browser is for everyone. These city photos are how I
					see things when I'm not staring at code.
				</p>
			</div>

			<div class="about__item reveal" data-scroll data-scroll-class="in-view" style="--d:0s">
				<h3 class="about__item-title">What I build</h3>
				<p class="about__body">
					Landing pages, web apps, interactive experiences — from visual
					design through clean code to a smooth handover. If it lives in a
					browser, I can build it. I care about fast loads, clear content,
					and the tiny details that feel good.
				</p>
			</div>

			<div class="about__item reveal" data-scroll data-scroll-class="in-view" style="--d:0s">
				<h3 class="about__item-title">How I work</h3>
				<p class="about__body">
					Sketch → prototype → code → feedback. I move fast but think
					slowly — always asking why before how. I'm still in a course, so
					I bring fresh patterns, honest questions, and momentum you can
					feel in the result.
				</p>
			</div>

			<div class="about__item reveal" data-scroll data-scroll-class="in-view" style="--d:0s">
				<h3 class="about__item-title">What drives me</h3>
				<p class="about__body">
					Content-first. Accessible by default. Real user metrics over
					guesses. Simple technology chosen deliberately — not by default.
					The web should work for everyone, everywhere, on every device.
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
	<blockquote class="pullquote__text reveal" data-scroll data-scroll-class="in-view">
		"A city is a living<br />thing — it breathes."
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
					data-scroll-speed={i === 0 ? '-2' : i === 1 ? '0' : '2'}
				/>
			</div>
			<p class="caption">{photo.caption}</p>
		</div>
	{/each}
</div>

<!-- ── CLOSING ──────────────────────────────────────────────────────────── -->
<footer class="closing section-padding">
	<p class="closing__text reveal" data-scroll data-scroll-class="in-view">
		More to come — the city never stops.
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
			opacity  0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--d, 0s),
			transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--d, 0s);
	}
	:global(.reveal.in-view) {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.reveal { opacity: 1; transform: none; transition: none; }
	}

	/* ── HAND ──────────────────────────────────────────────────────────── */
	.bg-hand {
		position: fixed;
		bottom: -6vh;
		right: -3vw;
		width: clamp(180px, 44vmin, 580px);
		height: auto;
		z-index: 0;
		pointer-events: none;
		color: var(--text-color-white-primary);
		opacity: 0.05;
		transform: rotate(13deg);
	}
	.bg-hand svg { display: block; width: 100%; height: auto; }

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
	.hero__bg-wrap { position: absolute; inset: -15%; z-index: 0; }
	.hero__bg { width: 100%; height: 100%; object-fit: cover; display: block; }
	.hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			hsl(226 48% 4%)      0%,
			hsl(226 48% 6% / .7) 50%,
			hsl(226 48% 6% / .2) 100%
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
		from { opacity: 0; transform: translateY(10px); }
		to   { opacity: 0.45; transform: none; }
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
		0%,100% { transform: scaleY(1); opacity: 0.45; }
		50%      { transform: scaleY(0.3); opacity: 0.1; }
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
	.zoom-bg img { width: 100%; height: 100%; object-fit: cover; display: block; }
	.zoom-bg__veil { position: absolute; inset: 0; background: hsl(226 48% 4% / 0.42); }
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
	.zoom-outer__line--right { text-align: right; align-self: flex-end; }
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
		.zoom-section { height: auto; }
		.zoom-sticky  { position: static; }
		.zoom-outer   { opacity: 1; transform: none; }
		.zoom-enter   { opacity: 0; transform: translate(-50%, -50%); }
		.zoom-bg      { opacity: 0; }
		.zoom-sweep   { display: none; }
	}

	/* ── FEATURE CARDS ──────────────────────────────────────────────────
	   On mobile  → plain vertical list (no diagonal trick)
	   On desktop → 900 vh sticky, cards on a diagonal staircase
	   ─────────────────────────────────────────────────────────────────── */

	/* Card variables shared by both layouts */
	.feat-section {
		--card-size: clamp(200px, 34vw, 320px);
		--margin:    clamp(16px, 4vw, 48px);
		position: relative;
		z-index: 1;
	}

	/* ── MOBILE layout ─── */
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
	/* On mobile all cards are visible immediately */
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

	/* ── DESKTOP layout ─── */
	@media (min-width: 768px) {
		.feat-section {
			height: 900vh;
		}
		.feat-sticky {
			/* override mobile styles */
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
			/* reveal handled by data-scroll-class on element */
		}

		/* Each card placed on a diagonal using --i ───────────────────── */
		.fc {
			position: absolute;
			width: var(--card-size);
			will-change: transform, opacity;
			/* Diagonal staircase: card i sits at (i/8) of available space */
			top:  calc(var(--i, 0) * (100vh - var(--card-size) - 2 * var(--margin)) / 8);
			left: calc(var(--i, 0) * (100vw - var(--card-size) - 2 * var(--margin)) / 8);

			/* Slide-in transition — same 1.2 s ease-out-expo as Lenis */
			transition:
				opacity   1.2s cubic-bezier(0.19, 1, 0.22, 1),
				transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
		}
		/* Cards wait off-screen (bottom-right) until .current is added */
		.fc:not(.current) {
			transform: translate3d(100%, 100%, 0);
			opacity: 0;
		}
		.fc.current {
			transform: translate3d(0, 0, 0);
			opacity: 1;
		}
		/* Card face — square glass tile */
		.fc__inner {
			width: var(--card-size);
			max-width: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fc,
		.fc:not(.current) { transform: none; opacity: 1; transition: none; }
		.feat-section { height: auto; }
		.feat-sticky  { position: static; }
	}

	/* ── ABOUT (sticky title + scrolling info) ──────────────────────────
	   Matches the Lenis "Why smooth scroll?" layout:
	   • Left column sticky title with appear animation
	   • Right column features scroll past it
	   ─────────────────────────────────────────────────────────────────── */
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

	/* ── Appear-title ────────────────────────────────────────────────────
	   Each .about__line has overflow:hidden — the inner <span> slides up
	   from translateY(100%) to 0 when .visible is added by locomotive-scroll.
	   Stagger: calc(200ms * var(--i))  (same timing as Lenis website)
	   ─────────────────────────────────────────────────────────────────── */
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
	/* Initial state: text hidden below clip */
	.about__line > span {
		display: inline-block;
		transform: translateY(105%);
	}
	/* When locomotive-scroll adds .visible — slide up with stagger */
	:global(.about__title.visible) .about__line > span {
		transform: translateY(0);
		transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1) calc(200ms * var(--i, 0));
	}
	@media (prefers-reduced-motion: reduce) {
		.about__line > span { transform: none; }
		:global(.about__title.visible) .about__line > span { transition: none; }
	}

	/* ── Info items ──────────────────────────────────────────────────────── */
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

	/* ── Desktop: sticky left column ────────────────────────────────────── */
	@media (min-width: 768px) {
		.about__grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
			gap: clamp(48px, 6vw, 100px);
		}
		.about__sticky {
			position: sticky;
			top: 33%;
			/* Left accent border — same as Lenis site */
			border-left: 3px solid var(--accent-color-blue-primary);
			padding-left: clamp(20px, 2.8vw, 36px);
		}
	}

	/* ── FULL-WIDTH PHOTO ───────────────────────────────────────────────── */
	.photo-full { position: relative; z-index: 1; }
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

	/* ── PHOTO BOX ──────────────────────────────────────────────────────── */
	.pbox { overflow: hidden; width: 100%; aspect-ratio: 3 / 4; }
	.pbox--square { aspect-ratio: 1; }
	.pbox__img { width: 100%; height: 130%; object-fit: cover; display: block; margin-top: -15%; }

	/* ── DIPTYCH ────────────────────────────────────────────────────────── */
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

	/* ── PULL QUOTE ─────────────────────────────────────────────────────── */
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

	/* ── TRIPTYCH ───────────────────────────────────────────────────────── */
	.triptych {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-large);
		padding-top: clamp(40px, 8vw, 110px);
		padding-bottom: clamp(80px, 12vw, 180px);
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
	.closing__link { font-size: var(--font-size-card-body-text); align-self: flex-start; }

	/* ── DESKTOP ────────────────────────────────────────────────────────── */
	@media (min-width: 768px) {
		.diptych {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
		.diptych__col--offset { margin-top: clamp(60px, 10vw, 130px); }
		.triptych { grid-template-columns: repeat(3, 1fr); }
	}
</style>
