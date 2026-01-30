<script>
	import Card from '$lib/components/molecules/Card.svelte';
	import LayeredBackground from '$lib/components/LayeredBackground.svelte';

	let { data } = $props();
</script>

<div class="background-wrap">
	<LayeredBackground />
</div>

<div class="spirits-page">
	<header class="spirits-header">
		<a href="/" class="back-link">← Back to Home</a>
		<h1>Spirits</h1>
		<p class="subtitle">Browse all spirits</p>
	</header>

	<main class="spirits-content">
		<ul class="spirits-grid">
			{#each data.spirits as spirit}
				<li>
					<Card
						title={spirit.name}
						image={spirit.image}
						href={"/sprits/" + spirit.slug}
					/>
				</li>
			{/each}
		</ul>
	</main>
</div>

<style>
	.background-wrap {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.spirits-page {
		position: relative;
		z-index: 10;
		min-height: 100vh;
		background: transparent;
		color: var(--primary-text, #e7ecff);
		padding: 2rem;
	}

	.spirits-header {
		max-width: 1200px;
		margin: 0 auto 3rem;
		text-align: center;
	}

	.back-link {
		display: inline-block;
		color: var(--primary-accent, #86a0ff);
		text-decoration: none;
		margin-bottom: 2rem;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--secondary-accent, #4bd6c8);
	}

	.spirits-header h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 800;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.25rem;
		color: var(--muted-text, #b8c1ff);
		opacity: 0.9;
		margin: 0;
	}

	.spirits-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.spirits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.spirits-grid :global(.card) {
		background: hsl(0 0% 100% / 0.08);
		border: 1px solid hsl(0 0% 100% / 0.15);
	}

	.spirits-grid :global(.card__title) {
		color: var(--primary-text, #e7ecff);
	}
</style>
