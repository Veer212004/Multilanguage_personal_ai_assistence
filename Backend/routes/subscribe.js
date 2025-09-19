import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log('📧 Subscribe request received:', req.body);
    
    const { email, name } = req.body; // ✅ Extract both email and name
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // ✅ Use name or default to "Friend"
    const subscriberName = name && name.trim() ? name.trim() : "Friend";
    
    console.log('📧 Subscriber email:', email);
    console.log('👤 Subscriber name:', subscriberName);

    // ✅ Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email address" 
      });
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Test connection
    console.log('🔍 Testing email connection...');
    await transporter.verify();
    console.log('✅ Email connection verified');

    // ✅ Email content with personalized subject and content
    const mailOptions = {
      from: `"LoanMate - Financial Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Welcome to LoanMate, ${subscriberName}!`, // ✅ Personalized subject
      text: `
Hi ${subscriberName}!

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
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} LoanMate. Built with ❤️ by Veeresh<br>
              You're receiving this because you subscribed as ${subscriberName} (${email})
            </p>
          </div>
        </div>
      `,
    };

    console.log('📤 Sending email FROM:', mailOptions.from);
    console.log('📥 Sending email TO:', mailOptions.to);
    console.log('📧 Email subject:', mailOptions.subject);
    console.log('👤 Personalized for:', subscriberName);

    // ✅ Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Email sent to:', `${subscriberName} <${email}>`);
    
    res.status(200).json({ 
      success: true, 
      message: `Welcome email sent successfully to ${subscriberName}! Check your inbox.`,
      messageId: info.messageId,
      recipient: `${subscriberName} <${email}>`
    });
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to send welcome email. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Test endpoint
router.get("/test", (req, res) => {
  res.json({ 
    message: "Subscribe API is working!", 
    timestamp: new Date(),
    emailUser: process.env.EMAIL_USER,
    emailConfigured: !!process.env.EMAIL_PASS
  });
});

export default router;