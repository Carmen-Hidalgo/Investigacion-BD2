import metricPage from "../shared/metricPage.js";
export default () =>
  metricPage({
    key: "seismic",
    label: "Seismic",
    unit: "RMS°",
    range: [0, 7],
    decimals: 2,
    thresholds: { warn: 4.5, critical: 5.8 },
  });
