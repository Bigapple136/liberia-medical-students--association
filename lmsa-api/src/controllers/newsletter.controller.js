import { supabase } from '../config/supabase.js';

// ─── POST /api/newsletter/subscribe ──────────────────────────────────────────
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
