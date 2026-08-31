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

// Like `authenticate`, but never blocks the request. If a valid Bearer
// token is present, `req.user` is populated exactly as it would be by
// `authenticate`; if the token is missing, invalid, or expired, the
// request simply proceeds with `req.user` left unset (`undefined`) —
// the route itself decides what an anonymous visitor can see, rather
// than being rejected outright. This exists specifically for endpoints
// that are genuinely public but read `req.user` to vary the response
// (e.g. document.controller.js's access-level filtering, where an
// anonymous visitor and a logged-in member should legitimately see
// different results from the same endpoint) — a route with no auth
// middleware at all can never have `req.user` populated regardless of
// whether the client sends a token, since nothing ever decodes it.
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return next();
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!error && user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Never fail the request over a broken optional-auth attempt.
    next();
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