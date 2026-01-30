<script>
	import Icon from '$lib/components/atoms/Icon.svelte';

	let {
		href = '#',
		active = false,
		icon = '',
		children
	} = $props();
</script>

<a class="nav-item" class:nav-item--active={active} {href}>
	{#if icon}
		<Icon name={icon} size="small" />
	{/if}
	<span class="nav-item__text">
		{@render children()}
	</span>
</a>

<style>
	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		color: #6b7280;
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	:global(html[data-theme='dark']) .nav-item {
		color: var(--text-color-white-muted, #b8c1ff);
	}

	.nav-item:hover {
		background-color: #f3f4f6;
		color: #111827;
	}

	:global(html[data-theme='dark']) .nav-item:hover {
		background-color: hsl(0 0% 100% / 0.1);
		color: var(--text-color-white-primary, #e7ecff);
	}

	.nav-item--active {
		background-color: #eff6ff;
		color: #3b82f6;
		font-weight: 500;
	}

	:global(html[data-theme='dark']) .nav-item--active {
		background-color: hsl(230 100% 75% / 0.15);
		color: var(--accent-color-blue-primary, #86a0ff);
	}

	.nav-item__text {
		font-size: 0.875rem;
	}
</style>
