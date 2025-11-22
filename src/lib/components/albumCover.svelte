<!----------------------------->
<!-- ALBUM COVER COMPONENT -->
<!----------------------------->

<script>
    import { currentSong } from '$lib/stores/currentSongDataStore.js';
</script>
<section>
    <p
        class="popularity"
        data-tip="Vinyl size = Song popularity
Vinyl glow size = Artist popularity
Rotation speed = Song length (shorter = faster)">
        ℹ️ Albuminformatie
    </p>

    {#if $currentSong.image}
        <img src={$currentSong.image} alt={`Album art for ${$currentSong.title}`} />
    {/if}
</section>
<style>
    img {
        display: block;
        width: 500px;
        height: 500px;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 1392px) {
        img {
            width: 320px;
            height: 320px;
        }
    }

    @media (max-width: 595px) {
        img {
            width: 250px;
            height: 250px;
        }
    }

    .popularity {
        position: relative;
        cursor: help;
        display: inline-block;
        margin-top: 0.5rem;
    }

    .popularity[data-tip]::after {
    content: attr(data-tip);
    position: absolute;
    left: 50%; 
    top: 100%;
    background: #111;
    color: #fff;
    padding: 8px 12px;
    font-size: 1em;
    border-radius: 4px;
    
    white-space: pre-wrap; 
    text-align: left; 
    
    max-width: 500px;
    width: max-content;
    opacity: 0;
    transform: translate(-20%, -125%); 
    transition: 0.15s;
    z-index: 2;
    margin-top: 0.5em;
    pointer-events: none;
}
    .popularity[data-tip]:hover::after {
        opacity: 1;
        transform: translate(-20%, -150%);
    }
</style>
