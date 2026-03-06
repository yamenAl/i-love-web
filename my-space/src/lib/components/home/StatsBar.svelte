<script>
	let { stats = [], animatedStats = [] } = $props();
</script>

<div class="stats-bar section-padding">
	{#each stats as stat, index}
		<div class="stat-item">
			<div class="stat-number">{animatedStats[index]}<span>{stat.suffix}</span></div>
			<div class="stat-label">{stat.label}</div>
		</div>
	{/each}
	<div class="stat-item">
		<div class="stat-number">∞</div>
		<div class="stat-label">Love for the web</div>
	</div>
</div>

<style>
	.stats-bar {
		position: relative;
		z-index: 2;
		border-top: 1px solid rgb(255 255 255 / 0.09);
		border-bottom: 1px solid rgb(255 255 255 / 0.09);
		padding-top: 34px;
		padding-bottom: 34px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}

	.stats-bar .stat-item {
		padding: 0 16px;
		border-right: 1px solid rgb(255 255 255 / 0.08);
		text-align: center;
	}

	.stats-bar .stat-item:last-child {
		border-right: none;
	}

	.stat-number {
		font-family: 'Unbounded', var(--font-family-primary);
		font-size: 32px;
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 8px;
		color: #f0f2f8;
	}

	.stat-number span {
		color: #ff4d6d;
	}

	.stat-label {
		font-size: 12px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #8e96ad;
	}

	@container (max-width: 48rem) {
		.stats-bar {
			grid-template-columns: repeat(2, 1fr);
			gap: 22px 0;
		}

		.stats-bar .stat-item {
			border-right: none;
			padding: 0 10px 16px;
			border-bottom: 1px solid rgb(255 255 255 / 0.1);
		}

		.stats-bar .stat-item:nth-child(odd) {
			border-right: 1px solid rgb(255 255 255 / 0.1);
		}

		.stats-bar .stat-item:nth-last-child(-n + 2) {
			border-bottom: none;
		}
	}
</style>
