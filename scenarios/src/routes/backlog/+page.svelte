<script>
    import ExpensiveTransition from "$lib/scenariocomponents/ExpensiveTransition.svelte";
    import Question from "$lib/uicomponents/Question.svelte";
</script>

<!---->
{#snippet q8()}
    <h2>
        How do you debug a performance issue where a Svelte+D3 visualization
        lags when data updates rapidly?
    </h2>
{/snippet}
{#snippet a8()}
    <p>
        The performance tab is good place to start. Maybe there are things to
        see right away. But I'd <em>guess</em> that one would first try to leave
        the data as is and make no updates. To see how the initial render behaves.
        Next thing is to look for the transition is D3 and see if there's a special
        transition that takes long.
    </p>
    <p>
        When lags persist maybe there are to many elements and one has to draw
        to canvas. But this also has a draw back: Unlike SVG, canvas does not
        track elements, since there are no elements like <code>{"<rect>"}</code>
        or <code>{"<g>"}</code>. So we need to redraw everything, should the
        data change. But it does not mean we have no interactions. We can build
        hit tests to see which part of the canvas is beeing interacted with and
        handle this with the data we haves.
    </p>
    <!--Illustrative component -->
    <DrawToCanvas />

    <p>
        Compared to the other approach we listen to the size of the container,
        instead of <code>window.innerWidth</code>. So it only scales when the
        <code>canvas</code> actually shrinks.
    </p>
    <p>
        To be honest I didn't work with <code>canvas</code> at all. So this will
        most likly disqualify me, pretty much directly. But now I know how the Pros
        do it and I can start learn what they do. It discourages me a bit but I like
        to continue.
    </p>
{/snippet}
<Question q={q8} a={a8} qtags={[tags.d3, tags.perf]} />

<!---->
{#snippet q11()}
    <h2>
        What are challenges you've encountered when integrating D3.js with
        component-based frameworks? How do you handle them?
    </h2>
{/snippet}
{#snippet a11()}
    <p>
        Challenges arise when the two thought bubbles conflict, like when you
        have the reactive world and a library that wants to do direct DOM
        updates. In example d3 likes to append elements like <code
            >{"<g>'s"}</code
        >
        to the DOM directly, while Svelte or other frameworks like to do updates
        on a virtual DOM. It means sometimes these two systems fight for the control
        over some elements (<em>DOM Ownership</em>). In example when I
        <code>d3.select(...)</code> data and the same element is already managed
        by Svelte, I'm getting trouble when changes are performed on this element.
    </p>
    <p>
        We also need to initiate a D3 chart in a Svelte component with <code
            >{"onMount(()=>{...})"}</code
        >, so we precisly see the reactive parts. If we don't do this, we cannot
        tell which parts of the svelte component are available. In a scenario
        where <code>{"<canvas bind:this={canvas}></canvas>"}</code>
        the <code>canvas</code> binding would not be available to work with,
        because the component didn't mount yet. This is the same principle for
        <code>{"$effect(() => {...})"}</code> calls. We used this in our first visual
        example, where we build a chart with a responsive scale.
    </p>
    <!-- Illustrative component (failing on purpose)
            <FailingComponent />
        -->
{/snippet}
<Question q={q11} a={a11} qtags={[tags.comp]} />

<!---->
{#snippet q7()}
    <h2>
        Describe how you would handle expensive transitions or animations so
        they don't block the main thread.
    </h2>
{/snippet}
{#snippet a7()}
    <p>
        Theoretically there are a few options, either use <code
            >requestAnimationFrame</code
        >, which schedules an update. Or as MDN Docs says it runs a
        <em>callback function before the next repaint</em> or we may use a WebWorker.
        Since the transition (I guess moving data or recalculating paths, ...) is
        taking some time, it seems reasonable to schedule these changes so the reactive
        framework is not blocked.
    </p>
    <p>
        I tried to implement a heavy loop that runs infinite, but I got some
        problems with resizing the svg, <em>I think</em> because I always
        request a new change at the end of every change. In this scenario my
        loop breaks, when I do changes like resize event. I'll invest more time
        to figure things out. Maybe <code>requestAnimationFrame</code> is better
        used for initial loading instead constantly requesting new animation frames.
    </p>
    <!--Illustrative component (WIP)
            <ExpensiveTransition />
        -->
{/snippet}
<Question q={q7} a={a7} qtags={[tags.perf, tags.d3]} />

<div class="flex flex-col pb-8">
    <h2>
        What's your approach to handling color scales—both programmatically and
        for accessibility?
    </h2>
    <p>
        There are color pallets that help people that are affected by
        color-blindness or optical green-red weaknesses. These should be
        available at least as an option to alter the color. Programmatically you
        can handle color scales in D3 with scale function depending on the
        usecase. Either use categorical or continuous color scales. Fit the
        scale to you'r data, turn on gray-scale mode on your computer and see if
        the vis is readable.
    </p>
</div>

<div class="flex flex-col pb-8">
    <h2>
        Describe how you would make a visualization embeddable across articles
        (standalone script, iframe, or shared component?).
    </h2>
    <p>
        Ok this is interesting I need to think about this. Haven't thought about
        this yet.
    </p>
</div>

<div class="flex flex-col pb-8">
    <h2>
        How would you implement transitions between chart types (e.g., map → bar
        → scatter) while preserving user context?
    </h2>
    <p>
        Nice question, but low context. I'll think of an example and illustrate
        an approach later.
    </p>
</div>

<div class="flex flex-col pb-8">
    <h2>
        How would you optimize a Svelte+D3 visualization for embedding in a CMS
        that performs server-side prerendering?
    </h2>
    <p>
        Puh very tough. I guess this Vis would need quite a bit of context, like
        which size it's rendered for, or what parts of interactions should be
        available. The embedded <code>iFrame</code> does exist on it's own would
        need to deliver it's own controls if needed. So first optimize it in terms
        of these aspects. I can imagine that a canvas would be fast but I don't really
        know if the hit tests would become tricky.
    </p>
</div>

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
