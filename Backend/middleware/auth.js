import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Add user to request
    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        req.user = {
          userId: user._id,
          email: user.email,
          name: user.name
        };
      }
    }

    next(); // Continue regardless of auth status
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};