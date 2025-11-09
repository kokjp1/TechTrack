<!-------------------------------->
<!-- TRACK INFORMATION + PLAYER -->
<!-------------------------------->

<script>
	import { currentSong } from '$lib/stores/currentSongDataStore.js';

  /* -------------------------
  TIME FORMATTING FUNCTION
  ------------------------- */

	// omreken formule voor duratie in ms naar mm:ss
	function formatDuration(duration) {
		const minutes = Math.floor(duration / 60000);
		const seconds = Math.floor((duration % 60000) / 1000);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

</script>

<div>
	{#if $currentSong}
		<!-- title -->
		{#if $currentSong.title}
			<h1 class="now-playing">{$currentSong.title}</h1>
		{/if}
		<section>
			<!-- artiest(en) -->
			{#if $currentSong.artists}
				<p class="artists">{$currentSong.artists}</p>
			{/if}
			<!-- album -->
			{#if $currentSong.album}
				<p class="album">&nbsp; • &nbsp;{$currentSong.album}</p>
			{/if}
		</section>
		<section>
			<p>GENERAL TRACK INFORMATION</p>
      <!-- duration -->
			{#if $currentSong.duration}
				<p class="duration">⏳ Duration: {formatDuration($currentSong.duration)}</p>
			{/if}
			<!-- popularity -->
			{#if $currentSong.popularity}
				<p class="popularity">🔥 Popularity: {$currentSong.popularity}</p>
			{/if}
		</section>
	{/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    max-width:400px;
  }

  section {
    display: flex;
    flex-direction: row;
  }

  h1 {
    font-weight: 700;
    font-size: 5em;
    margin: 0;
  }

  section:nth-of-type(1) {
    p {
      color: lightgray;
      font-size: 1.1em;
      font-weight: 600;
    }
  }

  /* CHANGED: use flex so duration & popularity stay together without extra spacing */
  section:nth-of-type(2) {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;           /* allow label on its own line */
    gap: 0.75rem;
  }

  section:nth-of-type(2) p:first-child {
    flex-basis: 100%; 
    font-size: 0.85em;
    color: #ced2d6;
    letter-spacing: 0.085em;
    margin: 0;
  }

  section:nth-of-type(2) p {
    font-weight: 600;
    font-size: .85em;
    margin: 0;
    white-space: nowrap; 
  }

  @media (max-width: 1392px) {
    div {
      align-items: center;
    }
    h1 { 
      font-size: 3em; 
      text-align: center;
    }
    section:nth-of-type(2) {
      flex-direction: column;
      align-items: center;
      gap: 1em;
    }
    section:nth-of-type(2) p:first-child {
      flex-basis: auto;
    }
  }

  @media (max-width: 595px) {
    h1 { 
      font-size: 2em;
      text-align: center;
    } 
  }
</style>
