/* ═══════════════════════════════════════════════════════
   NORTHWATCH INDEX — Formula Engine
   Five pillars, each normalized 0-100, then weighted.
   Each metric: (current - critical) / (healthy - critical) × 100
   Clamped 0-100.
═══════════════════════════════════════════════════════ */

const RWI = (function(){

  function normalize(current, healthy, critical){
    const score = (current - critical) / (healthy - critical) * 100;
    return Math.max(0, Math.min(100, score));
  }

  // ── PILLAR 1: Economic Health (25%) ──────────────────
  const economic = {
    label: "Economic Health",
    weight: 0.25,
    metrics: [
      { name: "GDP Per Capita Trend",       score: normalize(97,  110, 70)  },  // index ~97, healthy=110, critical=70
      { name: "G7 Productivity Rank",       score: normalize(1,   7,   1)   },  // rank 7 of 7 → score 0. Inverted: (7-7)/(7-1)=0
      { name: "US Export Concentration",    score: normalize(80,  40,  90)  },  // 80% to US; healthy=40%, critical=90%
    ]
  };
  // Fix productivity: rank 7 = worst, score 0
  economic.metrics[1].score = normalize(7, 1, 7); // inverted: lower rank = worse

  // ── PILLAR 2: Fiscal Sustainability (25%) ────────────
  const fiscal = {
    label: "Fiscal Sustainability",
    weight: 0.25,
    metrics: [
      { name: "Household Debt-to-Income",   score: normalize(179.6, 80,  200) },
      { name: "Federal Debt (% GDP)",       score: normalize(42,    20,  70)  },
      { name: "House Price-to-Income",      score: normalize(9.5,   3,   12)  },
    ]
  };

  // ── PILLAR 3: Demographic Vitality (20%) ─────────────
  const demographic = {
    label: "Demographic Vitality",
    weight: 0.20,
    metrics: [
      { name: "Total Fertility Rate",       score: normalize(1.35,  2.1, 1.0) },
      { name: "Age Dependency Ratio",       score: normalize(54,    40,  65)  },  // lower is healthier, inverted
      { name: "Immigration Share of Growth",score: normalize(95,    30,  100) },  // lower % = more endogenous, healthier
    ]
  };
  // Age dependency: lower = healthier, so invert
  demographic.metrics[1].score = normalize(54, 65, 40); // wait - actually higher dependency = worse
  // normalize(current, healthy, critical): healthy=40(low dep), critical=65(high dep)
  demographic.metrics[1].score = normalize(54, 40, 65);

  // ── PILLAR 4: Social Cohesion (20%) ──────────────────
  const social = {
    label: "Social Cohesion",
    weight: 0.20,
    metrics: [
      { name: "Social Trust Index",         score: normalize(28,    55,  15)  },
      { name: "Opioid Deaths (annual)",     score: normalize(7560,  500, 10000)},
      { name: "Voter Turnout",              score: normalize(63,    75,  50)  },
    ]
  };

  // ── PILLAR 5: Labour & Equality (10%) ────────────────
  const labour = {
    label: "Labour & Equality",
    weight: 0.10,
    metrics: [
      { name: "Labour Force Participation", score: normalize(64.1,  68,  58)  },
      { name: "Real Wage Growth",           score: normalize(-1.2,  2,  -3)   },
      { name: "Labour Share of GDP",        score: normalize(53.2,  58,  48)  },
    ]
  };

  const pillars = [economic, fiscal, demographic, social, labour];

  pillars.forEach(p => {
    p.score = Math.round(p.metrics.reduce((s,m) => s + m.score, 0) / p.metrics.length);
  });

  const total = Math.round(
    pillars.reduce((s, p) => s + p.score * p.weight, 0)
  );

  return { total, pillars };

})();

function getRWIColor(score){
  if(score <= 33) return "#c82d29";
  if(score <= 55) return "#c9853a";
  return "#5a8c4f";
}

function getRWILabel(score){
  if(score <= 25) return "Critical";
  if(score <= 40) return "Severe";
  if(score <= 55) return "Stressed";
  if(score <= 70) return "Moderate";
  return "Stable";
}

function renderRWI(){
  const el = document.getElementById("rwi-section");
  if(!el) return;

  const { total, pillars } = RWI;
  const color = getRWIColor(total);
  const verdict = getRWILabel(total);

  el.innerHTML = `
    <div class="rwi-wrap">
      <div class="rwi-header">
        <span class="rwi-eyebrow">THE NORTHWATCH INDEX</span>
        <span class="rwi-quarter">Q2 2026</span>
      </div>
      <div class="rwi-score-row">
        <div class="rwi-score-block">
          <span class="rwi-number" style="color:${color}">${total}</span>
          <span class="rwi-denom">/100</span>
        </div>
        <div class="rwi-verdict-block">
          <span class="rwi-verdict-badge" style="background:${color}">${verdict}</span>
          <p class="rwi-desc">A composite score across five structural pillars. Lower is worse. Canada currently scores <strong>${total}/100</strong> — rated <strong>${verdict}</strong>.</p>
        </div>
      </div>
      <div class="rwi-bar-wrap">
        <div class="rwi-bar-track">
          <div class="rwi-bar-fill" style="width:${total}%;background:${color}"></div>
        </div>
      </div>
      <div class="rwi-pillars">
        ${pillars.map(p => {
          const c = getRWIColor(p.score);
          return `<div class="rwi-pillar">
            <div class="rwi-pillar-score" style="color:${c}">${p.score}</div>
            <div class="rwi-pillar-name">${p.label}</div>
            <div class="rwi-pillar-weight">${Math.round(p.weight*100)}% weight</div>
          </div>`;
        }).join("")}
      </div>
      <p class="rwi-footer">Methodology: each metric normalized 0–100 against a defined healthy ceiling and critical floor. Pillar scores are unweighted averages of their metrics. Final score is a weighted average of all five pillars. <a href="methodology.html">Full methodology →</a></p>
    </div>`;
}
