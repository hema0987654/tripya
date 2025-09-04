import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: options.to,         // must be provided
      subject: options.subject,
      text: options.text || "",   // optional fallback
      html: options.html || "",   // optional HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
};

export default sendEmail;
