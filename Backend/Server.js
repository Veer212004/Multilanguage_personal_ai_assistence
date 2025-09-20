import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscribeRoutes from "./routes/subscribe.js";
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
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Allow-Headers'
  ],
  optionsSuccessStatus: 200 // ✅ For legacy browser support
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Add request logging for debugging
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url} from ${req.get('Origin') || 'unknown'}`);
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

// ✅ Add subscribe route BEFORE the error handler
app.post('/api/subscribe', async (req, res) => {
  try {
    console.log('📧 Subscribe request received:', req.body);
    
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    // Here you can add your email service logic
    // For now, just return success
    console.log(`✅ Subscription successful for: ${email}`);
    
    res.status(200).json({
      success: true,
      message: `Thank you ${name || 'Friend'} for subscribing!`,
      email: email
    });
    
  } catch (error) {
    console.error('❌ Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ✅ Add test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use('/api/chatbot', chatbotRoutes);

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
