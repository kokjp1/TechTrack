export function getTrackCover(spotifyData) {
  // haalt de eerste album image URL (of null)
  return spotifyData && spotifyData.item && spotifyData.item.album && spotifyData.item.album.images
    ? spotifyData.item.album.images[0]?.url ?? null
    : null;
}