<script>
	import { onMount } from 'svelte';

	let cursorDot = $state(null);
	let cursorRing = $state(null);

	onMount(() => {
		if (!cursorDot || !cursorRing || !window.matchMedia('(pointer: fine)').matches) {
			return;
		}

		let mouseX = window.innerWidth / 2;
		let mouseY = window.innerHeight / 2;
		let ringX = mouseX;
		let ringY = mouseY;
		let hoveringInteractive = false;
		let frameId = 0;

		const previousCursor = document.body.style.cursor;
		document.body.style.cursor = 'none';

		function onMouseMove(event) {
			mouseX = event.clientX;
			mouseY = event.clientY;
			cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
		}

		function onMouseOver(event) {
			hoveringInteractive = !!event.target.closest('a, button, input, textarea, [role="button"]');
		}

		function animateRing() {
			ringX += (mouseX - ringX) * 0.14;
			ringY += (mouseY - ringY) * 0.14;
			cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(${hoveringInteractive ? 1.35 : 1})`;
			frameId = requestAnimationFrame(animateRing);
		}

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseover', onMouseOver);
		animateRing();

		return () => {
			document.body.style.cursor = previousCursor;
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseover', onMouseOver);
			cancelAnimationFrame(frameId);
		};
	});
</script>

<div class="cursor" id="cursorDot" bind:this={cursorDot}>
	<div class="cursor-dot"></div>
</div>
<div class="cursor" id="cursorRing" bind:this={cursorRing}>
	<div class="cursor-ring"></div>
</div>

<style>
	.cursor {
		position: fixed;
		pointer-events: none;
		z-index: 9999;
	}

	.cursor-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ff4d6d;
		transform: translate(-50%, -50%);
	}

	.cursor-ring {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 1px solid rgb(255 77 109 / 0.5);
		transform: translate(-50%, -50%);
		transition: transform 0.18s ease;
	}

	@media (max-width: 767px), (prefers-reduced-motion: reduce) {
		.cursor {
			display: none;
		}
	}
</style>
