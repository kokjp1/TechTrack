<!-------------------------------->
<!-- TRACK INFORMATION + PLAYER -->
<!-------------------------------->

<script>
	import { currentSong } from '$lib/stores/currentSongDataStore.js';
	import SessionControls from '$lib/components/SessionControls.svelte';
	import SessionList from '$lib/components/SessionList.svelte';
	import { formatDuration } from '$lib/utils/formatDuration.js';

</script>

<!----------------------------->
<!-- BODY -->
<!-- --------------------------->

<div>
	{#if $currentSong}
		<!-- title -->
		{#if $currentSong.title}
			<h1 class="now-playing">{$currentSong.title}</h1>
		{/if}

		{#if $currentSong.artists || $currentSong.album}
			<div class="sub">
				{#if $currentSong.artists}{$currentSong.artists}{/if}
				{#if $currentSong.artists && $currentSong.album}
					•
				{/if}
				{#if $currentSong.album}{$currentSong.album}{/if}
			</div>
		{/if}
		<section class="player-controls">
			<button>previous</button>
			<button>play/pause</button>
			<button>next</button>
		</section>
		<section class="info-section">
			<p class="info-heading">GENERAL TRACK INFORMATION</p>

			<div class="info-row">
				{#if $currentSong.popularity}
					<p
						class="popularity"
						data-tip="Popularity is based on total streams and how recent they are. Tracks played more recently rank higher. Higher number = More popular."
					>
						🔥 Popularity: {$currentSong.popularity}
					</p>
				{/if}

				{#if $currentSong.artistPopularity}
					<p
						class="popularity"
						data-tip="Artist Popularity is based on the popularity of all the artist's tracks. Higher number = More popular."
					>
						🎤 Artist Popularity: {$currentSong.artistPopularity}
					</p>
				{/if}
			</div>

			<div class="info-row">
				{#if $currentSong.duration}
					<p>⏳ Duration: {formatDuration($currentSong.duration)}</p>
				{/if}
				{#if $currentSong.status === true}
					<p>▶️ Currently Playing</p>
				{:else if $currentSong.status === false}
					<p>⏸️ Song Paused</p>
				{/if}
			</div>

			<SessionControls />
			<SessionList />
		</section>
	{/if}
	<details>
		<summary><span></span> Session System Tutorial</summary>
		<p>
			Use the "Record" button to start a listening session. While recording, all songs you play will
			be logged in your session history. Click "Stop" to end the session. You can view your
			listening history by opening the sidebar.
		</p>
	</details>
</div>

<!----------------------------->
<!-- CSS -->
<!-- --------------------------->

<style>
	:root {
		interpolate-size: allow-keywords;
	}
	details {
		overflow: hidden;
		background-color: rgba(42, 42, 42, 0.5);
		padding: 0.5em;
		border-radius: 6px;
		margin-top: 1em;
		border: 1px solid #444;
	}

	details * {
		margin: 0;
		padding: 0.5em;
	}

	details > p {
		padding-block: 1rem;
	}

	details summary {
		list-style-type: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	details summary span {
		position: relative;
		width: 0.025em;
		height: 0.025em;
		display: inline-block;
	}

	details summary span::before,
	details summary span::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 2px;
		background: #1db954;
		transform-origin: center;
		transition: transform 150ms ease;
	}

	details summary span::before {
		transform: translate(-50%, -50%);
	}

	details summary span::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}

	details[open] summary span::after {
		transform: translate(-50%, -50%) rotate(0deg);
		background: red;
	}

	details::details-content {
		block-size: 0;
		transition:
			block-size 1s,
			content-visibility 1s allow-discrete;
	}

	details[open]::details-content {
		block-size: auto;
	}

	.player-controls {
		display: none;
	}

	div {
		display: flex;
		flex-direction: column;
		max-width: 600px;
	}

	h1 {
		font-weight: 700;
		font-size: 4em;
		margin: 0;
	}

	.sub {
		color: #9aa5b1;
		margin-top: 16px;
		margin-bottom: 16px;
		font-size: 18px;
	}

	.info-section {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1em;
	}

	.info-heading {
		flex-basis: 100%;
		font-size: 0.85em;
		color: #ced2d6;
		letter-spacing: 0.085em;
		margin: 0;
	}

	.info-section p {
		font-weight: 600;
		font-size: 0.85em;
		margin: 0;
		white-space: nowrap;
	}

	.info-row {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
	}

	.info-row:nth-of-type(2) {
		margin-bottom: 1em;
	}

	.popularity {
		position: relative;
		cursor: help;
		display: inline-block;
	}

	.popularity[data-tip]::after {
		content: attr(data-tip);
		position: absolute;
		left: 100%;
		top: 100%;
		background: #111;
		color: #fff;
		padding: 8px 12px;
		font-size: 1em;
		border-radius: 4px;
		white-space: normal;
		max-width: 500px;
		width: max-content;
		opacity: 0;
		transform: translate(-50%, -4px);
		transition: 0.15s;
		z-index: 2;
		margin-top: 0.5em;
		pointer-events: none;
	}

	.popularity[data-tip]:hover::after {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.session-container {
		margin-top: 2em;
		display: flex;
		flex-direction: row;
		gap: 1em;
	}

	@media (max-width: 1392px) {
		div {
			max-width: 337px;
		}
		h1 {
			font-size: 3em;
			text-align: center;
		}
		.sub {
			text-align: center;
		}

		.info-section {
			flex-direction: column;
			align-items: stretch;
			gap: 1em;
			margin-top: 1em;
		}

		.info-heading {
			flex-basis: auto;
			text-align: center;
		}

		.info-row {
			justify-content: space-between;
			flex-wrap: nowrap;
		}

		details {
			max-width: 100%;
		}
	}

	@media (max-width: 595px) {
		div {
			max-width: 283px;
		}
		h1 {
			font-size: 2em;
			text-align: center;
		}
		.sub {
			font-size: 1em;
			text-align: center;
		}

		.info-section {
			width: 100%;
		}

		.info-row {
			justify-content: space-between;
			gap: 0.5rem;
		}

		.info-section p {
			white-space: normal;
			text-align: center;
		}
		details {
			max-width: 100%;
		}
	}
</style>
