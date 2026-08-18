import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Weak', color: 'bg-red-600' },
      { score: 2, label: 'Fair', color: 'bg-amber-600' },
      { score: 3, label: 'Good', color: 'bg-lmsa-400' },
      { score: 4, label: 'Strong', color: 'bg-lmsa-600' }
    ];
    return levels[score];
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDiffer = formData.confirmPassword && formData.password !== formData.confirmPassword;
  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-lmsa-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-tight">Join LMSA</h1>
          <p className="text-xl text-lmsa-100 mb-8 text-balance">
            Become part of Liberia&apos;s leading medical student community
          </p>
          
          {/* Benefits */}
          <div className="space-y-4">
            {benefitsList.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-lmsa-500 rounded-full flex items-center justify-center">
                  <Check size={14} />
                </div>
                <span className="text-lmsa-100">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-lmsa-500">
            <p className="text-sm text-lmsa-200">
              A.M. Dogliotti College of Medicine, University of Liberia
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full">
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
            <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Create Account</h2>
            <p className="text-gray-600">Join the Liberia Medical Students&apos; Association</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                placeholder="Doe"
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail size={18} />}
              placeholder="your.email@example.com"
              helperText="Use your university email address"
              required
            />

            {/* Student ID + Year */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Student ID (Optional)"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                leftIcon={<GraduationCap size={18} />}
                placeholder="UL-2024-001"
              />
              <div>
                <Input
                  label="Year of Study"
                  name="yearOfStudy"
                  type="number"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  placeholder="1-6"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
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
                placeholder="Min 8 characters"
                helperText="Use uppercase, numbers, and symbols for strength"
                required
              />
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock size={18} />}
              rightIcon={
                <div className="flex items-center gap-2">
                  {passwordsMatch && <Check size={18} className="text-lmsa-600" />}
                  {passwordsDiffer && <X size={18} className="text-red-600" />}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="hover:text-lmsa-600 transition-colors duration-200 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              }
              placeholder="Re-enter your password"
              success={passwordsMatch}
              error={passwordsDiffer ? 'Passwords do not match' : ''}
              required
            />

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-lmsa-600 focus:ring-lmsa-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-lmsa-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-lmsa-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button type="submit" loading={loading} fullWidth>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-lmsa-600 hover:text-lmsa-700 font-medium transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const benefitsList = [
  'Access to study materials and resources',
  'Networking with medical students',
  'Leadership and mentorship opportunities',
  'Exclusive events and symposia',
  'Career guidance and internship support',
  'Student welfare advocacy'
];
