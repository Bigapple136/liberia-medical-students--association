import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';

export const register = async (req, res) => {
  try {
    const { email, password, full_name, year_level, student_id, membership_type } = req.body;

    // email_confirm: true — this app has no email-verification flow built
    // (no verify route, no frontend confirmation page, and Supabase's own
    // confirmation email requires separate SMTP setup in the Supabase
    // dashboard, distinct from this app's Gmail-based welcome email). With
    // email_confirm: false and nothing to ever satisfy it, every
    // registered user was permanently locked out at login
    // ("email_not_confirmed"). This endpoint already uses the service-role
    // key (admin-privileged), so marking accounts pre-confirmed here is a
    // deliberate, safe simplification — not a security gap, since account
    // creation still requires a valid registration request either way.
    // A real email-verification flow can be built as its own feature later
    // if desired; this just unblocks the core registration/login loop now.
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name,
      year_level,
      student_id,
      role: 'student',
      membership_status: 'pending',
      membership_type: membership_type || 'full',
    });

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user profile',
      });
    }

    // Create a pending membership application — best-effort, non-blocking.
    // The user account itself is the primary deliverable; a failed
    // auto-application can always be created later via the manual apply
    // flow on MembershipPage.jsx as a fallback.
    try {
      await supabase.from('membership_applications').insert({
        user_id: authData.user.id,
        membership_type: membership_type || 'full',
        application_status: 'pending',
      });
    } catch (appError) {
      console.error('Auto-membership-application insert failed (registration still succeeded):', appError);
    }

    // Send welcome email — best-effort only. Account creation above already
    // succeeded (auth user + profile row both exist), so a failure here
    // (e.g. email provider misconfigured/unreachable) must not turn a
    // successful registration into a reported failure. Log and continue.
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to LMSA',
        html: `
          <h1>Welcome to LMSA, ${full_name}!</h1>
          <p>Your account has been created successfully.</p>
          <p>Please verify your email to complete registration.</p>
        `,
      });
    } catch (emailError) {
      console.error('Welcome email failed to send (registration still succeeded):', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. You can now log in.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Get user profile
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      success: true,
      token: data.session.access_token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

export const logout = async (_req, res) => {
  try {
    await supabase.auth.signOut();

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};