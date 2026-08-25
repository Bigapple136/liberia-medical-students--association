import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';

const VALID_MEMBERSHIP_TYPES = ['full', 'associate', 'honorary', 'veteran'];
const VALID_STATUSES = ['approved', 'rejected'];

// ─── POST /api/membership/apply ─────────────────────────────────────────────
export const apply = async (req, res) => {
  try {
    const { membership_type } = req.body;
    const userId = req.user.id;

    if (!membership_type || !VALID_MEMBERSHIP_TYPES.includes(membership_type)) {
      return res.status(400).json({
        success: false,
        message: `membership_type must be one of: ${VALID_MEMBERSHIP_TYPES.join(', ')}`,
      });
    }

    // Block duplicate pending/approved applications
    const { data: existing } = await supabase
      .from('membership_applications')
      .select('id, application_status')
      .eq('user_id', userId)
      .in('application_status', ['pending', 'approved'])
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existing.application_status} membership application`,
      });
    }

    const { data, error } = await supabase
      .from('membership_applications')
      .insert({
        user_id: userId,
        membership_type,
        application_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to submit membership application',
      });
    }

    res.status(201).json({
      success: true,
      application: data,
    });
  } catch (error) {
    console.error('Apply for membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit membership application',
    });
  }
};

// ─── GET /api/membership/status ─────────────────────────────────────────────
export const getStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('membership_applications')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch membership status',
      });
    }

    res.json({
      success: true,
      application: data || null,
    });
  } catch (error) {
    console.error('Get membership status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership status',
    });
  }
};

// ─── GET /api/membership/applications ───────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('membership_applications')
      .select(`
        *,
        user:user_id ( id, full_name, email, year_level, student_id )
      `)
      .order('submitted_at', { ascending: false });

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query = query.eq('application_status', status);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch membership applications',
      });
    }

    // Flatten user data
    const applications = data.map(a => ({
      ...a,
      applicant_name: a.user?.full_name || null,
      applicant_email: a.user?.email || null,
      applicant_year_level: a.user?.year_level || null,
      applicant_student_id: a.user?.student_id || null,
      user: undefined,
    }));

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Get all membership applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership applications',
    });
  }
};

// ─── GET /api/membership/applications/:id ───────────────────────────────────
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('membership_applications')
      .select(`
        *,
        user:user_id ( id, full_name, email, year_level, student_id )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Flatten user data
    const application = {
      ...data,
      applicant_name: data.user?.full_name || null,
      applicant_email: data.user?.email || null,
      applicant_year_level: data.user?.year_level || null,
      applicant_student_id: data.user?.student_id || null,
      user: undefined,
    };

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Get membership application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership application',
    });
  }
};

// ─── PUT /api/membership/applications/:id ───────────────────────────────────
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { application_status, review_notes } = req.body;

    if (!application_status || !VALID_STATUSES.includes(application_status)) {
      return res.status(400).json({
        success: false,
        message: `application_status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Fetch the existing application
    const { data: application, error: fetchError } = await supabase
      .from('membership_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Update the application row
    const { data, error } = await supabase
      .from('membership_applications')
      .update({
        application_status,
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
        message: 'Failed to update application status',
      });
    }

    // On approval, update the user's membership standing
    if (application_status === 'approved') {
      const { error: userError } = await supabase
        .from('users')
        .update({
          membership_status: 'active',
          membership_type: application.membership_type,
        })
        .eq('id', application.user_id);

      if (userError) {
        console.error('Failed to update user membership status after approval:', userError);
        // Don't fail the whole request — the application is approved, the
        // user status update is a best-effort sync. Log for investigation.
      }
    }

    // Best-effort email notification — must never fail the review action
    try {
      const { data: user } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', application.user_id)
        .single();

      if (user?.email) {
        const isApproved = application_status === 'approved';
        await sendEmail({
          to: user.email,
          subject: isApproved
            ? 'Your LMSA Membership Has Been Approved!'
            : 'Update on Your LMSA Membership Application',
          html: isApproved
            ? `
                <h1>Congratulations, ${user.full_name}!</h1>
                <p>Your LMSA membership application has been <strong>approved</strong>.</p>
                <p>Your membership type: <strong>${application.membership_type}</strong></p>
                <p>Welcome to LMSA!</p>
              `
            : `
                <h1>Membership Application Update</h1>
                <p>Hi ${user.full_name},</p>
                <p>After careful review, your LMSA membership application has been <strong>not approved</strong> at this time.</p>
                ${review_notes ? `<p><strong>Reviewer notes:</strong> ${review_notes}</p>` : ''}
                <p>You are welcome to reapply in the future.</p>
              `,
        });
      }
    } catch (emailError) {
      console.error('Membership review notification email failed (review action still succeeded):', emailError);
    }

    res.json({
      success: true,
      application: data,
    });
  } catch (error) {
    console.error('Update membership application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
    });
  }
};
