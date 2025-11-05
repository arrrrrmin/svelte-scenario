<script>
    import { tagCurrent } from "$lib/tag.svelte.js";
    import PageHead from "$lib/uicomponents/PageHead.svelte";

    import DrawToCanvas from "$lib/scenariocomponents/DrawToCanvas.svelte";
    import ExpensiveTransition from "$lib/scenariocomponents/ExpensiveTransition.svelte";
    import FailingComponent from "$lib/scenariocomponents/FailingComponent.svelte";
    import GeoOnCanvas from "$lib/scenariocomponents/GeoOnCanvas.svelte";
    import ResponsiveScales from "$lib/scenariocomponents/ResponsiveScales.svelte";
    import Question from "$lib/uicomponents/Question.svelte";
    import { tags } from "$lib";
    import SyncedDataset1 from "$lib/scenariocomponents/SyncedDataset1.svelte";
    import SyncedDataset2 from "$lib/scenariocomponents/SyncedDataset2.svelte";
    import { onMount } from "svelte";
    import { stocksData } from "$lib/data.svelte.js";
    import NoFullRedraws from "$lib/scenariocomponents/NoFullRedraws.svelte";

    let { data } = $props();

    let syncedHover = $state(undefined);

    onMount(() => {
        if (data.stocks) {
            stocksData.data = data.stocks;
        }
    });

    $effect(() => {});
</script>

<h1 class="text-2xl font-bold py-8">
    Welcome to <em>Svelte Scenarios</em>
</h1>
<p>
    I'm career changer. I used to do Data Engineering and ML a lot. But I'm
    increasingly annoyed by the way AI is beeing developed (larger model =
    awesome). This is wrong in many ways and I don't want to be part of this
    trend. This is why I want to change careers, but to do so I really need to
    work on me and learn things. This site is my slow attempt of doing so. This
    project is a challenge to myself, where I try to solve scenarios that I
    haven't come across or that might have multiple solutions. Sadly I have no
    better idea than to simply write everything in a Q&A-ish way. This project
    is heavily focused on data visualisations (<a
        target="_blank"
        class=""
        href="https://d3js.org">D3js</a
    >) the use of
    <a href="https://svelte.dev" target="_blank" class="">Svelte 5</a>. So all
    scenarios will be surrounding this context.
</p>
<p class="pb-2 font-semibold">
    Disclaimer: The questions are sampled from a lot of ChatGPT responses. I
    sampled the questions that seemed reasonable and also a bit challenging to
    me. Also, I'm learning so don't rely on my assumptions or knowledge, it's
    limited. If you want to reach out to me let's discuss on <a
        href="https://chaos.social/@arrrrrmin"
        target="_blank">Mastodon</a
    >
    or
    <a href="https://bsky.app/profile/arrrrrmin.dev" target="_blank">Bluesky</a
    >.
</p>

<div class="pt-12">
    <PageHead />
</div>

<!---->
{#snippet q5()}
    <h2>
        How would I implement a responsive SVG visualization in Svelte using D3
        scales?
    </h2>
{/snippet}
{#snippet a5()}
    <p>
        So this question tells us we have an <code>SVG</code> and we use D3
        scales. So we may accept some <code>$state(wsize)</code> which could be
        a containers
        <code>{".node().getBoundingClientRect().width"}</code>. We can pass it
        down to a visualization component, that holds a scale variable. We can
        build a js function that internally sets different scales for different
        breakpoints
        <code
            ><a href="https://d3js.org/d3-scale" target="_blank">ranges()</a
            ></code
        >. Here is a simple example with circles
    </p>
    <!--Illustrative component-->
    <ResponsiveScales />
{/snippet}
<Question q={q5} a={a5} qtags={[tags.svelte, tags.d3]} />

<!---->
{#snippet q6()}
    <h2>
        How does the enter-update-exit pattern in D3 maps to Svelte's reactivity
        model?
    </h2>
{/snippet}
{#snippet a6()}
    <p>
        Both depends on data. D3 prefers direct DOM manipulations, while svelte
        does it <em>implicitly</em> (i believe). In Svelte we change data
        depending on <code>{"$state(...)"}</code>s, while in D3 we act uppon
        data changes more manually, since we define the behaviour of how element
        <code>enter</code>, <code>update</code> and <code>exit</code>. In Svelte
        we can use transitions like <code>{"in:slide={...}"}</code> like we did
        it for this site's <code>{"<Question ... />"}</code> components. In D3 we
        can do more. We can even chain transitions on different updates of a selection
        to build a sequence of animations. I guess it's important to split both sides
        and make sure some elements are only handled by D3 while others are handled
        by Svelte.
    </p>
{/snippet}
<Question q={q6} a={a6} qtags={[tags.svelte, tags.d3]} />

<!---->
{#snippet q14()}
    <h2>
        How would I design multiple charts, that depend on the same dataset?
    </h2>
{/snippet}
{#snippet a14()}
    <p>
        Depending on the same dataset, means we can store the data in a state. I
        want to approach it from a SSR view. We can load it in a <code
            >+page.server.js</code
        >
        file. We most likely await the data with some fetch function. After we receive
        the data, we can forward the data to a <code>{"$state()"}</code> and
        import it as we need it in different vis components. The svelte docs
        refer to this behaviour explicitly in their section about
        <a
            href="https://svelte.dev/docs/svelte/stores#When-to-use-stores"
            target="_blank">stores</a
        >. Like this we can seperate the components from each other, while
        keeping them in sync. When the dataset becomes larger we need to think
        about caching strategies like
        <code>IndexDB</code> or something else. But it's not in scope of this question.
    </p>
    <!--Illstrative component-->
    <SyncedDataset1 bind:syncedHover />
    <SyncedDataset2 bind:syncedHover />
{/snippet}
<Question q={q14} a={a14} qtags={[tags.svelte, tags.vis]} />

<!---->
{#snippet q9()}
    <h2>
        What is your approach to server-side rendering or prerendering in a
        data-heavy Svelte app (e.g., for SEO or fast first paint)?
    </h2>
{/snippet}
{#snippet a9()}
    <p>
        With server-side rendering we prepare the data on the server and deliver
        a full html page at best, which is always good for SEO. But when this
        delays a fast first paint we need to deliver the SEO relevant data and
        move data fetching in SvelteKit to a <code>+page.js</code>. This will
        cause the client to load the data. The first pains is fast, but causes
        the client to load the data.
    </p>
    <p>
        In terms of SEO I <em>think</em> it's a good idea to have all the textual,
        preview image and other metadata relevant to the article at hand as fast
        as possible. I'm not an SEO expert to be honest and really should think more
        about this.
    </p>
{/snippet}
<Question q={q9} a={a9} qtags={[tags.svelte]} />

<!---->
{#snippet q10()}
    <h2>
        How would I integrate geographic data (TopoJSON) and control zoom/pan
        performance?
    </h2>
{/snippet}
{#snippet a10()}
    <p>
        To build geographical maps and visualise data on top of it, we always
        need a few functions like a <a
            href="https://d3js.org/d3-geo/projection"
            target="_blank">projection</a
        >
        to interpret the TopoJSON features and geometries. When the data is already
        projected, we don't need a projection. Also we need a path generator, that
        draws our outlines. Lastly we need a helpers that binds the users zoom event
        to the <code>{"<svg>"}</code> or
        <code>{"<canvas>"}</code>. The transform event consists of
        <em>movement</em> in x, y and k directions, where k is the zoom state. We
        can use it to declare data grouping for dense map data.
    </p>
    <p>
        We can also reorganise data in a database like
        <a href="https://duckdb.org" target="_blank" class="">DuckDB</a>
        or
        <a href="https://postgis.net" target="_blank" class="">PostGIS</a>.
        These are also handy for geographical data preperation for example:
        <em
            >"Include all the captials for each country as feature, where the
            capital is inside a defined bounding box"</em
        >. Very handy functionality to have. Aside from all the data wrangling
        I'm feeling imposter syndrom piling up and needed to know how to draw
        maps on a canvas:
    </p>
    <!--Illustrative component -->
    <GeoOnCanvas land={data.land} />
{/snippet}
<Question q={q10} a={a10} qtags={[tags.d3, tags.vis]} />

<!---->
{#snippet q12()}
    <h2>
        How do I handle reactive data updates in a Svelte component that renders
        a D3 chart without causing full redraws?
    </h2>
{/snippet}
{#snippet a12()}
    <p>
        We can only redraw the data we need to update. D3's lifecycle pattern
        consists of <em>enter</em>, <em>update</em> and
        <em>exit</em>. So when we update the data we can use Svelte's
        <code>$effect</code> rune and update the data that is different. In D3
        we use something like
        <code>{"d3.select(...).data(...).join()..."}</code>.
    </p>
    <NoFullRedraws />
    <p class="pt-2">
        In this example we count the number of <code>{"enter => {...}"}</code>
        actions performed, as well as the number of
        <code>{"update => {...}"}</code> actions that a single
        <code>{"$effect"}</code>-trigger performs. Like this we can proof that
        it's not redrawing the chart, but updates, depending on the data, which
        is in turn a <code>$state</code>, so the reactive behaviour is
        triggered. If you wonder why it's incrementing by 8, this is because the
        update actions for both height and width are counted. A full redraw
        would include 16 actions per trigger, namely for <code>x</code>,
        <code>y</code>,
        <code>width</code>, <code>height</code>.
    </p>
{/snippet}
<Question q={q12} a={a12} qtags={[tags.svelte, tags.d3]} />

<!---->
{#snippet q13()}
    <h2>
        How do I share global state (e.g., filters, selected regions) across
        multiple Svelte visualization components.
    </h2>
{/snippet}
{#snippet a13()}
    <p>
        Since Svelte 5 <code>{"$state(...)"}</code>s are importable and we can
        simply use it like a store. I'll do a data filtering example for this
        question. It's a todo.
    </p>
{/snippet}
<Question q={q13} a={a13} qtags={[tags.comp]} />

<!---->
{#snippet q15()}
    <h2>
        When rendering thousands of SVG elements, what strategies improve frame
        rate and interaction latency?
    </h2>
{/snippet}
{#snippet a15()}
    <p>
        This is a simple call for <code>{"<canvas>"}</code>. It draws much
        faster, it's not as simple to add interaction (at least imho), bit it's
        really fast, also with interactions. The tradeoffs between SVG and
        Canvas stemms from the fact we add DOM elements in the SVG, while for
        the canvas we draw things directly on the canvas and when data updates
        we need to recalculate, but since it's so fast the redraw is absolutly
        worth it. With complex interactions I
        <em>imagine</em> we should work with dummy elements, that are empty, so we
        can trigger things on them. In my mind this could be a good strategy to not
        do to many hit-tests on the canvas.
    </p>
    <p>Todo: make a chart that uses dummy elements with a canvas...</p>
{/snippet}
<Question q={q15} a={a15} qtags={[tags.vis, tags.perf]} />

{#snippet q4()}
    <h2>
        How do I test visual components—unit tests, regression tests, or visual
        diffing?
    </h2>
{/snippet}
{#snippet a4()}
    <p>
        There are mulitple tools to solve the different testing scenarios. For
        unit-tests we can use
        <a href="https://svelte.dev/docs/cli/vitest" target="_blank" class=""
            >Vitest</a
        >. For component test
        <a href="https://svelte.dev/docs/cli/vitest" target="_blank" class=""
            >Storybook</a
        > plays a story (test scenario), where we events and checks to see if the
        interactions work as expected. For end-to-end tests are used to test for
        the user perspective. Playwright, Cypress and NightwatchJS can help for these
        types of tests.
    </p>
    <p>
        To be honest I have no experience with testing frontend code. Haven't
        got so far yet. In Python this is something different, here I'm used to
        use tests, just so I can feel a little more safe when I haven't touched
        a repo for a while. Also it's super handy to handle <em>real world</em> data,
        where I need to clean data. In test it's pretty handy to build some helpers
        that show edge cases in the data, so I can update the cleaning code. This
        becomes handy when data grows over time.
    </p>
{/snippet}
<Question q={q4} a={a4} qtags={[tags.svelte]} />

<style lang="postcss">
    @reference "tailwindcss/theme";
    h2 {
        @apply pb-1 text-xl font-semibold;
    }
    p {
        @apply pb-2;
    }
    a {
        @apply text-rose-700 underline hover:text-rose-900;
    }
    code {
        @apply px-1 py-0.5 bg-gray-200 rounded-xs;
    }
</style>
