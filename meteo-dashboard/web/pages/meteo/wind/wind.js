import metricPage from "../shared/metricPage.js";
export default () =>
  metricPage({
    key: "wind",
    label: "Wind",
    unit: "km/h",
    range: [0, 100],
    decimals: 0,
    thresholds: { warn: 60, critical: 80 },
  });
