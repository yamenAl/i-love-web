<script>
	import { onMount } from 'svelte';
	import { Application } from '@splinetool/runtime';
	import LayeredBackground from '$lib/components/LayeredBackground.svelte';

	let heroH1;
	let heroH2;
	let scrollWrap;
	let splineCanvas;
	let splineLoaded = $state(false);
	let splineError = $state(false);

	onMount(() => {
		if (splineCanvas) {
			const app = new Application(splineCanvas);
			app.load('https://prod.spline.design/O3pv-m0mZE2ZOVFc/scene.splinecode')
				.then(() => {
					splineLoaded = true;
				})
				.catch((error) => {
					console.error('Spline loading error:', error);
					splineError = true;
					splineLoaded = true; // Hide loader even on error
				});
		}

		const gsapScript = document.createElement('script');
		gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
		
		const scrollTriggerScript = document.createElement('script');
		scrollTriggerScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
		
		document.head.appendChild(gsapScript);
		document.head.appendChild(scrollTriggerScript);

		gsapScript.onload = () => {
			scrollTriggerScript.onload = () => {
				initAnimations();
			};
		};
	});

	function initAnimations() {
		if (!window.gsap || !window.ScrollTrigger) return;
		
		const { gsap } = window;
		gsap.registerPlugin(window.ScrollTrigger);

		animateHero(heroH1, 0.05);
		animateHero(heroH2, 0.25);
		initHorizontalScroll();
	}

	function splitToLetters(el) {
		if (!el || el.dataset.splitted === '1') return;
		const text = el.textContent;
		el.setAttribute('aria-label', text);
		el.textContent = '';
		[...text].forEach(ch => {
			const span = document.createElement('span');
			span.className = 'char';
			span.textContent = ch === ' ' ? '\u00A0' : ch;
			el.appendChild(span);
		});
		el.dataset.splitted = '1';
	}

	function animateHero(el, delay = 0) {
		if (!el || !window.gsap) return;
		const { gsap } = window;
		
		splitToLetters(el);
		const chars = el.querySelectorAll('.char');
		gsap.fromTo(chars,
			{ x: '1em', opacity: 0 },
			{
				x: '0em',
				opacity: 1,
				ease: 'power3.out',
				stagger: 0.035,
				duration: 0.5,
				delay
			}
		);
	}

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
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Loading Indicator -->
<LayeredBackground />

{#if !splineLoaded}
	<div class="spline-loader">
		<div class="loader-spinner"></div>
		<p>Loading 3D Scene...</p>
	</div>
{/if}

<canvas bind:this={splineCanvas} id="spline-canvas" class:loaded={splineLoaded}></canvas>

<main id="main-content">
	<section class="personal padding-sec">
		<h1 bind:this={heroH1} class="hero-letters home-typer-h1 h1-typer-style">Yamen Al Sharabi</h1>
		<h2 bind:this={heroH2} class="hero-letters home-typer-h2 h2-typer-style">Creative front end developer</h2>
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
		--font: "Outfit", system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif;
	}

	:global(html, body) {
		height: 100%;
		background: transparent;
	}

	:global(html) {
		background: #000;
	}

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
		transition: opacity 0.8s ease-in;
	}

	#spline-canvas.loaded {
		opacity: 0.7;
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
		padding-top: 30vh;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	.h1-typer-style,
	.h2-typer-style {
		border-right: none;
	}

	.hero-letters :global(.char) {
		display: inline-block;
		transform: translateX(1em);
		opacity: 0;
		will-change: transform, opacity;
	}

	:global(h1) {
		font-weight: 800;
		text-transform: uppercase;
		font-size: clamp(34px, 9vw, 120px);
		line-height: 1.05;
		letter-spacing: 0.5px;
	}

	:global(h2) {
		font-weight: 600;
		font-size: clamp(16px, 4vw, 34px);
		opacity: 0.95;
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
		gap: 0.6rem;
		width: min(92vw, 840px);
		margin: 0 auto;
		padding: clamp(18px, 4vw, 36px);
		background: hsl(0 0% 100% / 0.08);
		border: 1px solid hsl(0 0% 100% / 0.15);
		border-radius: 16px;
		box-shadow: 0 24px 60px hsl(0 0% 0% / 0.5);
		backdrop-filter: blur(20px);
		position: relative;
		z-index: 10;
	}

	.text-card .title {
		font-size: clamp(22px, 6vw, 42px);
		font-weight: 800;
		letter-spacing: 0.2px;
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
