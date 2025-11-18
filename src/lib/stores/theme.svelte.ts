import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

class ThemeStore {
	theme = $state<Theme>('light');

	constructor() {
		if (browser) {
			// Load theme from localStorage or use system preference
			const saved = localStorage.getItem('theme') as Theme | null;
			if (saved) {
				this.theme = saved;
			} else {
				// Check system preference
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				this.theme = prefersDark ? 'dark' : 'light';
			}
			this.applyTheme();
		}
	}

	toggle() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		this.save();
		this.applyTheme();
	}

	setTheme(theme: Theme) {
		this.theme = theme;
		this.save();
		this.applyTheme();
	}

	private applyTheme() {
		if (!browser) return;

		if (this.theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	private save() {
		if (!browser) return;
		localStorage.setItem('theme', this.theme);
	}
}

export const themeStore = new ThemeStore();
