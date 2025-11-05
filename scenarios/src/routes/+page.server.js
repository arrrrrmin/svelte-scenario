import { flareData } from '$lib/data.svelte';
import { loadLand110mJson, loadExampleStocks } from '$lib/loaders';

export const prerender = true;

function typed(d, company) {
    return {
        ...d,
        company: company,
        Date: new Date(`${d.Date}T00:00:00Z`),
        Close: parseFloat(d.Close),
    };
}

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const { land } = await loadLand110mJson();
    let stocks = await loadExampleStocks();

    stocks = new Array().concat(
        stocks.appl.map((d) => typed(d, "APPL")),
        stocks.amzn.map((d) => typed(d, "AMZN")),
        stocks.goog.map((d) => typed(d, "GOOG")),
        stocks.ibm.map((d) => typed(d, "IBM")),
        stocks.msft.map((d) => typed(d, "MSFT")),
    );

    return { land, stocks };
}