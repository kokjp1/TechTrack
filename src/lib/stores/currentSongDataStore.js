/* -------------------------------
  CURRENT SONG OBJECT SVELTE STORE
--------------------------------- */

import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCurrentSongData } from '$lib/api/api.js';

/* -------------------------
  1 Refresh rate voor de hele app 
  + Minder duplicate code in componenten zelf
  + makkelijker aan te passen 

  1 Bron voor de gefilterde data uit api.js
  + beschikbaar in ELK bestand die toegang heeft tot deze store
------------------------- */

export const currentSong = readable(null, (set) => {
  if (!browser) return () => {}; // SSR maatregel

  let timer;
  
  async function refresh() {
    const response = await getCurrentSongData();
    set(response);
  }

  refresh();
  timer = setInterval(refresh, 1000);

  return () => {
    clearInterval(timer);
  };
});

// https://svelte.dev/docs/svelte/stores