import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, FileText, Megaphone,
  UserPlus, Newspaper, Settings, ExternalLink, ArrowLeft,
  Crown, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/committees', label: 'Committee Management', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/membership', label: 'Membership Review', icon: UserPlus },
  { to: '/admin/news', label: 'News Management', icon: Newspaper },
  { to: '/admin/leadership', label: 'Leadership', icon: Crown },
];

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar with hamburger toggle */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            aria-label="Open admin menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-lmsa-600 flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-900 text-sm">LMSA</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Mobile off-canvas backdrop */}
        {drawerOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={closeDrawer}
          />
        )}

        {/* Admin sidebar */}
        <aside
          className={`fixed lg:sticky inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-col shrink-0 transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0 lg:flex hidden'
          }`}
        >
          {/* Sidebar header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={closeDrawer}>
              <div className="w-9 h-9 rounded-lg bg-lmsa-600 flex items-center justify-center">
                <Settings size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">LMSA</p>
                <p className="text-xs text-gray-500 leading-tight">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={closeDrawer}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Close admin menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin/dashboard'}
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-lmsa-50 text-lmsa-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={closeDrawer}
            >
              <ExternalLink size={16} />
              View Site
            </a>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={closeDrawer}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
