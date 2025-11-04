from streamparse import Spout
from kafka import KafkaConsumer
import json

class KafkaSensorSpout(Spout):
    outputs = ["sensor", "value", "timestamp"]

    def initialize(self, stormconf, context):
        self.consumer = KafkaConsumer(
            "sensor-data",
            bootstrap_servers=["kafka:29092"], 
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            auto_offset_reset="latest",
            enable_auto_commit=True,
            group_id="storm-meteo-group"
        )
        self.log("KafkaSensorSpoutlisteting to sensor-data")

    def next_tuple(self):
        for msg in self.consumer:
            data = msg.value
            sensor = data.get("sensor")
            value = data.get("value")
            timestamp = data.get("timestamp")
            self.emit([sensor, value, timestamp])
            self.log(f"From Kafka: {data}")
            break