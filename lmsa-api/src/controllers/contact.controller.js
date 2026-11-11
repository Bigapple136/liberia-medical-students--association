import { sendEmail } from '../config/email.js';
import { escapeHtml } from '../utils/helpers.js';

// ─── POST /api/contact ──────────────────────────────────────────────────────
export const submit = async (req, res) => {
  try {
    // Trim defensively even though the route validators already do: the
    // controller is the last stop before the values reach an inbox.
    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const message = String(req.body?.message ?? '').trim();
    const subject = String(req.body?.subject ?? '').trim() || 'General Inquiry';

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and message are required',
      });
    }

    // A newline in a subject line lets a value start extra mail headers, so
    // collapse them before the string reaches the transport.
    const headerSafeSubject = subject.replace(/[\r\n]+/g, ' ').trim();

    // Send email to the general LMSA inbox
    const contactEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM || 'info@lmsa.org';

    await sendEmail({
      to: contactEmail,
      subject: `[LMSA] Contact form: ${headerSafeSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(headerSafeSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
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
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for reaching out to the LMSA team. We'll get back to you as soon as possible.</p>
          <p><strong>Your message:</strong> ${escapeHtml(message)}</p>
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
