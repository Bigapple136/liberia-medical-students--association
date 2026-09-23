import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      // Always the same success state: the endpoint (and Supabase behind it)
      // responds identically whether or not the address is registered, so
      // this never branches on account existence and can't leak it.
      setSent(true);
    } catch (error) {
      // Only genuine failures land here (network down, rate limit) — never
      // "no such account".
      toast.error(
        error?.response?.data?.message ||
          'Could not send the reset email. Please try again.'
      );
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

          {sent ? (
            /* Success State - shown for every submission, regardless of whether
               the address belongs to an account (no account-existence leak). */
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-lmsa-100 rounded-full flex items-center justify-center text-lmsa-600 mb-4">
                <MailCheck size={24} />
              </div>
              <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Check Your Email</h2>
              <p className="text-gray-600 mb-6 text-balance">
                If an account exists for{' '}
                <span className="font-medium text-gray-900">{email}</span>, we&apos;ve
                sent a link to reset your password. It expires after a short
                time — check your spam folder if it doesn&apos;t arrive.
              </p>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => setSent(false)}
              >
                Use a different email
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
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Forgot Password</h2>
                <p className="text-gray-600">
                  Enter your email and we&apos;ll send you a link to reset your password
                </p>
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

                <Button type="submit" loading={loading} fullWidth>
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
