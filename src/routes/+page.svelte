<script>
  import { onMount } from 'svelte';
  import { startLogin, getStoredAccessToken, clearAuth } from '$lib/spotifyAuth';
  import { getCurrentlyPlaying } from '$lib/api';
  import { getTrackTitle } from '$lib/data/metadata';
  import { getTrackCover } from '$lib/data/albumcover';
  import { getTrackDuration } from '$lib/data/duration';

  let trackTitle = null;
  let trackCover = null;
  let trackDuration = null;
  let loading = false;
  let errorMsg = null;
  let hasToken = false;

  function formatDuration() {
    if (trackDuration == null) return '';
    const minutes = Math.floor(trackDuration / 60);
    const seconds = trackDuration % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  async function fetchCurrentlyPlaying() {
    errorMsg = null;
    trackTitle = null;
    trackCover = null;
    trackDuration = null;

    const token = getStoredAccessToken();
    if (!token) { hasToken = false; return; }
    hasToken = true;

    loading = true;
    try {
      const res = await getCurrentlyPlaying(token);

      if (res.status === 204) {
        trackTitle = null;
        trackCover = null;
      } else if (res.status === 401) {
        hasToken = false;
        errorMsg = 'Authenticatie verlopen. Log opnieuw in.';
      } else if (res.status === 200) {
        const data = res.data;
        trackTitle = getTrackTitle(data);
        trackCover = getTrackCover(data);
        trackDuration = getTrackDuration(data);
        // zet milliseconden om naar seconden zodat formatDuration() zonder parameter werkt
        if (trackDuration != null) {
          trackDuration = Math.floor(trackDuration / 1000);
        }
        console.log('trackDuration (seconds):', trackDuration, 'data.item?', data?.item);
      } else {
        errorMsg = `Fout ${res.status}`;
      }
    } catch (e) {
      errorMsg = e && e.message ? e.message : 'Onbekende fout';
    } finally {
      loading = false;
    }
  }

  function login() {
    startLogin();
  }

  function logout() {
    clearAuth();
    hasToken = false;
    trackTitle = null;
    trackCover = null;
    trackDuration = null;
  }

  onMount(() => {
    fetchCurrentlyPlaying();
  });
</script>

<section style="display:grid;gap:0.75rem;max-width:560px;margin:2rem auto;padding:1rem">
  <h1>Currently Playing (bare minimum)</h1>

  {#if !hasToken}
    <button on:click={login} style="padding:0.5rem 0.75rem;cursor:pointer">
      Connect Spotify
    </button>
  {:else}
    <div style="display:flex;gap:0.5rem;align-items:center">
      <button on:click={fetchCurrentlyPlaying} disabled={loading} style="padding:0.5rem 0.75rem;cursor:pointer">
        {loading ? 'Laden...' : 'Ververs'}
      </button>
      <button on:click={logout} style="padding:0.5rem 0.75rem;cursor:pointer">
        Log uit
      </button>
    </div>

    {#if errorMsg}
      <p style="color:#f66">Error: {errorMsg}</p>
    {/if}

    {#if loading}
      <p>Bezig met ophalen…</p>
    {:else}
      {#if trackTitle}
        <div style="display:flex;gap:0.75rem;align-items:center">
          {#if trackCover}
            <img src={trackCover} alt="Album cover" style="width:96px;height:96px;object-fit:cover;border-radius:6px" />
          {/if}
          <div>
            {#if trackDuration != null}
              <p><strong>Duur:</strong> {formatDuration()}</p>
            {/if}
            <p><strong>Track:</strong> {trackTitle}</p>
          </div>
        </div>
      {:else}
        <p>Er speelt nu niets.</p>
      {/if}
    {/if}
  {/if}
</section>