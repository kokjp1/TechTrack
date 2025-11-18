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
    gap: 7.5em;
    height: 100vh;  
	margin-left:-5em;    
  }

  @media (max-width: 1392px) {
	main {
	  flex-direction: column-reverse;
	  gap:3em;
	  margin:0;
	}
  }	

  @media (max-width: 595px) {
	main {
		margin:0;
	}
	section {
		transform: translateX(-17.5%);
	}
  }

  section {
	display:flex;
	flex-direction:row;
	align-items: center;
  }	
</style>
