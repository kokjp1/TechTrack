<script>
/* -------------------------
JAVASCRIPT IMPORTS
------------------------- */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getStoredAccessToken } from '$lib/spotifyAuth';
	import { currentSong } from '$lib/stores/currentSongDataStore.js';

/* -------------------------
SVELTE COMPONENTS IMPORTS
------------------------- */

	import ZeroState from '$lib/components/ZeroState.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import TrackInfo from '$lib/components/TrackInfo.svelte';
	import AlbumCover from '$lib/components/AlbumCover.svelte';
	import Visualization from '$lib/components/visualization.svelte';

	let signedIn = false;

	onMount(() => {
		if (!browser) return;
		signedIn = !!getStoredAccessToken();
	});
</script>

<!------------------------------>
<!-- BODY -->
<!-- --------------------------->

{#if signedIn}
	{#if $currentSong}
		<main>
			<TrackInfo />
			<section>
				<AlbumCover />
				<Visualization />
			</section>
		</main>
	{:else}
		<EmptyState />
	{/if}
{:else}
	<ZeroState />
{/if}

<!----------------------------->
<!-- CSS -->
<!-- --------------------------->

<style>
  main {
    display: flex;
    flex-direction: row;
    align-items: center;    
    justify-content: center;
    padding: 2rem;
    gap: 2.5em;
    height: 100vh;        
  }

  @media (max-width: 600px) {
	main {
	  flex-direction: column-reverse;
	}
  }	

  section {
	display:flex;
	flex-direction:row;
  }	
</style>
