<script>
  import { sessionStore, startSession, stopSession } from '$lib/stores/sessionStore.js';
</script>

<div class="session-controls">
  <button on:click={startSession}>Record</button>
  <button on:click={stopSession}>Stop</button>
  {#if $sessionStore.recording}
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
  .status { opacity: .8; }
</style>