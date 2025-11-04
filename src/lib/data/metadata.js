export function getTrackTitle(spotifyData) {
  // haalt de tracktitel uit de Spotify response (of null)
  if (!spotifyData || !spotifyData.item) return null;
  return spotifyData.item.name || null;
}

export function getTrackArtist(spotifyData) {
  // haalt de trackartiest uit de Spotify response (of null)
  if (!spotifyData || !spotifyData.item) return null;
  return spotifyData.item.artists[0].name || null;
}

export function getTrackAlbum(spotifyData) {
  // haalt de trackalbum uit de Spotify response (of null)
  if (!spotifyData || !spotifyData.item) return null;
  return spotifyData.item.album.name || null;
}