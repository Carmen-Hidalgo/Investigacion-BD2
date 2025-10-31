const home = () => {
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Meteo • Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root{ --bg:#0b0d10; --panel:#12161c; --muted:#9fb0c8; --line:#2a3340; --text:#e7eef7; --accent:#5aa9ff; }
      *{box-sizing:border-box}
      body{margin:0; font-family:system-ui,arial,segoe ui; background:var(--bg); color:var(--text)}
      .topbar{ position:sticky; top:0; z-index:20; display:flex; gap:12px; align-items:center; justify-content:space-between;
               padding:12px 18px; border-bottom:1px solid #0e1218; background:rgba(11,13,16,.6); backdrop-filter:blur(4px) }
      .logo{width:28px;height:28px;border-radius:10px;display:grid;place-items:center;background:#12161c;border:1px solid #ffffff18}
      .wrap{ max-width:1100px; margin:0 auto; padding:24px }
      .grid{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) }
      .card{ background:#0f1217; border:1px solid #ffffff18; border-radius:16px; padding:16px; display:flex; flex-direction:column; gap:12px }
      a.btn{ text-decoration:none; padding:10px 12px; border-radius:10px; border:1px solid var(--line); background:#0f1217; color:var(--text); display:inline-flex; gap:8px; align-items:center; justify-content:center }
      .muted{ color:var(--muted) }
      .title{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:12px }
      .badge{font-size:12px;padding:4px 8px;border-radius:999px;border:1px solid #ffffff1a;background:#5aa9ff26}
    </style>
  </head>
  <body>
    <header class="topbar">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="logo">⛅</div><strong>Meteorology • Dashboard</strong>
      </div>
      <span class="muted" id="clock"></span>
    </header>

    <div class="wrap">
      <div class="title">
        <h2>Choose a panel</h2>
        <span class="badge">Demo data (simulation)</span>
      </div>

      <section class="grid">
        <div class="card">
          <h3>🌡️ Temperature</h3>
          <p class="muted">Gauge + sparkline, thresholds (35/40 °C).</p>
          <a class="btn" href="/meteo/temperature">Open panel</a>
        </div>
        <div class="card">
          <h3>💧 Humidity</h3>
          <p class="muted">Relative humidity range 10–90%.</p>
          <a class="btn" href="/meteo/humidity">Open panel</a>
        </div>
        <div class="card">
          <h3>🍃 Wind</h3>
          <p class="muted">Wind speed 0–100 km/h.</p>
          <a class="btn" href="/meteo/wind">Open panel</a>
        </div>
        <div class="card">
          <h3>🌧️ Precipitation</h3>
          <p class="muted">Rain rate 0–100 mm/h.</p>
          <a class="btn" href="/meteo/precipitation">Open panel</a>
        </div>
        <div class="card">
          <h3>🌊 Water Level</h3>
          <p class="muted">River level 0–3 m.</p>
          <a class="btn" href="/meteo/water">Open panel</a>
        </div>
        <div class="card">
          <h3>📈 Seismic</h3>
          <p class="muted">Vibration (RMS) 0–7.</p>
          <a class="btn" href="/meteo/seismic">Open panel</a>
        </div>
      </section>
    </div>

    <script>
      setInterval(()=>{ document.getElementById("clock").textContent = new Date().toLocaleString(); },1000);
    </script>
  </body>
  </html>
  `;
};
export default home;
