<script>
	import Link from '$lib/components/atoms/Link.svelte';

	let { year = new Date().getFullYear() } = $props();

	const socialLinks = [
		{ label: 'GitHub', href: 'https://github.com' },
		{ label: 'Twitter', href: 'https://twitter.com' },
		{ label: 'LinkedIn', href: 'https://linkedin.com' }
	];

	const footerLinks = [
		{ label: 'About', href: '/about' },
		{ label: 'Privacy', href: '/privacy' },
		{ label: 'Terms', href: '/terms' },
		{ label: 'Contact', href: '/contact' }
	];
</script>

<footer class="footer">
	<div class="footer__container">
		<div class="footer__content">
			<div class="footer__section">
				<h3 class="footer__title">My Space</h3>
				<p class="footer__description">
					Building amazing web experiences with modern technologies.
				</p>
			</div>

			<div class="footer__section">
				<h4 class="footer__subtitle">Quick Links</h4>
				<nav class="footer__links">
					{#each footerLinks as link}
						<Link href={link.href} underline={false}>
							{link.label}
						</Link>
					{/each}
				</nav>
			</div>

			<div class="footer__section">
				<h4 class="footer__subtitle">Connect</h4>
				<nav class="footer__links">
					{#each socialLinks as link}
						<Link href={link.href} external underline={false}>
							{link.label}
						</Link>
					{/each}
				</nav>
			</div>
		</div>

		<div class="footer__bottom">
			<p class="footer__copyright">© {year} My Space. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: #111827;
		color: #d1d5db;
		padding: 3rem 1.5rem 1.5rem;
		margin-top: auto;
	}

	.footer__container {
		max-width: 1280px;
		margin: 0 auto;
	}

	.footer__content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.footer__title {
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		margin: 0 0 0.5rem 0;
	}

	.footer__subtitle {
		font-size: 1rem;
		font-weight: 600;
		color: white;
		margin: 0 0 1rem 0;
	}

	.footer__description {
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	.footer__links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.footer__bottom {
		padding-top: 2rem;
		border-top: 1px solid #374151;
		text-align: center;
	}

	.footer__copyright {
		font-size: 0.875rem;
		margin: 0;
	}
</style>
