<script>
	let {
		href = '#',
		external = false,
		underline = true,
		children
	} = $props();
</script>

{#if external}
	<a
		class="link"
		class:link--underline={underline}
		{href}
		target="_blank"
		rel="noopener noreferrer"
	>
		{@render children()}
	</a>
{:else}
	<a class="link" class:link--underline={underline} {href}>
		{@render children()}
	</a>
{/if}

<style>
	.link {
		color: #3b82f6;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.link--underline {
		text-decoration: underline;
	}

	.link:hover {
		color: #2563eb;
	}

	.link:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
