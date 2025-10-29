import Kafka from "kafka-node";
import dotenv from "dotenv";
dotenv.config();

const client = new Kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new Kafka.Producer(client);

let ready = false;

producer.on("ready", () => {
  ready = true;
  console.log("✅ Productor conectado a Kafka:", process.env.KAFKA_BROKER);
});

producer.on("error", (err) => console.error("❌ Kafka error:", err));

export default function sendSensorData(sensor, value) {
  if (!ready) {
    console.warn("⚠️ Productor aún no está listo. Mensaje omitido.");
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
    if (err) console.error("Error enviando mensaje a Kafka:", err);
    else console.log(`📤 Enviado a Kafka: ${sensor}=${value}`);
  });
}
