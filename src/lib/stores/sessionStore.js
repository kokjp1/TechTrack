import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

export const sessionStore = writable({
	recording: false,
	// flag om te definieren wanneer er opgeslagen moet worden
	previousTrackId: null,
	// looped songs duplicate entries voorkomen
	sessionPlayedSongs: []
	// lege array om dingen in op te gaan slaan
});

export function startSession() {
	sessionStore.set({
		recording: true,
		previousTrackId: null,
		sessionPlayedSongs: []
	});
}

export function stopSession() {
	sessionStore.update(function (currentSessionState) {
		return Object.assign({}, currentSessionState, { recording: false });
	});
	goto('/recap');
}

export function updateSessionSongs(sessionSong) {
	sessionStore.update(function (currentSession) {
		const updatedSongs = currentSession.sessionPlayedSongs.slice();
		updatedSongs.push(sessionSong);

		return Object.assign({}, currentSession, { sessionPlayedSongs: updatedSongs });
	});
}

// slice zonder getal maakt een hele array aan
// maak een kopie van de session songs played array en voeg daaraan een nieuw liedje toe en return vervolgens de updated songs als sessionplayedSongs