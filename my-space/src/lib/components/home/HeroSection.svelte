<script>
	let { heroName = 'Yamen Al Sharabi', themeMode = 'dark' } = $props();
</script>

<section class="hero section-padding" class:theme-light={themeMode === 'light'}>
	<div class="hero-inner">
		<p class="hero-tag">Available for projects</p>
		<h1 class="hero-headline" aria-label={heroName}>
			<span class="line"><span class="line-inner">I build things</span></span>
			<span class="line"><span class="line-inner outline">for the web.</span></span>
			<span class="line"><span class="line-inner red">I love it.</span></span>
		</h1>
		<p class="hero-sub">
			Hey, I am <em>{heroName}</em> - a creative frontend developer from Amsterdam. I blend
			<em>code, design, and 3D</em> into experiences that feel alive.
		</p>
		<div class="hero-actions">
			<a href="#work" class="btn-primary">See my work</a>
			<a href="#about" class="btn-secondary">About me</a>
		</div>
	</div>

	<div class="hero-badge" aria-hidden="true">
		<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="46" stroke="rgba(255,77,109,0.28)" stroke-width="1"></circle>
			<path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"></path>
			<text font-family="DM Mono, monospace" font-size="9.5" font-weight="500" fill="rgba(255,255,255,0.5)" letter-spacing="2.5">
				<textPath href="#circlePath">CREATIVE DEV - WEB LOVER - </textPath>
			</text>
			<circle cx="50" cy="50" r="8" fill="var(--accent1)" opacity="0.9"></circle>
			<ellipse class="badge-mouth" cx="50" cy="54" rx="3.5" ry="1.6" fill="white"></ellipse>
		</svg>
	</div>

	<div class="scroll-indicator">
		<div class="scroll-line"></div>
		scroll
	</div>
</section>

<style>
	@keyframes slideUp {
		from { transform: translateY(110%); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}
	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	@keyframes scanline {
		0% { transform: translateX(-100%); }
		50% { transform: translateX(0); }
		100% { transform: translateX(100%); }
	}
	@keyframes mouthPulse {
		0%, 100% { transform: scaleX(1) scaleY(1); }
		50% { transform: scaleX(0.7) scaleY(1.35); }
	}

	.hero {
		position: relative;
		min-height: calc(100vh - 86px);
		display: flex;
		align-items: center;
		padding-top: 120px;
		padding-bottom: 80px;
	}
	.hero-inner {
		max-width: 920px;
		position: relative;
		z-index: 2;
	}
	.hero-tag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #ff4d6d;
		margin-bottom: 28px;
		animation: fadeUp 0.6s ease both;
	}
	.hero-tag::before {
		content: '';
		width: 24px;
		height: 1px;
		background: #ff4d6d;
	}
	.hero-headline {
		margin: 0;
		font-family: 'Unbounded', var(--font-family-primary);
		font-size: clamp(38px, 7vw, 84px);
		font-weight: 900;
		line-height: 1.03;
		letter-spacing: -0.03em;
	}
	.line {
		display: block;
		overflow: hidden;
	}
	.line-inner {
		display: block;
		animation: slideUp 0.74s cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	.line:nth-child(2) .line-inner {
		animation-delay: 0.08s;
	}
	.line:nth-child(3) .line-inner {
		animation-delay: 0.16s;
	}
	.outline {
		color: transparent;
		-webkit-text-stroke: 1.5px #f0f2f8;
	}
	.red {
		color: #ff4d6d;
	}
	.hero-sub {
		max-width: 540px;
		margin: 26px 0 42px;
		font-size: 17px;
		line-height: 1.72;
		color: #a2a9bd;
		animation: fadeUp 0.6s ease 0.35s both;
	}
	.hero-sub em {
		color: #f0f2f8;
		font-style: normal;
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		animation: fadeUp 0.6s ease 0.45s both;
	}
	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 12px 24px;
		border-radius: 999px;
		text-decoration: none;
		font-size: 14px;
	}
	.btn-primary {
		background: #ff4d6d;
		color: #fff;
		box-shadow: 0 0 36px rgb(255 77 109 / 0.25);
	}
	.btn-secondary {
		color: #ced3e1;
		border: 1px solid rgb(255 255 255 / 0.16);
	}
	.hero-badge {
		position: absolute;
		right: 4vw;
		bottom: 62px;
		width: 112px;
		height: 112px;
		animation: spin 15s linear infinite, fadeUp 0.8s ease 0.6s both;
	}
	.hero-badge svg {
		width: 100%;
		height: 100%;
	}
	.badge-mouth {
		transform-origin: center;
		animation: mouthPulse 1.3s ease-in-out infinite;
	}
	.scroll-indicator {
		position: absolute;
		left: 4vw;
		bottom: 42px;
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #697087;
		animation: fadeUp 0.6s ease 0.7s both;
	}
	.scroll-line {
		width: 42px;
		height: 1px;
		background: #697087;
		position: relative;
		overflow: hidden;
	}
	.scroll-line::after {
		content: '';
		position: absolute;
		inset: 0;
		background: #ff4d6d;
		animation: scanline 2s ease infinite;
	}

	.theme-light .outline {
		-webkit-text-stroke-color: #121826;
	}
	.theme-light .hero-sub {
		color: #2f3b56;
	}

	@container (max-width: 48rem) {
		.hero {
			padding-top: 100px;
			padding-bottom: 76px;
		}
		.hero-badge {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hero-badge,
		.scroll-indicator {
			display: none;
		}
		.line-inner,
		.badge-mouth,
		.scroll-line::after {
			animation: none;
		}
	}
</style>
