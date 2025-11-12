<script>
    import { sessionStore } from '$lib/stores/sessionStore.js';

    let sidebarOpen = false;

    let label;
    if (sidebarOpen) {
      label = 'Close History';
    } else {
      label = 'History';
    }

    let statusLabel;
    $: {
      if ($sessionStore.recording) {
        statusLabel = 'Recording';
      } else {
        statusLabel = 'Not Recording';
      }
    }
</script>

<aside class="session-sidebar" class:open={sidebarOpen === true}>
	<!-- conditionele class apply van svelte -->
	 <!-- https://svelte.dev/docs/svelte/class#The-class:-directive -->
    <div class="session-history">
        <section class="header">
            <h3>(session) Listening History</h3>
            <button class="close" on:click={() => (sidebarOpen = false)}>×</button>
        </section>

        <p class="songMetadata">
            Status: {statusLabel} · Songs listened: {$sessionStore.sessionPlayedSongs.length}
        </p>

        {#if $sessionStore.sessionPlayedSongs.length === 0}
            <p class="emptyState">You haven't listened to anything yet.</p>
        {:else}
            <ul>
                {#each $sessionStore.sessionPlayedSongs as song}
                    <li>
                        <img src={song.image} alt={song.title} />
                        <div>
                            <div class="title">{song.title}</div>
                            <div class="subtext">{(song.artists).join(', ')}</div>
                        </div>
                    </li>
                {/each}
                <!-- https://svelte.dev/docs/svelte/each -->
            </ul>
        {/if}
    </div>
</aside>

<button
    class="sidebar-toggle"
    on:click={() => {
        if (sidebarOpen === true) {
            sidebarOpen = false;
        } else {
            sidebarOpen = true;
        }
    }}>
    {label}
</button>

<style>
    :root {
        --sidebar-width: 360px;
        --sidebar-bg: #111;
        --sidebar-fg: #fff;
        --sidebar-shadow: 8px 0 24px rgba(0, 0, 0, 0.25);
    }

    .session-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: var(--sidebar-width);
        background: var(--sidebar-bg);
        color: var(--sidebar-fg);
        box-shadow: var(--sidebar-shadow);
        transform: translateX(-100%); 
        transition: transform 180ms ease;
        z-index: 1000;
        pointer-events: none;
        display: flex;
        flex-direction: column;
    }
    .session-sidebar.open {
        transform: translateX(0);
        pointer-events: auto;
    }
    .session-history {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1rem;
        overflow: hidden;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }
    .close {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        line-height: 1;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    .close:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .songMetadata {
        opacity: 0.8;
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
    }
    .emptyState {
        opacity: 0.7;
        font-style: italic;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
        display: grid;
        gap: 0.5rem;
        overflow-y: auto;
    }

    li {
        display: grid;
        grid-template-columns: 48px 1fr;
        gap: 0.75rem;
        align-items: center;
    }

    img {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 4px;
    }

    .title {
        font-weight: 600;
    }
    .subtext,
    .songMetadata {
        opacity: 0.8;
        font-size: 0.9rem;
    }

    .sidebar-toggle {
        position: fixed;
        left: 0.75rem;
        bottom: 0.75rem;
        z-index: 1001;
        background: #1db954;
        color: #000;
        border: none;
        border-radius: 999px;
        padding: 0.6rem 0.9rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    .sidebar-toggle:hover {
        filter: brightness(1.25);
		transition: filter 150ms ease-in-out;
    }
    @media (max-width: 480px) {
        :root { --sidebar-width: 90vw; }
    }
</style>
