import * as d3 from "d3";

export async function loadLand110mJson() {
    const land = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json");
    return { land }
}

export async function loadD3FlareJson() {
    const flare = await d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/refs/heads/main/test/data/flare.json");
    return { flare }
}

export async function loadExampleStocks() {
    const appl = await d3.csv("https://datapublisher.s3.eu-central-1.amazonaws.com/stock-example/AAPL.csv");
    const amzn = await d3.csv("https://datapublisher.s3.eu-central-1.amazonaws.com/stock-example/AMZN.csv");
    const goog = await d3.csv("https://datapublisher.s3.eu-central-1.amazonaws.com/stock-example/GOOG.csv");
    const ibm = await d3.csv("https://datapublisher.s3.eu-central-1.amazonaws.com/stock-example/IBM.csv");
    const msft = await d3.csv("https://datapublisher.s3.eu-central-1.amazonaws.com/stock-example/MSFT.csv");
    return { appl, amzn, goog, ibm, msft }
}
