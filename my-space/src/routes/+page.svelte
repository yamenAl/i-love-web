<script>
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.js';
	import SplineSceneDark from '$lib/components/SplineSceneDark.svelte';
	import SplineSceneLight from '$lib/components/SplineSceneLight.svelte';
	import CustomCursor from '$lib/components/home/CustomCursor.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import AboutProjectsContact from '$lib/components/home/AboutProjectsContact.svelte';
	import StatsBar from '$lib/components/home/StatsBar.svelte';
	import StoryScroll from '$lib/components/home/StoryScroll.svelte';

	const GSAP_TIMEOUT_MS = 8000;
	const heroName = 'Yamen Al Sharabi';
	const stats = [
		{ target: 2, suffix: '+', label: 'Years building' },
		{ target: 10, suffix: '+', label: 'Projects shipped' },
		{ target: 3, suffix: '', label: 'Stacks mastered' }
	];

	// Page-level UI states: JS-ready flag, intro overlay, motion mode, progress values.
	let hasJs = $state(false);
	let showIntroLoader = $state(true);
	let gsapReady = $state(false);
	let scrollPercent = $state(0);
	let animatedStats = $state([0, 0, 0]);
	let horizontalScrollContainer = $state(null);
	let statBar = $state(null);

	function updateScrollProgress() {
		// Keep top progress line in sync with total scroll depth.
		const scrollable = document.documentElement.scrollHeight - window.innerHeight;
		if (scrollable <= 0) {
			scrollPercent = 0;
			return;
		}
		scrollPercent = Math.max(0, Math.min(100, (window.scrollY / scrollable) * 100));
	}

	function animateStat(index, target) {
		// Small cubic easing for smooth counter animation.
		const duration = 900;
		const startedAt = performance.now();

		function tick(now) {
			const progress = Math.min(1, (now - startedAt) / duration);
			animatedStats[index] = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
			if (progress < 1) requestAnimationFrame(tick);
		}

		requestAnimationFrame(tick);
	}

	function loadScript(src) {
		// Reuse existing script tags so we do not inject duplicates.
		return new Promise((resolve, reject) => {
			const existing = document.querySelector(`script[src="${src}"]`);
			if (existing) {
				if (existing.dataset.loaded === 'true') {
					resolve();
					return;
				}
				existing.addEventListener('load', () => resolve(), { once: true });
				existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
				return;
			}

			const script = document.createElement('script');
			script.src = src;
			script.async = true;
			script.onload = () => {
				script.dataset.loaded = 'true';
				resolve();
			};
			script.onerror = () => reject(new Error(`Failed to load ${src}`));
			document.head.appendChild(script);
		});
	}

	function initHorizontalScroll() {
		// Progressive enhancement: only activate horizontal pin on desktop + GSAP ready.
		if (!window.gsap || !window.ScrollTrigger || !horizontalScrollContainer) return () => {};

		const desktopQuery = window.matchMedia('(min-width: 768px)');
		if (!desktopQuery.matches) return () => {};

		const { gsap, ScrollTrigger } = window;
		const track = horizontalScrollContainer.querySelector('.story-scroll-track');
		if (!track) return () => {};

		const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
		if (getDistance() <= 1) return () => {};

		const tween = gsap.to(track, {
			x: () => -getDistance(),
			ease: 'none'
		});

		const pin = ScrollTrigger.create({
			trigger: horizontalScrollContainer,
			start: 'top top',
			end: () => `+=${getDistance()}`,
			pin: true,
			scrub: 1,
			animation: tween,
			invalidateOnRefresh: true
		});

		const cardTriggers = [];
		track.querySelectorAll('.story-card').forEach((card) => {
			const lines = card.querySelectorAll('.story-line');
			if (!lines.length) return;
			const trigger = gsap.fromTo(
				lines,
				{ xPercent: 36, opacity: 0 },
				{
					xPercent: 0,
					opacity: 1,
					ease: 'power2.out',
					stagger: 0.1,
					scrollTrigger: {
						trigger: card,
						containerAnimation: tween,
						start: 'left center',
						end: 'center center',
						scrub: true
					}
				}
			);
			cardTriggers.push(trigger);
		});

		const onResize = () => ScrollTrigger.refresh();
		window.addEventListener('resize', onResize);
		ScrollTrigger.refresh();

		return () => {
			window.removeEventListener('resize', onResize);
			pin.kill();
			tween.kill();
			cardTriggers.forEach((animation) => {
				if (animation?.scrollTrigger) animation.scrollTrigger.kill();
				animation?.kill?.();
			});
		};
	}

	onMount(() => {
		// Main boot sequence: loader, progress, counter observer, then GSAP setup.
		hasJs = true;
		const cleanups = [];

		const loaderTimer = setTimeout(() => {
			showIntroLoader = false;
		}, 1150);
		cleanups.push(() => clearTimeout(loaderTimer));

		updateScrollProgress();
		window.addEventListener('scroll', updateScrollProgress, { passive: true });
		window.addEventListener('resize', updateScrollProgress);
		cleanups.push(() => {
			window.removeEventListener('scroll', updateScrollProgress);
			window.removeEventListener('resize', updateScrollProgress);
		});

		if (statBar && 'IntersectionObserver' in window) {
			const statsObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						stats.forEach((item, index) => animateStat(index, item.target));
						statsObserver.disconnect();
					});
				},
				{ threshold: 0.35 }
			);
			statsObserver.observe(statBar);
			cleanups.push(() => statsObserver.disconnect());
		}

		(async () => {
			let timedOut = false;
			const timeout = setTimeout(() => {
				timedOut = true;
			}, GSAP_TIMEOUT_MS);

			try {
				await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
				await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
				if (timedOut || !window.gsap || !window.ScrollTrigger) return;

				clearTimeout(timeout);
				window.gsap.registerPlugin(window.ScrollTrigger);
				const cleanupHorizontal = initHorizontalScroll();
				if (cleanupHorizontal) {
					gsapReady = true;
					cleanups.push(cleanupHorizontal);
				}
			} catch (_) {
				clearTimeout(timeout);
			}
		})();

		return () => {
			cleanups.forEach((cleanup) => cleanup?.());
		};
	});
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

{#if hasJs}
	<CustomCursor />
{/if}

{#if showIntroLoader}
	<div class="intro-loader" aria-live="polite">
		<div class="intro-loader__inner">
			<p class="intro-loader__label">Yamen.dev</p>
			<div class="intro-loader__line"><span></span></div>
		</div>
	</div>
{/if}

<div class="scroll-progress">
	<span style="width: {scrollPercent}%;"></span>
</div>

<noscript>
	<p class="noscript-message">Some features (3D scene and motion effects) need JavaScript. The content still works.</p>
</noscript>

<main class="page">
	<div class="grid-bg"></div>
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
	<HeroSection {heroName} themeMode={$theme} />

	<div bind:this={statBar}>
		<StatsBar {stats} {animatedStats} />
	</div>

	<div bind:this={horizontalScrollContainer}>
		<StoryScroll {gsapReady} />
	</div>

	<AboutProjectsContact themeMode={$theme} />
</main>

<style>
	@keyframes loaderSlide {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}

	.intro-loader {
		position: fixed;
		inset: 0;
		z-index: 1200;
		display: grid;
		place-items: center;
		background: rgb(8 10 15 / 0.88);
		backdrop-filter: blur(10px);
	}
	.intro-loader__inner {
		width: min(420px, 84vw);
	}
	.intro-loader__label {
		margin: 0 0 10px;
		font-family: var(--font-family-mono);
		font-size: 0.78rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #f0f2f8;
	}
	.intro-loader__line {
		height: 2px;
		width: 100%;
		background: rgb(255 255 255 / 0.12);
		overflow: hidden;
	}
	.intro-loader__line span {
		display: block;
		width: 55%;
		height: 100%;
		background: linear-gradient(90deg, transparent, #ff4d6d, #4df0c8, transparent);
		animation: loaderSlide 1s ease infinite;
	}

	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		z-index: 110;
		background: transparent;
	}
	.scroll-progress span {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, #ff4d6d, #4df0c8);
		transition: width 0.08s linear;
	}

	.noscript-message {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		z-index: 200;
		padding: 0.7rem 1rem;
		background: rgb(0 0 0 / 0.78);
		color: #fff;
		font-size: 0.9rem;
		border-radius: 8px;
		text-align: center;
	}

	.page {
		position: relative;
		z-index: 1;
		container-type: inline-size;
	}

	.grid-bg,
	.orb {
		position: fixed;
		pointer-events: none;
		z-index: 0;
	}
	.grid-bg {
		inset: 0;
		background-image: linear-gradient(rgb(255 77 109 / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(255 77 109 / 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
	}
	.orb {
		border-radius: 50%;
		filter: blur(120px);
	}
	.orb-1 {
		width: 500px;
		height: 500px;
		top: -150px;
		right: -100px;
		background: rgb(255 77 109 / 0.1);
	}
	.orb-2 {
		width: 400px;
		height: 400px;
		bottom: -100px;
		left: -80px;
		background: rgb(77 240 200 / 0.08);
	}

	@media (prefers-reduced-motion: reduce) {
		.intro-loader {
			display: none;
		}
		.scroll-progress span {
			transition: none;
		}
	}
</style>
