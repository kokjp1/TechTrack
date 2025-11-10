<!----------------------------->
<!-- VISUALIZATION COMPONENT -->
<!----------------------------->

<script>
  import { scaleLinear } from 'd3-scale';
  import { currentSong } from '$lib/stores/currentSongDataStore.js';

  /* -------------------------------
  VINYL SIZE CALCULATION + IMAGE 
  ------------------------------- */

  const sizeCalculation = scaleLinear([0, 100], [100, 220]).clamp(true);
  $: vinylSize = sizeCalculation($currentSong.popularity);

  $: albumCoverUrl = $currentSong.image;
  $: vinylImageSize = vinylSize * 0.35;

  // TODO: Glow size calculation based on follower of artist popularity, zelfde methode als bovenstaand gebruiken

</script>

<!----------------------------->
<!-- VINYL PLAAT SVG ELEMENT -->
<!----------------------------->

<svg viewBox="0 0 500 500">

  <!-- mask voor de afbeelding -->
    <clipPath id="coverClip">
      <circle cx="250" cy="250" r={vinylImageSize} />
    </clipPath>

  <!-- vinyl plaat ----------
  Kleur aanpasbaar naar wens, gewoon {$currentSong.[KLEURTYPE]AlbumColor} aanpassen
  --------------------------->
  <circle cx="250" cy="250" r={vinylSize} fill="{$currentSong.vibrantAlbumColor}" style="filter: drop-shadow(0 0 200px {$currentSong.vibrantAlbumColor})" />

  <!-- afbeelding plaatsen in de eerder gemaakte mask & juist positioneren-->
  {#if albumCoverUrl}
    <image href={albumCoverUrl} x={250 - vinylImageSize} y={250 - vinylImageSize} width={vinylImageSize * 2} height={vinylImageSize * 2} clip-path="url(#coverClip)" 
    />
  {/if}
</svg>

<!----------------------------->
<!-- CSS -->
<!-- --------------------------->
 
<style>
  svg {
    display: block;
    position: absolute;
    width: 500px;
    height: auto;
    transform: translateX(50%);
    z-index: -1;
    overflow: visible;
  }

  @media (max-width: 1392px) {
    svg {
      width: 320px;
    }
  }

  @media (max-width: 595px) {
    svg {
      width: 250px;
    }
  }
</style>