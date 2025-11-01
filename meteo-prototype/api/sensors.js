import sendSensorData from "./producer.js";


const sensors = {
  Temp: [15, 45],
  Humidity: [10, 90],
  Wind: [0, 100],
  Precipitation: [0, 100],
  WaterLevel: [0, 3],
  seism: [0, 9],
};

function simulate() {
  for (const [sensor, [min, max]] of Object.entries(sensors)) {
    const value = (Math.random() * (max - min) + min).toFixed(2);
    sendSensorData(sensor, parseFloat(value));

  }
}

setInterval(simulate, 3000);
