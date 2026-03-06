<script>
	let { gsapReady = false } = $props();
</script>

<div class="story-scroll-container" class:story-scroll-container--fallback={!gsapReady}>
	<section class="story-scroll-track">
		<div class="story-card-wrap">
			<article class="story-card glass-card">
				<h3 class="story-line">Frontend with creative direction</h3>
				<p class="story-line">I design and build interfaces that feel clear, modern, and alive.</p>
				<p class="story-line">Based in Amsterdam, studying HBO-ICT at HvA.</p>
			</article>
		</div>
		<div class="story-card-wrap">
			<article class="story-card glass-card">
				<h3 class="story-line">What I build</h3>
				<p class="story-line">Portfolio sites, landing pages, and product frontends with strong UX.</p>
				<p class="story-line">From concept and visual direction to production-ready code.</p>
			</article>
		</div>
		<div class="story-card-wrap">
			<article class="story-card glass-card">
				<h3 class="story-line">Core stack</h3>
				<p class="story-line">SvelteKit, modern CSS, GSAP motion, and 3D workflows in Blender.</p>
				<p class="story-line">Fast iterations, clean structure, and scalable components.</p>
			</article>
		</div>
		<div class="story-card-wrap">
			<article class="story-card glass-card">
				<h3 class="story-line">Recent focus</h3>
				<p class="story-line">Health-tech platforms, creative AI experiments, and interaction design.</p>
				<a class="story-line cta-link" href="/year/2025-2026">See projects -&gt;</a>
			</article>
		</div>
	</section>
</div>

<style>
	.story-scroll-container {
		position: relative;
		z-index: 2;
		overflow: visible;
	}

	.story-scroll-container--fallback {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;

		.story-scroll-track {
			display: flex;
			flex-wrap: nowrap;
		}
	}

	.story-scroll-track {
		display: block;
	}

	.story-card-wrap {
		min-height: 74vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px 0;
	}

	.story-card {
		width: min(92vw, 840px);
		display: flex;
		flex-direction: column;
		gap: 12px;

		h3 {
			font-size: clamp(28px, 4.4vw, 52px);
			margin: 0;
		}

		p {
			color: #c1c7d8;
			font-size: 17px;
		}
	}

	@container (max-width: 48rem) {
		.story-scroll-container--fallback .story-card-wrap {
			flex: 0 0 88vw;
			padding-right: 10px;
		}
	}

	@container (min-width: 48rem) {
		.story-scroll-container {
			overflow: hidden;
			height: 100vh;
			height: 100dvh;
		}

		.story-scroll-track {
			display: flex;
			height: 100vh;
			height: 100dvh;
			min-width: max-content;
			will-change: transform;
		}

		.story-card-wrap {
			flex: 0 0 100vw;
			height: 100vh;
			height: 100dvh;
			padding: 0;
		}
	}
</style>
