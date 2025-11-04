import metricPage from "../shared/metricPage.js";
export default () =>
  metricPage({
    key: "humidity",
    label: "Humidity",
    unit: "%",
    range: [10, 90],
    decimals: 0,
    thresholds: { warn: 70, critical: 85 },
  });
