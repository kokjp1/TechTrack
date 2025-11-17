<script>
	import * as d3 from 'd3';
	import { sessionStore } from '$lib/stores/sessionStore.js';
	import 'd3-transition';

	let container;
	let sessionChart;
	let legendData = [];

	// TOOLTIP STATE (simpel: alleen tekst)
	let tooltip;
	let activeSlice = null;

	function formatDuration(duration) {
		const minutes = Math.floor(duration / 60000);
		const seconds = Math.floor((duration % 60000) / 1000);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

/* ------------------------------------------------
DATA / SESSION SONGS IMPORTEREN EN BRUIKBAAR MAKEN
------------------------------------------------- */

	function buildTreemapData(session) {
		const songs = session?.sessionPlayedSongs ?? [];

		return {
			name: 'root',
			children: [
				{
					name: 'Session',
					children: songs.map((song) => ({
						name: song.title || 'Unknown',
						value: song.durationMs || song.duration || 0,
						id: song.id,
						artists: song.artists,
						album: song.album,
						genre: song.genre || 'Unknown',
						durationMs: song.durationMs || song.duration || 0
					}))
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

    // standaard: NIET sorteren
    let sortMode = 'none'; 
    // 'none' | 'duration' | 'artistAmount' | 'genreAmount'

    function toggleSort() {
        // voorbeeld: cyclen tussen verschillende sorteringen
        if (sortMode === 'none') sortMode = 'duration';
        else if (sortMode === 'duration') sortMode = 'artistAmount';
        else if (sortMode === 'artistAmount') sortMode = 'genreAmount';
        else sortMode = 'none';

        const data = buildTreemapData($sessionStore);
        renderTreemap(data);
    }

	function renderTreemap(data, tile = d3.treemapDice) {
		// dice = horizontaal, slice = verticaal
		// vorige chart checken en evt. verwijderen
		if (sessionChart && sessionChart.parentNode) {
			sessionChart.parentNode.removeChild(sessionChart);
			sessionChart = null;
		}

		const width = 1154;
		const height = 554;

		const allGenres = []; // array om te gebruiken voor de visualisatie
		data.children[0]?.children?.forEach((song) => {
			const genre = song.genre || 'Unknown';
			if (!allGenres.includes(genre)) allGenres.push(genre);
		});

		// kleur-schaal op basis van genres (blijft nodig voor de treemap zelf)
		const color = d3.scaleOrdinal(allGenres, d3.schemeCategory10);
		// https://d3js.org/d3-scale-chromatic/categorical

		const songs = data.children[0]?.children ?? [];

		// telling functie aanroepen en maken van artiest voorkomendheid en genre voorkomendheid
		const artistAmount = buildArtistFrequency(songs);
		const genreAmount = buildGenreFrequency(songs);

		const root = d3
			.treemap()
			.tile(tile)
			.size([width, height])
			.padding(1)
			.round(true)(
				d3
					.hierarchy(data)
					.sum(d => 1)
					.sort((a, b) => {
						// voor zover ik weet werkt de javascript/d3 sort functie zo dat je twee elementen tegen elkaar gaat afwegen, en om dat te doen moet je wel twee objecten hebben (a & b). vervolgens handelt d3/javascript het loopen door de hele lijst zelf af.
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
							const aArtists = Array.isArray(aSong?.artists) ? aSong.artists : [aSong?.artists ?? 'Unknown'];
							const bArtists = Array.isArray(bSong?.artists) ? bSong.artists : [bSong?.artists ?? 'Unknown'];

							// neem simpelweg de eerste artiest als "hoofd"-artiest
							const aArtistName = aArtists[0]?.name ?? aArtists[0] ?? 'Unknown';
							const bArtistName = bArtists[0]?.name ?? bArtists[0] ?? 'Unknown';

							const aCount = artistAmount.get(aArtistName) || 0;
							const bCount = artistAmount.get(bArtistName) || 0;

							// eerst sorteren op frequentie (hoog -> laag)
							if (bCount !== aCount) return bCount - aCount;

							// dan alfabetisch als tie-breaker (optioneel)
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
			); // ChatGPT heeft me geholpen met de sorteerfunctie

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

		const format = d3.format(',d');
		leaf.append('title').text(
			(d) =>
				`${d.data.name} (${d.data.genre || 'Unknown genre'})\n` +
				`${d
					.ancestors()
					.reverse()
					.map((d) => d.data.name)
					.join('.')} ` +
				`\n${format(d.value)}`
		);

		const rects = leaf
			.selectAll('rect')
			.data(d => [d])
			.join(
				enter => enter
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
					.call(enter =>
						enter.transition().duration(500)
							.attr('width', (d) => d.x1 - d.x0)
							.attr('height', (d) => d.y1 - d.y0)
					),
				update => update
					.call(update =>
						update.transition().duration(500)
							.attr('width', (d) => d.x1 - d.x0)
							.attr('height', (d) => d.y1 - d.y0)
					),
				exit => exit
					.call(exit =>
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
			.append('text')
			.attr('clip-path', (d) => `url(#${d.clipUid})`)
			.selectAll('tspan')
			.data((d) => {
				const parts = d.data.name.split(/(?=[A-Z][a-z])|\s+/g);
				const label = `${d.data.genre || 'Unknown'}`;
				return parts.concat(label);
			})
			.join('tspan')
			.attr('x', 3)
			.attr('y', (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
			.attr('fill-opacity', (d, i, nodes) => (i === nodes.length - 1 ? 0.7 : null))
			.text((d) => d);

	/* -----------------------------------------------------------------
    TOOLTIP CODE | https://codepen.io/dandevri/pen/azdrEQb?editors=1010
    ----------------------------------------------------------------- */
		rects
			.on('mouseover touchstart', (event, d) => {
				// data meegeven die je in de tooltip wilt
				activeSlice = {
					artist: d.data.artists,
					title: d.data.name,
					genre: d.data.genre || 'Unknown',
					duration: formatDuration(d.data.durationMs || 0)
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

	$: if (container) {
		const data = buildTreemapData($sessionStore);
		renderTreemap(data);
	}
</script>

<!---------------------------------------->
<!-- TREEMAP & LEGENDA DOM ELEMENT-------->
<!-- + div gelijkstellen aan de container die met D3 gemaakt is via bind:this -->
<!-- ------------------------------------->

<button on:click={toggleSort}>
    {#if sortMode === 'none'}
        Sorteer: (geen)
    {:else if sortMode === 'duration'}
        Sorteer: duur (lang → kort)
    {:else if sortMode === 'artistAmount'}
        Sorteer: artiest (meest voorkomend → minst)
    {:else if sortMode === 'genreAmount'}
        Sorteer: genre (meest voorkomend → minst)
    {/if}
</button>

<div bind:this={container} style="width: 100%; height: 100%;"></div>

<div id="tooltip" bind:this={tooltip}>
	{#if activeSlice}
		<span>{activeSlice.artist} - {activeSlice.title} | {activeSlice.genre} | {activeSlice.duration}</span>
	{/if}
</div>

<div class="legend-container">
	{#each legendData as item}
		<div class="legend-item">
			<span class="legend-color-box" style="background-color: {item.color}"></span>
			<span class="legend-label">{item.name}</span>
		</div>
	{/each}
</div>

<p>
	Wow! Je hebt in totaal "aantal liedjes" geluisterd sinds "tijdstip". Je sessie bestond
	voornamelijk uit: "genre". Maarliefst "deel/geheel" liedjes waren "genre". Je tweede populairste
	genre was "genre" met "deel/geheel"
</p>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
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
		background: rgba(0, 0, 0, 0.85);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.8rem;
	}
</style>
