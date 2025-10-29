(defn meteo-topology []
  (topology
    {"sensor-spout" (spout-spec (python-spout "spout_kafka.py"))}
    {"alert-bolt" (bolt-spec {"sensor-spout" :shuffle}
                             (python-bolt "bolt_alert.py"))}))
