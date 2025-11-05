<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    import { stocksData } from "$lib/data.svelte";

    let { syncedHover = $bindable() } = $props();

    let height = $state(undefined);
    let width = $state(undefined);

    let container;
    let svg;
    let root;
    let x;
    let y;
    const margins = { left: 40, bottom: 20 };
    const c = {
        APPL: "stroke-rose-900",
        AMZN: "stroke-rose-800",
        GOOG: "stroke-rose-700",
        IBM: "stroke-rose-600",
        MSFT: "stroke-rose-500",
    };

    onMount(() => {});

    $effect(() => {
        // $inspect(stocksData.data);
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = 350;
        if (stocksData.data) {
            x = d3.scaleUtc(
                d3.extent(stocksData.data, (d) => d.Date),
                [margins.left, width],
            );
            y = d3.scaleLinear(
                d3.extent(stocksData.data, (d) => d.Close),
                [height - margins.bottom, margins.bottom],
            );
            const line = d3
                .line()
                .x((d) => x(d.Date))
                .y((d) => y(d.Close));

            const dataGroups = d3.groups(stocksData.data, (d) => d.company);
            const bisectFn = d3.bisector((d) => d.Date).left;

            d3.select(svg).attr("viewBox", [0, 0, width, height]);
            const g = d3.select("g#main");
            const gx = d3
                .select("g#x")
                .attr("transform", `translate(0, ${height - margins.bottom})`)
                .call(d3.axisBottom(x));
            const gy = d3
                .select("g#y")
                .attr("transform", `translate(${margins.left}, 0)`)
                .call(d3.axisLeft(y));

            gx.selectAll("text#labelgx")
                .data(["Date →"])
                .join("text")
                .attr("id", "labelgx")
                .attr("x", width)
                .attr("y", 20)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text((d) => d);

            gy.selectAll("text#labelgy")
                .data(["↑ Close"])
                .join("text")
                .attr("id", "labelgy")
                .attr("x", 0)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text((d) => d);

            g.selectAll("g")
                .data(dataGroups)
                .join("g")
                .attr("id", ([comp, data]) => comp)
                .selectAll("path")
                .data(([co, d]) => [[co, d]])
                .join("path")
                .attr("d", ([co, d]) => line(d))
                .attr("class", ([co, d]) => `fill-none ${c[co]}`);

            const rule = d3.select("g#rule line");

            function setSyncedHover(hoveredDate) {
                let interactionData;
                if (!hoveredDate) {
                    hoveredDate = x.invert(0);
                }
                interactionData = dataGroups.map(([comp, data]) => {
                    const i = bisectFn(data, hoveredDate, 1);
                    return { company: comp, data: data[i] };
                });
                syncedHover = interactionData;
                return interactionData;
            }

            let interactionData = setSyncedHover();

            const labels = g
                .selectAll("text#compnames")
                .data(interactionData)
                .join("text")
                .attr("id", "compnames")
                .attr("x", ({ company, data }) => x(data.Date))
                .attr("y", ({ company, data }) => y(data.Close))
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("font-weight", "bold")
                .text(({ company, data }) => company);

            d3.select(svg).on("mousemove touchmove", function (event) {
                const xPosition = x.invert(d3.pointer(event, this)[0]);
                const xDate = new Date(
                    `${xPosition.toISOString().slice(0, 10)}T00:00:00Z`,
                );
                rule.attr("x1", x(xPosition))
                    .attr("x2", x(xPosition))
                    .attr("y1", height)
                    .attr("y2", 0)
                    .attr("class", "stroke-gray-300");

                interactionData = setSyncedHover(xDate);

                labels
                    .data(interactionData)
                    .join("text")
                    .attr("id", "compnames")
                    .attr("x", ({ company, data }) => x(data.Date))
                    .attr("y", ({ company, data }) => y(data.Close))
                    .attr("text-anchor", "middle")
                    .attr("fill", "black")
                    .attr("font-weight", "bold")
                    .text(({ company, data }) => company);
                //d3.event.preventDefault();
            });
        }
    });
</script>

<div bind:this={container}>
    <svg bind:this={svg} class="block">
        <g id="main"></g>
        <g id="y"></g>
        <g id="x"></g>
        <g id="rule"><line></line></g>
    </svg>
</div>
