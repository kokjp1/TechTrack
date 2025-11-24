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

	const artistsIds = data.item.artists.map((artist) => artist.id);

	let artistsDetails = [];
	if (artistsIds.length) {
		const artistFetchResult = await fetch(
			`https://api.spotify.com/v1/artists?ids=${artistsIds.join(',')}`,
			{ headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
		);
		const artistsData = await artistFetchResult.json();
		artistsDetails = artistsData.artists.map((artist) => ({
			id: artist.id,
			name: artist.name,
			popularity: artist.popularity,
			genres: artist.genres,
			image: artist.images[0].url
		}));
	}

	const artistPopularity = artistsDetails[0].popularity;

	return {
		title: data.item.name,
		image: data.item.album.images[0].url,
		duration: data.item.duration_ms,
		progress: data.progress_ms,
		artists: data.item.artists.map((artist) => artist.name).join(', '),
		status: data.is_playing,
		artistsIds,
		album: data.item.album.name,
		popularity: data.item.popularity,
		artistPopularity,
		artistsDetails,
		data
	};
}

/* -------------------------
      Playback Controls
  ------------------------- */

export async function play() {
	const token = getStoredAccessToken();
	if (!token) return;
	await fetch('https://api.spotify.com/v1/me/player/play', {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function pause() {
	const token = getStoredAccessToken();
	if (!token) return;
	await fetch('https://api.spotify.com/v1/me/player/pause', {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function next() {
	const token = getStoredAccessToken();
	if (!token) return;
	await fetch('https://api.spotify.com/v1/me/player/next', {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function previous() {
	const token = getStoredAccessToken();
	if (!token) return;
	await fetch('https://api.spotify.com/v1/me/player/previous', {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function seek(position_ms) {
	const token = getStoredAccessToken();
	if (!token) return;
	await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` }
	});
}
