import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, full_name, year_level, student_id } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
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
    });

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user profile',
      });
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to LMSA',
      html: `
        <h1>Welcome to LMSA, ${full_name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>Please verify your email to complete registration.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email.',
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