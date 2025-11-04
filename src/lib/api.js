import { getTrackTitle } from './data/metadata.js';
import { getTrackCover } from './data/albumcover.js';

export async function getCurrentlyPlaying(token) {
  // simpele wrapper rond de Spotify endpoint; retourneert { status, data }
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.status === 204) {
    return { status: 204, data: null };
  }

  let data = null;
  if (res.ok) {
    data = await res.json();
  }
  return { status: res.status, data };
}

// nieuw: combineert request + parsing zodat callers UI-waardes krijgen
export async function getParsedCurrentlyPlaying(token) {
  const res = await getCurrentlyPlaying(token);
  if (res.status === 204 || !res.data) {
    return { status: res.status, title: null, cover: null, raw: null };
  }
  const raw = res.data;
  const title = getTrackTitle(raw);
  const cover = getTrackCover(raw);
  return { status: res.status, title, cover, raw };
}

