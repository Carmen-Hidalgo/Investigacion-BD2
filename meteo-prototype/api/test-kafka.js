import Kafka from "kafka-node";

const client = new Kafka.KafkaClient({ kafkaHost: "34.16.124.196:9092" });

client.on("ready", () => console.log("✅ Conectado a Kafka"));
client.on("error", (err) => console.error("❌ Error:", err));
