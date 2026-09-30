import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { Calendar, HeartPulse, Home, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import StatusBadge from '@components/common/StatusBadge';

const NAV_ITEMS = [
  { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/portal/events', label: 'My Events', icon: Calendar },
  { to: '/portal/profile', label: 'My Profile', icon: User },
];

/**
 * Member portal shell (spec §4.2).
 *
 * Deliberately compact (D4): its own sidebar + mobile top bar, never a
 * replica of the public chrome. Desktop gets a persistent 256px sidebar;
 * mobile adopts the admin panel's proven sticky top bar + off-canvas
 * drawer pattern. The drawer closes on Esc, backdrop click, and nav
 * selection, and returns focus to the hamburger on close.
 */
export default function PortalLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toggleButtonRef = useRef(null);
  const wasOpenRef = useRef(false);

  const closeDrawer = () => setDrawerOpen(false);

  // Return focus to the hamburger after the drawer closes (spec §4.7) —
  // but only on a true open→close transition, never on first mount.
  useEffect(() => {
    if (wasOpenRef.current && !drawerOpen) {
      toggleButtonRef.current?.focus();
    }
    wasOpenRef.current = drawerOpen;
  }, [drawerOpen]);

  // Esc closes the mobile drawer.
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const handleSignOut = () => {
    closeDrawer();
    // After logout the session clears and ProtectedRoute redirects;
    // navigating home here keeps the exit predictable even on the odd
    // chance the redirect races.
    logout();
    navigate('/');
  };

  const initial = user?.full_name?.trim().charAt(0).toUpperCase() || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-lmsa-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-lmsa-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Mobile top bar (admin panel pattern) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
            aria-label="Open portal menu"
            aria-expanded={drawerOpen}
            aria-controls="portal-sidebar"
          >
            <Menu size={22} />
          </button>
          <Link to="/portal/dashboard" className="flex items-center gap-2" onClick={closeDrawer}>
            <div className="w-8 h-8 rounded-lg bg-lmsa-600 flex items-center justify-center">
              <HeartPulse size={16} className="text-white" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-900 text-sm">LMSA</p>
              <p className="text-xs text-gray-500">Member Portal</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Off-canvas backdrop */}
        {drawerOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={closeDrawer}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          id="portal-sidebar"
          className={`fixed lg:sticky inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-col shrink-0 transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0 lg:flex hidden'
          }`}
        >
          {/* Identity header — badge links home so the exit exists even with the drawer closed */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={closeDrawer} aria-label="LMSA home">
              <div className="w-9 h-9 rounded-lg bg-lmsa-600 flex items-center justify-center">
                <HeartPulse size={18} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">LMSA</p>
                <p className="text-xs text-gray-500 leading-tight">Member Portal</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={closeDrawer}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
              aria-label="Close portal menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav aria-label="Portal" className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 ${
                    isActive
                      ? 'bg-lmsa-50 text-lmsa-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Identity chip + exits */}
          <div className="border-t border-gray-200 p-4 space-y-1">
            <div className="flex items-center gap-3 px-2 py-2">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lmsa-100 text-sm font-bold text-lmsa-800"
                aria-hidden="true"
              >
                {initial || <User size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user?.full_name || 'Member'}
                </p>
                <div className="mt-0.5">
                  <StatusBadge status={user?.membership_status} />
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
              onClick={closeDrawer}
            >
              <Home size={16} aria-hidden="true" />
              Back to LMSA site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main id="main-content" className="flex-1 p-4 sm:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
