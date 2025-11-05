<script>
    import { tagCurrent } from "../tag.svelte.js";
    import { tags } from "$lib";
    import Tag from "./Tag.svelte";
</script>

<div>
    <p>
        You can filter the questions by topic. These topics are somewhat
        overlapping and some questions belong to more than one topic. Feel free
        to explore.
    </p>
    <div>
        <div class="flex flex-wrap gap-1 py-8 justify-self-start">
            {#each Object.values(tags) as tag}
                <Tag {tag} />
            {/each}
        </div>
    </div>
</div>
