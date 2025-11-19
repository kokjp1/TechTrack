<script>
	import Treemap from '$lib/components/Treemap.svelte';
</script>

<main>
	<h1>🧬 Het DNA van je sessie. 🧬</h1>
	<button class="back-button" on:click={() => history.back()} aria-label="Terug">← Terug</button>

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
	.back-button {
		position: absolute;
		top: 8px;
		left: 8px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		border: none;
		padding: 6px 10px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 13px;
		backdrop-filter: blur(4px);
	}
	.back-button:hover {
		opacity: 0.9;
	}
</style>
