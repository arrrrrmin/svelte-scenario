<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    let containerWidth = $state(undefined);
    let radius = $state(1);
    let canvas;
    let container;
    let tooltip;

    const data = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 3,
    }));

    let hovered = null;

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        function resizeAndDraw() {
            const rect = container.getBoundingClientRect();
            const width = rect.width;
            containerWidth = width;

            const height = 500;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.scale(dpr, dpr);

            const maxR = d3.extent(data, (d) => d.r)[1];

            const xScale = d3
                .scaleLinear()
                .domain(d3.extent(data, (d) => d.x))
                .range([maxR, width - maxR]);

            const yScale = d3
                .scaleLinear()
                .domain(d3.extent(data, (d) => d.y))
                .range([20, height - 20]);

            const rScale = d3.scaleLinear().domain([320, 768]).range([1, maxR]);

            function draw() {
                ctx.clearRect(0, 0, width, height);
                radius = rScale(width);
                data.forEach((d) => {
                    ctx.beginPath();
                    ctx.arc(
                        xScale(d.x),
                        yScale(d.y),
                        hovered === d ? rScale(width) * 4 : rScale(width),
                        0,
                        Math.PI * 2,
                    );
                    ctx.fillStyle = hovered === d ? "#4d0218" : "#c70036";
                    ctx.fill();
                });
            }

            draw();

            canvas.onmousemove = (e) => {
                const rect = canvas.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;

                const found = data.find(
                    (d) => Math.hypot(xScale(d.x) - mx, yScale(d.y) - my) < d.r,
                );

                if (found !== hovered) {
                    hovered = found;
                    draw();
                }

                if (tooltip && hovered) {
                    tooltip.style.display = "block";
                    tooltip.style.left = mx + 10 + "px";
                    tooltip.style.top = my + 10 + "px";
                    tooltip.textContent = `x: ${hovered.x.toFixed(2)}, y: ${hovered.y.toFixed(2)}`;
                } else {
                    tooltip.style.display = "none";
                }
            };

            canvas.onmouseleave = () => {
                hovered = null;
                tooltip.style.display = "none";
                draw();
            };
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
    R scale: <code>{radius.toFixed(4)}</code>
</p>
<div bind:this={container} class="relative">
    <canvas bind:this={canvas} class="block rounded-lg"></canvas>
    <div
        bind:this={tooltip}
        class="absolute bg-white text-sm px-2 py-1 rounded border shadow pointer-events-none"
        style="display: none; z-index: 10;"
    ></div>
</div>
