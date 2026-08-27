import { sendEmail } from '../config/email.js';

// ─── POST /api/contact ──────────────────────────────────────────────────────
export const submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and message are required',
      });
    }

    // Send email to the general LMSA inbox
    const contactEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM || 'info@lmsa.org';

    await sendEmail({
      to: contactEmail,
      subject: `[LMSA] Contact form: ${subject || 'General Inquiry'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p style="color:#888">Sent via LMSA Website contact form</p>
      `,
    });

    // Confirmation copy to the sender — best-effort, must not fail the
    // primary response if only this second email fails (same resilience
    // pattern as committee.controller.js submitContactForm).
    try {
      await sendEmail({
        to: email,
        subject: `Your message to LMSA has been received`,
        html: `
          <h2>We received your message!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to the LMSA team. We'll get back to you as soon as possible.</p>
          <p><strong>Your message:</strong> ${message}</p>
          <p>Best regards,<br>LMSA Team</p>
        `,
      });
    } catch (confirmationError) {
      console.error('Contact form confirmation email failed (message to LMSA still sent):', confirmationError);
    }

    res.json({
      success: true,
      message: 'Your message has been sent.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};
