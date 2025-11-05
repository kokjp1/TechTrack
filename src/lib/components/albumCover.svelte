<!----------------------------->
<!-- ALBUM COVER COMPONENT -->
<!----------------------------->

<script>
  import { currentSong } from '$lib/stores/currentSongDataStore.js';
</script>

{#if $currentSong.image}
  <img src={$currentSong.image} alt={`Album art for ${$currentSong.title}`} width={300} height={300} />
{/if}

<style>
  img {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>