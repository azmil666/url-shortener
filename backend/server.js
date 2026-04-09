import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './routes/url.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", urlRoutes);

const PORT = process.env.PORT || 10000;


console.log("ENV CHECK:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "MISSING");
console.log("PORT:", process.env.PORT);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("FATAL ERROR:", err);
    process.exit(1);
  }
}

startServer();