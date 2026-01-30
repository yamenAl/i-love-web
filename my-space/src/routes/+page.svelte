<script>
	import { onMount } from 'svelte';
	import { Application } from '@splinetool/runtime';
	import { theme } from '$lib/stores/theme.js';

	const SPLINE_SCENE = 'https://prod.spline.design/O3pv-m0mZE2ZOVFc/scene.splinecode';

	const heroName = 'Yamen Al Sharabi';
	const heroSubtitle = 'front-end dev & learning in public';
	let scrollWrap;
	let splineCanvas = $state(null);
	let splineLoaded = $state(false);
	let splineError = $state(false);
	let splineApp = null;

	onMount(() => {
		if (!splineCanvas) return;

		splineApp = new Application(splineCanvas);
		splineApp
			.load(SPLINE_SCENE)
			.then(() => {
				splineLoaded = true;
			})
			.catch((err) => {
				console.error('Spline loading error:', err);
				splineError = true;
			});

		return () => {
			splineApp = null;
		};
	});

	// GSAP only for horizontal scroll
	onMount(() => {
		const gsapScript = document.createElement('script');
		gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
		const scrollTriggerScript = document.createElement('script');
		scrollTriggerScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
		document.head.appendChild(gsapScript);
		document.head.appendChild(scrollTriggerScript);
		gsapScript.onload = () => {
			scrollTriggerScript.onload = () => {
				if (window.gsap && window.ScrollTrigger) {
					window.gsap.registerPlugin(window.ScrollTrigger);
					initHorizontalScroll();
				}
			};
		};
	});

	function initHorizontalScroll() {
		if (!window.gsap || !window.ScrollTrigger) return;
		
		const { gsap, ScrollTrigger } = window;
		const track = document.querySelector('.horizontal-scroll-sec');
		const wrap = scrollWrap;
		
		if (!track || !wrap) return;

		const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
		if (distance() <= 1) return;

		const scroller = gsap.to(track, { x: () => -distance(), ease: 'none' });

		ScrollTrigger.create({
			trigger: wrap,
			start: 'top top',
			end: () => `+=${distance()}`,
			pin: true,
			animation: scroller,
			scrub: 1,
			invalidateOnRefresh: true
		});

		const panels = gsap.utils.toArray('.article-wrapper');
		panels.forEach((panel) => {
			const lines = panel.querySelectorAll('.line');
			if (!lines.length) return;

			gsap.fromTo(lines,
				{ xPercent: 40, opacity: 0 },
				{
					xPercent: 0,
					opacity: 1,
					ease: 'power2.out',
					stagger: 0.12,
					scrollTrigger: {
						trigger: panel,
						containerAnimation: scroller,
						start: 'left center',
						end: 'center center',
						scrub: true
					}
				}
			);
		});

		ScrollTrigger.refresh();
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
</svelte:head>

{#if !splineLoaded && !splineError}
	<div class="spline-loader">
		<div class="loader-spinner"></div>
		<p>Loading 3D Scene...</p>
	</div>
{/if}
<canvas bind:this={splineCanvas} id="spline-canvas" class:loaded={splineLoaded}></canvas>

<button
	type="button"
	class="theme-switch"
	aria-label="Toggle light and dark mode"
	onclick={() => theme.toggle()}
>
	<span class="theme-switch__track" aria-hidden="true">
		<span class="theme-switch__thumb"></span>
	</span>
	<span class="theme-switch__label">{$theme === 'dark' ? 'Dark' : 'Light'}</span>
</button>

<main id="main-content">
	<section class="personal padding-sec">
		<h1 class="hero-letters home-typer-h1 h1-typer-style" aria-label={heroName}>
			{#each heroName.split('') as char, i}
				<span class="char" style="--char-i: {i}">{char === ' ' ? '\u00A0' : char}</span>
			{/each}
		</h1>
		<h2 class="hero-letters home-typer-h2 h2-typer-style" aria-label={heroSubtitle}>
			{#each heroSubtitle.split('') as char, i}
				<span class="char" style="--char-i: {i}">{char === ' ' ? '\u00A0' : char}</span>
			{/each}
		</h2>
	</section>

	<section class="test-room"></section>

	<div bind:this={scrollWrap} class="scroll-wrap">
		<section class="horizontal-scroll-sec">
			<div class="article-wrapper article-wrapper-one">
				<article class="text-card">
					<h3 class="line title">Why the web?</h3>
					<p class="line">Because the browser is for everyone. That's why I build here.</p>
					<p class="line">I care about fast loads, clear content, and tiny details that feel good.</p>
				</article>
			</div>

			<div class="article-wrapper article-wrapper-two">
				<article class="text-card">
					<h3 class="line title">Hi, I'm Yamen</h3>
					<p class="line">Web developer in progress</p>
					<p class="line">I care about friendly UX, fast loads, and code you won't hate later.</p>
				</article>
			</div>

			<div class="article-wrapper article-wrapper-two">
				<article class="text-card">
					<h3 class="line title">What I can make for you</h3>
					<p class="line">Landing pages, small web apps, dashboards, and reusable components.</p>
					<p class="line">From idea to deploy: design, build, host, and a clean handover.</p>
				</article>
			</div>

			<div class="article-wrapper article-wrapper-three">
				<article class="text-card">
					<h3 class="line title">How I work</h3>
					<p class="line">Sketch → prototype → code → feedback.</p>
					<p class="line">I'm still in a course, so I bring fresh patterns, curiosity, and momentum.</p>
				</article>
			</div>

			<div class="article-wrapper article-wrapper-four">
				<article class="text-card">
					<h3 class="line title">Principles I work by</h3>
					<p class="line">Content first. Accessibility by default. Real-user metrics over guesses.</p>
					<p class="line">Simple stacks: HTML, CSS, JavaScript — plus modern tooling when it helps.</p>
				</article>
			</div>

			<div class="article-wrapper article-wrapper-five">
				<article class="text-card">
					<h3 class="line title">See my work</h3>
					<p class="line">Projects, experiments, and code samples — all in one place.</p>
					<a class="line cta" href="/year/2025-2026">Explore the portfolio →</a>
					<a class="line cta" href="/sprits">Spirits →</a>
				</article>
			</div>
		</section>
	</div>
</main>

<footer class="site-footer padding-sec">
	<p>© {new Date().getFullYear()} Yamen Al Sharabi. All rights reserved.</p>
</footer>

<style>
	:global(:root) {
		--primary-bg: #070b1a;
		--secondary-bg: #0c1229;
		--primary-text: #e7ecff;
		--muted-text: #b8c1ff;
		--primary-accent: #86a0ff;
		--secondary-accent: #4bd6c8;
		--font: "DM Sans", system-ui, -apple-system, Segoe UI, sans-serif;
	}

	:global(html, body) {
		height: 100%;
		background: transparent;
	}

	:global(html) {
		background: #000;
	}

	/* Dark mode: blue radial gradient behind 3D (blue center, black edges) like Spline preview */
	:global(html[data-theme='dark']) {
		background: radial-gradient(
			ellipse 90% 90% at 50% 50%,
			#0f1a2e 0%,
			#0c1229 35%,
			#070b1a 65%,
			#000 100%
		);
		background-attachment: fixed;
	}

	/* Light mode: keep page dark, only 3D sprite is "light"; no extra light on whole page */

	:global(body) {
		font-family: var(--font);
		color: var(--primary-text);
		background: transparent;
		line-height: 1.55;
		overflow-x: hidden;
	}

	.spline-loader {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1000;
		text-align: center;
		color: var(--primary-text);
	}

	.loader-spinner {
		width: 50px;
		height: 50px;
		margin: 0 auto 1rem;
		border: 3px solid hsl(0 0% 100% / 0.1);
		border-top-color: var(--primary-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.spline-loader p {
		font-size: 0.875rem;
		opacity: 0.8;
	}

	#spline-canvas {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100vw;
		height: 100vh;
		z-index: 0;
		pointer-events: none;
		opacity: 0;
		display: block;
		transition: opacity 0.8s ease-in, filter 0.4s ease;
	}

	#spline-canvas.loaded {
		opacity: 0.7;
	}

	:global(html[data-theme='dark']) #spline-canvas.loaded {
		opacity: 0.65;
		filter: brightness(0.95) contrast(1.02);
	}

	:global(html[data-theme='light']) #spline-canvas.loaded {
		opacity: 0.88;
		filter: brightness(1.12) contrast(1.08) saturate(1.1);
	}

	.theme-switch {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--glass-background-transparent, hsl(0 0% 100% / 0.08));
		border: 1px solid var(--glass-border-transparent, hsl(0 0% 100% / 0.15));
		border-radius: 999px;
		color: var(--primary-text);
		font-family: var(--font);
		font-size: 0.875rem;
		cursor: pointer;
		pointer-events: auto;
		transition: background 0.2s, border-color 0.2s, color 0.2s;
	}

	.theme-switch:hover {
		background: hsl(0 0% 100% / 0.12);
		border-color: hsl(0 0% 100% / 0.25);
	}

	.theme-switch__track {
		display: block;
		width: 2.5rem;
		height: 1.25rem;
		background: hsl(0 0% 100% / 0.2);
		border-radius: 999px;
		position: relative;
		transition: background 0.2s;
	}

	.theme-switch__thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 1rem;
		height: 1rem;
		background: #fff;
		border-radius: 50%;
		transition: transform 0.2s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	:global(html[data-theme='light']) .theme-switch__thumb {
		transform: translateX(1.25rem);
	}

	:global(html[data-theme='dark']) .theme-switch__thumb {
		transform: translateX(0);
	}

	.theme-switch__label {
		min-width: 2.5rem;
		text-align: left;
	}

	#main-content {
		position: relative;
		z-index: 10;
		pointer-events: none;
	}

	#main-content * {
		pointer-events: auto;
	}

	.padding-sec {
		padding-inline: 4vw;
	}

	.personal {
		position: relative;
		z-index: 10;
		padding-top: 32vh;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: 0.5rem;
	}

	.h1-typer-style,
	.h2-typer-style {
		border-right: none;
	}

	@keyframes nameReveal {
		from {
			transform: translateX(1em);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.hero-letters :global(.char) {
		display: inline-block;
		opacity: 0;
		animation: nameReveal 0.5s ease-out forwards;
	}

	.home-typer-h1 :global(.char) {
		animation-delay: calc(50ms + var(--char-i, 0) * 35ms);
	}

	.home-typer-h2 :global(.char) {
		animation-delay: calc(250ms + var(--char-i, 0) * 35ms);
	}

	:global(h1) {
		font-weight: 700;
		font-size: clamp(2rem, 8vw, 4.5rem);
		line-height: 1.15;
		letter-spacing: 0.02em;
	}

	:global(h2) {
		font-weight: 500;
		font-size: clamp(1rem, 3.5vw, 1.5rem);
		opacity: 0.9;
		letter-spacing: 0.01em;
	}

	.scroll-wrap {
		position: relative;
		z-index: 10;
		overflow: visible;
	}

	.horizontal-scroll-sec {
		display: block;
		position: relative;
		z-index: 10;
	}

	.article-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 10;
		min-height: 80svh;
	}

	.text-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: min(92vw, 800px);
		margin: 0 auto;
		padding: clamp(1.25rem, 4vw, 2rem);
		background: hsl(0 0% 100% / 0.07);
		border: 1px solid hsl(0 0% 100% / 0.12);
		border-radius: 20px;
		box-shadow: 0 16px 40px hsl(0 0% 0% / 0.35);
		backdrop-filter: blur(16px);
		position: relative;
		z-index: 10;
	}

	.text-card .title {
		font-size: clamp(1.35rem, 5vw, 2rem);
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.text-card p {
		color: var(--muted-text);
		font-size: clamp(14px, 3.6vw, 18px);
	}

	.text-card .cta {
		align-self: flex-start;
		color: var(--primary-accent);
		text-decoration: none;
		font-weight: 700;
		border-bottom: 2px solid hsl(230 100% 75% / 0.4);
		padding-bottom: 2px;
		margin-top: 0.3rem;
		transition: color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
	}

	.text-card .cta:hover {
		color: var(--secondary-accent);
		transform: translateX(2px);
		border-color: hsl(170 70% 60% / 0.55);
	}

	.site-footer {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 4vw;
		color: var(--muted-text);
	}

	@media (min-width: 768px) {
		.personal {
			padding-top: 25vh;
		}

		.scroll-wrap {
			overflow: hidden;
			position: relative;
			height: 100svh;
		}

		.horizontal-scroll-sec {
			display: flex;
			flex-direction: row;
			height: 100svh;
			min-width: max-content;
			will-change: transform;
		}

		.article-wrapper {
			flex: 0 0 100vw;
			height: 100svh;
		}
	}
</style>
