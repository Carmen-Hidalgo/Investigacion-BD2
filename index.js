// server.js
import express from "express";

// Para enviar info al dashboard
import { setupSSE } from "./meteo-dashboard/src/sse.js";
import "./meteo-prototype/api/kafka-consumer.js";

// Páginas de cada dashboard
import home from "./meteo-dashboard/web/pages/home/home.js";
import temperature from "./meteo-dashboard/web/pages/meteo/temperature/temperature.js";
import humidity from "./meteo-dashboard/web/pages/meteo/humidity/humidity.js";
import wind from "./meteo-dashboard/web/pages/meteo/wind/wind.js";
import precipitation from "./meteo-dashboard/web/pages/meteo/precipitation/precipitation.js";
import water from "./meteo-dashboard/web/pages/meteo/water/water.js";
import seismic from "./meteo-dashboard/web/pages/meteo/seismic/seismic.js";

const app = express();
const PORT = process.env.PORT || 4000;

setupSSE(app);
app.use(express.static("pages"));

// Pantalla de home
app.get("/", (req, res) => res.send(home()));

// Pantallas de todo lo que se está midiendo
app.get("/meteo", (req, res) => res.redirect("/meteo/temperature"));
app.get("/meteo/temperature", (req, res) => res.send(temperature()));
app.get("/meteo/humidity", (req, res) => res.send(humidity()));
app.get("/meteo/wind", (req, res) => res.send(wind()));
app.get("/meteo/precipitation", (req, res) => res.send(precipitation()));
app.get("/meteo/water", (req, res) => res.send(water()));
app.get("/meteo/seismic", (req, res) => res.send(seismic()));

app.listen(PORT, () =>
  console.log(`✅ Dashboard running on http://localhost:${PORT}`)
);
