<script>
  import { scaleLinear } from 'd3-scale';
  import { currentSong } from '$lib/stores/currentSongDataStore.js';

  // Map popularity 0–100 naar radius 20–120
  const rScale = scaleLinear([0, 100], [20, 120]).clamp(true);

  // Lees de store reactief en vang undefined af
  $: popularity =
    $currentSong?.track?.popularity ??
    $currentSong?.popularity ??
    0;

  // Bereken de radius op basis van popularity
  $: radius = rScale(popularity);
</script>

<svg viewBox="0 0 400 400" width="200" height="200">
  <circle cx="200" cy="200" r={radius} fill="black" />
</svg>


<style>
    circle {
        display:block;
    	transform: translateX(-50%);
    }
</style>