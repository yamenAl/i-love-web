<script>
	import NavItem from '$lib/components/molecules/NavItem.svelte';

	let {
		items = [],
		orientation = 'horizontal'
	} = $props();
</script>

<nav class="navigation navigation--{orientation}">
	{#each items as item}
		<NavItem href={item.href} active={item.active} icon={item.icon}>
			{item.label}
		</NavItem>
	{/each}
</nav>

<style>
	.navigation {
		display: flex;
		gap: 0.5rem;
	}

	.navigation--horizontal {
		flex-direction: row;
	}

	.navigation--vertical {
		flex-direction: column;
	}
</style>
