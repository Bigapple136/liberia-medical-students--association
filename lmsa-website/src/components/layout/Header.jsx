import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, User, X, LogOut, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@context/AuthContext';

const primaryNav = [
  {
    label: 'About',
    items: [
      { label: 'About LMSA', detail: 'Our story and mission', path: '/about' },
      { label: 'Our History', detail: '50+ years of excellence', path: '/about/history' },
      { label: 'Mission & Vision', detail: 'Our goals and values', path: '/about/mission-vision' },
      { label: 'Constitution', detail: 'How we are governed', path: '/about/constitution' },
    ],
  },
  {
    label: 'Membership',
    items: [
      { label: 'Join LMSA', detail: 'Become part of the community', path: '/membership' },
      { label: 'Member Benefits', detail: 'What you get as a member', path: '/membership/benefits' },
      { label: 'Membership Types', detail: 'Find your membership path', path: '/membership/categories' },
      { label: 'Dues & Payments', detail: 'Review the fee structure', path: '/membership/dues' },
    ],
  },
  {
    label: 'Learn & lead',
    items: [
      { label: 'Study Resources', detail: 'Tools for your training', path: '/academics/resources' },
      { label: 'Documents', detail: 'Browse the resource library', path: '/documents' },
      { label: 'Mentorship', detail: 'Learn from those ahead', path: '/academics/mentorship' },
      { label: 'Research', detail: 'Turn questions into impact', path: '/academics/research' },
      { label: 'Leadership', detail: 'Grow through service', path: '/leadership' },
      { label: 'Committees', detail: 'Find the work that matters', path: '/leadership/committees' },
    ],
  },
  {
    label: 'Stories & events',
    items: [
      { label: 'Upcoming Events', detail: 'See what is happening', path: '/events' },
      { label: 'Symposia', detail: 'Gather around new ideas', path: '/academics/symposia' },
      { label: 'News & Stories', detail: 'Read the latest from LMSA', path: '/news' },
    ],
  },
  {
    label: 'Get involved',
    items: [
      { label: 'Volunteer', detail: 'Serve alongside your peers', path: '/get-involved/volunteer' },
      { label: 'Leadership Opportunities', detail: 'Build the skills medicine needs', path: '/leadership#stand' },
      { label: 'Join a Committee', detail: 'Turn ideas into action', path: '/get-involved/committees' },
      { label: 'Partnerships', detail: 'Work with LMSA', path: '/partnership' },
    ],
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (items) =>
    items.some((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));

  return (
    <header className="site-header">
      <div className="site-utility">
        <div className="site-container site-utility-inner">
          <p className="site-utility-message">A student-led voice for better healthcare in Liberia</p>
          <nav className="site-utility-links" aria-label="Utility navigation">
            <Link to="/contact">Contact LMSA</Link>
            <Link to="/portal">Member portal</Link>
            {!user && <Link to="/login">Member login</Link>}
          </nav>
        </div>
      </div>

      <div className="site-container site-header-main">
        <Link to="/" className="site-brand" onClick={closeMenu} aria-label="LMSA home">
          <img src="/logo-128.png" alt="" className="site-brand-mark" />
          <span className="site-brand-copy">
            <strong>LMSA</strong>
            <span>Liberia Medical Students&apos; Association</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation" ref={dropdownRef}>
          {primaryNav.map((section) => (
            <div className="site-nav-group" key={section.label}>
              <button
                type="button"
                className={`site-nav-trigger ${isActive(section.items) ? 'is-active' : ''}`}
                aria-expanded={activeDropdown === section.label}
                aria-haspopup="true"
                onClick={() =>
                  setActiveDropdown(activeDropdown === section.label ? null : section.label)
                }
              >
                {section.label}
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className={activeDropdown === section.label ? 'rotate-180' : ''}
                />
              </button>

              {activeDropdown === section.label && (
                <div className="site-nav-menu">
                  {section.items.map((item) => (
                    <Link key={item.path} to={item.path} onClick={closeMenu} className="site-nav-menu-link">
                      <span>{item.label}</span>
                      <small>{item.detail}</small>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="site-header-actions">
          {user ? (
            <>
              {['admin', 'executive', 'super_admin'].includes(user.role) && (
                <Link to="/admin/dashboard" className="site-header-text-link">
                  Admin
                </Link>
              )}
              <Link to="/portal/dashboard" className="site-header-text-link site-header-user-link">
                <User size={16} aria-hidden="true" />
                Portal
              </Link>
              <button type="button" onClick={logout} className="site-header-text-link site-header-logout">
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="site-header-text-link desktop-login">
                Login
              </Link>
              <Link to="/register" className="site-header-join">
                Join LMSA
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="site-menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="site-mobile-navigation">
          <div className="site-container site-mobile-navigation-inner">
            {primaryNav.map((section) => (
              <details key={section.label} className="site-mobile-group">
                <summary>
                  <span>{section.label}</span>
                  <ChevronDown size={17} aria-hidden="true" />
                </summary>
                <div className="site-mobile-links">
                  {section.items.map((item) => (
                    <Link key={item.path} to={item.path} onClick={closeMenu}>
                      <span>{item.label}</span>
                      <small>{item.detail}</small>
                    </Link>
                  ))}
                </div>
              </details>
            ))}

            <div className="site-mobile-actions">
              {user ? (
                <>
                  {['admin', 'executive', 'super_admin'].includes(user.role) && (
                    <Link to="/admin/dashboard" onClick={closeMenu} className="site-mobile-action-secondary">
                      Go to Admin Panel
                    </Link>
                  )}
                  <Link to="/portal/dashboard" onClick={closeMenu} className="site-mobile-action-secondary">
                    Go to Member Portal
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="site-mobile-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="site-mobile-action-secondary">
                    Member login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="site-mobile-action-primary">
                    Join LMSA
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}