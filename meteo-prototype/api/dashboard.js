import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
await mongoose.connect(process.env.MONGO_URI);

const Reading = mongoose.model("Reading", new mongoose.Schema({
  sensor: String,
  value: Number,
  level: String,
  alert: Boolean,
  timestamp: Date
}));

app.get("/alerts", async (req, res) => {
  const alerts = await Reading.find({ alert: true }).sort({ timestamp: -1 }).limit(20);
  res.json(alerts);
});

app.listen(4000, () => console.log("🌍 Dashboard API en puerto 4000"));
