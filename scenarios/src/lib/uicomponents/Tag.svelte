<script>
    import { tags } from "$lib";
    import { tagCurrent } from "$lib/tag.svelte";

    let { tag } = $props();
</script>

<button
    class="block"
    onclick={(e) => {
        tagCurrent.string =
            tagCurrent.string === e.target.innerText
                ? tags.all
                : e.target.innerText;
    }}
>
    <div class="text-sm">
        <span
            class={`px-1 py-0.5 border rounded-sm 
                ${
                    tag === tagCurrent.string || tagCurrent.string === tags.all
                        ? "text-rose-700 border border-rose-700"
                        : "text-gray-500 border-gray-500 hover:shadow-md"
                }`}>{tag}</span
        >
    </div>
</button>
