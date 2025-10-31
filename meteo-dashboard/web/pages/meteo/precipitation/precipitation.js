import metricPage from "../shared/metricPage.js";
export default () =>
  metricPage({
    key: "precipitation",
    label: "Precipitation",
    unit: "mm/h",
    range: [0, 100],
    decimals: 0,
    thresholds: { warn: 40, critical: 70 },
  });
