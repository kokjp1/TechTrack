import { writable, get } from 'svelte/store';

export const sessionStore = writable({
  recording: false,
  previousTrackId: null,
  sessionPlayedSongs: []
});

export function startSession() {
  sessionStore.set({
    recording: true,
    previousTrackId: null,
    sessionPlayedSongs: []
  });
}

export function stopSession() {
  const currentSession = get(sessionStore);
  sessionStore.update(function (currentSessionState) {
    return Object.assign({}, currentSessionState, { recording: false });
  });
//   console.log('recorded session songs:', currentSession.sessionPlayedSongs);
}

export function updateSessionSongs(sessionSong) {
  sessionStore.update(function (currentSession) {
    // fallback optie als er iets mis is gegaan of als de gebruiker de knop spamt
    if (!currentSession.recording) return currentSession;
    // slice zonder getal maakt gwn een hele array aan
    // maak een kopie van de session songs played array en voeg daaraan een nieuw liedje toe en return vervolgens de updated songs als sessionplayedSongs
    const updatedSongs = currentSession.sessionPlayedSongs.slice();
    updatedSongs.push(sessionSong);

    return Object.assign({}, currentSession, { sessionPlayedSongs: updatedSongs });
  });
}