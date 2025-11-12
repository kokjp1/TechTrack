<script>
  import { sessionStore, startSession, stopSession } from '$lib/stores/sessionStore.js';
</script>

<div class="session-controls">
  <button class="start" on:click={startSession}>
    {#if $sessionStore.recording === true}Restart
    {:else}Record
    {/if}
  </button>
  <button class="stop" on:click={stopSession}>Stop</button>
  {#if $sessionStore.recording === true}
    <span class="status">Recording…</span>
  {/if}
</div>

<style>
  .session-controls {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: 1rem;
  }
  button {
    background: #2a2a2a;
    color: #fff;
    border: 1px solid #444;
    border-radius: 6px;
    padding: .4rem .7rem;
    cursor: pointer;
  }
  button:hover {
    filter: brightness(1.25);
		transition: filter 150ms ease-in-out;
    }
  .status { opacity: .8; }
</style>