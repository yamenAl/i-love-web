// postcss runs tailwind (so we get our utility classes) and autoprefixer (so -webkit- etc added for old browsers)
export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {}
	}
};
