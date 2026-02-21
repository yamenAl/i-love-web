<script>
	import { onMount } from 'svelte';
	import { Application } from '@splinetool/runtime';

	/** @type {{ sceneUrl: string; theme?: 'dark' | 'light' }} */
	let { sceneUrl, theme = 'dark' } = $props();

	// if spline takes longer than this we show error
	const SPLINE_TIMEOUT_MS = 15000;

	let splineCanvas = $state(null);
	let splineLoaded = $state(false);
	let splineError = $state(false);
	let splineApp = null;

	// 3d needs webgl; some old devices don't have it
	function hasWebGL() {
		try {
			const testCanvas = document.createElement('canvas');
			return !!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'));
		} catch {
			return false;
		}
	}

	// keep canvas size = viewport so it doesn't look wrong on resize
	function setSplineCanvasSize() {
		if (!splineCanvas) return;
		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight;
		if (splineCanvas.width !== canvasWidth || splineCanvas.height !== canvasHeight) {
			splineCanvas.width = canvasWidth;
			splineCanvas.height = canvasHeight;
		}
	}

	// load spline scene: set size, wait for layout, then create app so ship stays centered
	onMount(() => {
		if (!splineCanvas || !sceneUrl) return;
		if (!hasWebGL()) {
			splineError = true;
			return;
		}
		setSplineCanvasSize();
		window.addEventListener('resize', setSplineCanvasSize);
		const loadTimeout = setTimeout(() => {
			if (!splineLoaded && !splineError) splineError = true;
		}, SPLINE_TIMEOUT_MS);
		// step 1: size canvas; step 2: after layout paint, create app (keeps ship centered on load)
		function initSpline() {
			if (!splineCanvas || !document.body.contains(splineCanvas)) return;
			setSplineCanvasSize();
			splineApp = new Application(splineCanvas);
			splineApp.load(sceneUrl)
			.then(() => {
				setSplineCanvasSize();
				splineLoaded = true;
				clearTimeout(loadTimeout);
			})
			.catch((err) => {
				console.error('Spline load error:', err);
				splineError = true;
				clearTimeout(loadTimeout);
			});
		}
		const rafId = requestAnimationFrame(() => {
			requestAnimationFrame(initSpline);
		});
		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(loadTimeout);
			window.removeEventListener('resize', setSplineCanvasSize);
			splineApp = null;
		};
	});
</script>

{#if !splineLoaded && !splineError}
	<div class="spline-container__loader" aria-live="polite">
		<div class="spline-container__spinner" aria-hidden="true"></div>
		<p>Loading 3D Scene...</p>
	</div>
{/if}

<!-- Spline canvas: fixed center, full viewport; visible only when loaded -->
<canvas
	bind:this={splineCanvas}
	class="spline-container__canvas"
	class:spline-container__canvas--loaded={splineLoaded}
	class:theme-dark={theme === 'dark'}
	class:theme-light={theme === 'light'}
	aria-hidden="true"
></canvas>

<style>
	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.spline-container__loader {
		position: fixed;
		inset: 0;
		z-index: var(--z-index-loader);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--text-color-white-primary);
		font-family: var(--font-family-primary);
		padding: var(--spacing-medium);
	}
	.spline-container__spinner {
		width: 48px;
		height: 48px;
		margin-bottom: var(--spacing-medium);
		border: 3px solid hsl(0 0% 100% / 0.1);
		border-top-color: var(--accent-color-blue-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	.spline-container__loader p {
		font-size: var(--font-size-small-text);
		opacity: 0.8;
	}

	/* canvas: fixed full viewport from (0,0) so ship loads centered, no offset */
	.spline-container__canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: var(--z-index-background);
		pointer-events: none;
		opacity: 0;
		transition: opacity var(--transition-speed-slow), filter var(--transition-speed-fast);
	}
	.spline-container__canvas--loaded {
		opacity: 0.65;
	}
	.spline-container__canvas--loaded.theme-dark {
		opacity: 0.65;
		filter: brightness(0.95) contrast(1.02);
	}
	.spline-container__canvas--loaded.theme-light {
		opacity: 0.88;
		filter: brightness(1.12) contrast(1.08) saturate(1.1);
	}
</style>
