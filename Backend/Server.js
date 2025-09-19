import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscribeRoutes from "./routes/subscribe.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Updated CORS to include production URL
app.use(cors({
  origin: [
    "https://loanmate-platform.vercel.app", // ✅ Add your production URL
    "http://localhost:5173",                // Local development
    "http://localhost:3000",                // Alternative dev port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.options('*', cors());

app.get("/", (req, res) => res.send("API running - LoanMate Backend"));
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Subscribe endpoint: http://localhost:${PORT}/api/subscribe`);
    });
  })
  .catch(err => console.log("DB connection error:", err));
