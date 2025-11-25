<script>
	import Treemap from '$lib/components/Treemap.svelte';
</script>

<main>
	<div class="header-row">
		<button class="back-button" on:click={() => history.back()} aria-label="Terug"> ← </button>
		<h1>🧬 Het DNA van je sessie. 🧬</h1>
	</div>
	<Treemap />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	.header-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	h1 {
		margin: 0;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;

		background-color: #1db954;
		color: #000;
		border: none;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 600;

		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition:
			background-color 0.15s ease,
			transform 0.05s ease,
			box-shadow 0.15s ease,
			filter 0.15s ease;
	}

	.back-button:hover {
		filter: brightness(0.9);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
	}

	.back-button:active {
		transform: translateY(1px);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}
</style>
