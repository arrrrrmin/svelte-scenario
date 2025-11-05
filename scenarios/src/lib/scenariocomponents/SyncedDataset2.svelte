<script>
    import * as d3 from "d3";
    import { stocksData } from "$lib/data.svelte";
    import { onMount } from "svelte";
    import { defaultTransition } from "$lib";
    import { compile } from "svelte/compiler";

    let { syncedHover = $bindable() } = $props();

    let height = $state(undefined);
    let width = $state(undefined);

    let container;
    let svg;
    let localData;
    let arc;
    let pie;
    const color = d3.scaleOrdinal(d3.schemeObservable10);
    let x;
    let y;
    let r;
    const margins = { left: 40, bottom: 20 };
    const c = {
        APPL: "fill-rose-900",
        AMZN: "fill-rose-800",
        GOOG: "fill-rose-700",
        IBM: "fill-rose-600",
        MSFT: "fill-rose-500",
    };

    onMount(() => {
        if (stocksData.data) {
            console.log("Data arrived");
        } else {
            console.log("Data absent");
        }
    });

    $effect(() => {
        // $inspect(stocksData.data);
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = 250;
        if (syncedHover) {
            localData = d3
                .groups(stocksData.data, (d) => d.company)
                .map(([comp, data], i) => ({
                    company: comp,
                    data: syncedHover[i].data,
                    volume: parseInt(syncedHover[i].data.Volume),
                    days:
                        (syncedHover[i].data.Date - data[0].Date) /
                        (1000 * 60 * 60 * 24),
                    diff: syncedHover[i].data.Close - data[0].Close,
                }));
            const [datemin, datemax] = d3.extent(
                stocksData.data,
                (d) => d.Date,
            );
            x = d3.scaleBand(
                d3.groups(localData, (d) => d.company).map((grp) => grp[0]),
                [margins.left + 100, width],
            );
            r = d3.scaleLinear(
                [0, d3.max(localData, (d) => d.volume)],
                [2, 50],
            );

            const line = d3
                .line()
                .x((d) => d[0])
                .y((d) => d[1]);

            d3.select(svg).attr("viewBox", [0, 0, width, height]);
            const g = d3.select(svg).select("g#main");

            g.selectAll("circle")
                .data(localData)
                .join("circle")
                .attr("id", ({ company }) => company)
                .attr("cx", ({ company }) => x(company))
                .transition(defaultTransition)
                .attr("cy", (d) => height / 2)
                .attr("class", ({ company }) => c[company])
                .attr("r", (d) => r(d.volume));

            g.selectAll("text#volume")
                .data(localData)
                .join("text")
                .attr("id", "volume")
                .attr("x", ({ company }) => x(company))
                .attr("y", (d) => height / 2 - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text((d) => `${(d.data.Volume / 1000 / 1000).toFixed(2)} kk`);

            g.selectAll("text#compnames")
                .data(localData)
                .join("text")
                .attr("id", "compnames")
                .attr("x", ({ company }) => x(company))
                .attr("y", (d) => height / 2 - 55)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("font-weight", "bold")
                .text((d) => d.company);

            const titleDate = localData[0].data.Date;
            g.selectAll("text#title")
                .data([
                    `Volume of stocks at ${titleDate.getFullYear()}/${titleDate.getMonth() + 1}/${titleDate.getDay()}`,
                ])
                .join("text")
                .attr("id", "title")
                .attr("x", width / 2)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("font-size", 20)
                .text((d) => d);
        }
    });
</script>

<div bind:this={container}>
    <svg bind:this={svg}>
        <g id="main"></g>
        <g id="y"></g>
    </svg>
</div>
