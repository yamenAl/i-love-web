<script>
	import Icon from '$lib/atoms/Icon.svelte';

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

	.nav-item:hover {
		background-color: #f3f4f6;
		color: #111827;
	}

	.nav-item--active {
		background-color: #eff6ff;
		color: #3b82f6;
		font-weight: 500;
	}

	.nav-item__text {
		font-size: 0.875rem;
	}
</style>
