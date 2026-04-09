import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import urlRoutes from "./routes/url.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;

console.log("MONGO_URI:", process.env.MONGO_URI ? "OK" : "MISSING");
console.log("PORT:", PORT);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });