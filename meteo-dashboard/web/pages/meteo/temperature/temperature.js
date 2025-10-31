import metricPage from "../shared/metricPage.js";
const temperature = () =>
  metricPage({
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    range: [15, 45],
    decimals: 1,
    thresholds: { warn: 35, critical: 40 },
  });
export default temperature;
