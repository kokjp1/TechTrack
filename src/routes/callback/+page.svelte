<script>
  import { onMount } from 'svelte';
  import { exchangeCodeForToken } from '$lib/spotifyAuth';

  onMount(async () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    try {
      if (error) {
        console.error('Spotify error:', error);
      } else if (code) {
        await exchangeCodeForToken(code);
      }
    } catch (e) {
      console.error(e);
    } finally {
      window.location.replace('/');
    }
  });
</script>

<p>Spotify Authorization in progress...</p>
