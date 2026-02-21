<script>
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.js';
	import SplineSceneDark from '$lib/components/SplineSceneDark.svelte';
	import SplineSceneLight from '$lib/components/SplineSceneLight.svelte';

	// gsap loads from cdn so we wait max 8s then give up
	const GSAP_TIMEOUT_MS = 8000;

	const heroName = 'Yamen Al Sharabi';
	const heroSubtitle = 'front-end dev & learning in public';

	let horizontalScrollContainer;
	let gsapReady = $state(false);
	let hasJs = $state(false);

	// set hasJs and load gsap from cdn, then init horizontal scroll
	onMount(() => {
		hasJs = true;
		let timedOut = false;
		const timeout = setTimeout(() => { timedOut = true; }, GSAP_TIMEOUT_MS);
		const gsapScriptElement = document.createElement('script');
		gsapScriptElement.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
		gsapScriptElement.onerror = () => { clearTimeout(timeout); };
		gsapScriptElement.onload = () => {
			const scrollTriggerScriptElement = document.createElement('script');
			scrollTriggerScriptElement.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
			scrollTriggerScriptElement.onerror = () => { clearTimeout(timeout); };
			scrollTriggerScriptElement.onload = () => {
				if (timedOut || !window.gsap || !window.ScrollTrigger) { clearTimeout(timeout); return; }
				clearTimeout(timeout);
				window.gsap.registerPlugin(window.ScrollTrigger);
				requestAnimationFrame(() => setTimeout(() => { gsapReady = initHorizontalScroll() === true; }, 100));
			};
			document.head.appendChild(scrollTriggerScriptElement);
		};
		document.head.appendChild(gsapScriptElement);
	});

	// pin the scroll area and move it horizontally; animate each card's lines on the way
	function initHorizontalScroll() {
		if (!window.gsap || !window.ScrollTrigger) return false;
		const { gsap, ScrollTrigger } = window;
		const horizontalScrollTrack = document.querySelector('.horizontal-scroll-section');
		if (!horizontalScrollTrack || !horizontalScrollContainer) return false;
		const scrollDistance = () => Math.max(0, horizontalScrollTrack.scrollWidth - window.innerWidth);
		if (scrollDistance() <= 1) return false;
		const horizontalScroller = gsap.to(horizontalScrollTrack, { x: () => -scrollDistance(), ease: 'none' });
		ScrollTrigger.create({ trigger: horizontalScrollContainer, start: 'top top', end: () => `+=${scrollDistance()}`, pin: true, animation: horizontalScroller, scrub: 1, invalidateOnRefresh: true });
		gsap.utils.toArray('.scroll-card-wrapper').forEach((scrollCard) => {
			const cardLines = scrollCard.querySelectorAll('.scroll-card__line');
			if (!cardLines.length) return;
			gsap.fromTo(cardLines, { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out', stagger: 0.12, scrollTrigger: { trigger: scrollCard, containerAnimation: horizontalScroller, start: 'left center', end: 'center center', scrub: true } });
		});
		ScrollTrigger.refresh();
		window.addEventListener('resize', () => ScrollTrigger.refresh());
		return true;
	}
</script>


{#if hasJs}
	<div class="spline-container" aria-hidden="false">
		{#if $theme === 'dark'}
			<SplineSceneDark />
		{:else}
			<SplineSceneLight />
		{/if}
	</div>
{/if}

<noscript>
	<p class="noscript-message">Some features (3D scene, scroll animation) need JavaScript. Content below works without it.</p>
</noscript>

<main class="main">
	<section class="hero">
		<h1 class="hero__title hero__letters hero__title--animated" aria-label={heroName}>
			{#each heroName.split('') as letter, letterIndex}
				<span class="hero__letter" style="--hero-letter-index: {letterIndex}">{letter === ' ' ? '\u00A0' : letter}</span>
			{/each}
		</h1>
		<h2 class="hero__subtitle hero__letters hero__subtitle--animated" aria-label={heroSubtitle}>
			{#each heroSubtitle.split('') as letter, letterIndex}
				<span class="hero__letter" style="--hero-letter-index: {letterIndex}">{letter === ' ' ? '\u00A0' : letter}</span>
			{/each}
		</h2>
	</section>

	<div bind:this={horizontalScrollContainer} class="horizontal-scroll-container" class:horizontal-scroll-container--fallback={!gsapReady}>
		<section class="horizontal-scroll-section">
			<div class="scroll-card-wrapper">
				<article class="scroll-card glass-card">
					<h3 class="scroll-card__line">Why the web?</h3>
					<p class="scroll-card__line">Because the browser is for everyone. That's why I build here.</p>
					<p class="scroll-card__line">I care about fast loads, clear content, and tiny details that feel good.</p>
				</article>
			</div>
			<div class="scroll-card-wrapper">
				<article class="scroll-card glass-card">
					<h3 class="scroll-card__line">Hi, I'm Yamen</h3>
					<p class="scroll-card__line">Web developer in progress</p>
					<p class="scroll-card__line">I care about friendly UX, fast loads, and code you won't hate later.</p>
				</article>
			</div>
			<div class="scroll-card-wrapper">
				<article class="scroll-card glass-card">
					<h3 class="scroll-card__line">What I can make for you</h3>
					<p class="scroll-card__line">Landing pages, small web apps, dashboards, and reusable components.</p>
					<p class="scroll-card__line">From idea to deploy: design, build, host, and a clean handover.</p>
				</article>
			</div>
			<div class="scroll-card-wrapper">
				<article class="scroll-card glass-card">
					<h3 class="scroll-card__line">How I work</h3>
					<p class="scroll-card__line">Sketch → prototype → code → feedback.</p>
					<p class="scroll-card__line">I'm still in a course, so I bring fresh patterns, curiosity, and momentum.</p>
				</article>
			</div>
			<div class="scroll-card-wrapper">
				<article class="scroll-card glass-card">
					<h3 class="scroll-card__line">Principles I work by</h3>
					<p class="scroll-card__line">Content first. Accessibility by default. Real-user metrics over guesses.</p>
					<p class="scroll-card__line">Simple stacks: HTML, CSS, JavaScript — plus modern tooling when it helps.</p>
				</article>
			</div>
			<div class="scroll-card-wrapper">
				<article class="scroll-card glass-card">
					<h3 class="scroll-card__line">See my work</h3>
					<p class="scroll-card__line">Projects, experiments, and code samples — all in one place.</p>
					<a class="scroll-card__line cta-link" href="/year/2025-2026">Explore the portfolio →</a>
					<a class="scroll-card__line cta-link" href="/sprits">Spirits →</a>
				</article>
			</div>
		</section>
	</div>
</main>

<footer class="site-footer section-padding text-muted">
	<p>© {new Date().getFullYear()} Yamen Al Sharabi. All rights reserved.</p>
</footer>

<style>
	/* mobile first: default is small screen, then we override at 768px (tablet) */
	@keyframes nameReveal {
		from { transform: translateX(1em); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}

	/* spline wrapper: no position/transform so the canvas stays centered in viewport */
	.spline-container {
		position: static;
		z-index: var(--z-index-background);
		pointer-events: none;
	}

	/* when js is off we show this at bottom */
	.noscript-message {
		position: fixed;
		bottom: var(--spacing-medium);
		left: var(--spacing-medium);
		right: var(--spacing-medium);
		z-index: 100;
		padding: var(--spacing-small) var(--spacing-medium);
		background: hsl(0 0% 0% / 0.8);
		color: var(--text-color-white-primary);
		font-size: var(--font-size-small-text);
		text-align: center;
		border-radius: var(--border-radius-small);
		font-family: var(--font-family-primary);
	}

	.main {
		position: relative;
		z-index: var(--z-index-content);
		pointer-events: none;
	}
	.main * {
		pointer-events: auto;
	}

	/* hero: name + subtitle, centered, letters animate in with nameReveal */
	.hero {
		position: relative;
		z-index: var(--z-index-content);
		min-height: 100vh;
		min-height: 100dvh;
		padding: 28vh 1rem var(--spacing-large);
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: var(--spacing-small);
	}
	.hero__title {
		font-size: var(--font-size-hero-main-title);
		font-weight: var(--font-weight-bold);
		line-height: 1.15;
		letter-spacing: 0.02em;
		color: var(--text-color-white-primary);
		margin: 0;
	}
	.hero__subtitle {
		font-size: var(--font-size-hero-subtitle);
		font-weight: var(--font-weight-semibold);
		letter-spacing: 0.01em;
		color: var(--text-color-white-primary);
		opacity: 0.9;
		margin: 0;
	}

	.hero__letters .hero__letter {
		display: inline-block;
		opacity: 0;
		animation: nameReveal 0.5s ease-out forwards;
	}
	.hero__title--animated .hero__letter {
		animation-delay: calc(50ms + var(--hero-letter-index, 0) * 35ms);
	}
	.hero__subtitle--animated .hero__letter {
		animation-delay: calc(250ms + var(--hero-letter-index, 0) * 35ms);
	}
	@supports not (animation-duration: 1s) {
		.hero__letters .hero__letter { opacity: 1; animation: none; }
	}
	@media (prefers-reduced-motion: reduce) {
		.hero__letters .hero__letter { opacity: 1; animation: none; }
	}

	/* horizontal scroll: on mobile it's just normal scroll; desktop we use gsap to fake horizontal */
	.horizontal-scroll-container {
		position: relative;
		z-index: var(--z-index-content);
		overflow: visible;
	}
	.horizontal-scroll-container--fallback {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
	}
	.horizontal-scroll-container--fallback .horizontal-scroll-section {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.horizontal-scroll-section {
		position: relative;
		z-index: var(--z-index-content);
		display: block;
	}

	.scroll-card-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: var(--z-index-content);
		min-height: 80svh;
		min-height: 80dvh;
		padding: var(--spacing-medium) 0;
	}

	.scroll-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-small);
		width: 100%;
		max-width: 92vw;
		margin: 0 auto;
		position: relative;
		z-index: var(--z-index-content);
	}
	.scroll-card .cta-link {
		align-self: flex-start;
		margin-top: var(--spacing-extra-small);
		min-height: 44px;
		display: inline-flex;
		align-items: center;
	}

	.site-footer {
		position: relative;
		z-index: var(--z-index-content);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-large) 0;
	}
	.site-footer p {
		margin: 0;
	}

	/* from 768px up: real horizontal scroll (gsap pins and moves), cards side by side */
	@media (min-width: 768px) {
		.noscript-message {
			left: auto;
			right: var(--spacing-medium);
			max-width: 20rem;
		}
		.hero {
			padding-top: 25vh;
			padding-left: var(--spacing-extra-large);
			padding-right: var(--spacing-extra-large);
		}
		.horizontal-scroll-container {
			overflow: hidden;
			height: 100svh;
			height: 100dvh;
		}
		.horizontal-scroll-section {
			display: flex;
			flex-direction: row;
			height: 100svh;
			height: 100dvh;
			min-width: max-content;
			will-change: transform;
		}
		.scroll-card-wrapper {
			flex: 0 0 100vw;
			height: 100svh;
			height: 100dvh;
			padding: 0;
		}
		.scroll-card {
			max-width: min(92vw, 800px);
		}
	}
</style>
