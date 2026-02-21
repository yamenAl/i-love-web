<script>
	import Icon from '$lib/components/atoms/Icon.svelte';
	import NavItem from '$lib/components/molecules/NavItem.svelte';
	import { theme } from '$lib/stores/theme.js';

	let { siteName = 'My Space' } = $props();

	let mobileMenuOpen = $state(false);

	const headerNavLinks = [
		{ label: 'Home', href: '/', icon: 'home' },
		{ label: 'Spirits', href: '/sprits', icon: 'search' },
		{ label: 'About', href: '/about', icon: 'user' },
		{ label: 'Projects', href: '/projects', icon: 'search' }
	];
</script>

<header class="header">
	<div class="header__container">
		<div class="header__brand">
			<a href="/" class="header__logo">
				{siteName}
			</a>
		</div>

		<nav class="header__nav" class:header__nav--open={mobileMenuOpen}>
			{#each headerNavLinks as navLink}
				<NavItem href={navLink.href} icon={navLink.icon}>
					{navLink.label}
				</NavItem>
			{/each}
		</nav>

		<!-- theme toggle in header so it never sits on top of Spirits/Projects -->
		<button
			type="button"
			class="header__theme-switch"
			class:theme-light={$theme === 'light'}
			aria-label="Toggle light and dark mode"
			onclick={() => theme.toggle()}
		>
			<span class="header__theme-switch-track" aria-hidden="true">
				<span class="header__theme-switch-thumb"></span>
			</span>
			<span class="header__theme-switch-label">{$theme === 'dark' ? 'Dark' : 'Light'}</span>
		</button>

		<button
			class="header__menu-toggle"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Toggle menu"
		>
			<Icon name={mobileMenuOpen ? 'close' : 'menu'} />
		</button>
	</div>
</header>

<style>
	.header {
		background-color: hsl(0 0% 100% / 0.08);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid hsl(0 0% 100% / 0.12);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.header__container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header__brand {
		display: flex;
		align-items: center;
	}

	.header__logo {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-color-white-primary, #e7ecff);
		text-decoration: none;
	}

	.header__nav {
		display: none;
		gap: 0.5rem;
	}

	/* theme toggle: same row as logo/menu, never overlaps nav */
	.header__theme-switch {
		display: flex;
		align-items: center;
		gap: var(--spacing-small);
		padding: var(--spacing-small) var(--spacing-medium);
		min-height: 44px;
		min-width: 44px;
		background: var(--glass-background-transparent);
		border: 1px solid var(--glass-border-transparent);
		border-radius: 999px;
		color: var(--text-color-white-primary, #e7ecff);
		font-family: var(--font-family-primary);
		font-size: var(--font-size-small-text);
		cursor: pointer;
		transition: background 0.2s ease, border-color 0.2s ease;
	}
	.header__theme-switch:hover {
		background: hsl(0 0% 100% / 0.12);
		border-color: hsl(0 0% 100% / 0.25);
	}
	.header__theme-switch-track {
		display: block;
		width: 2.5rem;
		height: 1.25rem;
		background: hsl(0 0% 100% / 0.2);
		border-radius: 999px;
		position: relative;
	}
	.header__theme-switch-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 1rem;
		height: 1rem;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		transition: transform 0.2s ease;
	}
	.header__theme-switch.theme-light .header__theme-switch-thumb {
		transform: translateX(1.25rem);
	}
	.header__theme-switch-label {
		min-width: 2.5rem;
		text-align: left;
	}

	.header__menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--text-color-white-primary, #e7ecff);
	}

	@media (min-width: 768px) {
		.header__nav {
			display: flex;
		}

		.header__menu-toggle {
			display: none;
		}
	}

	@media (max-width: 767px) {
		.header__nav--open {
			display: flex;
			flex-direction: column;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background-color: hsl(0 0% 100% / 0.08);
			backdrop-filter: blur(12px);
			border-bottom: 1px solid hsl(0 0% 100% / 0.12);
			padding: 1rem;
		}

	}
</style>
