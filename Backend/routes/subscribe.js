import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Configure your email transporter (use your real credentials)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password", // Use App Password if 2FA is enabled
    },
  });

  // Email content
  const mailOptions = {
    from: '"LoanMate" <yourgmail@gmail.com>',
    to: email,
    subject: "Thank you for subscribing to LoanMate!",
    text: "Welcome to LoanMate! You'll now receive the latest financial tips and updates.",
    html: "<b>Welcome to LoanMate!</b><br>You'll now receive the latest financial tips and updates.",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Subscription email sent!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email." });
  }
});

export default router;