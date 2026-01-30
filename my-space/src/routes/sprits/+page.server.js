/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const spirits = [
		{ slug: 'fire', name: 'Fire Spirit', image: 'https://picsum.photos/400/300?random=fire' },
		{ slug: 'water', name: 'Water Spirit', image: 'https://picsum.photos/400/300?random=water' },
		{ slug: 'earth', name: 'Earth Spirit', image: 'https://picsum.photos/400/300?random=earth' },
		{ slug: 'air', name: 'Air Spirit', image: 'https://picsum.photos/400/300?random=air' },
		{ slug: 'light', name: 'Light Spirit', image: 'https://picsum.photos/400/300?random=light' },
		{ slug: 'shadow', name: 'Shadow Spirit', image: 'https://picsum.photos/400/300?random=shadow' }
	];
	return { spirits };
}
