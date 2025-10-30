<script>
  import { onMount } from 'svelte';
  import { startLogin, getStoredAccessToken, clearAuth } from '$lib/spotifyAuth';

  let trackTitle = null;
  let loading = false;
  let errorMsg = null;
  let hasToken = false;

  async function fetchCurrentlyPlaying() {
    errorMsg = null;
    trackTitle = null;
    const token = getStoredAccessToken();
    if (!token) { hasToken = false; return; }
    hasToken = true;

    loading = true;
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 204) {
        trackTitle = null; // niets speelt
      } else if (res.ok) {
        const data = await res.json();
        trackTitle = data && data.item && data.item.name ? data.item.name : '(onbekende track)';
      } else if (res.status === 401) {
        hasToken = false;
        errorMsg = 'Token verlopen. Log opnieuw in.';
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
        <p><strong>Track:</strong> {trackTitle}</p>
      {:else}
        <p>Er speelt nu niets.</p>
      {/if}
    {/if}
  {/if}
</section>
