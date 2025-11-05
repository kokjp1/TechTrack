/* -------------------------
  API Request handler 
------------------------- */

import { getStoredAccessToken } from '$lib/spotifyAuth';

  /* -------------------------
      API Query 
  ------------------------- */

export async function getCurrentSongData() {
  const token = getStoredAccessToken();
  if (!token) return null;

  const res = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track',
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );

  /* -------------------------
      Opgevraagde data
  ------------------------- */

  const data = await res.json();
  return { 
    title: data.item.name, 
    image: data.item.album.images[0].url, 
    duration: data.item.duration_ms,
    artists: data.item.artists.map(artist => artist.name).join(', '),
    album: data.item.album.name,
    popularity: data.item.popularity,
    data};
}
