<script>
	import { sessionStore } from '$lib/stores/sessionStore.js';

	const fmtTime = (ms) => {
		if (!ms && ms !== 0) return '-';
		const total = Math.floor(ms / 1000);
		const m = Math.floor(total / 60);
		const s = String(total % 60).padStart(2, '0');
		return `${m}:${s}`;
	};

	const fmtDate = (ts) => new Date(ts).toLocaleTimeString();
</script>

<div class="session-list">
	<h3>Sessie-opname</h3>

	<p class="meta">
		Status: {$sessionStore.recording ? 'Recording' : 'Idle'} · Snapshots: {$sessionStore
			.sessionPlayedSongs.length}
	</p>

	{#if $sessionStore.sessionPlayedSongs.length === 0}
		<p class="empty">Nog geen snapshots.</p>
	{:else}
		<ul>
			{#each $sessionStore.sessionPlayedSongs as s (s.id + '-' + s.capturedAt)}
				<li>
					<img src={s.image} alt={s.title} />
					<div class="info">
						<div class="title">{s.title}</div>
						<div class="sub">{(s.artists || []).join(', ')} • {s.album}</div>
						<div class="meta">{fmtTime(s.durationMs)} • {fmtDate(s.capturedAt)}</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.session-list {
		margin: 1rem 0;
		max-width: 720px;
	}
	h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
	}
	.meta {
		opacity: 0.8;
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
	}
	.empty {
		opacity: 0.7;
		font-style: italic;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0 0;
		display: grid;
		gap: 0.5rem;
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
	.sub,
	.meta {
		opacity: 0.8;
		font-size: 0.9rem;
	}
</style>
