import { flareData } from '$lib/data.svelte';
import { loadLand110mJson, loadExampleStocks } from '$lib/loaders';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const { land } = await loadLand110mJson();
    const stocks = await loadExampleStocks();

    return { land, stocks };
}