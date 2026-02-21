<script>
	import LayeredBackground from '$lib/components/LayeredBackground.svelte';

	let { data } = $props();

</script>


<div class="spirit-detail__background">
	<LayeredBackground />
</div>

<style>
	.spirit-detail__background {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
</style>
