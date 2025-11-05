<script>
    import { slide } from "svelte/transition";
    import { defaultTransition, tags } from "$lib";
    import { tagCurrent } from "$lib/tag.svelte.js";
    import Tag from "./Tag.svelte";

    let { q, a, qtags, o } = $props();
    let open = $state(o | false);

    function toggle() {
        open = !open;
    }

    function displayQuestion() {
        if (tagCurrent.string === tags.all) return true;
        return qtags ? qtags.includes(tagCurrent.string) : true;
    }
</script>

{#if displayQuestion()}
    <div
        in:slide={defaultTransition}
        out:slide={defaultTransition}
        class={`py-4 ${displayQuestion() ? "" : "hidden"}`}
    >
        <div class="pb-4">
            <button onclick={toggle}>
                <div class="flex flex-row justify-between w-full text-left">
                    {@render q()}
                    {#if open}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6 min-w-8"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                        </svg>
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6 min-w-8"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    {/if}
                </div>
            </button>
            <div class="flex flex-wrap gap-x-1">
                {#each qtags as tag}
                    <Tag {tag} />
                {/each}
            </div>
        </div>

        {#if open}
            <div in:slide={defaultTransition} out:slide={defaultTransition}>
                {@render a()}
            </div>
        {/if}
    </div>
{/if}

<style lang="postcss">
    @reference "tailwindcss/theme";
    button {
        @apply hover:underline;
    }

    .answer {
        transition: ease-in-out;
    }
</style>
