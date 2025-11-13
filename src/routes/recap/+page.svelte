<script>
    import { sessionStore } from '$lib/stores/sessionStore.js';
    import { goto } from '$app/navigation';

    function formatDuration(ms) {
        if (!ms) return 'N/A';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function formatCaptureTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
</script>

<div class="container">
    <h1>Session Recap</h1>
    <p>Een overzicht van de nummers die je tijdens deze sessie hebt geluisterd.</p>

    <button on:click={() => goto('/')}>Go back home</button>

    <ul>
        {#each $sessionStore.sessionPlayedSongs as song}
            <li>
                <img src={song.image} alt={song.title} />
                <div class="song-details">
                    <div class="title">{song.title}</div>
                    <div class="artist">{song.artists.join(', ')}</div>
                    <div class="album">Album: {song.album}</div>
                </div>
                <div class="song-meta">
                    <div class="duration">Duration: {formatDuration(song.durationMs)}</div>
                    <div class="capture-time">Listened at: {formatCaptureTime(song.capturedAt)}</div>
                </div>
            </li>
        {/each}
    </ul>
</div>

<style>
    .container {
        max-width: 800px;
        margin: auto;;
        color: #fff;
        display: flex;
        flex-direction: column;
        height: 95vh;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    p {
        margin-bottom: 2rem;
        opacity: 0.8;
    }

    button {
        background-color: #1db954;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        margin-bottom: 2rem;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #1ed760;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
        overflow-y: auto; 
        padding-right: 0.5rem;
    }

    li {
        display: grid;
        grid-template-columns: 64px 1fr auto;
        gap: 1rem;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        padding: 0.75rem;
        border-radius: 8px;
        transition: background-color 0.2s;
    }

    li:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    img {
        width: 64px;
        height: 64px;
        object-fit: cover;
        border-radius: 4px;
    }

    .song-details {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        overflow: hidden;
    }

    .title {
        font-weight: 600;
        font-size: 1.1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .artist,
    .album,
    .capture-time {
        opacity: 0.7;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .song-meta {
        text-align: right;
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .duration {
        font-weight: 500;
    }

    @media (max-width: 1392px) {
        .container {
            padding: 1rem;
        }
    }
    @media (max-width: 595px) {
        .container {
            padding: 1rem;
        }
    }   
</style>
