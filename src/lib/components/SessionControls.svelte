<script>
	import { sessionStore, startSession, stopSession } from '$lib/stores/sessionStore.js';
</script>

<div class="session-controls">
	<button class="start" on:click={startSession}>
		{#if $sessionStore.recording === true}Restart
		{:else}Record
		{/if}
	</button>
	{#if $sessionStore.recording === true}
		<button class="stop" on:click={stopSession}>Stop</button>
	{/if}
	{#if $sessionStore.recording === true}
		<div class="recording-status">
			<span></span>
			<p>Recording</p>
		</div>
	{/if}
</div>

<style>
	/* Special shoutout David hij heeft de animatie voor me gemaakt */
	/* https://codepen.io/Dave-deo/pen/GgZvZZX */
	.recording-status {
		display: flex;
		align-items: center;
		margin-left: 0.25em;
		gap: 0.75em;
	}

	span {
		position: relative;
		display: block;
		height: 12px;
		aspect-ratio: 1;
		background: red;
		border-radius: 50%;
	}

	span::before {
		position: absolute;
		content: '';
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: solid 3px rgb(255, 0, 0);
		animation: pulse ease 1s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
			scale: 0;
		}
		100% {
			opacity: 0;
			scale: 1.5;
		}
	}

	.session-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	button {
		background: #2a2a2a;
		color: #fff;
		border: 1px solid #444;
		border-radius: 6px;
		padding: 0.4rem 0.7rem;
		cursor: pointer;
		transition: filter 150ms ease-in-out;
	}
	button:hover {
		filter: brightness(1.25);
	}

	.stop {
		font-weight: 800;
		background-color: #640303;
		color: #bd1919;
		border-color: #380000;
	}
</style>
