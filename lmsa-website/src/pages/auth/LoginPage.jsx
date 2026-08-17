import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/portal/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
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
        </div>
      </div>
    </div>
  );
}
