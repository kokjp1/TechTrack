<script>
    import { sessionStore } from '$lib/stores/sessionStore.js';
    import { pie, arc } from 'd3-shape';

	$: songs = $sessionStore.sessionPlayedSongs;

    function formatDuration(duration) {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } //hergebruikt uit trackinfo.svelte'
    
    /* -------------------------
    PIE CHART SETUP 
    ------------------------- */
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const pieGenerator = pie().value((d) => d.durationMs);
    const arcGenerator = arc()
        .innerRadius(0)
        .outerRadius(radius);

    $: pieData = pieGenerator(songs);

    // PIECHART KLEUREN
    const colors = [
        '#1DB954',
        '#1ed760',
        '#1aa34a',
        '#25c865',
        '#12833a',
        '#2fd77a',
        '#158443',
        '#3ee98b',
        '#b7f7d8',
        '#eafaf1'
    ];

    function getColor(index) {
        return colors[index % colors.length];
    }

    /* -------------------------
    TOOLTIP SETUP
    ------------------------- */

    let tooltipVisible = false;
	let tooltipSong = null;
    let tooltipLeft = 0;
    let tooltipTop = 0;
    // https://d3-graph-gallery.com/graph/interactivity_tooltip.html

    let container;

    function showTooltip(e, song) {
        const pieChartContainer = container.getBoundingClientRect();
		tooltipSong = song;
		tooltipVisible = true;
        tooltipLeft = e.clientX - pieChartContainer.left + 10;
        tooltipTop = e.clientY - pieChartContainer.top + 10;
    }

    function moveTooltip(e) {
        const pieChartContainer = container.getBoundingClientRect();
        tooltipLeft = e.clientX - pieChartContainer.left + 10;
        tooltipTop = e.clientY - pieChartContainer.top + 10;
    }

    function hideTooltip() {
		tooltipVisible = false;
		tooltipSong = null;
    }
</script>

<!------------------------------>
<!-- PIE CHART SVG ELEMENT -->
<!-- --------------------------->
<div bind:this={container}>
    <!-- https://svelte.dev/docs/svelte/bind -->
    <svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
            {#each pieData as slice, index}
                <path
                    d={arcGenerator(slice)}
                    fill={getColor(index)}
                    on:mouseenter={(e) => showTooltip(e, songs[index])}
                    on:mousemove={moveTooltip}
                    on:mouseleave={hideTooltip}
                    role="graphics-symbol"
                    aria-label={`${songs[index].title} — ${songs[index].durationMs} ms`}>
                    <!-- fallback native title (optioneel) -->
                     <!-- https://d3js.org/d3-shape/arc#arcs -->
                      <!-- https://d3js.org/d3-shape/pie -->
                </path>
            {/each}
        </g>
    </svg>

    <!------------------------------>
    <!-- TOOLTIP DOM ELEMENT -->
    <!-- --------------------------->
	{#if tooltipVisible && tooltipSong}
		<div class="tooltip" style={`position:absolute; left:${tooltipLeft}px; top:${tooltipTop}px;`}>
			{#if tooltipSong.image}
				<img src={tooltipSong.image} alt={tooltipSong.title} class="tooltip-image" />
			{/if}
			<div class="tooltip-text">
				<div class="tooltip-title">{tooltipSong.title}</div>
				<div class="tooltip-duration">{formatDuration(tooltipSong.durationMs)}</div>
			</div>
		</div>
	{/if}
</div>

<style>
	div:nth-of-type(1) {
		position: relative;
		display: inline-block;
	}
	path {
		stroke: #003c04;
		stroke-width: 1px;
		transition: transform 0.2s;
		scale: 0.9;
	}
	path:hover {
		opacity: 0.8;
		transform: scale(1.025);
	}

	.tooltip {
		background: rgba(0, 0, 0, 0.85);
		color: #fff;
		padding: 6px 8px;
		border-radius: 4px;
		font-size: 12px;
		pointer-events: none;
		white-space: nowrap;
		transform: translateY(-50%);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
	}
	.tooltip-image {
		width: 40px;
		height: 40px;
		object-fit: cover;
		border-radius: 4px;
		margin-right: 8px;
		flex-shrink: 0;
	}
	.tooltip-text {
		display: flex;
		flex-direction: column;
	}
	.tooltip-title {
		font-weight: 600;
		font-size: 12px;
        margin-bottom:0.5em;
	}
	.tooltip-duration {
		font-size: 11px;
		opacity: 0.9;
        margin-top:0.25em;
	}
</style>
