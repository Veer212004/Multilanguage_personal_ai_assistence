import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscribeRoutes from './routes/subscribe.js';
import forgotPasswordRoutes from "./routes/forgotPassword.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// ✅ Enhanced middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Updated CORS for Capacitor apps
app.use(cors({
  origin: [
    "https://loanmate-platform.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "capacitor://localhost", // ✅ Capacitor iOS
    "http://localhost", // ✅ Capacitor Android
    "https://localhost", // ✅ HTTPS Capacitor
    "ionic://localhost", // ✅ Ionic
    "http://10.0.2.2:5000", // ✅ Android emulator
    "http://127.0.0.1:5173", // ✅ Alternative localhost
    "file://", // ✅ Add for mobile file protocol
    "capacitor://", // ✅ Add capacitor protocol
    "ionic://", // ✅ Add ionic protocol
    "*" // ✅ Allow all origins for mobile (you can restrict this later)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Allow-Headers',
    'X-Capacitor-Platform' // ✅ Add Capacitor header
  ],
  optionsSuccessStatus: 200 // ✅ For legacy browser support
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Add request logging for debugging
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.get('Origin') || 'unknown');
  console.log('User-Agent:', req.get('User-Agent') || 'unknown');
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }
  next();
});

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "LoanMate API running successfully!", 
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      contact: "/api/contact", 
      subscribe: "/api/subscribe",
      chatbot: "/api/chatbot"
    }
  });
});

// ✅ Add test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Add test route for subscribe
app.get('/api/subscribe/test', (req, res) => {
  res.json({
    message: 'Subscribe endpoint is reachable',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscribe", subscribeRoutes); // This should handle the subscription
app.use('/api/chatbot', chatbotRoutes);

// ✅ Add a test route to verify subscribe is working
app.get('/api/test-subscribe', (req, res) => {
  res.json({
    message: 'Subscribe test endpoint working',
    subscribeEndpoint: '/api/subscribe',
    method: 'POST',
    expectedBody: { email: 'test@example.com', name: 'Test User' }
  });
});

// ✅ Error handling
app.use(errorHandler);

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    availableRoutes: ['/api/auth', '/api/contact', '/api/subscribe', '/api/chatbot']
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, '0.0.0.0', () => { // ✅ Listen on all interfaces
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📱 For mobile testing: http://YOUR_IP_ADDRESS:${PORT}`);
      console.log(`📧 Subscribe endpoint: http://localhost:${PORT}/api/subscribe`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/`);
    });
  })
  .catch(err => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

export default app;
