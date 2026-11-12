import { supabase } from '../config/supabase.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trimmed here as well as in the route validators: this public endpoint used
// to reject ' member@example.com ' as an invalid address instead of
// normalising it, and the same value is what gets stored.
function readEmail(req) {
  return String(req.body?.email ?? '').trim();
}

// ─── POST /api/newsletter/subscribe ──────────────────────────────────────────
export const subscribe = async (req, res) => {
  try {
    const email = readEmail(req);

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required',
      });
    }

    // Upsert on the unique `email`: a brand-new subscriber is inserted; an
    // already-present email (including a previously-unsubscribed one) is
    // updated back to `status: 'active'`, so re-subscribing never errors.
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email, status: 'active' },
        { onConflict: 'email' }
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to subscribe',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
    });
  }
};

// ─── POST /api/newsletter/unsubscribe ──────────────────────────────────────
export const unsubscribe = async (req, res) => {
  try {
    const email = readEmail(req);

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required',
      });
    }

    // Preserve the row (don't delete) — just mark it unsubscribed, standard
    // practice so we keep a record that the address once opted in.
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to unsubscribe',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe',
    });
  }
};
