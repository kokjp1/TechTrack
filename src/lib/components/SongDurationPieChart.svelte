<script>
    import { sessionStore } from '$lib/stores/sessionStore.js';
    import { pie, arc } from 'd3-shape';
    import { select } from 'd3-selection';
    import { scaleOrdinal } from 'd3-scale';
    import 'd3-transition';
    import { onMount } from 'svelte';

    $: songs = $sessionStore.sessionPlayedSongs;

    function formatDuration(duration) {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const width = 300;
    const height = 300;
    const margin = 0;
    const radius = Math.min(width, height) / 2 - margin;

    const color = scaleOrdinal([
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
    ]);

    let container;
    let tooltip;
    let activeSlice = null; // { title, durationMs }

    onMount(() => {
        const pieChart = select(container);

        const svg = pieChart
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pieGenerator = pie().value((durationData) => durationData.durationMs);
        const sliceGenerator = arc().innerRadius(0).outerRadius(radius);

        const paths = svg
            .selectAll('path.slice')
            .data(pieGenerator(songs))
            .join('path')
            .attr('class', 'slice')
            .attr('d', sliceGenerator)
            .attr('fill', (d, i) => color(i))
            .attr('stroke', '#003c04')
            .style('stroke-width', '1px')
            .style('opacity', 0.9);

        // native title
        paths
            .append('title')
            .text((d) => `${d.data.title} — ${formatDuration(d.data.durationMs)}`);

        // TOOLTIP EVENTS: alleen positie & state via d3, geen tekst
        paths
            .on('mouseover touchstart', (event, d) => {
                activeSlice = d.data; // Svelte zet tekst in HTML
                select(tooltip)
                    .transition()
                    .duration(175)
                    .style('opacity', 1);
            })
            .on('mousemove', (event) => {
                select(tooltip)
                    .style('left', event.pageX + 15 + 'px')
                    .style('top', event.pageY + 15 + 'px');
            })
            .on('mouseout', () => {
                activeSlice = null;
                select(tooltip).style('opacity', 0);
            });

        select('body').on('touchend', () => {
            activeSlice = null;
            select(tooltip).style('opacity', 0);
        });
    });
</script>

<div bind:this={container}></div>

<div id="tooltip" bind:this={tooltip}>
    {#if activeSlice}
        <span>{activeSlice.title}: {formatDuration(activeSlice.durationMs)}</span>
    {/if}
</div>

<style>
    div:nth-of-type(1) {
        position: relative;
        display: inline-block;
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
