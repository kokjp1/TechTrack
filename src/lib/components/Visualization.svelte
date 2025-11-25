<!----------------------------->
<!-- VISUALIZATION COMPONENT -->
<!----------------------------->

<script>
	import { scaleLinear } from 'd3-scale';
	import { currentSong } from '$lib/stores/currentSongDataStore.js';

	/* -------------------------------
  VINYL SIZE CALCULATION + IMAGE 
  ------------------------------- */

	const sizeCalculation = scaleLinear().domain([0, 100]).range([100, 220]).clamp(true);

	$: vinylSize = sizeCalculation($currentSong.popularity);

	$: albumCoverUrl = $currentSong.image;
	$: vinylImageSize = vinylSize * 0.35;

	/* -------------------------------
  GLOW BLUR SIZE (based on artistPopularity)
  ------------------------------- */
	const glowBlurScale = scaleLinear().domain([0, 100]).range([20, 150]).clamp(true);

	$: glowBlurSize = glowBlurScale($currentSong.artistPopularity);

	/* -------------------------------
  SPIN DURATION OP BASIS VAN SONGDURATIE
  // Hoe lang 1 rotatie mag duren binnen standaardrange (uitschieters worden geclamped). css rotatie duurt tussen 6 en 16 sec. afhangend van songduratie
  ------------------------------- */
	const typicalRangeSec = [110, 350];
	const animRangeSec = [6, 16];

	const durationToSpinSec = scaleLinear().domain(typicalRangeSec).range(animRangeSec).clamp(true);

	$: spinDurationSec = durationToSpinSec($currentSong.duration / 1000);

</script>

<!----------------------------->
<!-- VINYL PLAAT SVG ELEMENT -->
<!----------------------------->

<svg viewBox="0 0 500 500">
	<!-- mask voor de afbeelding -->
	<clipPath id="coverClip">
		<circle cx="250" cy="250" r={vinylImageSize} />
	</clipPath>

	<!-- Vinyl + cover in één draaiende groep -->
	<g
		class="spin {$currentSong.status === false ? 'paused' : ''}"
		style={`--spin-duration: ${spinDurationSec}s`}
	>
		<circle
			cx="250"
			cy="250"
			r={vinylSize}
			fill={$currentSong.vibrantAlbumColor}
			style:filter={`drop-shadow(0 0 ${glowBlurSize}px ${$currentSong.vibrantAlbumColor})`}
		/>

		{#if albumCoverUrl}
			<image
				href={albumCoverUrl}
				x={250 - vinylImageSize}
				y={250 - vinylImageSize}
				width={vinylImageSize * 2}
				height={vinylImageSize * 2}
				clip-path="url(#coverClip)"
			/>
		{/if}
	</g>
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
		margin-top: 3em;
		z-index: -1;
		overflow: visible;
	}

	.spin {
		animation: spin var(--spin-duration) linear infinite;
		transform-box: fill-box;
		transform-origin: center;
	}

	.spin.paused {
		animation-play-state: paused;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(720deg);
		}
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
