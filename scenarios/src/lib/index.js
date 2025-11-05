export const config = {
    domain: "https://svelte-scenarios.arrrrrmin.dev",
    title: "Svelte scenarios",
    description: "A site to intensively learn about challenging scenarios in Svelte + D3js, by taking them apart.",
    preview: "",
    buildwith: [
        { href: "https://svelte.dev/", title: "SvelteKit" },
        { href: "https://tailwindcss.com/", title: "Tailwind" },
        { href: "https://d3js.org/", title: "D3" }
    ]
}

export const tags = { all: "All", svelte: "Svelte", comp: "Components", d3: "D3", vis: "Visualisation", perf: "Performance" };
export const defaultTransition = { duration: 150, axis: "y" };