import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import StatusChip from '@components/common/StatusChip';

// Primary nav: destinations that exist today. Roadmap items render disabled
// with a "Soon" chip (confirmed shape decision) so the portal's direction is
// visible without creating dead links.
const NAV_ITEMS = [
  { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const SOON_ITEMS = [
  { label: 'My Events', icon: CalendarDays },
  { label: 'Resources', icon: FolderOpen },
  { label: 'Dues', icon: Wallet },
  { label: 'Applications', icon: ClipboardList },
];

function initialsOf(user) {
  const name = user?.full_name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (user?.email) return user.email.slice(0, 2).toUpperCase();
  return '?';
}

function displayNameOf(user) {
  return user?.full_name?.trim() || user?.email || 'Member';
}

function NavList({ onNavigate }) {
  return (
    <nav aria-label="Portal" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 ${
              isActive
                ? 'bg-lmsa-50 font-semibold text-lmsa-800'
                : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              {label}
              {isActive && <span className="sr-only">(current page)</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SoonList() {
  return (
    <ul aria-label="Coming soon" className="flex flex-col gap-1">
      {SOON_ITEMS.map(({ label, icon: Icon }) => (
        <li
          key={label}
          aria-disabled="true"
          className="flex min-h-[44px] cursor-not-allowed select-none items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-400"
        >
          <Icon size={20} className="shrink-0" aria-hidden="true" />
          <span className="flex-1">{label}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Soon
          </span>
        </li>
      ))}
    </ul>
  );
}

function IdentityBlock({ user, logout }) {
  return (
    <div className="border-t border-gray-200 p-3">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lmsa-100 text-xs font-bold text-lmsa-800"
          aria-hidden="true"
        >
          {initialsOf(user)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{displayNameOf(user)}</p>
          <div className="mt-0.5">
            <StatusChip status={user?.membership_status} />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={logout}
        className="mt-2 flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
      >
        <LogOut size={20} className="shrink-0" aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
}

function SidebarContent({ user, logout, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand block */}
      <div className="border-b border-gray-200 p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-h-[44px] items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-lmsa-600 text-sm font-bold text-white"
            aria-hidden="true"
          >
            LM
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight text-gray-900">LMSA</span>
            <span className="block text-xs text-gray-500">Member portal</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <NavList onNavigate={onNavigate} />

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          More, coming soon
        </p>
        <SoonList />

        <div className="mt-6 border-t border-gray-200 pt-3">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Support</p>
          <Link
            to="/contact"
            onClick={onNavigate}
            className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
          >
            <HelpCircle size={20} className="shrink-0" aria-hidden="true" />
            Help &amp; contact
          </Link>
          <Link
            to="/"
            onClick={onNavigate}
            className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
          >
            <ArrowLeft size={20} className="shrink-0" aria-hidden="true" />
            Back to LMSA site
          </Link>
        </div>
      </div>

      <IdentityBlock user={user} logout={logout} />
    </div>
  );
}

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);

  // Close the drawer whenever the route changes — the member navigated, so
  // the drawer's job is done.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Drawer hygiene: Escape closes and refocuses the toggle; body scroll is
  // locked while open. Focus is trapped inside the drawer on Tab.
  useEffect(() => {
    if (!drawerOpen) return undefined;

    const { style: bodyStyle } = document.body;
    const previousOverflow = bodyStyle.overflow;
    bodyStyle.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      bodyStyle.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 md:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          aria-controls="portal-drawer"
        >
          {drawerOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-lmsa-600 text-sm font-bold text-white"
            aria-hidden="true"
          >
            LM
          </span>
          <span className="text-sm font-bold text-gray-900">LMSA</span>
          <span className="text-sm text-gray-500">· Portal</span>
        </span>
      </header>

      {/* Scrim + drawer (mobile) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        id="portal-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Portal menu"
        className={`fixed bottom-0 left-0 top-0 z-50 w-64 bg-white shadow-lg transition-[transform,visibility] duration-200 md:hidden ${
          drawerOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <SidebarContent user={user} logout={logout} onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="fixed bottom-0 left-0 top-0 hidden w-64 border-r border-gray-200 bg-white md:sticky md:top-0 md:block md:h-screen md:translate-x-0">
          <SidebarContent user={user} logout={logout} />
        </aside>

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
