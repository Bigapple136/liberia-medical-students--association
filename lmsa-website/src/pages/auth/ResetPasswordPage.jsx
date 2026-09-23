import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@services/supabase';
import { authService } from '@services/auth.service';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // null = still resolving whether a recovery session exists, then true/false.
  const [hasSession, setHasSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      setHasSession(false);
      return undefined;
    }

    let mounted = true;

    // Supabase's client parses the recovery token out of the URL on load
    // (detectSessionInUrl, on by default) and fires PASSWORD_RECOVERY once
    // the recovery session is established. Subscribe first so a slow parse
    // is still caught, then getSession() for the case where the session was
    // already established before this component mounted (e.g. a reload).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (mounted && event === 'PASSWORD_RECOVERY') {
        setHasSession(true);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        setHasSession(Boolean(session));
      })
      .catch(() => {
        if (mounted) setHasSession(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side checks before touching Supabase — same rules as the
    // register form.
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(password);
      // A recovery link is a valid, if narrowly-scoped, sign-in — sign the
      // session out so the person isn't left in an unexplained "logged in"
      // state just because they clicked an email link.
      if (supabase) await supabase.auth.signOut();
      toast.success('Password updated! You can now sign in with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to update password. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-lmsa-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-tight">LMSA</h1>
          <p className="text-xl text-lmsa-100 mb-8 text-balance">
            Liberia Medical Students&apos; Association
          </p>
          <blockquote className="text-lg text-lmsa-100 italic mb-4 text-balance">
            &quot;Uniting future physicians to promote excellence, advocate for student welfare, and advance healthcare in Liberia.&quot;
          </blockquote>
          <div className="mt-12 pt-8 border-t border-lmsa-500">
            <p className="text-sm text-lmsa-200">
              A.M. Dogliotti College of Medicine, University of Liberia
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Back Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-lmsa-600 transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to login</span>
          </Link>

          {/* Checking State */}
          {hasSession === null && (
            <div className="py-16 text-center" role="status">
              <div className="mx-auto w-10 h-10 border-4 border-gray-300 border-t-lmsa-600 rounded-full animate-spin" />
              <p className="mt-4 text-sm text-gray-600">Checking your reset link...</p>
            </div>
          )}

          {/* Invalid / Expired / Already-used Link State */}
          {hasSession === false && (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Invalid or Expired Link</h2>
              <p className="text-gray-600 mb-6 text-balance">
                This password reset link is invalid, has expired, or has
                already been used. Reset links can only be used once — request
                a fresh one below.
              </p>
              <Button type="button" fullWidth onClick={() => navigate('/forgot-password')}>
                Request a new link
              </Button>
              <div className="mt-4 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-lmsa-600 hover:text-lmsa-700 font-medium transition-colors duration-200">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Valid Recovery Session - Form */}
          {hasSession === true && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Reset Password</h2>
                <p className="text-gray-600">Choose a new password for your LMSA account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-lmsa-600 transition-colors duration-200 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  placeholder="Enter your new password"
                  helperText="Must be at least 8 characters."
                  required
                />

                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:text-lmsa-600 transition-colors duration-200 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  placeholder="Re-enter your new password"
                  required
                />

                <Button type="submit" loading={loading} fullWidth>
                  {loading ? 'Updating...' : 'Reset Password'}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-lmsa-600 hover:text-lmsa-700 font-medium transition-colors duration-200">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 text-balance">
              <strong>Need help?</strong> Contact us at{' '}
              <a href="mailto:support@lmsa.org.lr" className="text-lmsa-600 hover:underline">
                support@lmsa.org.lr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
