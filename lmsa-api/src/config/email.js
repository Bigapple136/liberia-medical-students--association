import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Force IPv4. Render's outbound networking doesn't reliably route IPv6,
  // but Node's DNS resolution can still prefer an AAAA (IPv6) record for
  // smtp.gmail.com when both A and AAAA records exist -- observed in
  // production as ENETUNREACH on a 2607:f8b0:... address, and likely the
  // same underlying cause behind the ETIMEDOUT connection failures seen
  // alongside it. `family: 4` is passed through to the underlying
  // net.connect() call and forces IPv4-only resolution/connection for
  // this transporter specifically, without changing DNS behavior for the
  // rest of the process.
  family: 4,
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};