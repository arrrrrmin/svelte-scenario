<script>
    import Head from "$lib/uicomponents/Head.svelte";
    import "../app.css";

    let { data, children } = $props();
</script>

<Head />
<main
    class="mx-auto pb-8 px-12 max-w-4xl lg:border-x lg:border-dashed lg:border-gray-300"
>
    {@render children()}
</main>
