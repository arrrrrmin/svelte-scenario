<script>
    import { onMount, onDestroy } from "svelte";
    import * as d3 from "d3";

    const n = 1000;
    const height = 600;
    let svg;
    let loopId = null;
    let width = 800; // fallback for SSR

    const data = Array.from({ length: n }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
    }));

    const raf = (cb) =>
        typeof window !== "undefined" ? window.requestAnimationFrame(cb) : null;
    const caf = (id) =>
        typeof window !== "undefined" && id != null
            ? window.cancelAnimationFrame(id)
            : null;

    let circles;

    function frame() {
        for (const d of data) {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0 || d.x > width) d.vx *= -1;
            if (d.y < 0 || d.y > height) d.vy *= -1;
        }
        circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        loopId = raf(frame);
    }

    function start() {
        caf(loopId);
        frame();
    }

    onMount(() => {
        circles = d3
            .select(svg)
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", 3)
            .attr("fill", "steelblue");

        start();
    });

    $effect(() => {
        if (!svg) return;
        caf(loopId);

        // schedule resize adjustment after DOM stabilizes
        raf(() => {
            for (const d of data) d.x = Math.min(Math.max(d.x, 0), width);
            circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
            start();
        });
    });

    onDestroy(() => caf(loopId));
</script>

<svg bind:this={svg} {width} {height} style="display:block;width:100%"></svg>
