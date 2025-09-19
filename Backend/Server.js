import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscribeRoutes from "./routes/subscribe.js";
import forgotPasswordRoutes from "./routes/forgotPassword.js"; // ✅ Import the route
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "https://loanmate-platform.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.options('*', cors());

app.get("/", (req, res) => res.send("API running - LoanMate Backend"));
app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes); // ✅ Add the forgot password routes
app.use("/api/contact", contactRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Forgot password endpoint: http://localhost:${PORT}/api/auth/forgot-password`);
      console.log(`Verify OTP endpoint: http://localhost:${PORT}/api/auth/verify-otp`);
    });
  })
  .catch(err => console.log("DB connection error:", err));
