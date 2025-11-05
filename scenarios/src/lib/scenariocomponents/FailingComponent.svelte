<script>
    import * as d3 from "d3";

    let canvas;
    const data = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 3,
    }));

    function draw() {
        const ctx = canvas.getContext("2d"); // It will fail here already
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = 300;

        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.x))
            .range([20, width - 20]);

        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.y))
            .range([20, height - 20]);
        data.forEach((d) => {
            ctx.beginPath();
            ctx.arc(
                xScale(d.x),
                yScale(d.y),
                3, 
                0,
                Math.PI * 2,
            );
            ctx.fillStyle = hovered === d ? "#4d0218" : "#c70036";
            ctx.fill();
        });
    }

    draw();
</script>

<div>
    <canvas bind:this={canvas} class="block rounded-lg"></canvas>
</div>
