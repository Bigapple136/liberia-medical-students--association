import dotenv from 'dotenv';

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'LMSA';

// Startup sanity check — warn (don't crash) if the key is missing so the
// server still boots for non-email routes during local dev.
if (!BREVO_API_KEY) {
  console.warn(
    '⚠️  BREVO_API_KEY is not set — emails will fail to send. ' +
    'Set it in your .env to enable email delivery.'
  );
}

/**
 * Send an email via Brevo's HTTP transactional API.
 *
 * Signature preserved from the nodemailer version so none of the 4 calling
 * controllers (auth, committee ×2, contact, membership) need to change:
 *   sendEmail({ to, subject, html, text })
 *
 * @param {object}  options
 * @param {string}  options.to      - Recipient email address
 * @param {string}  options.subject - Email subject line
 * @param {string}  options.html    - HTML body content
 * @param {string}  [options.text]  - Plain text body (optional)
 * @returns {Promise<object>}       - Brevo response with messageId
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: BREVO_SENDER_EMAIL,
        name: BREVO_SENDER_NAME,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      ...(text ? { textContent: text } : {}),
    }),
  });

  if (!response.ok) {
    // Try to parse Brevo's error body for a useful message.
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody?.message || JSON.stringify(errBody);
    } catch {
      detail = response.statusText;
    }
    const err = new Error(`Brevo email send failed (${response.status}): ${detail}`);
    console.error('Email sending error:', err.message);
    throw err;
  }

  const data = await response.json();
  console.log('Email sent:', data.messageId);
  return data;
};
