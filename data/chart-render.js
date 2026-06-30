/* ── reference table ─────────────────────────────────────── */
function buildRefTable(t){
  const headRow = t.headers.map(h=>`<th>${h}</th>`).join("");
  const bodyRows = t.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("");
  return `<div class="ref-table-wrap">
    <p class="ref-table-caption">${t.caption}</p>
    <table class="ref-table">
      <thead><tr>${headRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </div>`;
}

/* ── series helpers ──────────────────────────────────────── */
function isChartableSeries(values){
  const present=values.filter(v=>v!==null&&v!==undefined);
  if(!present.length)return false;
  return present.filter(v=>typeof v==="number").length/present.length>0.5;
}
function sanitizeSeries(values){
  return values.map(v=>typeof v==="number"?v:null);
}

/* ── dataset builder ─────────────────────────────────────── */
function buildDataset(key,type,seriesSubset){
  const d=CANADA_DATA[key];
  const allNames=seriesSubset||Object.keys(d.series);
  const seriesNames=allNames.filter(s=>d.series[s]&&isChartableSeries(d.series[s]));
  if(type==="horizontalBar"){
    const sName=seriesNames[0];
    const raw=d.series[sName].map((v,i)=>({label:d.x[i],value:v}))
      .filter(r=>typeof r.value==="number")
      .sort((a,b)=>b.value-a.value);
    return{chartType:"bar",indexAxis:"y",
      labels:raw.map(r=>r.label),
      datasets:[{label:sName,data:raw.map(r=>r.value),
        backgroundColor:PALETTE[0],borderRadius:3}]};
  }
  return{chartType:"line",labels:d.x,
    datasets:seriesNames.map((s,i)=>({
      label:s,data:sanitizeSeries(d.series[s]),
      borderColor:PALETTE[i%PALETTE.length],
      backgroundColor:PALETTE[i%PALETTE.length],
      borderWidth:2,pointRadius:0,pointHoverRadius:4,
      tension:0.15,spanGaps:true}))};
}

/* ── base chart options ──────────────────────────────────── */
function baseChartOptions(){
  return{
    responsive:true,maintainAspectRatio:false,
    interaction:{mode:"index",intersect:false},
    plugins:{
      legend:{display:false},   // disabled — we use HTML legend
      tooltip:{
        backgroundColor:"#2a2825",titleColor:"#f3f0e8",
        bodyColor:"#f3f0e8",borderColor:"#3a3733",
        borderWidth:1,padding:10},
      zoom:{
        pan:{enabled:true,mode:"x"},
        zoom:{wheel:{enabled:true},pinch:{enabled:true},mode:"x"}}},
    scales:{
      x:{ticks:{color:"#a8a39a",font:{size:11}},grid:{color:"#2c2a27"}},
      y:{ticks:{color:"#a8a39a",font:{size:11}},grid:{color:"#2c2a27"}}}};
}

/* ── HTML legend builder ─────────────────────────────────── */
function buildHtmlLegend(seriesNames,legendExplain){
  if(!seriesNames||!seriesNames.length)return"";
  const items=seriesNames.map((name,i)=>{
    const color=PALETTE[i%PALETTE.length];
    const tip=(legendExplain&&legendExplain[name])||"";
    return `<span class="legend-item"${tip?` title="${tip.replace(/"/g,"&quot;")}"`:""}>`+
      `<span class="legend-dot" style="background:${color}"></span>${name}</span>`;
  });
  return`<div class="html-legend">${items.join("")}</div>`;
}

/* ── modal system ────────────────────────────────────────── */
let _modalCharts=[];
let _modalInited=false;

function initModal(){
  if(_modalInited)return;
  _modalInited=true;
  const el=document.createElement("div");
  el.className="info-modal-overlay";
  el.id="info-modal-overlay";
  el.innerHTML=`<div class="info-modal">
    <button class="info-modal-close" onclick="closeInfoModal()">×</button>
    <p class="info-modal-tag">How to read this chart</p>
    <h4 id="info-modal-title"></h4>
    <p class="info-modal-explain" id="info-modal-body"></p>
    <div class="info-modal-legend" id="info-modal-legend" style="display:none"></div>
  </div>`;
  el.addEventListener("click",function(e){if(e.target===el)closeInfoModal();});
  document.body.appendChild(el);
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape")closeInfoModal();});
}

function openInfoModal(idx){
  const m=_modalCharts[idx];
  document.getElementById("info-modal-title").textContent=m.title;
  document.getElementById("info-modal-body").textContent=m.explain||"No additional explanation available.";
  const legendEl=document.getElementById("info-modal-legend");
  if(m.legendItems&&m.legendItems.length){
    legendEl.innerHTML=`<p class="info-modal-legend-label">What each line means</p>`+
      m.legendItems.map(item=>`<div class="info-modal-item">
        <div class="dot" style="background:${item.color}"></div>
        <div><strong>${item.name}</strong>${item.explain?` — <span>${item.explain}</span>`:""}
        </div></div>`).join("");
    legendEl.style.display="";
  }else{
    legendEl.style.display="none";
  }
  document.getElementById("info-modal-overlay").classList.add("active");
}

function closeInfoModal(){
  document.getElementById("info-modal-overlay").classList.remove("active");
}

/* ── main render ─────────────────────────────────────────── */
function renderCategory(catKey){
  initModal();
  _modalCharts=[];

  const cfg=CHART_CONFIG[catKey];
  document.getElementById("cat-title").textContent=cfg.label;
  document.getElementById("cat-desc").textContent=cfg.desc;

  const grid=document.getElementById("chart-grid");

  cfg.charts.forEach((c)=>{
    const d=CANADA_DATA[c.key];
    const canvasId=c.id||c.key;
    const title=c.title||d.title;
    const subtitle=c.subtitle||d.subtitle;
    const explain=c.explain||"";
    const legendExplain=c.legendExplain||{};
    const modalIdx=_modalCharts.length;

    // Determine which series names are shown
    const allNames=c.seriesSubset||Object.keys(d.series);
    const shownSeries=allNames.filter(s=>d.series[s]&&isChartableSeries(d.series[s]));

    // Build legend items for modal
    const legendItems=shownSeries.map((name,i)=>({
      name,color:PALETTE[i%PALETTE.length],
      explain:legendExplain[name]||""}));

    _modalCharts.push({title,explain,legendItems});

    // Build card HTML
    const card=document.createElement("div");
    card.className="chart-card";

    const legendHtml=c.type==="horizontalBar"?"":buildHtmlLegend(shownSeries,legendExplain);

    const showRef=c.showRef===true||(!c.seriesSubset&&c.showRef!==false);
    const refHtml=(showRef&&d.refTable)?buildRefTable(d.refTable):"";
    const noteHtml=(showRef&&d.note)?`<div class="ref-note">${d.note}</div>`:"";

    card.innerHTML=`
      <div class="chart-header">
        <h3 title="${explain.replace(/"/g,"&quot;")}">${title}</h3>
        <button class="info-btn" onclick="openInfoModal(${modalIdx})" title="Explain this chart">ⓘ</button>
      </div>
      <p class="sub">${subtitle||""}</p>
      ${legendHtml}
      <div class="chart-box"><canvas id="chart-${canvasId}"></canvas></div>
      ${refHtml}${noteHtml}
      <div class="src">${d.source||""}</div>`;
    grid.appendChild(card);

    const built=buildDataset(c.key,c.type,c.seriesSubset);
    const ctx=document.getElementById(`chart-${canvasId}`).getContext("2d");
    const opts=baseChartOptions();
    if(built.indexAxis)opts.indexAxis=built.indexAxis;
    new Chart(ctx,{
      type:built.chartType,
      data:{labels:built.labels,datasets:built.datasets},
      options:opts});
  });
}
