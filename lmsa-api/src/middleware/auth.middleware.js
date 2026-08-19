import { supabase } from '../config/supabase.js';

// Tokens arriving here are Supabase session access tokens issued directly
// by Supabase Auth on login (see auth.controller.js's login, and the
// frontend's authService.login, which both use Supabase's own session —
// this app never issues its own JWTs). Validate them against Supabase
// itself via the admin/service-role client, not a local secret.
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    // Validate the token with Supabase Auth and get the corresponding
    // auth user (id, email, etc.) — this replaces the old jwt.verify()
    // against process.env.JWT_SECRET, which nothing in this codebase ever
    // actually signed tokens with, so it rejected every request.
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Get the app-level profile row (role, membership_status, etc.)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    next();
  };
};