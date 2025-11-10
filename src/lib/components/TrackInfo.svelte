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

<!----------------------------->
<!-- BODY -->
<!-- --------------------------->

<div>
	{#if $currentSong}
		<!-- title -->
		{#if $currentSong.title}
			<h1 class="now-playing">{$currentSong.title}</h1>
		{/if}
		<section>
			<!-- artiest(en) -->
			{#if $currentSong.artists}
				<p>{$currentSong.artists}</p>
			{/if}
			<!-- album -->
			{#if $currentSong.album}
				<p style="color: {$currentSong.vibrant}">&nbsp; • &nbsp;{$currentSong.album}</p>
			{/if}
		</section>
		<section>
			<p>GENERAL TRACK INFORMATION</p>
      <!-- duration -->
			{#if $currentSong.duration}
				<p>⏳ Duration: {formatDuration($currentSong.duration)}</p>
			{/if}
			<!-- popularity -->
			{#if $currentSong.popularity}
        <p
          class="popularity"
          data-tip="Popularity is based on total streams and how recent they are. Tracks played more recently rank higher. Higher number = More popular."
        >🔥 Popularity: {$currentSong.popularity}</p>
      {/if}
		</section>
	{/if}
</div>

<!----------------------------->
<!-- CSS -->
<!-- --------------------------->

<style>
  div {
    display: flex;
    flex-direction: column;
    max-width:400px;
  }

  section {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-self: stretch; 
  }

  h1 {
    font-weight: 700;
    font-size: 5em;
    margin: 0;
  }

  section:nth-of-type(1) {
    width:500px;
    p {
      color: lightgray;
      font-size: 1.1em;
      font-weight: 600;
    }
  }

  section:nth-of-type(2) {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;          
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

  .popularity {
    position: relative;
    cursor: help;
  }
  .popularity[data-tip]::after {
    content: attr(data-tip);
    position: absolute;
    left: -115%;
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
    transform: translateY(-4px);
    transition: .15s;
    z-index: 2;
    margin-top: .5em;
  }
  .popularity[data-tip]:hover::after {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 1392px) {
    div {
      align-items: center;
    }
    h1 { 
      font-size: 3em; 
      text-align: center;
    }
    section:nth-of-type(1) {
      justify-content: center;
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