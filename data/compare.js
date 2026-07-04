// Category key -> HTML file, for linking Share buttons back to the canonical chart page
const CATEGORY_FILES = {
  economy: "economy.html",
  debt_fiscal: "debt-fiscal.html",
  demographics: "demographics.html",
  labour_inequality: "labour-inequality.html",
  social_fabric: "social-fabric.html",
  resources: "resources.html",
  taxes: "taxes.html"
};

// Flatten every individual chart-config entry into one selectable list.
// Uses array index as the <option> value (not chart key) since several
// entries share the same key (e.g. energy / energy-wti / energy-lng) —
// using key alone made those indistinguishable in the dropdown.
function allChartOptions(){
  const opts = [];
  Object.entries(CHART_CONFIG).forEach(([catKey, cat])=>{
    cat.charts.forEach(c=>{
      opts.push({
        catKey, catLabel: cat.label, config: c,
        label: c.title || CANADA_DATA[c.key].title
      });
    });
  });
  return opts;
}

function populateSelect(sel, options, defaultIdx){
  let currentGroup=null, groupEl=null;
  options.forEach((o, i)=>{
    if(o.catLabel !== currentGroup){
      currentGroup = o.catLabel;
      groupEl = document.createElement("optgroup");
      groupEl.label = o.catLabel;
      sel.appendChild(groupEl);
    }
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = o.label;
    if(i === defaultIdx) opt.selected = true;
    groupEl.appendChild(opt);
  });
}

function shareCompareChart(catKey, canvasId, btnEl){
  const file = CATEGORY_FILES[catKey];
  const url = location.origin + location.pathname.replace(/[^/]+$/, "") +
    file + "?chart=" + encodeURIComponent(canvasId);
  const done = ()=>{
    const orig = btnEl.textContent;
    btnEl.textContent = "Copied";
    btnEl.classList.add("share-btn-copied");
    setTimeout(()=>{ btnEl.textContent = orig; btnEl.classList.remove("share-btn-copied"); }, 1500);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(done).catch(()=>{ prompt("Copy this link:", url); });
  } else {
    prompt("Copy this link:", url);
  }
}

let chartA = null, chartB = null;

/* ── x-axis sync helpers ─────────────────────────────────── */
function isTimeSeriesConfig(c, d){
  return c.type !== "horizontalBar" && Array.isArray(d.x) && d.x.length > 0 && typeof d.x[0] === "number";
}
function unionSortedX(xA, xB){
  return Array.from(new Set([...xA, ...xB])).sort((a,b)=>a-b);
}
function computeSharedLabels(oA, oB){
  const dA = CANADA_DATA[oA.config.key], dB = CANADA_DATA[oB.config.key];
  if(!isTimeSeriesConfig(oA.config, dA) || !isTimeSeriesConfig(oB.config, dB)) return null;
  const minA = Math.min(...dA.x), maxA = Math.max(...dA.x);
  const minB = Math.min(...dB.x), maxB = Math.max(...dB.x);
  if(Math.max(minA, minB) > Math.min(maxA, maxB)) return null; // no overlap
  return unionSortedX(dA.x, dB.x);
}

function renderSlot(o, ids, chartRef, sharedLabels){
  const c = o.config;
  const d = CANADA_DATA[c.key];
  const canvasId = c.id || c.key;

  document.getElementById(ids.title).textContent = c.title || d.title;
  document.getElementById(ids.sub).textContent = c.subtitle || d.subtitle || "";
  document.getElementById(ids.src).innerHTML = `${d.source||""}${d.lastUpdated?` <span class="last-updated">· Data verified current as of ${formatLastUpdated(d.lastUpdated)}</span>`:""}`;

  const built = buildDataset(c.key, c.type, c.seriesSubset);
  const opts = baseChartOptions();
  if(built.indexAxis) opts.indexAxis = built.indexAxis;

  let labels = built.labels, datasets = built.datasets;
  if(sharedLabels && built.chartType === "line"){
    // remap each dataset's data from its native x-index onto the shared label set
    labels = sharedLabels;
    datasets = built.datasets.map(ds=>{
      const valueByX = new Map(d.x.map((xv,i)=>[xv, ds.data[i]]));
      return { ...ds, data: sharedLabels.map(xv => valueByX.has(xv) ? valueByX.get(xv) : null) };
    });
  }

  if(chartRef.chart) chartRef.chart.destroy();
  const canvasEl = document.getElementById(ids.canvas);
  chartRef.chart = new Chart(canvasEl.getContext("2d"), {
    type: built.chartType,
    data: { labels, datasets },
    options: opts
  });

  // Accessibility: aria-label summary + visually-hidden full data table
  const shownForAria = (c.seriesSubset || Object.keys(d.series)).filter(s=>d.series[s] && isChartableSeries(d.series[s]));
  canvasEl.setAttribute("aria-label", escapeAttr(buildChartAriaLabel(c.title || d.title, d, shownForAria, c.verdict || "")));
  const srTableEl = document.getElementById(ids.srTable);
  if(srTableEl) srTableEl.innerHTML = buildAccessibleTable(c.title || d.title, d.xLabel || "", d.x || [], shownForAria, d.series);

  // Share button -> links back to the canonical chart page for this indicator
  const shareBtn = document.getElementById(ids.share);
  shareBtn.onclick = ()=> shareCompareChart(o.catKey, canvasId, shareBtn);

  // CSV export -> reuses chart-render.js's global downloadChartCSV via its export map
  const allNames = c.seriesSubset || Object.keys(d.series);
  const shownSeries = allNames.filter(s=>d.series[s] && isChartableSeries(d.series[s]));
  _csvExportMap[canvasId] = { dataKey: c.key, seriesNames: shownSeries, xLabel: d.xLabel || "", title: c.title || d.title, subtitle: c.subtitle || d.subtitle || "" };
  document.getElementById(ids.csv).onclick = ()=> downloadChartCSV(canvasId);

  // Image export -> reuses chart-render.js's global downloadChartImage via the same export map
  document.getElementById(ids.img).onclick = ()=> downloadChartImage(canvasId);

  // Cited Threshold badge
  const badgeEl = document.getElementById(ids.badge);
  badgeEl.style.display = c.citedThreshold ? "" : "none";

  // Info modal -> build the same data shape chart-render.js uses for category pages
  const legendItems = shownSeries.map((name,i)=>({
    name, color: PALETTE[i % PALETTE.length],
    explain: (c.legendExplain && c.legendExplain[name]) || ""
  }));
  const modalData = {
    title: c.title || d.title,
    explain: c.explain || "",
    verdict: c.verdict || "",
    citedThreshold: c.citedThreshold || "",
    legendItems,
    canvasId,
    source: d.source || "",
    lastUpdated: d.lastUpdated || ""
  };
  document.getElementById(ids.info).onclick = ()=> openInfoModalData(modalData);
}

document.addEventListener("DOMContentLoaded", () => {
  initModal();

  const options = allChartOptions();
  const selA = document.getElementById("sel-a");
  const selB = document.getElementById("sel-b");
  populateSelect(selA, options, 0);
  populateSelect(selB, options, 1);

  const refA = {}, refB = {};
  const idsA = { title:"title-a", sub:"sub-a", src:"src-a", canvas:"chart-a", share:"share-a", info:"info-a", csv:"csv-a", img:"img-a", badge:"badge-a", srTable:"sr-table-a" };
  const idsB = { title:"title-b", sub:"sub-b", src:"src-b", canvas:"chart-b", share:"share-b", info:"info-b", csv:"csv-b", img:"img-b", badge:"badge-b", srTable:"sr-table-b" };
  const syncStatusEl = document.getElementById("sync-status");

  function update(){
    const oA = options[+selA.value], oB = options[+selB.value];
    const sharedLabels = computeSharedLabels(oA, oB);

    if(sharedLabels){
      syncStatusEl.textContent = "X-axis synced — years are aligned across both charts.";
      syncStatusEl.classList.add("synced");
    } else {
      syncStatusEl.textContent = "X-axis not synced — these charts don't share a common numeric year range (different range, or one uses category labels rather than years).";
      syncStatusEl.classList.remove("synced");
    }

    renderSlot(oA, idsA, refA, sharedLabels);
    renderSlot(oB, idsB, refB, sharedLabels);
  }

  selA.addEventListener("change", update);
  selB.addEventListener("change", update);
  update();
});
