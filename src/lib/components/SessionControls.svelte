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
		<span class="status">
			<span class="status-label">
				<span class="ring-container"
					><span class="ringring"></span><span class="circle"></span></span
				>
				Recording...
			</span>
		</span>
		<!-- https://codepen.io/vram1980/pen/oNvWdO -->
	{/if}
</div>

<style>

	.ring-container {
		position: relative;
		width: 25px;
		height: 25px;
	}

	.circle {
		width: 15px;
		height: 15px;
		background-color: #bd1919;
		border-radius: 50%;
		position: absolute;
		top: 5px;
		left: 5px;
	}

	.ringring {
		border: 3px solid #bd1919;
		border-radius: 30px;
		height: 25px;
		width: 25px;
		position: absolute;
		left: -2.5px;
		top: -2px;
		animation: pulsate 1s ease-out infinite;
		-webkit-animation: pulsate 1s ease-out infinite;
		opacity: 0;
	}
	@keyframes pulsate {
		0% {
			transform: scale(0.1, 0.1);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: scale(1.2, 1.2);
			opacity: 0;
		}
	}

	@-webkit-keyframes pulsate {
		0% {
			-webkit-transform: scale(0.1, 0.1);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			-webkit-transform: scale(1.2, 1.2);
			opacity: 0;
		}
	}

	.session-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap; 
	}

	.status {
		opacity: 0.8;
	}

	.status-label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem; /* ruimte tussen dot en tekst */
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
