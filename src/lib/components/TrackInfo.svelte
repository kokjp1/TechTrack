<!-------------------------------->
<!-- TRACK INFORMATION + PLAYER -->
<!-------------------------------->

<script>
  import { currentSong } from '$lib/stores/currentSongDataStore.js';

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
    <div class="now-playing">Now playing: {$currentSong.title}</div>
  {/if}
  <!-- duration -->
  {#if $currentSong.duration}
    <div class="duration">Duration: {formatDuration($currentSong.duration)}</div>
  {/if}
  <!-- artiest(en) -->
  {#if $currentSong.artists}
    <div class="artists">Artists: {$currentSong.artists}</div>
  {/if}
  <!-- album -->
  {#if $currentSong.album}
    <div class="album">Album: {$currentSong.album}</div>
  {/if}
  <!-- populariteit -->
  {#if $currentSong.popularity}
    <div class="popularity">Popularity: {$currentSong.popularity}</div> 
  {/if}
{/if}
</div>

<style>
  div {
    display:flex;
    flex-direction: column;
    gap:2em;
  }
</style>