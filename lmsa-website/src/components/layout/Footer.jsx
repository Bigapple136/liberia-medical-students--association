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
    <footer className="site-footer">
      <div className="site-container site-footer-container">
        <div className="footer-intro">
          <div>
            <p className="section-kicker section-kicker-light">Stay connected</p>
            <h2>Keep learning. Keep leading. Keep showing up.</h2>
          </div>
          <Link to="/register" className="footer-join-link">
            Join the LMSA community <ExternalLink size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <h3>LMSA</h3>
            <p className="footer-description">
              Liberia Medical Students&apos; Association<br />
              Uniting future physicians at A.M. Dogliotti College of Medicine
            </p>
            <div className="footer-contact-list">
              <div>
                <MapPin size={16} aria-hidden="true" />
                <span>A.M. Dogliotti College of Medicine, Monrovia</span>
              </div>
              <div>
                <Mail size={16} aria-hidden="true" />
                <a href="mailto:dev.lmsa@gmail.com" className="hover:text-lmsa-400 transition-colors duration-200">
                  dev.lmsa@gmail.com
                </a>
              </div>
              <div>
                <Phone size={16} aria-hidden="true" />
                <a href="tel:+231770000000" className="hover:text-lmsa-400 transition-colors duration-200">
                  +231 77 000 0000
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="footer-socials">
              <a
                href="#"
                className="footer-social-link"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="footer-social-link"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>

            {/* Newsletter Signup */}
            <form onSubmit={handleSubscribe} className="footer-newsletter">
              <label htmlFor="newsletter-email">
                Subscribe to our newsletter
              </label>
              <div>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="footer-newsletter-input"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="footer-newsletter-button"
                >
                  {submitting ? '...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>

          {/* About Column */}
          <div>
            <h4 className="footer-column-title">About</h4>
            <ul className="footer-links">
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
            <h4 className="footer-column-title">Membership</h4>
            <ul className="footer-links">
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
            <h4 className="footer-column-title">Resources</h4>
            <ul className="footer-links">
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
        <div className="footer-bottom">
          <p>
            © {currentYear} Liberia Medical Students&apos; Association. All rights reserved.
          </p>
          <div>
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