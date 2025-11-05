<script>
    import * as d3 from "d3";

    let { children, width = $bindable() } = $props();

    let container;
    let dragger;
    let resizing = false;
    let startX;
    let startWidth;
    let minWidth = 250;

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
        if (translateX > clampWidth - minWidth) {
            translateX = clampWidth - minWidth;
        }
        d3.select(container).attr("style", `margin-right: ${translateX}px`);
        d3.select(dragger).attr(
            "style",
            `transform: translateX(${-translateX}px); -webkit-user-select: none; touch-action: pan-y;`,
        );
        width = Math.max(minWidth, Math.min(e.layerX, clampWidth));
    }

    function stopResize() {
        resizing = false;
        window.removeEventListener("pointermove", onResize);
        window.removeEventListener("pointerup", stopResize);
    }
</script>

<div id="main-container" class="bg-gray-200 rounded-md p-1 select-none">
    <div class="group not-prose relative overflow-hidden">
        <div bind:this={container} class="bg-white rounded-md">
            {@render children()}
        </div>
        <div class="pointer-events-none absolute inset-y-0 right-1 left-60">
            <div
                bind:this={dragger}
                title="Drag to resize"
                class="pointer-events-auto absolute top-1/2 right-1 z-50 -mt-6 h-12 w-1.5 cursor-ew-resize rounded-full bg-slate-950/20 group-data-dragging:bg-slate-950/40 hover:bg-slate-950/40"
                draggable="false"
                onpointerdown={startResize}
            ></div>
        </div>
    </div>
</div>
