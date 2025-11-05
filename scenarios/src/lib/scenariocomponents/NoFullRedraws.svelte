<script>
    import { loadD3FlareJson } from "$lib/loaders";
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { defaultTransition } from "$lib";

    function generateData(categories, n) {
        return categories.map((categories) => ({
            category: categories[Math.floor(Math.random() * categories.length)],
            value: d3.sum(
                Array.from({ length: n }, () => Math.random().toFixed(2)),
            ),
        }));
    }

    const categories = ["A", "B", "C", "D"];
    const c = [
        "fill-rose-900",
        "fill-rose-800",
        "fill-rose-700",
        "fill-rose-600",
    ];
    const num = 20;
    let data = $state(generateData(categories, num));
    let width = $state(undefined);
    let height = $derived(width / 2);

    // svelte-ignore non_reactive_update
    let actions = { enter: 0, update: 0 };

    let container;
    let svg;
    let x;
    let y;
    let g;

    onMount(() => {
        data = generateData(categories, num);
        const rect = container.getBoundingClientRect();
        width = rect.width;

        x = d3.scaleBand(categories, [0, width]).padding(0.2);
        y = d3.scaleLinear([0, 20], [height, 0]);

        d3.select(svg).attr("viewBox", [0, 0, width, height]);
        g = d3.select(svg).append("g").attr("id", "main");

        g.selectAll("rect#r")
            .data(data)
            .join("rect")
            .attr("id", "r")
            .attr("x", (d) => trackD3Actions("enter", x(d.category)))
            .attr("y", (d) => trackD3Actions("enter", y(d.value)))
            .attr("class", (d, i) => c[i])
            .attr("rx", 5)
            .attr("width", (d) => trackD3Actions("enter", x.bandwidth()))
            .attr("height", (d) => trackD3Actions("enter", y(0) - y(d.value)));
    });

    function trackD3Actions(action, rv) {
        if (action == "enter") {
            actions.enter += 1;
        } else {
            actions.update += 1;
        }
        return rv;
    }

    $effect(() => {
        if (data) {
            d3.select(svg).attr("viewBox", [0, 0, width, height]);
            g.selectAll("rect#r")
                .data(data)
                .join(
                    (enter) => {
                        enter
                            .append("rect")
                            .attr("id", "r")
                            .attr("x", (d) =>
                                trackD3Actions("enter", x(d.category)),
                            )
                            .attr("width", (d) =>
                                trackD3Actions("enter", x.bandwidth()),
                            )
                            .transition()
                            .duration(400)
                            .attr("y", (d) =>
                                trackD3Actions("enter", y(d.value)),
                            )
                            .attr("height", (d) =>
                                trackD3Actions("enter", y(0) - y(d.value)),
                            );
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(defaultTransition)
                            .attr("y", (d) =>
                                trackD3Actions("update", y(d.value)),
                            )
                            .attr("height", (d) =>
                                trackD3Actions("update", y(0) - y(d.value)),
                            );
                    },
                    (exit) => {
                        exit.transition(defaultTransition).remove();
                    },
                );

            d3.select("code#action-enter").text(actions.enter);
            d3.select("code#action-update").text(actions.update);
        }
    });

    function update() {
        const updateCat =
            categories[Math.floor(Math.random() * categories.length)];
        const newValue = d3.sum(
            Array.from({ length: num }, () => (Math.random() * 1).toFixed(2)),
        );
        const updateIndex = data.findIndex((d) => d.category === updateCat);
        data[updateIndex] = { category: updateCat, value: newValue };
    }
</script>

<p>
    Number of D3 enter actions: <code id="action-enter"></code>
</p>
<p>
    Number of D3 update actions: <code id="action-update"></code>
</p>
<button onclick={update} class="border rounded-md p-1">Update</button>
<div bind:this={container} class="pt-2">
    <svg bind:this={svg}></svg>
</div>
