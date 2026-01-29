<script>
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import NavItem from '$lib/components/molecules/NavItem.svelte';

	let { siteName = 'My Space' } = $props();

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Home', href: '/', icon: 'home' },
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
			{#each navItems as item}
				<NavItem href={item.href} icon={item.icon}>
					{item.label}
				</NavItem>
			{/each}
		</nav>

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
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
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
		color: #111827;
		text-decoration: none;
	}

	.header__nav {
		display: none;
		gap: 0.5rem;
	}

	.header__menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: #374151;
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
			background-color: white;
			border-bottom: 1px solid #e5e7eb;
			padding: 1rem;
		}
	}
</style>
