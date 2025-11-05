<!------------------------------------>
<!-- ZERO STATE PAGE (UNAUTHORIZED) -->
<!------------------------------------>

<script>
  import { startLogin } from '$lib/spotifyAuth';

  let loading = false;

  function signIn() {
    loading = true;
    startLogin().catch(() => {
      loading = false;
    });
  }
</script>

<div class="zero-state">
  <h2>Connect Spotify</h2>
  <button class="spotify-btn" on:click={signIn} disabled={loading}>
    {#if loading}Redirecting…{/if}
    {#if !loading}Sign in with Spotify{/if}
  </button>
  <p class="hint">You’ll be redirected to Spotify to authorize.</p>
</div>

<style>
  .zero-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
  }

  .spotify-btn {
    background: #1db954;
    color: #000;
    font-weight: 600;
    border: none;
    border-radius: 9999px;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
  }

  .spotify-btn:disabled {
    opacity: 0.7;
    cursor: default;
  }

  .hint {
    opacity: 0.8;
    font-size: 0.9rem;
  }
</style>