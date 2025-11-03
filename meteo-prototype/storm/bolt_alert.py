from streamparse import Bolt
from pymongo import MongoClient
import requests, time, json, threading
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry


class AlertBolt(Bolt):
    def initialize(self, conf, context):
        self.log("✅ AlertBolt initialized with batching...")

        #MongoDB Atlas
        try:
            self.mongo = MongoClient(
                "MONGO URI HERE"
            )
            self.db = self.mongo["meteo"]
            self.collection = self.db["sensor_data"]
            self.log("✅ Connected to MongoDB Atlas")
        except Exception as e:
            self.log(f"❌ MongoDB connection failed: {e}")
            self.mongo = None

        # Telegram config
        self.telegram_token = "Telegram Bot Token Here"
        self.chat_id = "Telegram Chat ID Here"
        self.telegram_url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"

        # HTTP Session with retry
        self.session = requests.Session()
        retry = Retry(connect=3, backoff_factor=1)
        self.session.mount("https://", HTTPAdapter(max_retries=retry))

        # Buffer de alertas (lista en memoria)
        self.alert_buffer = []
        self.buffer_lock = threading.Lock()

        # ⏱️ Hilo para enviar cada 10 s
        self.sender_thread = threading.Thread(target=self._send_buffer_periodically, daemon=True)
        self.sender_thread.start()

    # =======================================================
    # Envío periódico de alertas agrupadas
    # =======================================================
    def _send_buffer_periodically(self):
        while True:
            try:
                time.sleep(10)  # cada 10 segundos
                with self.buffer_lock:
                    if not self.alert_buffer:
                        continue

                    # Unir todas las alertas pendientes
                    combined = "🚨 *METEO ALERT SUMMARY*\n\n" + "\n\n".join(self.alert_buffer)
                    self._send_telegram(combined)
                    self.alert_buffer.clear()
            except Exception as e:
                self.log(f"❌ Error in buffer sender thread: {e}")

    # =======================================================
    # Envío a Telegram con control de errores y pausas
    # =======================================================
    def _send_telegram(self, message, parse_mode="Markdown"):
        try:
            data = {"chat_id": self.chat_id, "text": message, "parse_mode": parse_mode}
            resp = self.session.post(self.telegram_url, data=data, timeout=10)

            if resp.status_code == 200:
                self.log("Telegram batch sent successfully.")
            elif resp.status_code == 429:
                retry_after = json.loads(resp.text).get("parameters", {}).get("retry_after", 60)
                self.log(f"Rate limit hit — sleeping {retry_after}s...")
                time.sleep(retry_after)
            else:
                self.log(f"Telegram API error {resp.status_code}: {resp.text}")

            time.sleep(0.7)  # evita saturar

        except Exception as e:
            self.log(f"❌ Error sending Telegram message: {e}")

    # =======================================================
    # Procesamiento principal
    # =======================================================
    def process(self, tup):
        if not self.mongo:
            return

        try:
            sensor, value, timestamp = tup.values
            self.collection.insert_one({"sensor": sensor, "value": value, "timestamp": timestamp})

            alert_msg = None
            if sensor == "Temp" and value > 35:
                alert_msg = f"🔥 *High Temp:* {value}°C\n🕓 `{timestamp}`"
            elif sensor == "WaterLevel" and value > 3:
                alert_msg = f"🌊 *Water Level:* {value} m\n🕓 `{timestamp}`"
            elif sensor == "seism" and 5 < value < 7:
                alert_msg = f"🌋 *Seismic Activity:* {value} Richter\n🕓 `{timestamp}`"
            elif sensor == "seism" and value >= 7:
                alert_msg = f"🌋 *EARTHQUAKE:* {value} Richter\n🕓 `{timestamp}`"
            elif sensor == "Wind" and value > 80:
                alert_msg = f"💨 *Wind Speed:* {value} km/h\n🕓 `{timestamp}`"
            elif sensor == "Precipitation" and value > 60:
                alert_msg = f"🌧️ *Rainfall:* {value} mm/h\n🕓 `{timestamp}`"
            elif sensor == "Humidity" and value > 60:
                alert_msg = f"💧 *Humidity:* {value}%\n🕓 `{timestamp}`"

            if alert_msg:
                with self.buffer_lock:
                    self.alert_buffer.append(alert_msg)

        except Exception as e:
            self.log(f"❌ Error processing tuple: {e}")
