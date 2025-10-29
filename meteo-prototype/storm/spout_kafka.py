from streamparse import Spout
from kafka import KafkaConsumer
import os

class KafkaSensorSpout(Spout):
    outputs = ['message']

    def initialize(self, stormconf, context):
        broker = os.getenv("KAFKA_BROKER")
        topic = os.getenv("KAFKA_TOPIC")
        self.consumer = KafkaConsumer(topic, bootstrap_servers=[broker],
                                      auto_offset_reset='latest', group_id='storm-consumer')

    def next_tuple(self):
        for msg in self.consumer:
            self.emit([msg.value.decode('utf-8')])
