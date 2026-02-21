import { writable } from 'svelte/store';

const STORAGE_KEY = 'theme';
const DEFAULT = 'light';

// read saved theme from localStorage (or default) – only in browser
function getInitial() {
	if (typeof document === 'undefined') return DEFAULT;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark') return stored;
	} catch (_) {}
	return DEFAULT;
}

// sync theme to localStorage and html (so css can use data-theme)
function syncTheme(value) {
	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch (_) {}
	if (typeof document !== 'undefined') {
		document.documentElement.dataset.theme = value;
	}
}

function createThemeStore() {
	const { subscribe, set, update } = writable(getInitial());

	return {
		subscribe,
		set: (value) => {
			if (value !== 'light' && value !== 'dark') return;
			set(value);
			syncTheme(value);
		},
		toggle: () => {
			update((v) => {
				const next = v === 'light' ? 'dark' : 'light';
				syncTheme(next);
				return next;
			});
		}
	};
}

export const theme = createThemeStore();
