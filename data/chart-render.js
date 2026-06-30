function fmtHeader(h){
  return h.replace(/\s*\(/, '\n(').split('\n')[0].trim();
}

function buildDataset(key, type, idx){
  const d = CANADA_DATA[key];
  const seriesNames = Object.keys(d.series);
  const color = PALETTE[idx % PALETTE.length];

  if(type === "horizontalBar"){
    // x is category labels, single series (col 1)
    const sName = seriesNames[0];
    const raw = d.series[sName].map((v,i)=>({label: d.x[i], value: v}))
      .filter(r=>typeof r.value === "number")
      .sort((a,b)=>b.value-a.value);
    return {
      chartType: "bar",
      indexAxis: "y",
      labels: raw.map(r=>r.label),
      datasets: [{
        label: sName,
        data: raw.map(r=>r.value),
        backgroundColor: PALETTE[idx % PALETTE.length],
        borderRadius: 3
      }]
    };
  }

  // line chart, possibly multi-series
  return {
    chartType: "line",
    labels: d.x,
    datasets: seriesNames.map((s,i)=>({
      label: s,
      data: d.series[s],
      borderColor: PALETTE[i % PALETTE.length],
      backgroundColor: PALETTE[i % PALETTE.length],
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.15,
      spanGaps: true
    }))
  };
}

function baseChartOptions(){
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        labels: { color: "#a8a39a", boxWidth: 12, font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: "#2a2825",
        titleColor: "#f3f0e8",
        bodyColor: "#f3f0e8",
        borderColor: "#3a3733",
        borderWidth: 1,
        padding: 10
      },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x"
        }
      }
    },
    scales: {
      x: { ticks: { color: "#a8a39a", font: { size: 11 } }, grid: { color: "#2c2a27" } },
      y: { ticks: { color: "#a8a39a", font: { size: 11 } }, grid: { color: "#2c2a27" } }
    }
  };
}

function renderCategory(catKey){
  const cfg = CHART_CONFIG[catKey];
  document.getElementById("cat-title").textContent = cfg.label;
  document.getElementById("cat-desc").textContent = cfg.desc;

  const grid = document.getElementById("chart-grid");
  cfg.charts.forEach((c, idx) => {
    const d = CANADA_DATA[c.key];
    const card = document.createElement("div");
    card.className = "chart-card";
    card.innerHTML = `
      <h3>${d.title}</h3>
      <p class="sub">${d.subtitle || ""}</p>
      <div class="chart-box"><canvas id="chart-${c.key}"></canvas></div>
      <div class="src">${d.source || ""}</div>
    `;
    grid.appendChild(card);

    const built = buildDataset(c.key, c.type, idx);
    const ctx = document.getElementById(`chart-${c.key}`).getContext("2d");
    const opts = baseChartOptions();
    if(built.indexAxis) opts.indexAxis = built.indexAxis;
    new Chart(ctx, {
      type: built.chartType,
      data: { labels: built.labels, datasets: built.datasets },
      options: opts
    });
  });
}
