export function load() {
	return {
		hero: {
			src: 'https://picsum.photos/seed/city-hero-v2/1920/1080',
			alt: 'City skyline'
		},
		gallery: [
			{
				id: 1,
				src: 'https://picsum.photos/seed/city-wide-1/1600/900',
				alt: 'Wide urban boulevard',
				caption: 'Every street leads somewhere worth going.',
				aspect: 'wide'
			},
			{
				id: 2,
				src: 'https://picsum.photos/seed/city-tall-1/800/1100',
				alt: 'Tall city building',
				caption: 'Glass towers hold a thousand quiet stories.',
				aspect: 'tall'
			},
			{
				id: 3,
				src: 'https://picsum.photos/seed/city-tall-2/800/1100',
				alt: 'Urban alley at dusk',
				caption: 'Shadows fall softer between old walls.',
				aspect: 'tall'
			},
			{
				id: 4,
				src: 'https://picsum.photos/seed/city-wide-2/1600/900',
				alt: 'City bridge at night',
				caption: 'Light bends differently over water.',
				aspect: 'wide'
			},
			{
				id: 5,
				src: 'https://picsum.photos/seed/city-sq-1/900/900',
				alt: 'City square',
				caption: 'Noon.',
				aspect: 'square'
			},
			{
				id: 6,
				src: 'https://picsum.photos/seed/city-sq-2/900/900',
				alt: 'Corner cafe',
				caption: 'A coffee, a window, a city outside.',
				aspect: 'square'
			},
			{
				id: 7,
				src: 'https://picsum.photos/seed/city-sq-3/900/900',
				alt: 'Street market',
				caption: 'Colour before noon.',
				aspect: 'square'
			}
		]
	};
}
