/* -------------------------------
  CURRENT SONG OBJECT SVELTE STORE
--------------------------------- */

import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCurrentSongData } from '$lib/api/api.js';
import { Vibrant } from 'node-vibrant/browser';
import { sessionStore, updateSessionSongs } from '$lib/stores/sessionStore.js';

export const currentSong = readable(null, (set) => {
  if (!browser) return () => {};
  // SSR guard van chatgpt

  let timer;

  async function refresh() {
    try {
      const storableSongData = await getCurrentSongData();
      if (!storableSongData) return;
      
      const data = storableSongData;
      const track = data.data.item;

      /* -------------------------
      SESSION LOGICA 
      + nodig omdat de het currentSong Object hier gemaakt/opgeslagen word, sessionStore dient puur om de "recording" state bij te houden en bij te houden WELKE liedjes er in de sessie zijn, niet OM de liedjes zelf op te slaan
      ------------------------- */
      if (track) {
        sessionStore.update(function (session) {
          if (session.recording === false) return session;

          let trackId = track.id;
          if (!trackId || trackId === session.previousTrackId) return session;

          let singleSessionSong = {
            id: trackId,
            title: track.name,
            artists: (track.artists || []).map(function (artist) { return artist.name; }),
            album: track.album && track.album.name,
            popularity: track.popularity,
            durationMs: track.duration_ms,
            image: track.album.images[0].url,
            capturedAt: Date.now()
          };

          let updatedSongs = session.sessionPlayedSongs.slice();
          updatedSongs.push(singleSessionSong);

          return Object.assign({}, session, {
            previousTrackId: trackId,
            sessionPlayedSongs: updatedSongs
          });
        }); 
      }

      // KLEUREN TOEVOEGEN AAN DE SONG STORE OBJECT
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