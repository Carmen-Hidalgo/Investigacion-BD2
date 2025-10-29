import sendSensorData from "./producer.js";

const sensors = {
  temperatura: [15, 45],
  humedad: [10, 90],
  viento: [0, 100],
  precipitacion: [0, 100],
  agua: [0, 3],
  sismo: [0, 7],
};

function simulate() {
  for (const [sensor, [min, max]] of Object.entries(sensors)) {
    const value = (Math.random() * (max - min) + min).toFixed(2);
    sendSensorData(sensor, parseFloat(value));
  }
}

setInterval(simulate, 3000);
