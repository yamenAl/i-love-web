<script>
	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		required = false,
		name = '',
		id = '',
		error = ''
	} = $props();
</script>

<div class="input-wrapper">
	<input
		class="input"
		class:input--error={error}
		{type}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{name}
		{id}
	/>
	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
	}

	.input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.input:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	.input--error {
		border-color: #ef4444;
	}

	.input--error:focus {
		border-color: #ef4444;
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	.error-message {
		font-size: 0.875rem;
		color: #ef4444;
	}
</style>
