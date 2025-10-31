import metricPage from "../shared/metricPage.js";
export default () =>
  metricPage({
    key: "water",
    label: "Water Level",
    unit: "m",
    range: [0, 3],
    decimals: 2,
    thresholds: { warn: 1.8, critical: 2.3 },
  });
