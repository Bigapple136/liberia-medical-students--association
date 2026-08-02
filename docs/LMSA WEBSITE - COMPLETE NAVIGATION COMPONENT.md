// ============================================
// LMSA WEBSITE - COMPLETE NAVIGATION COMPONENT
// File: src/components/layout/Header.jsx
// ============================================

import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="w-10 h-10 bg-lmsa-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-lmsa-600">LMSA</span>
              <p className="text-xs text-gray-500">Medical Students' Association</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('about')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                  isActive('/about') 
                    ? 'text-lmsa-600 bg-lmsa-50' 
                    : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">About</span>
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'about' && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/about"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">About LMSA</div>
                    <div className="text-xs text-gray-500">Our story and mission</div>
                  </Link>
                  <Link
                    to="/about/history"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Our History</div>
                    <div className="text-xs text-gray-500">50+ years of excellence</div>
                  </Link>
                  <Link
                    to="/about/mission-vision"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Mission & Vision</div>
                    <div className="text-xs text-gray-500">Our goals and values</div>
                  </Link>
                  <Link
                    to="/about/constitution"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Constitution</div>
                    <div className="text-xs text-gray-500">Download our bylaws</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Leadership Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('leadership')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                  isActive('/leadership') 
                    ? 'text-lmsa-600 bg-lmsa-50' 
                    : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Leadership</span>
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'leadership' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'leadership' && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/leadership"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Executive Committee</div>
                    <div className="text-xs text-gray-500">Current cabinet members</div>
                  </Link>
                  <Link
                    to="/leadership/committees"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Standing Committees</div>
                    <div className="text-xs text-gray-500">All 12 committees</div>
                  </Link>
                  <Link
                    to="/leadership/past-presidents"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Past Presidents</div>
                    <div className="text-xs text-gray-500">Alumni leadership</div>
                  </Link>
                  <Link
                    to="/leadership/executive-council"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Executive Council</div>
                    <div className="text-xs text-gray-500">Class presidents & SRC</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Membership Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('membership')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                  isActive('/membership') 
                    ? 'text-lmsa-600 bg-lmsa-50' 
                    : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Membership</span>
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'membership' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'membership' && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/membership"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Join LMSA</div>
                    <div className="text-xs text-gray-500">Become a member</div>
                  </Link>
                  <Link
                    to="/membership/benefits"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Member Benefits</div>
                    <div className="text-xs text-gray-500">What you get</div>
                  </Link>
                  <Link
                    to="/membership/categories"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Membership Types</div>
                    <div className="text-xs text-gray-500">Full, associate, honorary</div>
                  </Link>
                  <Link
                    to="/membership/dues"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Dues & Payments</div>
                    <div className="text-xs text-gray-500">Fee structure</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Academics Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('academics')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                  isActive('/academics') 
                    ? 'text-lmsa-600 bg-lmsa-50' 
                    : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Academics</span>
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'academics' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'academics' && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/academics/symposia"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Symposia</div>
                    <div className="text-xs text-gray-500">Academic conferences</div>
                  </Link>
                  <Link
                    to="/academics/resources"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Study Resources</div>
                    <div className="text-xs text-gray-500">Materials & guides</div>
                  </Link>
                  <Link
                    to="/academics/mentorship"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Mentorship Program</div>
                    <div className="text-xs text-gray-500">Connect with seniors</div>
                  </Link>
                  <Link
                    to="/academics/research"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Research</div>
                    <div className="text-xs text-gray-500">Opportunities & journal</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Events */}
            <Link
              to="/events"
              onClick={closeMenu}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/events')
                  ? 'text-lmsa-600 bg-lmsa-50'
                  : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
              }`}
            >
              Events
            </Link>

            {/* News */}
            <Link
              to="/news"
              onClick={closeMenu}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/news')
                  ? 'text-lmsa-600 bg-lmsa-50'
                  : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
              }`}
            >
              News
            </Link>

            {/* Get Involved Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('get-involved')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                  isActive('/get-involved') 
                    ? 'text-lmsa-600 bg-lmsa-50' 
                    : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Get Involved</span>
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'get-involved' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'get-involved' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/get-involved/volunteer"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Volunteer</div>
                    <div className="text-xs text-gray-500">Community service</div>
                  </Link>
                  <Link
                    to="/get-involved/leadership"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Leadership Opportunities</div>
                    <div className="text-xs text-gray-500">Run for office</div>
                  </Link>
                  <Link
                    to="/get-involved/committees"
                    onClick={closeMenu}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600"
                  >
                    <div className="font-medium">Join a Committee</div>
                    <div className="text-xs text-gray-500">Get active in LMSA</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              onClick={closeMenu}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/contact')
                  ? 'text-lmsa-600 bg-lmsa-50'
                  : 'text-gray-700 hover:text-lmsa-600 hover:bg-gray-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/portal/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-lmsa-600 rounded-lg hover:bg-gray-50"
                >
                  <User size={18} />
                  <span className="font-medium">Portal</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-gray-50"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-lmsa-600 font-medium rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-lmsa-600 text-white font-medium rounded-lg hover:bg-lmsa-700 transition-colors"
                >
                  Join LMSA
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-gray-200">
            <MobileNavSection title="About" items={aboutItems} closeMenu={closeMenu} />
            <MobileNavSection title="Leadership" items={leadershipItems} closeMenu={closeMenu} />
            <MobileNavSection title="Membership" items={membershipItems} closeMenu={closeMenu} />
            <MobileNavSection title="Academics" items={academicsItems} closeMenu={closeMenu} />
            
            <Link
              to="/events"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600 rounded-lg"
            >
              Events
            </Link>
            
            <Link
              to="/news"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600 rounded-lg"
            >
              News
            </Link>

            <MobileNavSection title="Get Involved" items={getInvolvedItems} closeMenu={closeMenu} />
            
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:bg-lmsa-50 hover:text-lmsa-600 rounded-lg"
            >
              Contact
            </Link>

            <div className="pt-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/portal/dashboard"
                    onClick={closeMenu}
                    className="block px-4 py-2 bg-lmsa-50 text-lmsa-600 font-medium rounded-lg"
                  >
                    Go to Portal
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block px-4 py-2 bg-lmsa-600 text-white font-medium rounded-lg text-center"
                  >
                    Join LMSA
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Mobile Navigation Section Component
function MobileNavSection({ title, items, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pl-4 space-y-1 pb-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={closeMenu}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-lmsa-50 hover:text-lmsa-600 rounded-lg"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Navigation Items Data
const aboutItems = [
  { label: 'About LMSA', path: '/about' },
  { label: 'Our History', path: '/about/history' },
  { label: 'Mission & Vision', path: '/about/mission-vision' },
  { label: 'Constitution', path: '/about/constitution' },
];

const leadershipItems = [
  { label: 'Executive Committee', path: '/leadership' },
  { label: 'Standing Committees', path: '/leadership/committees' },
  { label: 'Past Presidents', path: '/leadership/past-presidents' },
  { label: 'Executive Council', path: '/leadership/executive-council' },
];

const membershipItems = [
  { label: 'Join LMSA', path: '/membership' },
  { label: 'Member Benefits', path: '/membership/benefits' },
  { label: 'Membership Types', path: '/membership/categories' },
  { label: 'Dues & Payments', path: '/membership/dues' },
];

const academicsItems = [
  { label: 'Symposia', path: '/academics/symposia' },
  { label: 'Study Resources', path: '/academics/resources' },
  { label: 'Mentorship Program', path: '/academics/mentorship' },
  { label: 'Research', path: '/academics/research' },
];

const getInvolvedItems = [
  { label: 'Volunteer', path: '/get-involved/volunteer' },
  { label: 'Leadership Opportunities', path: '/get-involved/leadership' },
  { label: 'Join a Committee', path: '/get-involved/committees' },
];

// ============================================
// COMPLETE ROUTE STRUCTURE FOR routes.jsx
// ============================================
/*
Add these routes to your src/routes.jsx file:

// About routes
<Route path="/about" element={<AboutPage />} />
<Route path="/about/history" element={<HistoryPage />} />
<Route path="/about/mission-vision" element={<MissionVisionPage />} />
<Route path="/about/constitution" element={<ConstitutionPage />} />

// Leadership routes
<Route path="/leadership" element={<LeadershipPage />} />
<Route path="/leadership/committees" element={<CommitteesPage />} />
<Route path="/leadership/past-presidents" element={<PastPresidentsPage />} />
<Route path="/leadership/executive-council" element={<ExecutiveCouncilPage />} />

// Membership routes
<Route path="/membership" element={<MembershipPage />} />
<Route path="/membership/benefits" element={<BenefitsPage />} />
<Route path="/membership/categories" element={<CategoriesPage />} />
<Route path="/membership/dues" element={<DuesPage />} />

// Academics routes
<Route path="/academics/symposia" element={<SymposiaPage />} />
<Route path="/academics/resources" element={<ResourcesPage />} />
<Route path="/academics/mentorship" element={<MentorshipPage />} />
<Route path="/academics/research" element={<ResearchPage />} />

// Events routes
<Route path="/events" element={<EventsPage />} />
<Route path="/events/:slug" element={<EventDetailPage />} />

// News routes
<Route path="/news" element={<NewsPage />} />
<Route path="/news/:slug" element={<NewsDetailPage />} />

// Get Involved routes
<Route path="/get-involved/volunteer" element={<VolunteerPage />} />
<Route path="/get-involved/leadership" element={<LeadershipOpportunitiesPage />} />
<Route path="/get-involved/committees" element={<JoinCommitteePage />} />

// Contact route
<Route path="/contact" element={<ContactPage />} />
*/