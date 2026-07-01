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
      legend:{display:false},
      tooltip:{
        backgroundColor:"#111110",titleColor:"#f0ede5",
        bodyColor:"#f0ede5",borderColor:"#252320",
        borderWidth:1,padding:10},
      zoom:{
        pan:{enabled:true,mode:"x"},
        zoom:{wheel:{enabled:true},pinch:{enabled:true},mode:"x"}}},
    scales:{
      x:{ticks:{color:"#9e9a94",font:{size:11}},grid:{color:"#eeece8"}},
      y:{ticks:{color:"#9e9a94",font:{size:11}},grid:{color:"#eeece8"}}}};
}

/* ── HTML legend builder ─────────────────────────────────── */
function buildHtmlLegend(seriesNames,legendExplain){
  if(!seriesNames||!seriesNames.length)return"";
  const items=seriesNames.map((name,i)=>{
    const color=PALETTE[i%PALETTE.length];
    const tip=(legendExplain&&legendExplain[name])||"";
    const label=tip
      ?`<span class="info-tip">${name}<span class="info-tip-bubble">${tip.replace(/</g,"&lt;")}</span></span>`
      :name;
    return `<span class="legend-item">`+
      `<span class="legend-dot" style="background:${color}"></span>${label}</span>`;
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
    <div class="info-modal-top-row">
      <h4 id="info-modal-title"></h4>
    </div>
    <p class="info-modal-explain" id="info-modal-body"></p>
    <div class="info-modal-verdict" id="info-modal-verdict" style="display:none">
      <span class="verdict-tag" id="verdict-tag"></span>
      <p id="verdict-text"></p>
    </div>
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

  // verdict block — flat, always visible, no hover/click
  const verdictBox=document.getElementById("info-modal-verdict");
  const tagEl=document.getElementById("verdict-tag");
  const textEl=document.getElementById("verdict-text");
  if(m.verdict){
    const dashIdx=m.verdict.indexOf(" — ");
    let cat="",text=m.verdict;
    if(dashIdx!==-1){
      cat=m.verdict.slice(0,dashIdx).trim();
      text=m.verdict.slice(dashIdx+3).trim();
    }
    const catUpper=cat.toUpperCase();
    let cls="v-context",label=cat||"Context";
    if(catUpper.indexOf("BAD")!==-1){cls="v-bad";label="Bad";}
    else if(catUpper.indexOf("MIXED")!==-1){cls="v-mixed";label=catUpper.indexOf("POSITIVE")!==-1?"Mixed / Positive":"Mixed";}
    else if(catUpper.indexOf("CONTEXT")!==-1){cls="v-context";label="Context";}
    label="Chart Analysis: "+label;
    verdictBox.className="info-modal-verdict "+cls;
    tagEl.textContent=label;
    textEl.textContent=text;
    verdictBox.style.display="";
  } else {
    verdictBox.style.display="none";
  }

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

/* ── collapse/expand all ─────────────────────────────────── */
function expandAll(){
  document.querySelectorAll(".chart-card.collapsed").forEach(card=>{
    toggleCard(card, true);
  });
}
function collapseAll(){
  document.querySelectorAll(".chart-card:not(.collapsed)").forEach(card=>{
    toggleCard(card, false);
  });
}
function toggleCard(card, forceOpen){
  const isCollapsed = card.classList.contains("collapsed");
  const shouldOpen = forceOpen !== undefined ? forceOpen : isCollapsed;

  if(shouldOpen && isCollapsed){
    card.classList.remove("collapsed");
    card.querySelector(".toggle-arrow").textContent="▲";
    // Lazy chart init
    if(!card._chartInited){
      card._chartInited = true;
      const initFn = card._chartInitFn;
      if(initFn) initFn();
    }
  } else if(!shouldOpen && !isCollapsed){
    card.classList.add("collapsed");
    card.querySelector(".toggle-arrow").textContent="▼";
  }
}

/* ── main render ─────────────────────────────────────────── */
function renderCategory(catKey){
  initModal();
  _modalCharts=[];

  const cfg=CHART_CONFIG[catKey];
  document.getElementById("cat-title").textContent=cfg.label;
  document.getElementById("cat-desc").textContent=cfg.desc;

  // Expand/collapse controls
  const grid=document.getElementById("chart-grid");
  const controls=document.createElement("div");
  controls.className="expand-controls";
  controls.innerHTML=`<button onclick="expandAll()" class="expand-btn">Expand All</button>
    <button onclick="collapseAll()" class="expand-btn">Collapse All</button>`;
  grid.parentNode.insertBefore(controls, grid);

  cfg.charts.forEach((c)=>{
    const d=CANADA_DATA[c.key];
    const canvasId=c.id||c.key;
    const title=c.title||d.title;
    const subtitle=c.subtitle||d.subtitle;
    const explain=c.explain||"";
    const verdict=c.verdict||"";
    const legendExplain=c.legendExplain||{};
    const modalIdx=_modalCharts.length;

    const allNames=c.seriesSubset||Object.keys(d.series);
    const shownSeries=allNames.filter(s=>d.series[s]&&isChartableSeries(d.series[s]));

    const legendItems=shownSeries.map((name,i)=>({
      name,color:PALETTE[i%PALETTE.length],
      explain:legendExplain[name]||""}));

    _modalCharts.push({title,explain,verdict,legendItems});

    const card=document.createElement("div");
    card.className="chart-card collapsed";

    const legendHtml=c.type==="horizontalBar"?"":buildHtmlLegend(shownSeries,legendExplain);
    const showRef=c.showRef===true||(!c.seriesSubset&&c.showRef!==false);
    const refHtml=(showRef&&d.refTable)?buildRefTable(d.refTable):"";
    const noteHtml=(showRef&&d.note)?`<div class="ref-note">${d.note}</div>`:"";

    card.innerHTML=`
      <div class="chart-header" onclick="toggleCard(this.closest('.chart-card'))">
        <div class="chart-header-text">
          <h3>${title}</h3>
          <p class="sub">${subtitle||""}</p>
        </div>
        <div class="chart-header-actions">
          <button class="info-btn" onclick="event.stopPropagation();openInfoModal(${modalIdx})">What does this mean?</button>
          <span class="toggle-arrow">▼</span>
        </div>
      </div>
      <div class="chart-body">
        ${legendHtml}
        <div class="chart-box"><canvas id="chart-${canvasId}"></canvas></div>
        ${refHtml}${noteHtml}
        <div class="src">${d.source||""}</div>
      </div>`;

    grid.appendChild(card);

    // Store lazy init function
    card._chartInited = false;
    card._chartInitFn = function(){
      const built=buildDataset(c.key,c.type,c.seriesSubset);
      const ctx=document.getElementById(`chart-${canvasId}`).getContext("2d");
      const opts=baseChartOptions();
      if(built.indexAxis)opts.indexAxis=built.indexAxis;
      new Chart(ctx,{
        type:built.chartType,
        data:{labels:built.labels,datasets:built.datasets},
        options:opts});
    };
  });
}
