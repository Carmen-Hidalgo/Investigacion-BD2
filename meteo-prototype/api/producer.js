import Kafka from "kafka-node";
import dotenv from "dotenv";
dotenv.config();

const client = new Kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new Kafka.Producer(client);

let ready = false;

producer.on("ready", () => {
  ready = true;
  console.log("✅ Productor Connected to Kafka:", process.env.KAFKA_BROKER);
});

producer.on("error", (err) => console.error("❌ Kafka error:", err));

export default function sendSensorData(sensor, value) {
  if (!ready) {
    console.warn("⚠️ Productor not ready yet, Message ignored.");
    return;
  }

  const payloads = [
    {
      topic: process.env.KAFKA_TOPIC,
      messages: JSON.stringify({
        sensor,
        value,
        timestamp: new Date().toISOString(),
      }),
    },
  ];

  producer.send(payloads, (err, data) => {
    if (err) console.error("Error sending to Kafka:", err);
    else console.log(`📤 Sended to Kafka: ${sensor} = ${value}`);
  });
}
