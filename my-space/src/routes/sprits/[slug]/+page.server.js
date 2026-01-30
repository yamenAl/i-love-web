/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const photos = await getPhotosForSlug(slug);
	return {
		slug,
		photos
	};
}

async function getPhotosForSlug(slug) {
	const defaultPhotos = [
		{ src: 'https://picsum.photos/600/400?random=1', alt: 'Photo 1' },
		{ src: 'https://picsum.photos/600/400?random=2', alt: 'Photo 2' },
		{ src: 'https://picsum.photos/600/400?random=3', alt: 'Photo 3' }
	];
	return defaultPhotos;
}
