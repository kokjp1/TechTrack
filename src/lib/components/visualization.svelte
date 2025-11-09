<!----------------------------->
<!-- VISUALIZATION COMPONENT -->
<!----------------------------->

<script>
  import { scaleLinear } from 'd3-scale';
  import { currentSong } from '$lib/stores/currentSongDataStore.js';

  // keep popularity mapping; overall visual size jumps via CSS width breakpoints
  const sizeCalculation = scaleLinear([0, 100], [100, 220]).clamp(true);
  $: vinylSize = sizeCalculation($currentSong.popularity);
</script>

<svg class="viz" viewBox="0 0 500 500">
  <circle cx="250" cy="250" r={vinylSize} fill="white" />
</svg>

<style>
  .viz {
    display: block;
    position: absolute;
    width: 500px;
    height: auto;
    transform: translateX(50%);
    z-index: -1;
  }

  @media (max-width: 1392px) {
    .viz {
      width: 320px; 
    }
  }

  @media (max-width: 595px) {
    .viz {
      width: 250px; 
    }
  }
</style>