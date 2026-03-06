<script>
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme.js';

	let { siteName = 'Yamen — I love web' } = $props();

	let mobileMenuOpen = $state(false);

	const headerNavLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Spirits', href: '/sprits' }
	];

	const tickerItems = [
		'FRONT-END DEV',
		'LEARNING IN PUBLIC',
		'SVELTEKIT',
		'MOTION UI',
		'BLENDER',
		'CREATIVE CODING',
		'HBO-ICT @ HvA',
		'AMSTERDAM'
	];

	function isActiveLink(href) {
		const path = $page.url.pathname;
		if (href === '/') return path === '/';
		return path.startsWith(href);
	}
</script>

<header class="header">
	<div class="header-row">
		<a href="/" class="logo">
			<span>{siteName.split('—')[0].trim()}</span>
			<span class="logo-accent">&nbsp;—&nbsp;</span>
			<span>{siteName.split('—')[1]?.trim() ?? 'I love web'}</span>
		</a>

		<div class="status-tag" aria-label="Always looking for new ideas">
			<span class="status-dot"></span>
			ALWAYS LOOKING FOR NEW IDEAS
		</div>

		<nav class="header-nav" class:header-nav--open={mobileMenuOpen}>
			{#each headerNavLinks as navLink}
				<a
					href={navLink.href}
					class="nav-link"
					class:active={isActiveLink(navLink.href)}
					onclick={() => (mobileMenuOpen = false)}
				>
					{navLink.label}
				</a>
			{/each}
		</nav>

		<div class="header-actions">
			<label class="toggle-pill" aria-label="Toggle light and dark mode">
				<span class="ts">
					<input
						type="checkbox"
						checked={$theme === 'light'}
						onchange={() => theme.toggle()}
					/>
					<span class="ts-track"></span>
					<span class="ts-thumb"></span>
				</span>
				<span class="toggle-text">{$theme === 'dark' ? 'Dark' : 'Light'}</span>
			</label>

			<button
				class="menu-toggle"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<Icon name={mobileMenuOpen ? 'close' : 'menu'} />
			</button>
		</div>
	</div>

	<div class="ticker-strip">
		<div class="ticker-track">
			{#each [...tickerItems, ...tickerItems] as item}
				<span>{item}</span><span class="sep">·</span>
			{/each}
		</div>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--header-bg);
		border-bottom: 1px solid var(--divider);
		container-type: inline-size;
		transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}

	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		height: 58px;
		padding: 0 1rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.125rem;
		font-family: var(--font-family-mono);
		font-size: 0.92rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--logo);
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.logo-accent {
		color: var(--logo-dash);
	}

	.status-tag {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border-radius: 999px;
		background: var(--tag-bg);
		border: 1px solid var(--tag-border);
		color: var(--tag-text);
		font-family: var(--font-family-mono);
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		white-space: nowrap;
		display: none;
	}
	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--tag-text);
		animation: pulse 2s ease-in-out infinite;
	}

	.header-nav {
		display: none;
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: 0.125rem;
	}

	.nav-link {
		position: relative;
		padding: 0.375rem 0.875rem;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		border-radius: 8px;
		text-decoration: none;
		color: var(--nav-link);
		transition: color 0.25s var(--ease), background 0.25s var(--ease);
	}
	.nav-link:hover {
		color: var(--nav-hover);
		background: var(--divider);
	}
	.nav-link.active {
		color: var(--nav-hover);
	}
	.nav-link.active::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -1px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--nav-active-dot);
		transform: translateX(-50%);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.toggle-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3125rem 0.75rem 0.3125rem 0.5rem;
		background: var(--toggle-bg);
		border: 1px solid var(--toggle-border);
		border-radius: 999px;
		cursor: pointer;
		flex-shrink: 0;
		transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}
	.toggle-pill:hover {
		filter: brightness(1.1);
	}

	.ts {
		position: relative;
		width: 36px;
		height: 20px;
	}
	.ts input {
		display: none;
	}
	.ts-track {
		position: absolute;
		inset: 0;
		background: #444;
		border-radius: 999px;
		transition: background var(--dur) var(--ease);
	}
	.ts-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.4);
		transition: transform var(--dur) var(--ease);
	}
	.ts input:checked ~ .ts-track {
		background: var(--toggle-track);
	}
	.ts input:checked ~ .ts-thumb {
		transform: translateX(16px);
	}

	.toggle-text {
		font-family: var(--font-family-mono);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		color: var(--toggle-label);
		min-width: 30px;
	}

	.menu-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.4rem 0.48rem;
		border-radius: 0.45rem;
		border: 1px solid var(--toggle-border);
		background: var(--toggle-bg);
		color: var(--logo);
		cursor: pointer;
	}

	.ticker-strip {
		height: 28px;
		background: var(--ticker-bg);
		overflow: hidden;
		transition: background var(--dur) var(--ease);
	}
	.ticker-track {
		display: flex;
		align-items: center;
		height: 100%;
		white-space: nowrap;
		animation: ticker 22s linear infinite;
	}
	.ticker-track span {
		font-family: var(--font-family-mono);
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		color: var(--ticker-text);
		padding: 0 1.75rem;
		opacity: 0.85;
	}
	.ticker-track .sep {
		opacity: 0.3;
		padding: 0 0.25rem;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.4;
			transform: scale(0.75);
		}
	}

	@keyframes ticker {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@container (min-width: 48rem) {
		.header-row {
			padding: 0 2rem;
		}
		.header-nav {
			display: flex;
		}
		.menu-toggle {
			display: none;
		}
		.status-tag {
			display: flex;
		}
	}

	@container (max-width: 48rem) {
		.header-row {
			gap: 0.65rem;
			padding: 0 0.85rem;
		}
		.logo {
			font-size: 0.78rem;
		}
		.header-nav--open {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			position: absolute;
			top: 58px;
			left: 0.5rem;
			right: 0.5rem;
			padding: 0.5rem;
			background: var(--header-bg);
			border: 1px solid var(--divider);
			border-radius: 0.5rem;
			z-index: 20;
		}
		.nav-link {
			padding: 0.55rem 0.65rem;
		}
		.nav-link.active::after {
			display: none;
		}
		.toggle-text {
			display: none;
		}
	}
</style>
