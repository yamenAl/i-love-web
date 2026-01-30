import { writable } from 'svelte/store';

const STORAGE_KEY = 'theme';
const DEFAULT = 'light';

function getInitial() {
	if (typeof document === 'undefined') return DEFAULT;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark') return stored;
	} catch (_) {}
	return DEFAULT;
}

function createThemeStore() {
	const { subscribe, set, update } = writable(getInitial());

	return {
		subscribe,
		set: (value) => {
			if (value !== 'light' && value !== 'dark') return;
			set(value);
			try {
				localStorage.setItem(STORAGE_KEY, value);
			} catch (_) {}
			if (typeof document !== 'undefined') {
				document.documentElement.dataset.theme = value;
			}
		},
		toggle: () => {
			update((v) => {
				const next = v === 'light' ? 'dark' : 'light';
				try {
					localStorage.setItem(STORAGE_KEY, next);
				} catch (_) {}
				if (typeof document !== 'undefined') {
					document.documentElement.dataset.theme = next;
				}
				return next;
			});
		}
	};
}

export const theme = createThemeStore();
