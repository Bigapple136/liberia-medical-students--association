import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';

/**
 * Leadership nominations.
 *
 * /get-involved/leadership used to describe three leadership levels and offer
 * no way to pursue any of them — its only link was "Explore committees". This
 * is the real flow: an admin opens a nomination window on an election cycle, a
 * member nominates themselves for a position, and an admin reviews.
 *
 * Window rules, in priority order:
 *   1. No cycle row, or `accepting_nominations` false -> closed.
 *   2. Today before `nomination_opens`  -> not open yet (with the date).
 *   3. Today after `nomination_closes`  -> closed (with the date).
 *   4. Otherwise -> open.
 */

const VALID_LEVELS = ['executive', 'class_rep'];
const VALID_STATUSES = ['approved', 'rejected'];
const MAX_STATEMENT_LENGTH = 2000;

const today = () => new Date().toISOString().split('T')[0];

/** Attach a derived state to a cycle row so the frontend never has to guess. */
function describeCycle(cycle) {
  if (!cycle) {
    return { cycle: null, state: 'none', message: 'No election cycle has been scheduled yet' };
  }

  const date = today();
  const enriched = { ...cycle };

  if (!cycle.accepting_nominations) {
    return { cycle: enriched, state: 'closed', message: 'Nominations are not open' };
  }
  if (cycle.nomination_opens && cycle.nomination_opens > date) {
    return {
      cycle: enriched,
      state: 'scheduled',
      message: `Nominations open on ${cycle.nomination_opens}`,
    };
  }
  if (cycle.nomination_closes && cycle.nomination_closes < date) {
    return {
      cycle: enriched,
      state: 'closed',
      message: `Nominations closed on ${cycle.nomination_closes}`,
    };
  }
  return { cycle: enriched, state: 'open', message: 'Nominations are open' };
}

/** The cycle nominations currently belong to: open first, then the next one. */
async function resolveActiveCycle() {
  const { data: cycles } = await supabase
    .from('election_cycles')
    .select('*')
    .order('academic_year', { ascending: false });

  if (!cycles || cycles.length === 0) return null;

  const date = today();
  const open = cycles.find(
    c =>
      c.accepting_nominations &&
      (!c.nomination_opens || c.nomination_opens <= date) &&
      (!c.nomination_closes || c.nomination_closes >= date)
  );

  // Fall back to the most recent scheduled round so the page can say when the
  // next one opens instead of showing nothing at all.
  return open || cycles[0];
}

// ─── GET /api/nominations/cycle ──────────────────────────────────────────────
export const getCycle = async (req, res) => {
  try {
    const cycle = await resolveActiveCycle();
    const { cycle: enriched, state, message } = describeCycle(cycle);

    res.json({
      success: true,
      cycle: enriched,
      state,
      message,
    });
  } catch (error) {
    console.error('Get election cycle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch the election cycle',
    });
  }
};

// ─── PUT /api/nominations/cycle (admin) ──────────────────────────────────────
export const saveCycle = async (req, res) => {
  try {
    const {
      academic_year,
      nomination_opens,
      nomination_closes,
      election_date,
      accepting_nominations,
    } = req.body || {};

    if (!academic_year || !String(academic_year).trim()) {
      return res.status(400).json({
        success: false,
        message: 'academic_year is required (for example 2026-2027)',
      });
    }

    if (nomination_opens && nomination_closes && nomination_closes < nomination_opens) {
      return res.status(400).json({
        success: false,
        message: 'Nominations cannot close before they open',
      });
    }

    const payload = {
      academic_year: String(academic_year).trim(),
      nomination_opens: nomination_opens || null,
      nomination_closes: nomination_closes || null,
      election_date: election_date || null,
      accepting_nominations: Boolean(accepting_nominations),
    };

    // Upsert on the unique academic_year so the admin form is idempotent.
    const { data, error } = await supabase
      .from('election_cycles')
      .upsert(payload, { onConflict: 'academic_year' })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to save the election cycle',
      });
    }

    res.json({ success: true, cycle: data, ...describeCycle(data) });
  } catch (error) {
    console.error('Save election cycle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save the election cycle',
    });
  }
};

// ─── POST /api/nominations ───────────────────────────────────────────────────
export const nominate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { position_name, level, statement, year_level, phone } = req.body || {};

    if (!level || !VALID_LEVELS.includes(level)) {
      return res.status(400).json({
        success: false,
        message: `level must be one of: ${VALID_LEVELS.join(', ')}`,
      });
    }

    const trimmedPosition = typeof position_name === 'string' ? position_name.trim() : '';
    if (!trimmedPosition) {
      return res.status(400).json({
        success: false,
        message: 'Choose the position you are standing for',
      });
    }

    const trimmedStatement = typeof statement === 'string' ? statement.trim() : '';
    if (!trimmedStatement) {
      return res.status(400).json({
        success: false,
        message: 'Tell members why you are standing — a short statement is required',
      });
    }
    if (trimmedStatement.length > MAX_STATEMENT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Your statement must be ${MAX_STATEMENT_LENGTH} characters or fewer`,
      });
    }

    const cycle = await resolveActiveCycle();
    const { state, message } = describeCycle(cycle);

    if (state !== 'open') {
      return res.status(409).json({ success: false, message });
    }

    // Duplicate guard
    const { data: existing } = await supabase
      .from('leadership_nominations')
      .select('id, status')
      .eq('cycle_id', cycle.id)
      .eq('position_name', trimmedPosition)
      .eq('user_id', userId)
      .in('status', ['pending', 'approved'])
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          existing.status === 'approved'
            ? `You are already nominated for ${trimmedPosition}`
            : `You already have a pending nomination for ${trimmedPosition}`,
      });
    }

    const { data, error } = await supabase
      .from('leadership_nominations')
      .insert({
        cycle_id: cycle.id,
        user_id: userId,
        level,
        position_name: trimmedPosition,
        statement: trimmedStatement,
        year_level: year_level || null,
        phone: phone || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to submit your nomination',
      });
    }

    // Best-effort confirmation — never fails the submission
    try {
      const { data: nominee } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      if (nominee?.email) {
        await sendEmail({
          to: nominee.email,
          subject: `Your nomination for ${trimmedPosition}`,
          html: `
            <h1>Nomination received</h1>
            <p>Hi ${nominee.full_name},</p>
            <p>Your nomination for <strong>${trimmedPosition}</strong> (${cycle.academic_year}) has been received and is pending review.</p>
            ${cycle.election_date ? `<p>The election is scheduled for ${cycle.election_date}.</p>` : ''}
          `,
        });
      }
    } catch (emailError) {
      console.error('Nomination confirmation email failed (submission still succeeded):', emailError);
    }

    res.status(201).json({
      success: true,
      nomination: data,
      cycle: { id: cycle.id, academic_year: cycle.academic_year },
    });
  } catch (error) {
    console.error('Submit nomination error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit your nomination',
    });
  }
};

// ─── GET /api/nominations (admin) ────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    const { status, cycle_id } = req.query;

    let query = supabase
      .from('leadership_nominations')
      .select(`
        *,
        user:user_id ( id, full_name, email, year_level, student_id )
      `)
      .order('submitted_at', { ascending: false });

    if (status && ['pending', 'approved', 'rejected', 'withdrawn'].includes(status)) {
      query = query.eq('status', status);
    }
    if (cycle_id) {
      query = query.eq('cycle_id', cycle_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch nominations',
      });
    }

    const nominations = data.map(n => ({
      ...n,
      nominee_name: n.user?.full_name || null,
      nominee_email: n.user?.email || null,
      nominee_year_level: n.user?.year_level || null,
      nominee_student_id: n.user?.student_id || null,
      user: undefined,
    }));

    res.json({ success: true, nominations });
  } catch (error) {
    console.error('Get nominations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nominations',
    });
  }
};

// ─── PUT /api/nominations/:id (admin) ────────────────────────────────────────
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body || {};

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const { data: nomination, error: fetchError } = await supabase
      .from('leadership_nominations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !nomination) {
      return res.status(404).json({
        success: false,
        message: 'Nomination not found',
      });
    }

    const { data, error } = await supabase
      .from('leadership_nominations')
      .update({
        status,
        review_notes: review_notes || null,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update nomination',
      });
    }

    const { data: cycle } = await supabase
      .from('election_cycles')
      .select('academic_year, election_date')
      .eq('id', nomination.cycle_id)
      .single();

    // Best-effort notification — must never fail the review action
    try {
      const { data: nominee } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', nomination.user_id)
        .single();

      if (nominee?.email) {
        await sendEmail({
          to: nominee.email,
          subject:
            status === 'approved'
              ? `Your nomination for ${nomination.position_name} was accepted`
              : 'Update on your nomination',
          html:
            status === 'approved'
              ? `
                  <h1>You're on the ballot</h1>
                  <p>Hi ${nominee.full_name},</p>
                  <p>Your nomination for <strong>${nomination.position_name}</strong> (${cycle?.academic_year || ''}) has been <strong>accepted</strong>.</p>
                  ${cycle?.election_date ? `<p>The election is scheduled for ${cycle.election_date}.</p>` : ''}
                  ${review_notes ? `<p><strong>Reviewer notes:</strong> ${review_notes}</p>` : ''}
                `
              : `
                  <h1>Nomination update</h1>
                  <p>Hi ${nominee.full_name},</p>
                  <p>Your nomination for <strong>${nomination.position_name}</strong> was not accepted this round.</p>
                  ${review_notes ? `<p><strong>Reviewer notes:</strong> ${review_notes}</p>` : ''}
                `,
        });
      }
    } catch (emailError) {
      console.error('Nomination review email failed (review still succeeded):', emailError);
    }

    res.json({ success: true, nomination: data });
  } catch (error) {
    console.error('Update nomination status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update nomination',
    });
  }
};
