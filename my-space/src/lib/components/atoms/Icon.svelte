<script>
	/**
	 * @typedef {'small' | 'medium' | 'large'} IconSize
	 */

	let {
		name = 'menu',
		size = 'medium',
		color = 'currentColor'
	} = $props();

	const icons = {
		menu: 'M4 6h16M4 12h16M4 18h16',
		close: 'M6 18L18 6M6 6l12 12',
		home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
		user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
		search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		arrow: 'M9 5l7 7-7 7'
	};

	const sizeMap = {
		small: 16,
		medium: 24,
		large: 32
	};
</script>

<svg
	class="icon icon--{size}"
	width={sizeMap[size]}
	height={sizeMap[size]}
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path d={icons[name] || icons.menu} />
</svg>

<style>
	.icon {
		display: inline-block;
		flex-shrink: 0;
	}
</style>
