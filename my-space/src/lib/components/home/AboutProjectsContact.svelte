<script>
	let { themeMode = 'dark' } = $props();
</script>

<div class="home-sections" class:theme-light={themeMode === 'light'}>
	<section class="section section-padding about" id="about">
		<div class="section-label">About me</div>
		<div class="about-grid">
			<div class="about-text">
				<h2>Developer by craft, <em>creative</em> by nature.</h2>
				<p>
					I am a <strong>frontend developer and designer</strong> from Amsterdam. I build interfaces
					that feel intentional, energetic, and human.
				</p>
				<p>
					When I am not writing Svelte components, I am in <strong>Blender</strong> building 3D scenes,
					experimenting with motion, and exploring AI-powered workflows.
				</p>
				<p>I believe the web is one of the strongest creative mediums we have. That is why I love it.</p>
				<div class="love-list">
					<div class="love-item"><span class="icon">🌐</span><span>Web is my favorite canvas</span></div>
					<div class="love-item"><span class="icon">🎨</span><span>Design systems and visual craft</span></div>
					<div class="love-item"><span class="icon">🧊</span><span>3D with Blender workflows</span></div>
					<div class="love-item"><span class="icon">🤖</span><span>AI tools for creative work</span></div>
				</div>
			</div>
			<div class="skills-col">
				<div class="skill-group">
					<div class="skill-group-title">Frontend</div>
					<div class="skill-tags">
						<span class="tag active">SvelteKit</span>
						<span class="tag active">HTML / CSS</span>
						<span class="tag">JavaScript</span>
						<span class="tag">GSAP</span>
						<span class="tag">Motion UI</span>
					</div>
				</div>
				<div class="skill-group">
					<div class="skill-group-title">Design</div>
					<div class="skill-tags">
						<span class="tag active">Figma</span>
						<span class="tag">Design Systems</span>
						<span class="tag">UI / UX</span>
					</div>
				</div>
				<div class="skill-group">
					<div class="skill-group-title">3D and Creative</div>
					<div class="skill-tags">
						<span class="tag active">Blender</span>
						<span class="tag">3D Printing</span>
						<span class="tag">Particle FX</span>
						<span class="tag">AI / n8n</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="projects-section section-padding" id="work">
	<div class="section-label">Selected work</div>
	<div class="projects-grid">
		<a href="/year/2025-2026" class="project-card featured">
			<div class="project-top">
				<div class="project-icon">🦶</div>
				<div class="project-arrow">→</div>
			</div>
			<div class="project-name">FootGuard</div>
			<div class="project-desc">
				A SvelteKit platform for IWGDF replacing Excel-heavy research workflows with an accessible,
				modern interface.
			</div>
			<div class="project-tags">
				<span class="ptag">SvelteKit</span>
				<span class="ptag">Figma</span>
				<span class="ptag">Agile</span>
				<span class="ptag">Healthcare UX</span>
			</div>
		</a>
		<a href="/sprits" class="project-card">
			<div class="project-top">
				<div class="project-icon">🤖</div>
				<div class="project-arrow">→</div>
			</div>
			<div class="project-name">G1 Voice Agent</div>
			<div class="project-desc">A voice AI concept with a reactive 3D face and interaction-focused motion language.</div>
			<div class="project-tags">
				<span class="ptag">Interactive UI</span>
				<span class="ptag">Blender</span>
				<span class="ptag">Voice AI</span>
			</div>
		</a>
		<a href="/city" class="project-card">
			<div class="project-top">
				<div class="project-icon">🧊</div>
				<div class="project-arrow">→</div>
			</div>
			<div class="project-name">3D Print Lab</div>
			<div class="project-desc">
				Character workflows in Blender with interlocking pieces, clean booleans, and reliable print prep.
			</div>
			<div class="project-tags">
				<span class="ptag">Blender</span>
				<span class="ptag">Python</span>
				<span class="ptag">3D Printing</span>
			</div>
		</a>
	</div>
	</section>

	<section class="contact-section section-padding" id="contact">
	<h2 class="contact-title">
		<span class="contact-line">Let's build something</span>
		<span class="outline contact-line">beautiful together.</span>
	</h2>
	<p class="contact-lead">Open for freelance, collabs, and interesting projects.</p>
	<div class="social-links">
		<a href="mailto:yamen@example.com" class="social-btn">Email me</a>
		<a href="/year/2025-2026" class="social-btn">Portfolio</a>
		<a href="/sprits" class="social-btn">Experiments</a>
	</div>
	</section>

	<footer class="site-footer section-padding">
		<p>© {new Date().getFullYear()} Yamen - Made with ♥ for the web</p>
		<p>Amsterdam, NL</p>
	</footer>
</div>

<style>
	.section {
		position: relative;
		z-index: 2;
		padding-top: 90px;
		padding-bottom: 90px;
	}
	.section-label {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #7b839b;
		margin-bottom: 44px;
	}
	.section-label::after {
		content: '';
		flex: 1;
		height: 1px;
		background: rgb(255 255 255 / 0.12);
	}
	.about-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 72px;
	}
	.about-text h2 {
		margin: 0 0 18px;
		font-family: 'Unbounded', var(--font-family-primary);
		font-size: clamp(26px, 3vw, 38px);
		line-height: 1.22;
		letter-spacing: -0.02em;
	}
	.about-text h2 em {
		color: #ff4d6d;
		font-style: normal;
	}
	.about-text p {
		margin: 0 0 16px;
		color: #b7bed0;
		font-size: 15px;
		line-height: 1.82;
	}
	.about-text strong {
		color: #eef1f7;
		font-weight: 500;
	}
	.love-list {
		margin-top: 28px;
		display: grid;
		gap: 12px;
	}
	.love-item {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #c3cada;
		font-size: 14px;
	}
	.icon {
		width: 36px;
		height: 36px;
		display: grid;
		place-items: center;
		background: rgb(255 255 255 / 0.06);
		border: 1px solid rgb(255 255 255 / 0.12);
		border-radius: 9px;
	}
	.skill-group {
		margin-bottom: 28px;
	}
	.skill-group-title {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #7b839b;
		margin-bottom: 12px;
	}
	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tag {
		padding: 5px 12px;
		border-radius: 999px;
		border: 1px solid rgb(255 255 255 / 0.14);
		background: rgb(255 255 255 / 0.05);
		color: #c5cce0;
		font-size: 12px;
	}
	.tag.active {
		color: #4df0c8;
		border-color: rgb(77 240 200 / 0.36);
		background: rgb(77 240 200 / 0.08);
	}

	.projects-section {
		position: relative;
		z-index: 2;
		padding-top: 76px;
		padding-bottom: 98px;
		border-top: 1px solid rgb(255 255 255 / 0.09);
	}
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}
	.project-card {
		display: block;
		background: rgb(255 255 255 / 0.04);
		border: 1px solid rgb(255 255 255 / 0.1);
		border-radius: 16px;
		padding: 26px;
		text-decoration: none;
		transition: transform 0.3s ease, border-color 0.3s ease;
	}
	.project-card:hover {
		transform: translateY(-4px);
		border-color: rgb(255 255 255 / 0.2);
	}
	.project-card.featured {
		grid-column: 1 / -1;
	}
	.project-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}
	.project-icon {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		display: grid;
		place-items: center;
		background: rgb(255 255 255 / 0.08);
	}
	.project-arrow {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: rgb(255 255 255 / 0.1);
		color: #f7f9ff;
	}
	.project-name {
		font-family: 'Unbounded', var(--font-family-primary);
		font-size: 17px;
		font-weight: 600;
		margin-bottom: 8px;
		color: #f0f2f8;
	}
	.project-desc {
		font-size: 14px;
		line-height: 1.65;
		color: #bbc2d5;
		margin-bottom: 16px;
	}
	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.ptag {
		font-size: 11px;
		padding: 3px 10px;
		border-radius: 999px;
		border: 1px solid rgb(255 255 255 / 0.14);
		color: #a9b1c7;
	}

	.contact-section {
		position: relative;
		z-index: 2;
		border-top: 1px solid rgb(255 255 255 / 0.09);
		padding-top: 92px;
		padding-bottom: 84px;
		text-align: center;
	}
	.contact-title {
		display: inline-flex;
		flex-direction: column;
		margin: 0 0 18px;
		font-family: 'Unbounded', var(--font-family-primary);
		font-size: clamp(32px, 5.4vw, 64px);
		font-weight: 900;
		line-height: 1.03;
		letter-spacing: -0.04em;
		text-transform: none;
		text-wrap: balance;
		text-shadow: 0 10px 34px rgb(0 0 0 / 0.22);
	}
	.contact-line {
		display: block;
	}
	.contact-title .outline {
		color: transparent;
		-webkit-text-stroke: 1.6px #f0f2f8;
	}
	.contact-lead {
		margin: 0 0 36px;
		font-size: 16px;
		color: #bcc4d8;
	}
	.social-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
	.social-btn {
		min-height: 42px;
		padding: 10px 20px;
		border-radius: 999px;
		border: 1px solid rgb(255 255 255 / 0.16);
		color: #d3d9e8;
		font-size: 13px;
	}

	.site-footer {
		position: relative;
		z-index: 2;
		border-top: 1px solid rgb(255 255 255 / 0.09);
		padding-top: 22px;
		padding-bottom: 24px;
		display: flex;
		justify-content: space-between;
		gap: 10px;
		color: #8890a6;
		font-size: 12px;
	}
	.site-footer p {
		margin: 0;
	}

	.theme-light .outline {
		-webkit-text-stroke-color: #121826;
	}
	.theme-light .contact-title {
		text-shadow: 0 8px 26px rgb(255 255 255 / 0.38);
	}
	.theme-light .project-desc,
	.theme-light .about-text p,
	.theme-light .contact-lead,
	.theme-light .social-btn {
		color: #2f3b56;
	}
	.theme-light .tag,
	.theme-light .project-card,
	.theme-light .social-btn,
	.theme-light .icon,
	.theme-light .ptag {
		border-color: rgb(20 30 50 / 0.18);
	}

	@container (max-width: 48rem) {
		.about-grid,
		.projects-grid {
			grid-template-columns: 1fr;
		}
		.project-card.featured {
			grid-column: 1;
		}
		.site-footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
