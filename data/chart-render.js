/* ── last-updated formatting ─────────────────────────────── */
function formatLastUpdated(iso){
  const d=new Date(iso+"T00:00:00");
  if(isNaN(d))return iso;
  return d.toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});
}

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
        borderWidth:1,padding:10}},
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
const CATEGORY_PAGES={
  economy:"economy.html",
  debt_fiscal:"debt-fiscal.html",
  demographics:"demographics.html",
  labour_inequality:"labour-inequality.html",
  social_fabric:"social-fabric.html",
  resources:"resources.html"
};

function resolveChartRef(id){
  for(const catKey in CHART_CONFIG){
    const cfg=CHART_CONFIG[catKey];
    const c=cfg.charts.find(ch=>(ch.id||ch.key)===id);
    if(c){
      const d=CANADA_DATA[c.key];
      return {id, title:c.title||(d&&d.title)||id, page:CATEGORY_PAGES[catKey]};
    }
  }
  return null;
}

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
    <div class="info-modal-threshold" id="info-modal-threshold" style="display:none">
      <span class="threshold-tag">Cited Threshold</span>
      <p id="threshold-text"></p>
    </div>
    <div class="info-modal-legend" id="info-modal-legend" style="display:none"></div>
    <div class="info-modal-related" id="info-modal-related" style="display:none"></div>
  </div>`;
  el.addEventListener("click",function(e){if(e.target===el)closeInfoModal();});
  document.body.appendChild(el);
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape")closeInfoModal();});
}

function openInfoModal(idx){
  openInfoModalData(_modalCharts[idx]);
}

function openInfoModalData(m){
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

  // cited threshold block — external, sourced benchmark (distinct from internal verdict)
  const thresholdBox=document.getElementById("info-modal-threshold");
  const thresholdText=document.getElementById("threshold-text");
  if(m.citedThreshold){
    thresholdText.textContent=m.citedThreshold;
    thresholdBox.style.display="";
  } else {
    thresholdBox.style.display="none";
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
  const relatedEl=document.getElementById("info-modal-related");
  if(m.relatedCharts&&m.relatedCharts.length){
    const currentPage=location.pathname.split("/").pop();
    const links=m.relatedCharts.map(id=>{
      const ref=resolveChartRef(id);
      if(!ref)return "";
      const href=(ref.page===currentPage||!ref.page)?`?chart=${encodeURIComponent(ref.id)}`:`${ref.page}?chart=${encodeURIComponent(ref.id)}`;
      return `<a class="related-chart-link" href="${href}">${ref.title}</a>`;
    }).join("");
    relatedEl.innerHTML=`<p class="info-modal-related-label">Related charts</p><div class="related-chart-links">${links}</div>`;
    relatedEl.style.display="";
  }else{
    relatedEl.style.display="none";
  }

  lockBodyScroll();
  document.getElementById("info-modal-overlay").classList.add("active");
}

let _scrollLockY=0;
function lockBodyScroll(){
  _scrollLockY=window.scrollY||window.pageYOffset||0;
  document.body.style.position="fixed";
  document.body.style.top=(-_scrollLockY)+"px";
  document.body.style.left="0";
  document.body.style.right="0";
}
function unlockBodyScroll(){
  document.body.style.position="";
  document.body.style.top="";
  document.body.style.left="";
  document.body.style.right="";
  window.scrollTo(0,_scrollLockY);
}

function closeInfoModal(){
  document.getElementById("info-modal-overlay").classList.remove("active");
  unlockBodyScroll();
}

/* ── share chart ──────────────────────────────────────────── */
function shareChart(canvasId, btnEl){
  const url=location.origin+location.pathname+"?chart="+encodeURIComponent(canvasId);
  const done=()=>{
    if(!btnEl)return;
    const orig=btnEl.textContent;
    btnEl.textContent="Copied";
    btnEl.classList.add("share-btn-copied");
    setTimeout(()=>{btnEl.textContent=orig;btnEl.classList.remove("share-btn-copied");},1500);
  };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(done).catch(()=>{prompt("Copy this link:",url);});
  }else{
    prompt("Copy this link:",url);
  }
}

function openSharedChart(){
  const params=new URLSearchParams(location.search);
  const target=params.get("chart");
  if(!target)return;
  const card=document.getElementById(`card-${target}`);
  if(!card)return;
  toggleCard(card,true);
  card.scrollIntoView({behavior:"smooth",block:"center"});
  card.classList.add("share-highlight");
  setTimeout(()=>card.classList.remove("share-highlight"),2200);
}

/* ── CSV export ───────────────────────────────────────────── */
const _csvExportMap={};

function csvEscape(val){
  if(val===null||val===undefined)return "";
  const s=String(val);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}

function downloadChartCSV(canvasId){
  const meta=_csvExportMap[canvasId];
  if(!meta)return;
  const d=CANADA_DATA[meta.dataKey];
  if(!d)return;
  const x=d.x||[];
  const header=[meta.xLabel||"X",...meta.seriesNames];
  const rows=[header];
  for(let i=0;i<x.length;i++){
    const row=[x[i]];
    for(const name of meta.seriesNames){
      const series=d.series[name]||[];
      row.push(series[i]===undefined?"":series[i]);
    }
    rows.push(row);
  }
  const csv=rows.map(r=>r.map(csvEscape).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  const safeName=(meta.title||canvasId).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  a.href=url;
  a.download=`northwatch-${safeName||canvasId}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── chart-as-image export ───────────────────────────────── */
function wrapCanvasText(ctx,text,maxWidth,maxLines){
  const words=text.split(" ");
  const lines=[];
  let line="";
  for(const word of words){
    const test=line?line+" "+word:word;
    if(ctx.measureText(test).width>maxWidth&&line){
      lines.push(line);
      line=word;
      if(lines.length===maxLines-1){
        // last allowed line — fill remainder and truncate with ellipsis if needed
        let rest=[line,...words.slice(words.indexOf(word)+1)].join(" ");
        while(ctx.measureText(rest+"…").width>maxWidth&&rest.length>1){
          rest=rest.slice(0,-1);
        }
        lines.push(rest.length<line.length?rest+"…":rest);
        return lines;
      }
    }else{
      line=test;
    }
  }
  if(line)lines.push(line);
  return lines;
}

function downloadChartImage(canvasId){
  const srcCanvas=document.getElementById(`chart-${canvasId}`);
  if(!srcCanvas)return;
  const meta=_csvExportMap[canvasId]||{};
  const title=meta.title||canvasId;
  const subtitle=meta.subtitle||"";

  const pad=40;
  const w=srcCanvas.width;
  const h=srcCanvas.height;

  // measure title/subtitle to size header dynamically
  const measureCtx=document.createElement("canvas").getContext("2d");
  measureCtx.font="bold 22px Inter, sans-serif";
  const titleLines=wrapCanvasText(measureCtx,title,w,2);
  const titleLineHeight=28;
  const subtitleHeight=subtitle?20:0;

  const topPad=28;
  const headerH=topPad+titleLines.length*titleLineHeight+subtitleHeight+16;
  const footerH=44;

  const out=document.createElement("canvas");
  out.width=w+pad*2;
  out.height=headerH+h+footerH;
  const ctx=out.getContext("2d");

  // background
  ctx.fillStyle="#f7f5f1";
  ctx.fillRect(0,0,out.width,out.height);

  // accent bar
  ctx.fillStyle="#c82d29";
  ctx.fillRect(0,0,out.width,5);

  // title
  ctx.fillStyle="#111110";
  ctx.font="bold 22px Inter, sans-serif";
  ctx.textBaseline="top";
  titleLines.forEach((line,i)=>ctx.fillText(line,pad,topPad+i*titleLineHeight));

  // subtitle
  if(subtitle){
    ctx.fillStyle="#7a7670";
    ctx.font="14px Inter, sans-serif";
    ctx.fillText(subtitle,pad,topPad+titleLines.length*titleLineHeight+2);
  }

  // chart
  ctx.drawImage(srcCanvas,pad,headerH,w,h);

  // footer divider + attribution
  ctx.strokeStyle="rgba(17,17,16,0.15)";
  ctx.beginPath();
  ctx.moveTo(pad,headerH+h+16);
  ctx.lineTo(out.width-pad,headerH+h+16);
  ctx.stroke();

  ctx.fillStyle="#7a7670";
  ctx.font="13px Inter, sans-serif";
  ctx.textBaseline="top";
  ctx.fillText("thenorthwatch.ca",pad,headerH+h+24);

  const url=out.toDataURL("image/png");
  const a=document.createElement("a");
  const safeName=(title||canvasId).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  a.href=url;
  a.download=`northwatch-${safeName||canvasId}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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

    if(c.sectionHeader){
      const section=document.createElement("div");
      section.className="chart-section-header";
      section.innerHTML=`<h3>${c.sectionHeader}</h3>${c.sectionSubhead?`<p>${c.sectionSubhead}</p>`:""}`;
      grid.appendChild(section);
    }

    const allNames=c.seriesSubset||Object.keys(d.series);
    const shownSeries=allNames.filter(s=>d.series[s]&&isChartableSeries(d.series[s]));

    const legendItems=shownSeries.map((name,i)=>({
      name,color:PALETTE[i%PALETTE.length],
      explain:legendExplain[name]||""}));

    _modalCharts.push({title,explain,verdict,legendItems,citedThreshold:c.citedThreshold||"",relatedCharts:c.relatedCharts||[]});

    _csvExportMap[canvasId]={dataKey:c.key,seriesNames:shownSeries,xLabel:d.xLabel||"",title,subtitle:subtitle||""};

    const card=document.createElement("div");
    card.className="chart-card collapsed";
    card.id=`card-${canvasId}`;

    const legendHtml=c.type==="horizontalBar"?"":buildHtmlLegend(shownSeries,legendExplain);
    const showRef=c.showRef===true||(!c.seriesSubset&&c.showRef!==false);
    const refHtml=(showRef&&d.refTable)?buildRefTable(d.refTable):"";
    const noteHtml=(showRef&&d.note)?`<div class="ref-note">${d.note}</div>`:"";
    const thresholdBadgeHtml=c.citedThreshold?`<span class="cited-badge" title="This chart has a real, citable external threshold — see 'What does this mean?'">Cited Threshold</span>`:"";

    card.innerHTML=`
      <div class="chart-header" onclick="toggleCard(this.closest('.chart-card'))">
        <div class="chart-header-text">
          <h3>${title}${thresholdBadgeHtml}</h3>
          <p class="sub">${subtitle||""}</p>
        </div>
        <div class="chart-header-actions">
          <button class="share-btn" onclick="event.stopPropagation();shareChart('${canvasId}', this)" title="Copy link to this chart">Share</button>
          <button class="csv-btn" onclick="event.stopPropagation();downloadChartCSV('${canvasId}')" title="Download this chart's data as CSV">CSV</button>
          <button class="img-btn" onclick="event.stopPropagation();downloadChartImage('${canvasId}')" title="Download this chart as a branded PNG image">Image</button>
          <button class="info-btn" onclick="event.stopPropagation();openInfoModal(${modalIdx})">What does this mean?</button>
          <span class="toggle-arrow">▼</span>
        </div>
      </div>
      <div class="chart-body">
        ${legendHtml}
        <div class="chart-box"><canvas id="chart-${canvasId}"></canvas></div>
        ${refHtml}${noteHtml}
        <div class="src">${d.source||""}${d.lastUpdated?` <span class="last-updated">· Data verified current as of ${formatLastUpdated(d.lastUpdated)}</span>`:""}</div>
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

  openSharedChart();
}
