<!------------------------------------>
<!-- ZERO STATE PAGE (UNAUTHORIZED) -->
<!------------------------------------>

<script>
    import { startLogin } from '$lib/spotifyAuth';

    let loading = false;

    function signIn() {
        loading = true;
        startLogin().catch(() => {
            loading = false;
        });
    }
</script>

<div class="zero-state">
    <div class="zero-state-text">
    <h1>Welkom bij Sonora</h1>

    <p>Deze app laat je op een nieuwe manier naar je muziek kijken. Terwijl je gewoon via Spotify luistert, verandert elk nummer automatisch in een visuele vinylplaat.</p>

    <p>De vinyl draait, groeit en kleurt mee met de eigenschappen van de track die je op dat moment afspeelt. Zo zie je in één oogopslag hoe jouw muziek “aanvoelt”.</p>

    <p>Samen vormen deze elementen een soort muzikale “vingerafdruk”. Elke track krijgt zijn eigen unieke vinyl — volledig automatisch.</p>

    <p>Perfect voor iedereen die nieuwsgierig is naar hun luistergedrag: muziekliefhebbers, makers,ontwerpers of gewoon mensen die willen spelen met data.</p>

    <p>Om te beginnen hoef je alleen Spotify te koppelen. Daarna zie je direct jouw eerstegegenereerde vinyl.</p>
</div>

<div class="zero-state-action">
    <h2>Verbind Spotify om te starten</h2>

    <button class="spotify-btn" on:click={signIn} disabled={loading}>
        {#if loading}Spotify wordt geopend…{/if}
        {#if !loading}Sign in met Spotify{/if}
    </button>

    <p class="hint">
        We gebruiken uitsluitend de gegevens die nodig zijn om je huidige track, artiest, album en
        genres te visualiseren. Je kunt op elk moment stoppen of uitloggen.
    </p>
</div>

</div>

<style>
    .zero-state {
        display: grid;
        grid-template-rows: minmax(0, 2fr) minmax(0, 1.5fr);
        gap: 2.5rem;
        align-items: flex-start;
        padding: 3rem 2rem;
        max-width: 960px;
        margin: 0 auto;
    }

    .zero-state-text h1 {
        font-size: 2rem;
        margin:0 0 1rem 0;
    }

	.zero-state-text {
		display:flex;
		flex-direction: column;
		gap:1.5em;
	}

	.zero-state-text p{
		margin:0;
		font-weight:402;
	}

    .zero-state-action {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.5rem 1.75rem;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(10px);
    }

    .zero-state-action h2 {
        margin: 0;
        font-size: 1.25rem;
    }

    .spotify-btn {
        background: #1db954;
        color: #000;
        font-weight: 600;
        border: none;
        border-radius: 9999px;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        font-size: 0.95rem;
        transition: transform 0.05s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
    }

    .spotify-btn:hover:enabled {
        background: #1ed760;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
    }

    .spotify-btn:active:enabled {
        transform: translateY(1px);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
    }

    .spotify-btn:disabled {
        opacity: 0.8;
        cursor: default;
    }

    .hint {
        opacity: 0.8;
        font-size: 0.9rem;
    }

    @media (max-width: 800px) {
        .zero-state {
            grid-template-columns: minmax(0, 1fr);
            padding: 2rem 1.5rem;
        }

        .zero-state-action {
            margin-top: 0.5rem;
        }
    }
</style>
