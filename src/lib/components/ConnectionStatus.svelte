<script>
	// connectionstatus exporteren om de homepage te laten weten of de spotify verbinding actief is
	export let isConnected = false;

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { clearAuth, startLogin } from '$lib/spotifyAuth';

	function handleLogoutClick() {
		clearAuth();
	}
</script>

<div class="connection-container">
	<button class="connection-status">
		<span class:connected={isConnected} class:notconnected={!isConnected}></span>
		{#if isConnected}
			Spotify is connected
		{:else}
			Session verlopen, log opnieuw in
		{/if}
	</button>

	<button
		class="logout-button"
		type="button"
		on:click={handleLogoutClick}
		title="Uitloggen"
		aria-label="Uitloggen"
	>
		⏻
	</button>
</div>

<style>
	.connection-container {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
	}

	.connection-status {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		padding: 0.35rem 0.8rem;
		font-size: 0.8rem;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			filter 0.15s ease;
	}

	.connection-status:hover {
		filter: brightness(1.1);
	}

	.connection-status span {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		box-shadow: 0 0 6px currentColor;
	}

	.connection-status .connected {
		background: #1db954;
		color: #1db954;
	}

	.connection-status .notconnected {
		background: #ff5252;
		color: #ff5252;
	}

	.logout-button {
		width: 24px;
		height: 24px;
		border-radius: 999px;
		border: none;
		background: #ff5252;
		color: #fff;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			transform 0.05s ease,
			box-shadow 0.15s ease;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
	}

	.logout-button:hover {
		background: #ff3b3b;
	}

	.logout-button:active {
		transform: translateY(1px);
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.7);
	}
</style>
