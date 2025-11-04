// SONG DURATION

export function getTrackDuration(spotifyData) {
  // haalt de tracktitel uit de Spotify response (of null)
  if (!spotifyData || !spotifyData.item) return null;
  return spotifyData.item.duration_ms || null;
}