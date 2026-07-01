#!/usr/bin/env node
/*
 * Northwatch — Data Change Detector
 * ----------------------------------
 * Compares the current data/data.js against the last saved snapshot and
 * drafts "What Changed" feed entries for any series whose latest value
 * moved, or where a new data point was added.
 *
 * USAGE:
 *   node scripts/detect-data-changes.js
 *     -> diffs data.js against scripts/.snapshots/baseline.json
 *     -> writes a draft feed file to scripts/output/feed-draft-<date>.js
 *     -> AUTO-STAMPS lastUpdated (today's date) on every dataset with a
 *        detected change, directly in data.js. This is the mechanism that
 *        keeps per-chart "last updated" timestamps honest — no manual
 *        reminder needed, run this after any data.js edit.
 *     -> does NOT touch index.html or the baseline — you copy in what you want
 *
 *   node scripts/detect-data-changes.js --update-snapshot
 *     -> just saves the current data.js as the new baseline (no diff)
 *     -> run this once after you've incorporated a draft into the FEED array
 *
 * THRESHOLD: only flags a change if it's a brand-new data point, or an
 * existing value moved by more than MIN_PCT_CHANGE (default 0.3%). This is
 * intentional — per Northwatch convention, we flag threshold-crossing-scale
 * changes, not every rounding-level tick, to avoid alert fatigue.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_JS = path.join(ROOT, "data", "data.js");
const SNAPSHOT_DIR = path.join(__dirname, ".snapshots");
const BASELINE = path.join(SNAPSHOT_DIR, "baseline.json");
const OUTPUT_DIR = path.join(__dirname, "output");
const MIN_PCT_CHANGE = 0.3; // percent

function loadCanadaData() {
  const raw = fs.readFileSync(DATA_JS, "utf8");
  const stripped = raw.replace("const CANADA_DATA = ", "").replace(/;\s*$/, "");
  return JSON.parse(stripped);
}

function lastNonNull(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (typeof arr[i] === "number") return { index: i, value: arr[i] };
  }
  return null;
}

function main() {
  const args = process.argv.slice(2);
  const updateOnly = args.includes("--update-snapshot");

  if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const current = loadCanadaData();

  if (updateOnly) {
    fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2));
    console.log(`Snapshot updated: ${BASELINE}`);
    return;
  }

  if (!fs.existsSync(BASELINE)) {
    fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2));
    console.log("No prior snapshot found — baseline created from current data.js.");
    console.log("Nothing to diff yet. Re-run this script after the next data.js update.");
    return;
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  const changes = [];

  for (const key of Object.keys(current)) {
    const curDs = current[key];
    const baseDs = baseline[key];

    if (!baseDs) {
      changes.push({ kind: "new_dataset", key, title: curDs.title });
      continue;
    }

    const curX = curDs.x || [];
    const baseX = baseDs.x || [];
    const newYearsAdded = curX.length > baseX.length;

    for (const seriesName of Object.keys(curDs.series || {})) {
      const curSeries = curDs.series[seriesName];
      const baseSeries = (baseDs.series || {})[seriesName];

      if (!baseSeries) {
        changes.push({ kind: "new_series", key, title: curDs.title, seriesName });
        continue;
      }

      const curLast = lastNonNull(curSeries);
      const baseLast = lastNonNull(baseSeries);
      if (!curLast) continue;

      const curYear = curX[curLast.index];

      if (!baseLast) {
        changes.push({
          kind: "new_point", key, title: curDs.title, seriesName,
          year: curYear, value: curLast.value
        });
        continue;
      }

      const baseYear = baseX[baseLast.index];
      const sameYear = curYear === baseYear;
      const valueChanged = curLast.value !== baseLast.value;

      if (!sameYear && curLast.index > baseLast.index) {
        // a new data point was appended
        const pctChange = baseLast.value !== 0
          ? ((curLast.value - baseLast.value) / Math.abs(baseLast.value)) * 100
          : null;
        changes.push({
          kind: "new_point", key, title: curDs.title, seriesName,
          year: curYear, value: curLast.value,
          prevYear: baseYear, prevValue: baseLast.value, pctChange
        });
      } else if (sameYear && valueChanged) {
        const pctChange = baseLast.value !== 0
          ? ((curLast.value - baseLast.value) / Math.abs(baseLast.value)) * 100
          : null;
        if (pctChange === null || Math.abs(pctChange) >= MIN_PCT_CHANGE) {
          changes.push({
            kind: "revision", key, title: curDs.title, seriesName,
            year: curYear, value: curLast.value,
            prevValue: baseLast.value, pctChange
          });
        }
      }
    }
  }

  if (!changes.length) {
    console.log("No changes detected since last snapshot. Nothing to draft.");
    return;
  }

  // Auto-stamp lastUpdated on every dataset with a detected change.
  const todayStr = new Date().toISOString().slice(0, 10);
  const touchedKeys = [...new Set(changes.map(c => c.key))];
  for (const key of touchedKeys) {
    if (current[key]) current[key].lastUpdated = todayStr;
  }
  const rawOut = "const CANADA_DATA = " + JSON.stringify(current) + ";\n";
  fs.writeFileSync(DATA_JS, rawOut);
  console.log(`lastUpdated stamped to ${todayStr} for ${touchedKeys.length} dataset(s): ${touchedKeys.join(", ")}`);
  console.log("(Remember to bump the data.js cache-bust version param in the HTML pages.)");
  console.log("");

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const draftEntries = changes.map(c => {
    let direction = "neutral";
    let title, note;

    if (c.kind === "new_dataset") {
      direction = "new";
      title = `New dataset added: ${c.title}`;
      note = "REVIEW: describe why this dataset was added and what it shows.";
    } else if (c.kind === "new_series") {
      direction = "new";
      title = `New series added to "${c.title}": ${c.seriesName}`;
      note = "REVIEW: describe what this new series shows.";
    } else if (c.kind === "new_point") {
      const pct = c.pctChange !== undefined && c.pctChange !== null
        ? `${c.pctChange >= 0 ? "+" : ""}${c.pctChange.toFixed(1)}%` : null;
      direction = c.pctChange === undefined || c.pctChange === null
        ? "new"
        : (c.pctChange >= 0 ? "up" : "down");
      title = `${c.seriesName} — new ${c.year} figure: ${c.value}${pct ? ` (${pct} vs ${c.prevYear})` : ""}`;
      note = "REVIEW: confirm this is good/bad/context before publishing, per Northwatch verdict convention.";
    } else if (c.kind === "revision") {
      const pct = c.pctChange !== null ? `${c.pctChange >= 0 ? "+" : ""}${c.pctChange.toFixed(1)}%` : "n/a";
      direction = c.pctChange >= 0 ? "up" : "down";
      title = `${c.seriesName} (${c.year}) revised: ${c.prevValue} -> ${c.value} (${pct})`;
      note = "REVIEW: source revision, not a new period. Confirm before publishing.";
    }

    return { kind: c.kind, key: c.key, direction, date: new Date().toISOString().slice(0,10), tag: "data", title, note };
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  const outFile = path.join(OUTPUT_DIR, `feed-draft-${dateStr}.js`);

  const fileBody = `/* Northwatch — draft feed entries generated ${dateStr}
 * Source: scripts/detect-data-changes.js
 * ${draftEntries.length} change(s) detected vs last snapshot.
 *
 * REVIEW EACH ENTRY: direction/tag are best-effort guesses.
 * "up"/"down" reflects the raw number, NOT whether it's good or bad —
 * you decide that per Northwatch convention (e.g. rising debt is "down" tag-wise
 * in tone even though the number went up). Edit freely, then paste the ones
 * you want into the FEED array in index.html.
 *
 * After publishing, run:  node scripts/detect-data-changes.js --update-snapshot
 */
const FEED_DRAFT = ${JSON.stringify(draftEntries, null, 2)};
`;

  fs.writeFileSync(outFile, fileBody);

  console.log(`${changes.length} change(s) detected. Draft written to:`);
  console.log(`  ${outFile}`);
  console.log("");
  console.log("Review, edit direction/tag/wording, then paste chosen entries into index.html's FEED array.");
  console.log("When done, run: node scripts/detect-data-changes.js --update-snapshot");
}

main();
