<script>
	let { data } = $props();
</script>

<div class="portfolio-page">
	<header class="portfolio-header">
		<a href="/" class="back-link">← Back to Home</a>
		<h1>Portfolio {data.year}</h1>
		<p class="subtitle">My work and projects</p>
	</header>

	<main class="portfolio-content">
		<section class="projects-section">
			<h2>Projects</h2>
			<p>Coming soon! This is where your portfolio projects will be displayed.</p>
			
			<div class="project-grid">
				<div class="project-card">
					<h3>Project 1</h3>
					<p>Description of your project goes here.</p>
				</div>
				
				<div class="project-card">
					<h3>Project 2</h3>
					<p>Description of your project goes here.</p>
				</div>
				
				<div class="project-card">
					<h3>Project 3</h3>
					<p>Description of your project goes here.</p>
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	.portfolio-page {
		min-height: 100vh;
		background: #070b1a;
		color: #e7ecff;
		padding: 2rem;
	}

	.portfolio-header {
		max-width: 1200px;
		margin: 0 auto 4rem;
		text-align: center;
	}

	.back-link {
		display: inline-block;
		color: #86a0ff;
		text-decoration: none;
		margin-bottom: 2rem;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: #4bd6c8;
	}

	.portfolio-header h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 800;
		margin-bottom: 1rem;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #b8c1ff;
		opacity: 0.9;
	}

	.portfolio-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.projects-section h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
		color: #86a0ff;
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.project-card {
		background: hsl(0 0% 100% / 0.06);
		border: 1px solid hsl(0 0% 100% / 0.12);
		border-radius: 12px;
		padding: 2rem;
		backdrop-filter: blur(10px);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.project-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px hsl(0 0% 0% / 0.4);
	}

	.project-card h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #e7ecff;
	}

	.project-card p {
		color: #b8c1ff;
		line-height: 1.6;
	}
</style>
