import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log('📧 Subscribe request received:', req.body);
    console.log('🔍 Environment check:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // ✅ Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials not configured');
      return res.status(500).json({
        success: false,
        message: "Email service not configured"
      });
    }

    const subscriberName = name && name.trim() ? name.trim() : "Friend";
    
    // ✅ Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email address" 
      });
    }

    // ✅ Fixed: Use createTransport (not createTransporter)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // ✅ Test connection with detailed error handling
    console.log('🔍 Testing email connection...');
    try {
      await transporter.verify();
      console.log('✅ Email connection verified');
    } catch (verifyError) {
      console.error('❌ Email connection failed:', verifyError);
      return res.status(500).json({
        success: false,
        message: "Email service connection failed",
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    // ✅ Simplified email for testing
    const mailOptions = {
      from: `"LoanMate Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: ` $🤖$ Welcome to LoanMate, ${subscriberName}!`,
      text: `
Hi ${subscriberName}😎

Thank you for subscribing to LoanMate newsletter!

You'll now receive:
✓ Latest financial tips and insights
✓ Loan eligibility updates
✓ Exclusive offers from partner banks
✓ AI-powered financial recommendations

Visit our platform: https://loanmate-platform.vercel.app

Best regards,
LoanMate Team
      `,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to LoanMate, ${subscriberName}!</h1>
            <p style="color: #e1e8ed; margin: 10px 0 0 0; font-size: 16px;">Your Financial Journey Starts Here</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hi ${subscriberName}, thank you for subscribing!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              You've joined thousands of smart financial decision-makers. Here's what you'll receive:
            </p>
            
            <ul style="color: #333; line-height: 1.8;">
              <li>💡 Latest financial tips and insights</li>
              <li>🏦 Loan eligibility updates and bank offers</li>
              <li>🤖 AI-powered financial recommendations</li>
              <li>🎯 Exclusive offers and early access</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://loanmate-platform.vercel.app" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🚀 Start Your Journey, ${subscriberName}!
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">🎯 What's Next?</h3>
              <p style="color: #666; margin: 10px 0;">
                ${subscriberName}, here are some things you can do right now:
              </p>
              <ul style="color: #666; margin: 0;">
                <li>Check your loan eligibility in 2 minutes</li>
                <li>Compare offers from top banks</li>
                <li>Get personalized financial recommendations</li>
                <li>Access our financial planning tools</li>
              </ul>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                Follow us on social media for daily tips:
              </p>
              <div style="margin: 10px 0;">
                <a href="https://www.linkedin.com/in/veeresh-hedderi-83838525b" style="margin: 0 10px; text-decoration: none;">
                  <span style="background: #0077b5; color: white; padding: 8px 12px; border-radius: 5px; font-size: 12px;">LinkedIn</span>
                </a>
                <a href="https://wa.me/+918880717978" style="margin: 0 10px; text-decoration: none;">
                  <span style="background: #25d366; color: white; padding: 8px 12px; border-radius: 5px; font-size: 12px;">WhatsApp</span>
                </a>
                <a href="https://github.com/Veer212004/Multilanguage_personal_ai_assistence" style="margin: 0 10px; text-decoration: none;">
                  <span style="background: #333; color: white; padding: 8px 12px; border-radius: 5px; font-size: 12px;">GitHub</span>
                </a>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} LoanMate. Built with ❤️ by Veeresh<br>
              You're receiving this because you subscribed as ${subscriberName} (${email})
            </p>

            <h5>
            Created by Veeresh - <a href="https://www.linkedin.com/in/veeresh-hedderi-83838525b" style="color: #764ba2; text-decoration: none;">Connect on LinkedIn</a>
            </h5>
          </div>
        </div>
      `,
    };

    console.log('📤 Attempting to send email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);

    // ✅ Send email with timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout')), 30000)
      )
    ]);
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: `Welcome email sent successfully to ${subscriberName}!`,
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // ✅ Send different messages based on error type
    let errorMessage = "Failed to send welcome email. Please try again.";
    
    if (error.code === 'EAUTH') {
      errorMessage = "Email authentication failed. Please contact support.";
    } else if (error.code === 'ETIMEDOUT' || error.message === 'Email timeout') {
      errorMessage = "Email service timeout. Please try again.";
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = "Email service unavailable. Please try again later.";
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    });
  }
});

// ✅ Enhanced test endpoint
router.get("/test", (req, res) => {
  res.json({ 
    message: "Subscribe API is working!", 
    timestamp: new Date(),
    emailUser: process.env.EMAIL_USER || 'Not configured',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    nodeMailerVersion: "Available"
  });
});

export default router;