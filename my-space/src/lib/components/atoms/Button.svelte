<script>
	/**
	 * @typedef {'primary' | 'secondary' | 'outline' | 'ghost'} ButtonVariant
	 * @typedef {'small' | 'medium' | 'large'} ButtonSize
	 */

	let {
		variant = 'primary',
		size = 'medium',
		disabled = false,
		type = 'button',
		onclick,
		children
	} = $props();
</script>

<button
	class="btn btn--{variant} btn--{size}"
	{type}
	{disabled}
	onclick={onclick}
>
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn--small {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
	}

	.btn--medium {
		padding: 0.5rem 1rem;
		font-size: 1rem;
	}

	.btn--large {
		padding: 0.75rem 1.5rem;
		font-size: 1.125rem;
	}

	/* Variants */
	.btn--primary {
		background-color: #3b82f6;
		color: white;
	}

	.btn--primary:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.btn--secondary {
		background-color: #6b7280;
		color: white;
	}

	.btn--secondary:hover:not(:disabled) {
		background-color: #4b5563;
	}

	.btn--outline {
		background-color: transparent;
		color: #3b82f6;
		border: 2px solid #3b82f6;
	}

	.btn--outline:hover:not(:disabled) {
		background-color: #3b82f6;
		color: white;
	}

	.btn--ghost {
		background-color: transparent;
		color: #374151;
	}

	.btn--ghost:hover:not(:disabled) {
		background-color: #f3f4f6;
	}
</style>
