import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { newsletterService } from '@services/newsletter.service';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setSubmitting(true);
    try {
      const result = await newsletterService.subscribe(email);
      if (result.success) {
        toast.success('Subscribed! Welcome to the LMSA newsletter.');
        setEmail('');
      } else {
        toast.error(result.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">LMSA</h3>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Liberia Medical Students&apos; Association<br />
              Uniting future physicians at A.M. Dogliotti College of Medicine
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-lmsa-400 flex-shrink-0" />
                <span>A.M. Dogliotti College of Medicine, Monrovia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-lmsa-400 flex-shrink-0" />
                <a href="mailto:info@lmsa.org.lr" className="hover:text-lmsa-400 transition-colors duration-200">
                  info@lmsa.org.lr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-lmsa-400 flex-shrink-0" />
                <a href="tel:+231770000000" className="hover:text-lmsa-400 transition-colors duration-200">
                  +231 77 000 0000
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-lmsa-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-lmsa-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-lmsa-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>

            {/* Newsletter Signup */}
            <form onSubmit={handleSubscribe} className="mt-6">
              <label htmlFor="newsletter-email" className="block text-sm font-medium text-white mb-2">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lmsa-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-lmsa-600 text-white hover:bg-lmsa-500 transition-colors duration-200 disabled:opacity-60"
                >
                  {submitting ? '...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-lmsa-400 transition-colors duration-200">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link to="/leadership" className="hover:text-lmsa-400 transition-colors duration-200">
                  Leadership
                </Link>
              </li>
              <li>
                <Link to="/about#history" className="hover:text-lmsa-400 transition-colors duration-200">
                  History
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-lmsa-400 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Membership</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/membership" className="hover:text-lmsa-400 transition-colors duration-200">
                  Join LMSA
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-lmsa-400 transition-colors duration-200">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link to="/portal#events" className="hover:text-lmsa-400 transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/portal#resources" className="hover:text-lmsa-400 transition-colors duration-200">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-lmsa-400 transition-colors duration-200 flex items-center gap-1">
                  Constitution <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lmsa-400 transition-colors duration-200 flex items-center gap-1">
                  Study Materials <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <Link to="/partnership" className="hover:text-lmsa-400 transition-colors duration-200">
                  Partnerships
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-lmsa-400 transition-colors duration-200 flex items-center gap-1">
                  Career Center <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lmsa-400 transition-colors duration-200 flex items-center gap-1">
                  Mentorship <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Liberia Medical Students&apos; Association. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-lmsa-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-lmsa-400 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-lmsa-400 transition-colors duration-200">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}