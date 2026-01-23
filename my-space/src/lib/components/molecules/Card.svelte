<script>
	let {
		title = '',
		subtitle = '',
		image = '',
		href = '',
		children
	} = $props();
</script>

<article class="card">
	{#if image}
		<div class="card__image">
			<img src={image} alt={title} />
		</div>
	{/if}
	<div class="card__content">
		{#if title}
			<h3 class="card__title">{title}</h3>
		{/if}
		{#if subtitle}
			<p class="card__subtitle">{subtitle}</p>
		{/if}
		{#if children}
			<div class="card__body">
				{@render children()}
			</div>
		{/if}
	</div>
	{#if href}
		<a class="card__link" {href} aria-label="Read more about {title}"></a>
	{/if}
</article>

<style>
	.card {
		position: relative;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		overflow: hidden;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.card__image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.card__image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card__content {
		padding: 1.5rem;
	}

	.card__title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #111827;
	}

	.card__subtitle {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0 0 1rem 0;
	}

	.card__body {
		color: #374151;
		line-height: 1.5;
	}

	.card__link {
		position: absolute;
		inset: 0;
		z-index: 1;
	}
</style>
