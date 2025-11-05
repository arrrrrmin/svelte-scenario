<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { defaultTransition } from "$lib";
    import Resizer from "$lib/uicomponents/Resizer.svelte";

    let width = $state(undefined);
    let height = 400;
    let container;
    let x;
    let y;

    const margins = { top: 20, right: 40, bottom: 30, left: 40 };
    const breakpoints = {
        medium: [1280, [6, 24]],
        small: [768, [4, 16]],
        tiny: [640, [2, 8]],
        xs: [480, [1, 6]],
    };

    function generateData(n = 500) {
        return Array.from({ length: n }, (_, i) => ({
            x: i,
            y: Math.round(Math.random() * 100),
            z: Math.round(Math.random() * 25),
        }));
    }

    let randData = $state(generateData());
    let currentR = $state([0, 0]);

    function getRadiusScale(breakpoints, w) {
        let result = [1, 6];
        if (w >= breakpoints.xs[0]) result = breakpoints.xs[1];
        if (w >= breakpoints.tiny[0]) result = breakpoints.tiny[1];
        if (w >= breakpoints.small[0]) result = breakpoints.small[1];
        if (w >= breakpoints.medium[0]) result = breakpoints.medium[1];
        currentR = result;
        return result;
    }

    function getWidthFromContainer() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
    }

    onMount(() => {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        const padding = 1.5;

        x = d3
            .scaleLinear()
            .domain(d3.extent(randData, (d) => d.x))
            .range([margins.left, width - margins.right]);

        y = d3
            .scaleLinear()
            .domain(d3.extent(randData, (d) => d.y))
            .range([height - margins.bottom, margins.top]);

        const r = d3
            .scaleLinear()
            .domain(d3.extent(randData, (d) => d.y))
            .range(getRadiusScale(breakpoints, width));

        const svg = d3
            .select("div#responsive-scales")
            .append("svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .attr("id", "x")
            .attr("transform", `translate(0,${height - margins.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        svg.append("g")
            .attr("id", "y")
            .attr("transform", `translate(${margins.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0));

        svg.append("g")
            .selectAll()
            .data(randData)
            .join("circle")
            .attr("class", "fill-rose-700")
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", (d) => r(d.z));

        container.addEventListener("resize", (event) =>
            getWidthFromContainer(),
        );
    });

    function update() {
        const r = d3
            .scaleLinear()
            .domain(d3.extent(randData, (d) => d.y))
            .range(getRadiusScale(breakpoints, width));

        x.range([margins.left, width - margins.right]);
        y.range([height - margins.bottom, margins.top]);

        d3.select("g#x")
            .attr("transform", `translate(0,${height - margins.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        d3.select("g#y")
            .attr("transform", `translate(${margins.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0));

        d3.selectAll("circle")
            .data(randData)
            .join("circle")
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", (d) => r(d.z));

        const svg = d3
            .select("div#responsive-scales svg")
            .attr("viewBox", [0, 0, width, height]);
    }

    $effect(() => {
        update();
    });
</script>

<p>
    Container Width: <code>{width}</code> <br />
    R Scale: <code>{currentR}</code>
</p>

<Resizer bind:width>
    <div
        bind:this={container}
        class="pb-2 @container relative overflow-auto rounded-md bg-white"
    >
        <div class="pt-2" id="responsive-scales"></div>
    </div>
</Resizer>
