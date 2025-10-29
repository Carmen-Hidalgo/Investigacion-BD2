from streamparse import Bolt
import pymongo
import json
import os
import requests

class AlertBolt(Bolt):
    def initialize(self, conf, context):
        self.mongo = pymongo.MongoClient(os.getenv("MONGO_URI")).meteo.readings
        self.thresholds = {
            "temperatura": [35, 40],
            "humedad": [20, 10],
            "viento": [60, 80],
            "precipitacion": [50, 80],
            "agua": [1.5, 2],
            "sismo": [4.0, 6.0]
        }
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.chat_id = os.getenv("TELEGRAM_CHAT_ID")

    def process(self, tup):
        msg = json.loads(tup.values[0])
        sensor, value = msg["sensor"], msg["value"]
        alert = False
        level = "Normal"
        alert_msg = None

        if sensor in self.thresholds:
            warn, crit = self.thresholds[sensor]
            if value >= crit:
                alert, level, alert_msg = True, "Crítico", f"⚠️ ALERTA CRÍTICA: {sensor} = {value}"
            elif value >= warn:
                alert, level, alert_msg = True, "Alerta", f"⚠️ Alerta: {sensor} = {value}"

        self.mongo.insert_one({
            "sensor": sensor,
            "value": value,
            "timestamp": msg["timestamp"],
            "alert": alert,
            "level": level
        })

        if alert_msg:
            self.notify_telegram(alert_msg)
            self.log(alert_msg)

    def notify_telegram(self, text):
        try:
            url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
            payload = {"chat_id": self.chat_id, "text": text}
            requests.post(url, json=payload)
        except Exception as e:
            self.log(f"Telegram error: {e}")
