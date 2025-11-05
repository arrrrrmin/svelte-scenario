<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { defaultTransition } from "$lib";

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

    let resizing = false;
    let startX;
    let startWidth;

    function startResize(e) {
        resizing = true;
        startX = e.clientX;
        startWidth = width;
        window.addEventListener("pointermove", onResize);
        window.addEventListener("pointerup", stopResize);
    }

    function onResize(e) {
        if (!resizing) return;
        const clampWidth = d3
            .select("div#main-container")
            .node()
            .getBoundingClientRect().width;

        let translateX = e.layerX < clampWidth ? clampWidth - e.layerX : 0;
        if (translateX > clampWidth - 320) {
            translateX = clampWidth - 320;
        }
        d3.select(container).attr("style", `margin-right: ${translateX}px`);
        d3.select("div#dragger").attr(
            "style",
            `transform: translateX(${-translateX}px); -webkit-user-select: none; touch-action: pan-y;`,
        );
        width = Math.max(320, Math.min(e.layerX, clampWidth));
    }

    function stopResize() {
        resizing = false;
        window.removeEventListener("pointermove", onResize);
        window.removeEventListener("pointerup", stopResize);
    }
</script>

<p>
    Container Width: <code>{width}</code> <br />
    R Scale: <code>{currentR}</code>
</p>

<div id="main-container" class="bg-gray-200 rounded-lg p-1 select-none">
    <div class="group not-prose relative overflow-hidden">
        <div
            bind:this={container}
            class="pb-2 @container relative overflow-auto rounded-lg bg-white outline outline-white/5 dark:bg-gray-950/50 dark:inset-ring dark:inset-ring-white/5 group-data-dragging:before:absolute group-data-dragging:before:inset-0"
        >
            <div class="pt-2" id="responsive-scales"></div>
        </div>
        <div
            class="pointer-events-none absolute inset-y-0 right-1.5 left-60 max-sm:hidden"
        >
            <div
                id="dragger"
                title="Drag to resize"
                class="pointer-events-auto absolute top-1/2 right-1 z-50 -mt-6 h-12 w-1.5 cursor-ew-resize rounded-full bg-slate-950/20 group-data-dragging:bg-slate-950/40 hover:bg-slate-950/40 dark:bg-slate-500 dark:group-data-dragging:bg-slate-300 dark:hover:bg-slate-300"
                draggable="false"
                onpointerdown={startResize}
            ></div>
        </div>
    </div>
</div>
