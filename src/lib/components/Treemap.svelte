<script>
	import * as d3 from 'd3';
	import { sessionStore } from '$lib/stores/sessionStore.js';
	import 'd3-transition';
	import { formatDuration } from '$lib/utils/formatDuration.js';
	import sortByDurationIcon from '$lib/assets/qlementine-icons--sort-time-asc-16.svg';
	import sortByArtistIcon from '$lib/assets/qlementine-icons--sort-user-asc-16.svg';
	import sortByGenreIcon from '$lib/assets/qlementine-icons--sort-alpha-asc-16.svg';

	let container;
	let sessionChart;
	let legendData = [];

	let tooltip;
	let activeSlice = null;

	let isMobile = false;

	let hideUnknownGenres = false;

	const customPalette = [
		'#1DB954',
		'#7C4DFF',
		'#E040FB',
		'#FF4081',
		'#00E5FF',
		'#FFD740',
		'#69F0AE',
		'#FF5252',
		'#536DFE',
		'#FFAB40'
	];

	function updateLayout() {
		isMobile = window.innerWidth < 768;
		const data = buildTreemapData($sessionStore);
		renderTreemap(data);
	}

	// run once on mount + watch resize
	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		updateLayout();
		window.addEventListener('resize', updateLayout);
	});

	onDestroy(() => {
		window.removeEventListener('resize', updateLayout);
	});
	/* ------------------------------------------------
DATA / SESSION SONGS IMPORTEREN EN BRUIKBAAR MAKEN
------------------------------------------------- */

	function buildTreemapData(session) {
		const songs = session?.sessionPlayedSongs ?? [];

		let children = songs.map((song) => ({
			name: song.title || 'Unknown',
			value: song.durationMs || song.duration || 0,
			id: song.id,
			artists: song.artists,
			album: song.album,
			genre: song.genre || 'Unknown',
			durationMs: song.durationMs || song.duration || 0,
			image: song.image
		}));

		// Filter Unknown genres als checkbox aan staat
		if (hideUnknownGenres) {
			children = children.filter((song) => (song.genre || 'Unknown') !== 'Unknown');
		}

		return {
			name: 'root',
			children: [
				{
					name: 'Session',
					children
				}
			]
		};
	}

	// telt hoe vaak elke artiest voorkomt
	function buildArtistFrequency(songs) {
		const artistAmount = new Map();
		for (const song of songs) {
			const artists = Array.isArray(song.artists) ? song.artists : [song.artists ?? 'Unknown'];
			for (const artist of artists) {
				if (!artist) continue;
				const key = artist.name ?? artist;
				artistAmount.set(key, (artistAmount.get(key) || 0) + 1);
			}
		}
		return artistAmount; // Map(artistName -> count)
	}

	// telt hoe vaak elk genre voorkomt
	function buildGenreFrequency(songs) {
		const genreAmount = new Map();
		for (const song of songs) {
			const genre = song.genre || 'Unknown';
			genreAmount.set(genre, (genreAmount.get(genre) || 0) + 1);
		}
		return genreAmount; // Map(genre -> count)
	}

	/* -----------------------------------------------------
    D3 TREEMAP CODE | https://observablehq.com/@d3/treemap/2
    ------------------------------------------------------ */

	let sortMode = 'none';

	function setSortMode(mode) {
		if (sortMode === mode) return; // geen dubbele render
		sortMode = mode;
		const data = buildTreemapData($sessionStore);
		renderTreemap(data);
	}

	function renderTreemap(data) {
		if (sessionChart && sessionChart.parentNode) {
			sessionChart.parentNode.removeChild(sessionChart);
			sessionChart = null;
		}

		const width = 1154;
		const height = isMobile ? 350 : 554;
		const tile = isMobile ? d3.treemapSlice : d3.treemapDice;

		const allGenres = [];
		data.children[0]?.children?.forEach((song) => {
			const genre = song.genre || 'Unknown';
			if (!allGenres.includes(genre)) allGenres.push(genre);
		});

		// Als alles Unknown is en hideUnknownGenres true is, dan is data leeg;
		// daar hoeven we verder niets speciaals voor te doen: treemap wordt dan gewoon leeg gerenderd.

		// kleur-schaal op basis van genres (blijft nodig voor de treemap zelf)
		const color = d3.scaleOrdinal(allGenres, customPalette);
		// https://d3js.org/d3-scale-chromatic/categorical

		const songs = data.children[0]?.children ?? [];
		// telling functie aanroepen en maken van artiest voorkomendheid en genre voorkomendheid
		const artistAmount = buildArtistFrequency(songs);
		const genreAmount = buildGenreFrequency(songs);

		const root = d3.treemap().tile(tile).size([width, height]).padding(1).round(true)(
			d3
				.hierarchy(data)
				.sum((d) => d.value) // Aangepast: gebruik d.value (duur) in plaats van 1
				.sort((a, b) => {
					const aSong = a.data;
					const bSong = b.data;

					if (sortMode === 'none') {
						return 0; // originele volgorde
					}

					if (sortMode === 'duration') {
						const aDur = aSong?.durationMs ?? 0;
						const bDur = bSong?.durationMs ?? 0;
						return bDur - aDur; // lang -> kort
					}

					if (sortMode === 'artistAmount') {
						const aArtists = Array.isArray(aSong?.artists)
							? aSong.artists
							: [aSong?.artists ?? 'Unknown'];
						const bArtists = Array.isArray(bSong?.artists)
							? bSong.artists
							: [bSong?.artists ?? 'Unknown'];

						const aArtistName = aArtists[0]?.name ?? aArtists[0] ?? 'Unknown';
						const bArtistName = bArtists[0]?.name ?? bArtists[0] ?? 'Unknown';

						const aCount = artistAmount.get(aArtistName) || 0;
						const bCount = artistAmount.get(bArtistName) || 0;

						if (bCount !== aCount) return bCount - aCount;
						return d3.ascending(aArtistName, bArtistName);
					}

					if (sortMode === 'genreAmount') {
						const aGenre = aSong?.genre || 'Unknown';
						const bGenre = bSong?.genre || 'Unknown';

						const aCount = genreAmount.get(aGenre) || 0;
						const bCount = genreAmount.get(bGenre) || 0;

						if (bCount !== aCount) return bCount - aCount;
						return d3.ascending(aGenre, bGenre);
					}

					return 0;
				})
		);

		// Assign index for staggered animation
		root.leaves().forEach((d, i) => (d.index = i));

		const svg = d3
			.create('svg')
			.attr('viewBox', [0, 0, width, height])
			.attr('width', width)
			.attr('height', height)
			.attr('style', 'max-width: 100%; height: auto;');

		const leaf = svg
			.selectAll('g')
			.data(root.leaves())
			.join('g')
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		const rects = leaf
			.selectAll('rect')
			.data((d) => [d])
			.join(
				(enter) =>
					enter
						.append('rect')
						.attr('id', (d) => {
							const uid = `leaf-${Math.random().toString(36).slice(2)}`;
							d.leafUid = { id: uid, href: `#${uid}` };
							return d.leafUid.id;
						})
						.attr('fill', (d) => {
							const genre = d.data.genre || 'Unknown';
							return color(genre);
						})
						.attr('fill-opacity', 0.7)
						.attr('width', 0)
						.attr('height', 0)
						.call((enter) =>
							enter
								.transition()
								.duration(500)
								.delay((d) => d.index * 75)
								.attr('width', (d) => d.x1 - d.x0)
								.attr('height', (d) => d.y1 - d.y0)
						),
				(update) =>
					update.call((update) =>
						update
							.transition()
							.duration(500)
							.delay((d) => d.index * 25)
							.attr('width', (d) => d.x1 - d.x0)
							.attr('height', (d) => d.y1 - d.y0)
					),
				(exit) =>
					exit.call((exit) =>
						exit.transition().duration(300).attr('width', 0).attr('height', 0).remove()
					)
			);

		leaf
			.append('clipPath')
			.attr('id', (d) => {
				const uid = `clip-${Math.random().toString(36).slice(2)}`;
				d.clipUid = uid;
				return d.clipUid;
			})
			.append('use')
			.attr('xlink:href', (d) => d.leafUid.href);

		leaf
			.append('foreignObject')
			.style('pointer-events', 'none')
			.attr('x', 4)
			.attr('y', 4)
			.attr('width', (d) => Math.max(0, d.x1 - d.x0 - 8)) // padding
			.attr('height', (d) => Math.max(0, d.y1 - d.y0 - 8))
			.append('xhtml:div')
			.style('width', '100%')
			.style('height', '100%')
			.style('overflow', 'hidden')
			.style('font-size', '12px')
			.style('color', 'black')
			.style('text-overflow', 'ellipsis')
			.html(
				(d) => `
                <div style="font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${d.data.name}
                </div>
                <div style="font-size:0.8em; opacity:0.8;">
                    ${d.data.genre || 'Unknown'}
                </div>
            `
			);

		/* -----------------------------------------------------------------
    TOOLTIP CODE | https://codepen.io/dandevri/pen/azdrEQb?editors=1010
    ----------------------------------------------------------------- */
		rects
			.on('mouseover touchstart', (event, d) => {
				activeSlice = {
					artist: d.data.artists,
					title: d.data.name,
					genre: d.data.genre || 'Unknown',
					duration: formatDuration(d.data.durationMs || 0),
					image: d.data.image
				};
				d3.select(tooltip).transition().duration(175).style('opacity', 1);
			})
			.on('mousemove', (event) => {
				d3.select(tooltip)
					.style('left', event.pageX + 15 + 'px')
					.style('top', event.pageY + 15 + 'px');
			})
			.on('mouseout', () => {
				activeSlice = null;
				d3.select(tooltip).style('opacity', 0);
			});

		d3.select('body').on('touchend', () => {
			activeSlice = null;
			d3.select(tooltip).style('opacity', 0);
		});

		/* ---------------------------------
    LEGENDA CODE 
    --------------------------------- */
		legendData = allGenres.map((genre) => {
			return {
				name: genre,
				color: color(genre)
			};
		});

		/* ---------------------------------
    SVG FINALISEREN EN AAN DOM TOEVOEGEN
    --------------------------------- */
		sessionChart = svg.node();
		if (container) {
			container.appendChild(sessionChart);
		}
	}

	// optional: keep this or remove it if you only want resize/sort to re-render
	$: if (container && $sessionStore) {
		const data = buildTreemapData($sessionStore);
		renderTreemap(data);
	}
</script>

<!---------------------------------------->
<!-- TREEMAP & LEGENDA DOM ELEMENT-------->
<!-- + div gelijkstellen aan de container die met D3 gemaakt is via bind:this -->
<!-- ------------------------------------->

<div class="sort-tabs">
	<button
		type="button"
		class="sort-tab {sortMode === 'none' ? 'active' : ''}"
		on:click={() => setSortMode('none')}
	>
		Standaard
	</button>
	<button
		type="button"
		class="sort-tab {sortMode === 'duration' ? 'active' : ''}"
		on:click={() => setSortMode('duration')}
	>
		Duur <img src={sortByDurationIcon} alt="Sort by time" />
	</button>
	<button
		type="button"
		class="sort-tab {sortMode === 'artistAmount' ? 'active' : ''}"
		on:click={() => setSortMode('artistAmount')}
	>
		Artiest <img src={sortByArtistIcon} alt="Sort by artist" />
	</button>
	<button
		type="button"
		class="sort-tab {sortMode === 'genreAmount' ? 'active' : ''}"
		on:click={() => setSortMode('genreAmount')}
	>
		Genre <img src={sortByGenreIcon} alt="Sort by genre" />
	</button>
</div>

<div class="TREEMAP" bind:this={container}></div>

<div id="tooltip" bind:this={tooltip}>
	{#if activeSlice}
		<div class="tooltip-content">
			{#if activeSlice.image}
				<img src={activeSlice.image} alt="Album Art" class="tooltip-image" />
			{/if}
			<div class="tooltip-text">
				<span>{activeSlice.artist} - {activeSlice.title}</span>
				<span class="tooltip-sub">{activeSlice.genre} | {activeSlice.duration}</span>
			</div>
		</div>
	{/if}
</div>
<div class="treemap-header">
    <label class="unknown-filter">
        <input
            type="checkbox"
            bind:checked={hideUnknownGenres}
            on:change={() => {
                const data = buildTreemapData($sessionStore);
                renderTreemap(data);
            }}
        />
        <span>Verberg nummers zonder genre (“Unknown”)</span>
    </label>
    <p class="unknown-disclaimer">
        Spotify levert helaas niet voor elk liedje een genre. Daarom kun je er hier voor kiezen om
        alle <strong>Unknown</strong>-liedjes uit de visualisatie te filteren.
    </p>
</div>
<div class="legend-container">
	{#each legendData as item}
		<div class="legend-item">
			<span class="legend-color-box" style="background-color: {item.color}"></span>
			<span class="legend-label">{item.name}</span>
		</div>
	{/each}
</div>

<style>
	.TREEMAP {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.sort-tabs {
		display: inline-flex;
		gap: 0.5rem;
		padding: 0.25rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		margin-bottom: 1rem;
	}

	.sort-tab.active img {
		filter: invert(1);
	}

	.sort-tab {
		display: flex;
		gap: 0.5em;
		border: none;
		background: transparent;
		color: #e5e5e5;
		font-size: 0.85rem;
		padding: 0.35rem 0.9rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.05s ease;
		white-space: nowrap;
	}

	.sort-tab:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.sort-tab.active {
		background: #1db954;
		color: #000;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
		font-weight: 700;
	}
	.sort-tab:active {
		transform: translateY(1px);
	}

	.legend-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px 20px;
		width: 100%;
		max-width: 1154px;
		padding: 10px 0;
	}
	.legend-item {
		display: flex;
		align-items: center;
	}
	.legend-color-box {
		width: 14px;
		height: 14px;
		margin-right: 8px;
		border: 1px solid #000000;
		border-radius: 3px;
	}

	.legend-label {
		font-weight: 800;
		color: white;
		font-size: 12px;
	}

	#tooltip {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		background: rgba(0, 0, 0, 0.9);
		color: white;
		padding: 0.5rem;
		border-radius: 0.5rem;
		font-size: 0.8rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
		z-index: 10;
	}

	.tooltip-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.tooltip-image {
		width: 48px;
		height: 48px;
		border-radius: 4px;
		object-fit: cover;
	}

	.tooltip-text {
		display: flex;
		flex-direction: column;
	}

	.tooltip-sub {
		font-size: 0.75em;
		opacity: 0.8;
	}

	.treemap-header {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-bottom: 0.75rem;
		max-width: 1154px;
	}

	.unknown-filter {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: #e5e5e5;
		font-size: 0.85rem;
		cursor: pointer;
		user-select: none;
	}

	.unknown-filter input {
		accent-color: #1db954;
		cursor: pointer;
	}

	.unknown-disclaimer {
		margin: 0;
		font-size: 0.75rem;
		color: #b3b3b3;
		max-width: 40rem;
		line-height: 1.3;
	}
</style>
