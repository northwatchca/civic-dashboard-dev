// Category key -> HTML file, for linking Share buttons back to the canonical chart page
const CATEGORY_FILES = {
  economy: "economy.html",
  debt_fiscal: "debt-fiscal.html",
  demographics: "demographics.html",
  labour_inequality: "labour-inequality.html",
  social_fabric: "social-fabric.html",
  resources: "resources.html"
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

function renderSlot(o, ids, chartRef){
  const c = o.config;
  const d = CANADA_DATA[c.key];
  const canvasId = c.id || c.key;

  document.getElementById(ids.title).textContent = c.title || d.title;
  document.getElementById(ids.sub).textContent = c.subtitle || d.subtitle || "";
  document.getElementById(ids.src).textContent = d.source || "";

  const built = buildDataset(c.key, c.type, c.seriesSubset);
  const opts = baseChartOptions();
  if(built.indexAxis) opts.indexAxis = built.indexAxis;

  if(chartRef.chart) chartRef.chart.destroy();
  chartRef.chart = new Chart(document.getElementById(ids.canvas).getContext("2d"), {
    type: built.chartType,
    data: { labels: built.labels, datasets: built.datasets },
    options: opts
  });

  // Share button -> links back to the canonical chart page for this indicator
  const shareBtn = document.getElementById(ids.share);
  shareBtn.onclick = ()=> shareCompareChart(o.catKey, canvasId, shareBtn);

  // Info modal -> build the same data shape chart-render.js uses for category pages
  const allNames = c.seriesSubset || Object.keys(d.series);
  const shownSeries = allNames.filter(s=>d.series[s] && isChartableSeries(d.series[s]));
  const legendItems = shownSeries.map((name,i)=>({
    name, color: PALETTE[i % PALETTE.length],
    explain: (c.legendExplain && c.legendExplain[name]) || ""
  }));
  const modalData = {
    title: c.title || d.title,
    explain: c.explain || "",
    verdict: c.verdict || "",
    legendItems
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
  const idsA = { title:"title-a", sub:"sub-a", src:"src-a", canvas:"chart-a", share:"share-a", info:"info-a" };
  const idsB = { title:"title-b", sub:"sub-b", src:"src-b", canvas:"chart-b", share:"share-b", info:"info-b" };

  function update(){
    renderSlot(options[+selA.value], idsA, refA);
    renderSlot(options[+selB.value], idsB, refB);
  }

  selA.addEventListener("change", update);
  selB.addEventListener("change", update);
  update();
});
