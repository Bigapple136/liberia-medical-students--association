import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, FileText, Megaphone,
  UserPlus, Settings, ExternalLink, ArrowLeft
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/committees', label: 'Committee Management', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/membership', label: 'Membership Review', icon: UserPlus },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shrink-0">
          <div className="p-5 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-lmsa-600 flex items-center justify-center">
                <Settings size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">LMSA</p>
                <p className="text-xs text-gray-500 leading-tight">Admin Panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin/dashboard'}
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
            >
              <ExternalLink size={16} />
              View Site
            </a>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
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
