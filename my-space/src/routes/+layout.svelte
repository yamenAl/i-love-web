<script>
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/organisms/Header.svelte';
	import '$lib/assets/styles/styleguide.css';
	import { theme } from '$lib/stores/theme.js';

	let { children } = $props();

	onMount(() => {
		const unsub = theme.subscribe((value) => {
			document.documentElement.dataset.theme = value;
		});
		return unsub;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Yamen — I love web</title>
</svelte:head>

<Header siteName="Yamen — I love web" />
{@render children()}
