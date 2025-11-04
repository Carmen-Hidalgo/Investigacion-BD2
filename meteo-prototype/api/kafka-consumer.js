import Kafka from "kafka-node";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { emitReading } from "../../meteo-dashboard/src/sse.js";

// .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Kafka consumer broker =", process.env.KAFKA_BROKER);

// Connect to Kafka
const kafkaHost = process.env.KAFKA_BROKER;
const client = new Kafka.KafkaClient({ kafkaHost });

// Create an instance so Kafka returns all new messages
// that appear on the sensor-data topic
const consumer = new Kafka.Consumer(
  client,
  [{ topic: process.env.KAFKA_TOPIC, partition: 0 }],
  { autoCommit: true }
);

// Runs every time a new value is added
consumer.on("message", (msg) => {
  try {
    const reading = JSON.parse(msg.value);
    reading.sensor = String(reading.sensor || "").toLowerCase();
    // Call function that displays the value on the dashboard
    emitReading(reading);
    console.log(`📡 Kafka → dashboard: ${reading.sensor}=${reading.value}`);
  } catch (err) {
    console.error("❌ Error parsing Kafka message:", err);
  }
});

consumer.on("error", (err) => console.error("❌ Kafka consumer error:", err));
console.log("Kafka consumer running…");
