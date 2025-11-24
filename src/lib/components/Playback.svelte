<script>
	import { currentSong } from '$lib/stores/currentSongDataStore.js';
	import { play, pause, next, previous, seek } from '$lib/api/api.js';
	import { formatDuration } from '$lib/utils/formatDuration.js';

	function togglePlayPause() {
		if ($currentSong?.status) pause();
		else play();
	}

	function handleSeek(e) {
		const position = e.currentTarget.value;
		seek(position);
	}

	$: progressPercent = $currentSong?.duration ? ($currentSong.progress / $currentSong.duration) * 100 : 0;
	// if currentsong exists AND has a duration -> calculation -> else 0
</script>

{#if $currentSong}
	<div class="playback-container">
		<input
			type="range"
			class="progress-slider"
			min="0"
			max={$currentSong.duration}
			value={$currentSong.progress || 0}
			on:change={handleSeek}
			style="
                --progress-color: {$currentSong.vibrantAlbumColor || '#1db954'};
                
                background: linear-gradient(to right, var(--progress-color) {progressPercent}%, 
                rgba(255, 255, 255, 0.1) {progressPercent}%);"
		/>
		<!-- Het is een harde gradient zonder nette overgang. Kleur (played progress) -> Grijs (rest duration) de hoeveelheid % van de gradient die de eerste helft (kleur) moet zijn is o.b.v. progressPercent -->

		<div class="time-info">
			<span>{formatDuration($currentSong.progress || 0)}</span>
			<span>{formatDuration($currentSong.duration || 0)}</span>
		</div>

		<!-- Controls -->
		<div class="controls">
			<button class="controlbutton" on:click={previous} aria-label="Previous">⏮</button>

			<button
				class="controlbutton play-pause"
				on:click={togglePlayPause}
                style="--glow-color: {$currentSong.vibrantAlbumColor || '#1db954'}"
			>
				{#if $currentSong.status}
					<span class="pause-icon">⏸︎</span>
				{:else}
					<span class="play-icon">▶</span>
				{/if}
			</button>

			<button class="controlbutton" on:click={next} aria-label="Next">⏭</button>
		</div>
	</div>
{/if}

<style>
	.playback-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-slider {
		width: 100%;
		height: 6px;
		appearance: none;
		-webkit-appearance: none;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 999px;
		cursor: pointer;
		outline: none;
	}

	.progress-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0;
		height: 0;
		background: transparent;
		border: none;
		box-shadow: none;
	}
	.progress-slider::-moz-range-thumb {
		width: 0;
		height: 0;
		background: transparent;
	}

	.time-info {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #9aa5b1;
		font-variant-numeric: tabular-nums;
	}

	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		margin: -1rem 0 1rem 0;
	}

	.controlbutton {
		background: #2a2a2a;
		color: #fff;
		border: 1px solid #444;
		border-radius: 6px;
		padding: 0;
		cursor: pointer;
		transition:
			filter 150ms ease-in-out,
			transform 0.1s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 42px;
		font-size: 1.2rem;
	}

	.controlbutton:hover {
		filter: brightness(1.25);
	}
	.controlbutton:active {
		transform: scale(0.96);
	}

	.play-pause {
		width: 50px;
		height: 50px;
		font-size: 2rem;
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.play-pause:hover {
		background: var(--glow-color);
		color: #000;
		box-shadow: 0 6px 16px rgba(0, 0, 0);
	}

	.pause-icon {
		display: inline-block;
		transform: translateY(-3px);
		line-height: 1;
	}
	.play-icon {
		display: inline-block;
		transform: translateX(2px);
		line-height: 1; 
    }
    .play-icon { 
        display: inline-block; 
        transform: translateX(2px); 
        line-height: 1; 
    }
    .play-icon { 
        display: inline-block; 
        transform: translateX(2px); 
        line-height: 1; 
    }
</style>