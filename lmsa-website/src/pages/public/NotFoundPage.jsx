import { Link } from 'react-router-dom';
import { Home, Mail, AlertTriangle } from 'lucide-react';
import Button from '@components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-lmsa-100 rounded-full mb-8">
          <AlertTriangle size={48} className="text-lmsa-600" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-bold text-lmsa-600 mb-4 uppercase tracking-tight">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto text-balance">
          Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/">
            <Button variant="primary" size="lg" leftIcon={<Home size={20} />}>
              Go Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary" size="lg" leftIcon={<Mail size={20} />}>
              Contact Us
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/about" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200 text-sm font-medium">
              About LMSA
            </Link>
            <Link to="/membership" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200 text-sm font-medium">
              Membership
            </Link>
            <Link to="/leadership" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200 text-sm font-medium">
              Leadership
            </Link>
            <Link to="/portal" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200 text-sm font-medium">
              Member Portal
            </Link>
            <Link to="/register" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200 text-sm font-medium">
              Join LMSA
            </Link>
            <Link to="/contact" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200 text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
