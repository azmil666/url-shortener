import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/url.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("FATAL ERROR:", err.message);
    process.exit(1);
  }
}

startServer();