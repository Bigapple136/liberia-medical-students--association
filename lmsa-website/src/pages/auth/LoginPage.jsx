import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { ADMIN_ROLES } from '@utils/constants';
import toast from 'react-hot-toast';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Spinner from '@components/common/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  // Set once login() itself succeeds — from that moment the form's job is
  // done and we hand over to the effect below, which watches AuthContext
  // for the profile fetch that sign-in triggered.
  const [welcoming, setWelcoming] = useState(false);
  const { login, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // `?next=` is how the committee and leadership pages send a signed-out member
  // back to what they were doing. Only same-origin paths are honoured, so the
  // parameter can never be used as an open redirect. `next`, when present,
  // always wins over the role-based default below — it means the person was
  // headed somewhere specific and should land there, not at a generic
  // dashboard, admin or not.
  const nextParam = searchParams.get('next');
  const explicitDestination =
    nextParam && /^\/[^/]/.test(nextParam) && !nextParam.startsWith('//')
      ? nextParam
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      // Credentials are good and Supabase has a session. Do NOT navigate
      // here: AuthContext is fetching the real profile (GET /users/me) in
      // parallel right now, so `user`/`role` aren't final yet. Switch to the
      // welcome state and let the effect below watch AuthContext's own
      // `loading`/`user` — which, with the setLoading(true) fix in
      // AuthContext's onAuthStateChange, reliably reflect *this* sign-in's
      // fetch — then redirect once it settles. (An earlier version of this
      // fix made a second, redundant /users/me call right here instead —
      // see the 2026-09-23 ORCHESTRATION.md follow-up for why that's the
      // wrong shape.)
      toast.success('Login successful!');
      setWelcoming(true);
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!welcoming) return;

    // Wait for AuthContext's profile fetch to settle. `authLoading` is the
    // context's flag, not this form's submit spinner — after the T35
    // AuthContext fix it goes true when the sign-in's fetch starts and false
    // when it settles, so `!authLoading && user` here really does mean the
    // profile (with its `role`) is final. If the fetch failed,
    // fetchProfile's existing fallback leaves us signed in with the bare
    // session user (`role` undefined) — `ADMIN_ROLES.includes(undefined)` is
    // false, so that case still lands on the student destination below
    // rather than hanging here.
    if (authLoading) return;

    // Session vanished mid-welcome (e.g. signed out from another tab) —
    // give up on the transition instead of spinning forever.
    if (!user) {
      setWelcoming(false);
      return;
    }

    // `full_name` is a display string like "Martha K. Sherman"; the welcome
    // heading below uses its first word. If it's somehow empty, the heading
    // degrades to a plain "Welcome back!".
    const timer = setTimeout(() => {
      if (explicitDestination) {
        navigate(explicitDestination);
      } else if (ADMIN_ROLES.includes(user.role)) {
        navigate('/admin/dashboard');
      } else {
        // Student default (and fail-open on unknown role): the Homepage.
        navigate('/');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [welcoming, authLoading, user, navigate, explicitDestination]);

  const firstName = user?.full_name?.trim().split(/\s+/)[0];

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
          {welcoming ? (
            /* Welcome / transition state — replaces the form from the moment
               credentials check out until the redirect fires. */
            <div className="text-center py-12" aria-live="polite">
              <Spinner size="lg" label="Signing you in" className="text-lmsa-600 mb-6" />
              <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">
                {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
              </h2>
              <p className="text-gray-600">Signing you in, one moment…</p>
            </div>
          ) : (
            <>
              {/* Back Link */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-lmsa-600 transition-colors duration-200 mb-8"
              >
                <ArrowLeft size={16} />
                <span className="text-sm">Back to home</span>
              </Link>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your LMSA member account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={18} />}
                  placeholder="your.email@example.com"
                  required
                />

                <Input
                  label="Password"
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
                  placeholder="Enter your password"
                  required
                />

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-lmsa-600 focus:ring-lmsa-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-lmsa-600 hover:text-lmsa-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" loading={loading} fullWidth>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center text-sm">
                <p className="text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="text-lmsa-600 hover:text-lmsa-700 font-medium transition-colors duration-200">
                    Register here
                  </Link>
                </p>
              </div>

              {/* Help Text */}
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 text-balance">
                  <strong>Need help?</strong> Contact us at{' '}
                  <a href="mailto:support@lmsa.org.lr" className="text-lmsa-600 hover:underline">
                    support@lmsa.org.lr
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
