/*
  Northwatch — Recent Headlines fetcher
  Pulls category-filtered Canadian headlines from Google News RSS and writes
  news-feed.json (repo root) for the homepage "Recent headlines" section.
  Headline text + outlet + date + outbound link only — no scraped images,
  no full-text article content.
  Run hourly via .github/workflows/news-feed.yml (also: workflow_dispatch).
*/

const fs = require("fs");
const path = require("path");

const CATEGORIES = [
  { key: "economy", label: "Economy & Productivity",
    keywords: ["GDP", "productivity", "trade balance", "manufacturing", "exports"] },
  { key: "debt-fiscal", label: "Debt & Fiscal",
    keywords: ["federal debt", "deficit", "federal budget", "Parliamentary Budget Officer", "interest rate", "mortgage rates"] },
  { key: "demographics", label: "Demographics",
    keywords: ["immigration levels", "population growth", "fertility rate", "census Canada", "permanent residents"] },
  { key: "labour-inequality", label: "Labour & Inequality",
    keywords: ["unemployment rate", "wages Canada", "labour strike", "minimum wage", "employment insurance"] },
  { key: "social-fabric", label: "Social Fabric",
    keywords: ["social trust", "civic participation", "PISA scores", "education outcomes Canada"] },
  { key: "resources", label: "Resources",
    keywords: ["oil prices Canada", "LNG Canada", "pipeline", "equalization payments", "mining Canada"] },
  { key: "taxes", label: "Taxes",
    keywords: ["tax bracket", "CRA", "capital gains tax", "GST", "tax revenue Canada"] },
];

const MAX_PER_CATEGORY = 3;
const MAX_TOTAL = 15;
const OUTPUT_PATH = path.join(__dirname, "..", "news-feed.json");

function buildQuery(keywords) {
  const orGroup = keywords.map(k => `"${k}"`).join(" OR ");
  return `Canada (${orGroup})`;
}

function decodeEntities(str) {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseItems(xml) {
  const items = [];
  const blocks = xml.split("<item>").slice(1);
  for (const block of blocks) {
    const body = block.split("</item>")[0];
    const titleMatch = body.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = body.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = body.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = body.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    if (!titleMatch || !linkMatch) continue;

    let title = decodeEntities(titleMatch[1]);
    let outlet = sourceMatch ? decodeEntities(sourceMatch[1]) : null;

    // Google News titles are formatted "Headline - Outlet"
    if (outlet) {
      const suffix = " - " + outlet;
      if (title.endsWith(suffix)) title = title.slice(0, -suffix.length).trim();
    } else {
      const idx = title.lastIndexOf(" - ");
      if (idx > -1) {
        outlet = title.slice(idx + 3).trim();
        title = title.slice(0, idx).trim();
      } else {
        outlet = "Unknown source";
      }
    }

    items.push({
      title,
      outlet,
      link: decodeEntities(linkMatch[1]),
      pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
    });
  }
  return items;
}

async function fetchCategory(cat) {
  const q = encodeURIComponent(buildQuery(cat.keywords));
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-CA&gl=CA&ceid=CA:en`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; NorthwatchBot/1.0; +https://thenorthwatch.ca)" },
  });
  if (!res.ok) throw new Error(`${cat.key} fetch failed: HTTP ${res.status}`);
  const xml = await res.text();
  return parseItems(xml)
    .slice(0, MAX_PER_CATEGORY)
    .map(it => ({ ...it, category: cat.key, categoryLabel: cat.label }));
}

async function main() {
  const results = [];
  for (const cat of CATEGORIES) {
    try {
      results.push(...(await fetchCategory(cat)));
    } catch (err) {
      console.error(`Skipping ${cat.key}: ${err.message}`);
    }
  }

  results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const trimmed = results.slice(0, MAX_TOTAL);

  const output = { updated: new Date().toISOString(), items: trimmed };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${trimmed.length} headlines to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
