<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import * as topojson from "topojson-client";

    let { land } = $props();

    let containerWidth = $state(undefined);
    let transformState = $state({ x: 0, y: 0, k: 1 });
    let container;
    let canvas;
    let currentTransform = d3.zoomIdentity;

    let landmap = topojson.merge(land, land.objects.land.geometries);

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        function resizeAndDraw() {
            const rect = container.getBoundingClientRect();
            const width = rect.width;
            containerWidth = width;

            const height = width;

            const projection = d3
                .geoMercator()
                .rotate([0, 0])
                .fitSize([width, height], landmap);

            const path = d3.geoPath().projection(projection);

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.scale(dpr, dpr);

            path.context(ctx);

            const zoomBehavior = d3
                .zoom()
                .scaleExtent([1, 8])
                .on("zoom", (event) => {
                    event.preventDefault();
                    const { transform } = event;
                    draw(transform);
                });

            d3.select(canvas).call(
                d3
                    .zoom()
                    .scaleExtent([1, 8])
                    .on("zoom", ({ transform }) => draw(transform)),
            );

            function draw(transform = currentTransform) {
                currentTransform = transform;
                transformState = {
                    x: transform.x,
                    y: transform.y,
                    k: transform.k,
                };
                if (transform) {
                    ctx.save();
                    ctx.clearRect(0, 0, width, height);

                    // Apply zoom/pan transform
                    ctx.translate(transform.x, transform.y);
                    ctx.scale(transform.k, transform.k);
                    ctx.clearRect(0, 0, width, height);
                }
                ctx.beginPath();

                path(landmap);
                ctx.fillStyle = "#fff";
                ctx.fill();

                ctx.strokeStyle = "#c70036";
                ctx.stroke();

                if (transform) {
                    ctx.restore();
                }
            }
            draw();
        }
        resizeAndDraw();

        // Redraw on resize
        window.addEventListener("resize", resizeAndDraw);

        return () => {
            window.removeEventListener("resize", resizeAndDraw);
        };
    });
</script>

<p>
    Container Width: <code>{containerWidth}</code> <br />
    Transform State:
    <code
        >x: {transformState.x.toFixed(2)}, y:{transformState.y.toFixed(2)}, k: {transformState.k.toFixed(
            2,
        )}</code
    >
</p>
<div bind:this={container} class="relative">
    <canvas
        bind:this={canvas}
        class="block border border-rose-700 rounded-lg"
        style="touch-action: none; cursor: grab;"
    ></canvas>
</div>
