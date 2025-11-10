<!----------------------------->
<!-- ALBUM COVER COMPONENT -->
<!----------------------------->

<script>
  import { currentSong } from '$lib/stores/currentSongDataStore.js';
</script>

{#if $currentSong.image}
  <img src={$currentSong.image} alt={`Album art for ${$currentSong.title}`} />
{/if}

<style>
  img {
    display: block;
    width: 500px; 
    height: 500px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* transform: translateX(50%); */
  }

  @media (max-width: 1392px) {
    img {
      width: 320px;
      height: 320px;
    }
  }

  @media (max-width: 595px) {
    img {
      width: 250px;
      height: 250px;
    }
  }
</style>