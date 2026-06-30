// Flatten all chart keys across categories into one selectable list
function allChartOptions(){
  const opts = [];
  Object.values(CHART_CONFIG).forEach(cat=>{
    cat.charts.forEach(c=>{
      opts.push({ key: c.key, type: c.type, label: CANADA_DATA[c.key].title, category: cat.label });
    });
  });
  return opts;
}

function populateSelect(sel, options, defaultIdx){
  options.forEach((o, i)=>{
    const opt = document.createElement("option");
    opt.value = o.key;
    opt.textContent = `[${o.category}] ${o.label}`;
    if(i === defaultIdx) opt.selected = true;
    sel.appendChild(opt);
  });
}

let chartA = null, chartB = null;

function renderOne(key, type, canvasId, titleId, subId, srcId, chartRefSetter){
  const d = CANADA_DATA[key];
  document.getElementById(titleId).textContent = d.title;
  document.getElementById(subId).textContent = d.subtitle || "";
  document.getElementById(srcId).textContent = d.source || "";

  const idx = 0;
  const built = buildDataset(key, type, idx);
  const ctx = document.getElementById(canvasId).getContext("2d");
  const opts = baseChartOptions();
  if(built.indexAxis) opts.indexAxis = built.indexAxis;

  const existing = chartRefSetter(null); // get current
  if(existing) existing.destroy();

  const chart = new Chart(ctx, {
    type: built.chartType,
    data: { labels: built.labels, datasets: built.datasets },
    options: opts
  });
  chartRefSetter(chart, true);
}

document.addEventListener("DOMContentLoaded", () => {
  const options = allChartOptions();
  const selA = document.getElementById("sel-a");
  const selB = document.getElementById("sel-b");
  populateSelect(selA, options, 0);
  populateSelect(selB, options, 1);

  function update(){
    const a = options.find(o=>o.key===selA.value);
    const b = options.find(o=>o.key===selB.value);

    if(chartA) chartA.destroy();
    if(chartB) chartB.destroy();

    document.getElementById("title-a").textContent = CANADA_DATA[a.key].title;
    document.getElementById("sub-a").textContent = CANADA_DATA[a.key].subtitle || "";
    document.getElementById("src-a").textContent = CANADA_DATA[a.key].source || "";
    let built = buildDataset(a.key, a.type, 0);
    let opts = baseChartOptions();
    if(built.indexAxis) opts.indexAxis = built.indexAxis;
    chartA = new Chart(document.getElementById("chart-a").getContext("2d"), {
      type: built.chartType, data: { labels: built.labels, datasets: built.datasets }, options: opts
    });

    document.getElementById("title-b").textContent = CANADA_DATA[b.key].title;
    document.getElementById("sub-b").textContent = CANADA_DATA[b.key].subtitle || "";
    document.getElementById("src-b").textContent = CANADA_DATA[b.key].source || "";
    built = buildDataset(b.key, b.type, 1);
    opts = baseChartOptions();
    if(built.indexAxis) opts.indexAxis = built.indexAxis;
    chartB = new Chart(document.getElementById("chart-b").getContext("2d"), {
      type: built.chartType, data: { labels: built.labels, datasets: built.datasets }, options: opts
    });
  }

  selA.addEventListener("change", update);
  selB.addEventListener("change", update);
  update();
});
