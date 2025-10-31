const metricPage = ({
  key,
  label,
  unit,
  range,
  decimals = 1,
  thresholds: { warn, critical },
}) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${label} • Meteo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root{ --bg:#0b0d10; --panel:#12161c; --muted:#9fb0c8; --line:#2a3340; --text:#e7eef7; --accent:#5aa9ff; }
    *{box-sizing:border-box}
    body{margin:0; font-family:system-ui,arial,segoe ui; background:var(--bg); color:var(--text)}
    a,button,input{font:inherit}
    .btn{ padding:10px 12px; border-radius:10px; border:1px solid var(--line); background:#0f1217; color:var(--text); cursor:pointer; text-decoration:none }
    .topbar{ position:sticky; top:0; z-index:10; display:flex; align-items:center; gap:12px; padding:12px 18px;
             border-bottom:1px solid #0e1218; background:rgba(11,13,16,.6); backdrop-filter:blur(4px) }
    .logo{width:28px;height:28px;border-radius:10px;display:grid;place-items:center;background:#12161c;border:1px solid #ffffff18}
    .wrap{ max-width:1100px; margin:0 auto; padding:20px }
    .card{ background:#0f1217; border:1px solid #ffffff18; border-radius:16px; padding:16px }
    .grid{ display:grid; gap:16px; grid-template-columns: repeat(12, 1fr) }
    .muted{ color:var(--muted) }

    .gauge{position:relative;width:140px;height:140px;border-radius:50%;
      background:conic-gradient(var(--ring, #5aa9ff) var(--pct, 0%), #ffffff10 0)}
    .gauge::after{content:"";position:absolute;inset:12px;border-radius:50%;
      background:#0f1217;border:1px solid #ffffff10}
    .gauge-text{position:absolute;inset:0;display:grid;place-items:center;font-weight:600}
    .kpi{font-size:38px;font-weight:800}
    .badge{font-size:12px;padding:4px 8px;border-radius:999px;border:1px solid #ffffff1a}
    .ok{background:#10b98133;color:#9ae6b4;border-color:#10b98166}
    .warn{background:#f59e0b33;color:#fde68a;border-color:#f59e0b66}
    .crit{background:#ef444433;color:#fecaca;border-color:#ef444466}

    .tabs{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px}
    .tab{padding:8px 12px;border-radius:14px;border:1px solid #ffffff1a;text-decoration:none;color:var(--text)}
    .active{background:#12161c;border-color:#ffffff33}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>
  <div class="topbar">
    <div class="logo">⛅</div>
    <div style="font-weight:600">${label} • Meteo</div>
    <div style="margin-left:auto" class="muted" id="clock"></div>
    <a class="btn" href="/">Home</a>
  </div>

  <div class="wrap">
    <nav class="tabs">
      <a class="tab ${
        key === "temperature" ? "active" : ""
      }"   href="/meteo/temperature">🌡️ Temperature</a>
      <a class="tab ${
        key === "humidity" ? "active" : ""
      }"      href="/meteo/humidity">💧 Humidity</a>
      <a class="tab ${
        key === "wind" ? "active" : ""
      }"          href="/meteo/wind">🍃 Wind</a>
      <a class="tab ${
        key === "precipitation" ? "active" : ""
      }" href="/meteo/precipitation">🌧️ Precipitation</a>
      <a class="tab ${
        key === "water" ? "active" : ""
      }"         href="/meteo/water">🌊 Water Level</a>
      <a class="tab ${
        key === "seismic" ? "active" : ""
      }"       href="/meteo/seismic">📈 Seismic</a>
    </nav>

    <div class="grid">
      <div class="card" style="grid-column: span 4;">
        <div style="display:flex; align-items:center; justify-content:center">
          <div class="gauge" id="g"><div class="gauge-text">
            <div>
              <div class="muted" style="text-align:center">Level</div>
              <div id="pct" class="kpi">0%</div>
            </div>
          </div></div>
        </div>
      </div>

      <div class="card" style="grid-column: span 4;">
        <div style="display:flex; align-items:center; justify-content:space-between">
          <div>
            <div class="muted">Latest</div>
            <div id="latest" class="kpi">--</div>
            <div class="muted" style="margin-top:6px;">Range: ${range[0]} – ${
  range[1]
} ${unit}</div>
          </div>
          <span id="badge" class="badge ok">Normal</span>
        </div>
      </div>

      <div class="card" style="grid-column: span 12;">
        <canvas id="c" height="170"></canvas>
      </div>
    </div>

    <p class="muted" style="text-align:center;margin-top:8px">Demo only — values simulated every 3 seconds.</p>
  </div>

<script>
(function(){
  const cfg = {
    key: "${key}", label: "${label}", unit: "${unit}",
    range: [${range[0]}, ${range[1]}], decimals: ${decimals},
    thresholds: { warn: ${warn}, critical: ${critical} }
  };
  const clamp = (v,min,max) => Math.max(min, Math.min(max, v));
  const next = (prev,[min,max]) => {
    const drift = (Math.random()-0.5)*(max-min)*0.02;
    const event = Math.random()<0.04 ? (Math.random()-0.5)*(max-min)*0.25 : 0;
    return clamp(prev + drift + event, min, max);
  };
  const pct = (v,[min,max]) => ((v-min)/(max-min))*100;

  const ctx = document.getElementById("c");
  const labels = []; const data = [];
  const chart = new Chart(ctx, {
    type:"line",
    data:{ labels, datasets:[{ data, borderWidth:2, pointRadius:0, tension:.3 }]},
    options:{ animation:false, plugins:{legend:{display:false}},
      scales:{ y:{ min: cfg.range[0], max: cfg.range[1] }, x:{ ticks:{display:false}, grid:{display:false} } }
    }
  });

  let cur = (cfg.range[0]+cfg.range[1])/2;
  function tick(){
    cur = parseFloat(next(cur, cfg.range).toFixed(cfg.decimals));
    const t = new Date().toLocaleTimeString();
    labels.push(t); data.push(cur);
    if(labels.length>30){ labels.shift(); data.shift(); }
    chart.update();

    document.getElementById("latest").textContent = cur.toFixed(cfg.decimals) + " " + cfg.unit;
    const p = Math.round(pct(cur, cfg.range));
    const g = document.getElementById("g");
    g.style.setProperty("--pct", p + "%"); g.style.setProperty("--ring", "#5aa9ff");
    document.getElementById("pct").textContent = p + "%";
    const b = document.getElementById("badge");
    const st = cur>=cfg.thresholds.critical ? "crit" : cur>=cfg.thresholds.warn ? "warn" : "ok";
    b.className = "badge " + st;
    b.textContent = st==="ok" ? "Normal" : (st==="warn" ? "Warning" : "Critical");
  }
  for(let i=0;i<5;i++) tick();
  setInterval(tick, 3000);
  setInterval(()=>{ document.getElementById("clock").textContent = new Date().toLocaleString(); }, 1000);
})();
</script>
</body>
</html>
`;
export default metricPage;
