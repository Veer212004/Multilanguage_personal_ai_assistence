import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Debugging information
console.log('🔍 Auth Routes Loaded - JWT available:', typeof jwt);
console.log('🔍 JWT_SECRET exists:', !!process.env.JWT_SECRET);

// ✅ Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes working',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});

// ✅ Enhanced Register route with transaction support
router.post('/register', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false, // ✅ Include success field
        message: 'Please provide name, email, and password'
      });
    }

    // Clean and validate inputs
    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // Validate name
    if (cleanName.length < 2) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate password length
    if (cleanPassword.length < 6) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false, // ✅ Include success field
        message: 'User already exists with this email address'
      });
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(cleanPassword, saltRounds);

    // Create user within transaction
    console.log('👤 Creating user...');
    const user = new User({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword
    });

    await user.save({ session });
    console.log('✅ User created in database:', user.email);

    // Create JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // Commit transaction - all operations succeeded
    await session.commitTransaction();
    console.log('✅ Transaction committed successfully');

    // Send success response
    res.status(201).json({
      success: true, // ✅ Make sure this line exists
      message: 'Account created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    console.error('❌ Register error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false, // ✅ Include success field
        message: 'Email address is already registered'
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false, // ✅ Include success field
      message: 'Server error during registration. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Always end the session
    session.endSession();
  }
});

// ✅ Enhanced Login route
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Please use Google login for this account'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ Debug JWT generation
    console.log('🎫 Starting JWT generation...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // ✅ Generate token with error handling
    let token;
    try {
      token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email,
          name: user.name
        },
        process.env.JWT_SECRET || 'fallback-secret-key-for-development',
        { expiresIn: '7d' }
      );
      console.log('✅ JWT token generated successfully');
      console.log('🎫 Token preview:', token ? token.substring(0, 20) + '...' : 'MISSING');
    } catch (jwtError) {
      console.error('❌ JWT generation failed:', jwtError);
      return res.status(500).json({
        success: false,
        message: 'Token generation failed'
      });
    }

    // ✅ Build response object step by step
    const responseObj = {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token: token  // ✅ CRITICAL: Make sure this is included
    };

    console.log('📤 Response object created:', {
      success: responseObj.success,
      hasUser: !!responseObj.user,
      hasToken: !!responseObj.token,
      tokenLength: responseObj.token ? responseObj.token.length : 0
    });

    // ✅ Send the response
    res.status(200).json(responseObj);
    console.log('✅ Login response sent successfully');

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Add route to check if email exists (for frontend validation)
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    
    res.json({
      success: true,
      exists: !!existingUser
    });

  } catch (error) {
    console.error('❌ Check email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking email'
    });
  }
});

// Add this debug route
router.get('/debug-jwt', (req, res) => {
  try {
    console.log('🧪 Testing JWT generation...');
    
    const testPayload = { test: 'data', userId: '123' };
    const testToken = jwt.sign(testPayload, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
    
    res.json({
      jwtAvailable: typeof jwt,
      secretExists: !!process.env.JWT_SECRET,
      secretValue: process.env.JWT_SECRET ? 'EXISTS' : 'MISSING',
      testToken: testToken,
      tokenLength: testToken?.length || 0
    });
  } catch (error) {
    res.json({
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;