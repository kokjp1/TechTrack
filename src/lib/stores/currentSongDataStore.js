/* -------------------------------
  CURRENT SONG OBJECT SVELTE STORE
--------------------------------- */

import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCurrentSongData } from '$lib/api/api.js';
import { Vibrant } from 'node-vibrant/browser';

export const currentSong = readable(null, (set) => {
  if (!browser) return () => {};

  let timer;

  async function refresh() {
    try {
      const storableSongData = await getCurrentSongData();
      if (!storableSongData) return;

      if (storableSongData.image) {
        try {
          const albumCoverColors = await Vibrant.from(storableSongData.image).getPalette();
          storableSongData.vibrantAlbumColor = albumCoverColors.Vibrant?.hex;
          storableSongData.mutedAlbumColor = albumCoverColors.Muted?.hex;
          storableSongData.darkVibrantAlbumColor = albumCoverColors.DarkVibrant?.hex;
          storableSongData.lightVibrantAlbumColor = albumCoverColors.LightVibrant?.hex;
          storableSongData.darkMutedAlbumColor = albumCoverColors.DarkMuted?.hex;
          storableSongData.lightMutedAlbumColor = albumCoverColors.LightMuted?.hex;
        } catch {}
      }
      set(storableSongData);

      // TROUBLESHOOT/TEST LOGGING
      // INGEKLAPT HOUDEN TENZIJ NODIG
      
      // console.log(
      //   storableSongData.title,
      //   '|', storableSongData.artists,
      //   '|', storableSongData.album,
      //   '| popu:', storableSongData.popularity,
      //   '| dur(ms):', storableSongData.duration,
      //   '| vibrant:', storableSongData.vibrantAlbumColor, 
      //   '| muted:', storableSongData.mutedAlbumColor,
      //   '| dark vibrant:', storableSongData.darkVibrantAlbumColor,
      //   '| light vibrant:', storableSongData.lightVibrantAlbumColor,
      //   '| dark muted:', storableSongData.darkMutedAlbumColor,
      //   '| light muted:', storableSongData.lightMutedAlbumColor
      // );

    } catch (e) {
      console.warn('refresh failed', e);
    }
  }

  refresh();
  timer = setInterval(refresh, 1000);

  return () => clearInterval(timer);
});

// https://svelte.dev/docs/svelte/stores
// https://github.com/Vibrant-Colors/node-vibrant