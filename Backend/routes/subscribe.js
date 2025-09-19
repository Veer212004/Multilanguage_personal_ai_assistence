import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // ✅ Configure your email transporter with real credentials
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "veereshhedderi18@gmail.com", // Your Gmail
      pass: process.env.EMAIL_PASS || "your-16-digit-app-password", // Gmail App Password
    },
  });

  // ✅ Enhanced email template
  const mailOptions = {
    from: '"LoanMate - Financial Assistant" <veereshhedderi18@gmail.com>',
    to: email,
    subject: "🎉 Welcome to LoanMate Newsletter!",
    text: `
      Hi there!
      
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
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to LoanMate!</h1>
          <p style="color: #e1e8ed; margin: 10px 0 0 0; font-size: 16px;">Your Financial Journey Starts Here</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Thank you for subscribing!</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            You've joined thousands of smart financial decision-makers. Here's what you'll receive:
          </p>
          
          <div style="margin: 20px 0;">
            <div style="display: flex; align-items: center; margin: 10px 0; padding: 15px; background: #f0f8ff; border-radius: 8px;">
              <span style="font-size: 20px; margin-right: 10px;">💡</span>
              <span style="color: #333;">Latest financial tips and insights</span>
            </div>
            <div style="display: flex; align-items: center; margin: 10px 0; padding: 15px; background: #f0f8ff; border-radius: 8px;">
              <span style="font-size: 20px; margin-right: 10px;">🏦</span>
              <span style="color: #333;">Loan eligibility updates and bank offers</span>
            </div>
            <div style="display: flex; align-items: center; margin: 10px 0; padding: 15px; background: #f0f8ff; border-radius: 8px;">
              <span style="font-size: 20px; margin-right: 10px;">🤖</span>
              <span style="color: #333;">AI-powered financial recommendations</span>
            </div>
            <div style="display: flex; align-items: center; margin: 10px 0; padding: 15px; background: #f0f8ff; border-radius: 8px;">
              <span style="font-size: 20px; margin-right: 10px;">🎯</span>
              <span style="color: #333;">Exclusive offers and early access</span>
            </div>
          </div>
          
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
              🚀 Explore LoanMate Platform
            </a>
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
            © ${new Date().getFullYear()} LoanMate. Built with ❤️ by Veeresh | 
            <a href="https://loanmate-platform.vercel.app" style="color: #667eea;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    console.log('📧 Attempting to send email to:', email);
    
    // ✅ Send email with better error handling
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    res.status(200).json({ 
      success: true, 
      message: "Welcome email sent successfully! Check your inbox.",
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // ✅ Better error messages
    let errorMessage = "Failed to send welcome email. ";
    
    if (error.code === 'EAUTH') {
      errorMessage += "Email authentication failed. Please check email credentials.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage += "Unable to connect to email server. Please check internet connection.";
    } else if (error.responseCode === 535) {
      errorMessage += "Invalid email credentials. Please check Gmail App Password.";
    } else {
      errorMessage += "Please try again later.";
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;