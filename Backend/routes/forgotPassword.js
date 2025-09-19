import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // ✅ Add this import
import User from "../models/User.js"; // ✅ Add this import (adjust path as needed)

const router = express.Router();

// In-memory storage for OTPs (use Redis in production)
const otpStorage = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send OTP via email
router.post("/forgot-password", async (req, res) => {
  try {
    console.log('📧 Forgot password request:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email address" 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP with expiry
    otpStorage.set(email, { otp, expiryTime });
    
    console.log(`📧 Generated OTP for ${email}: ${otp}`);
    console.log(`⏰ OTP expires at: ${new Date(expiryTime)}`);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test connection first
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Email content
    const mailOptions = {
      from: `"LoanMate Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your Password Reset OTP - LoanMate",
      text: `
Your Password Reset OTP: ${otp}

This OTP will expire in 10 minutes.
If you didn't request this, please ignore this email.

LoanMate Security Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
            <p style="color: #e1e8ed; margin: 10px 0 0 0; font-size: 16px;">LoanMate Security</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; text-align: center;">Your OTP Code</h2>
            
            <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #495057; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Enter this 6-digit code to verify your identity and reset your password.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px; text-align: center;">
                ⏰ This OTP will expire in <strong>10 minutes</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} LoanMate Security Team
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ OTP email sent to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    
    res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully!",
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify OTP and send reset link
router.post("/verify-otp", async (req, res) => {
  try {
    console.log('🔍 OTP verification request:', req.body);
    
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Check if OTP exists
    const storedData = otpStorage.get(email);
    console.log(`📝 Stored OTP data for ${email}:`, storedData);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one."
      });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiryTime) {
      console.log(`⏰ OTP expired for ${email}`);
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    // Verify OTP
    console.log(`🔍 Comparing OTP: provided=${otp}, stored=${storedData.otp}`);
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again."
      });
    }

    // OTP is valid, generate reset token
    const resetToken = generateResetToken();
    const resetExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    
    // Store reset token
    otpStorage.set(`reset_${email}`, { resetToken, resetExpiry });
    
    // Remove used OTP
    otpStorage.delete(email);
    
    console.log(`✅ OTP verified for ${email}, reset token generated: ${resetToken}`);

    // Send password reset link via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Updated reset link to point to your frontend
    const resetLink = `https://loanmate-platform.vercel.app/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"LoanMate Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔗 Password Reset Link - LoanMate",
      text: `
Click the link below to reset your password:
${resetLink}

This link will expire in 30 minutes.
If you didn't request this, please ignore this email.

LoanMate Security Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔗 Reset Your Password</h1>
            <p style="color: #e1e8ed; margin: 10px 0 0 0; font-size: 16px;">LoanMate Security</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; text-align: center;">Reset Your Password</h2>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Your identity has been verified! Click the button below to create a new password for your LoanMate account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🔐 Reset Password Now
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px; text-align: center;">
                ⏰ This link will expire in <strong>30 minutes</strong>
              </p>
            </div>
            
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0; font-size: 14px; text-align: center;">
                <strong>Can't click the button?</strong> Copy this link:<br>
                <span style="word-break: break-all; font-size: 12px; background: #e9ecef; padding: 5px; border-radius: 3px; display: inline-block; margin-top: 5px;">
                  ${resetLink}
                </span>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} LoanMate Security Team<br>
              This is an automated message, please do not reply.
            </p>
             <h2>Created by Veeresh - <a href="https://www.linkedin.com/in/veeresh-hedderi-83838525b" style="color: #764ba2; text-decoration: none;">Connect on LinkedIn</a></h2>
          </div>
        </div>
      `,
    };

    console.log(`📤 Sending reset link to: ${email}`);
    console.log(`🔗 Reset link: ${resetLink}`);

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Reset link email sent to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    
    res.status(200).json({
      success: true,
      message: "OTP verified successfully! Password reset link sent to your email.",
    });

  } catch (error) {
    console.error('❌ OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reset password with token - UPDATED VERSION
router.post("/reset-password", async (req, res) => {
  try {
    console.log('🔑 Reset password request received');
    console.log('📧 Request body:', req.body);
    console.log('🗂️ Current otpStorage contents:', Array.from(otpStorage.entries()));
    
    const { token, email, password } = req.body;
    
    if (!token || !email || !password) {
      console.log('❌ Missing required fields:', { token: !!token, email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: "Token, email, and password are required"
      });
    }

    console.log(`🔍 Looking for reset token with key: reset_${email}`);
    
    // Check if reset token exists and is valid
    const storedData = otpStorage.get(`reset_${email}`);
    console.log(`📝 Stored reset data for ${email}:`, storedData);
    
    if (!storedData) {
      console.log(`❌ No stored data found for key: reset_${email}`);
      console.log('📊 All stored keys:', Array.from(otpStorage.keys()));
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request a new one."
      });
    }

    // Check if token is expired
    const currentTime = Date.now();
    console.log(`⏰ Current time: ${currentTime} (${new Date(currentTime)})`);
    console.log(`⏰ Token expiry: ${storedData.resetExpiry} (${new Date(storedData.resetExpiry)})`);
    console.log(`⏰ Time remaining: ${(storedData.resetExpiry - currentTime) / 1000 / 60} minutes`);
    
    if (currentTime > storedData.resetExpiry) {
      console.log(`⏰ Reset token expired for ${email}`);
      otpStorage.delete(`reset_${email}`);
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one."
      });
    }

    // Verify token
    console.log(`🔍 Token comparison:`);
    console.log(`🔍 Provided token: "${token}"`);
    console.log(`🔍 Stored token: "${storedData.resetToken}"`);
    console.log(`🔍 Tokens match: ${storedData.resetToken === token}`);
    
    if (storedData.resetToken !== token) {
      console.log(`❌ Token mismatch for ${email}`);
      return res.status(400).json({
        success: false,
        message: "Invalid reset token."
      });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log(`❌ Password validation failed for ${email}`);
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      });
    }

    console.log(`✅ All validations passed for ${email}`);

    // ✅ ACTUAL DATABASE UPDATE STARTS HERE
    try {
      console.log(`🔍 Searching for user with email: ${email}`);
      
      // 1. Find user in database
      const user = await User.findOne({ email: email });
      
      if (!user) {
        console.log(`❌ User not found in database: ${email}`);
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }

      console.log(`👤 Found user in database: ${user.email} (ID: ${user._id})`);

      // 2. Hash the new password
      const saltRounds = 12;
      console.log(`🔐 Hashing password with ${saltRounds} salt rounds...`);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      console.log(`🔐 Password hashed successfully (length: ${hashedPassword.length})`);

      // 3. Update password in database
      console.log(`💾 Updating password in database for user: ${user._id}`);
      
      const updateResult = await User.findByIdAndUpdate(
        user._id, 
        { 
          password: hashedPassword,
          passwordChangedAt: new Date()
        },
        { new: true } // Return updated document
      );

      console.log(`✅ Password updated in database successfully`);
      console.log(`📊 Update result ID: ${updateResult._id}`);

      // 4. Remove used reset token
      otpStorage.delete(`reset_${email}`);
      console.log(`🗑️ Reset token removed for ${email}`);

    } catch (dbError) {
      console.error('❌ Database update error:', dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to update password in database.",
        error: dbError.message
      });
    }

    // Send confirmation email (optional - can be commented out for testing)
    try {
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"LoanMate Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "✅ Password Reset Successful - LoanMate",
        text: `Your password has been reset successfully!`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError);
      // Don't fail the password reset if email fails
    }
    
    res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;