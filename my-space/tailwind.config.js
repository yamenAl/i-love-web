/** @type {import('tailwindcss').Config} */
// where tailwind looks for classes + our custom colors/fonts/keyframes
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			// so we can use text-primary-text, bg-primary-bg etc
			colors: {
				primary: {
					bg: '#070b1a',
					text: '#e7ecff',
					accent: '#86a0ff'
				},
				secondary: {
					bg: '#0c1229',
					accent: '#4bd6c8'
				},
				muted: {
					text: '#b8c1ff'
				}
			},
			fontFamily: {
				sans: ['DM Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
			}
		}
	},
	plugins: []
};
