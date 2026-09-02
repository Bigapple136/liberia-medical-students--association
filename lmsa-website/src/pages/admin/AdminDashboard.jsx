import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Calendar, ClipboardCheck, Users } from 'lucide-react';
import Card from '@components/common/Card';
import { committeeService } from '@services/committee.service';
import { eventService } from '@services/event.service';
import { membershipService } from '@services/membership.service';

const STATUS_BADGES = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-lmsa-50 text-lmsa-700',
  rejected: 'bg-red-50 text-red-700',
};

const quickActions = [
  {
    to: '/admin/membership',
    icon: ClipboardCheck,
    title: 'Review applications',
    description: 'Approve or reject pending membership applications',
  },
  {
    to: '/admin/committees',
    icon: Users,
    title: 'Manage committees',
    description: 'Edit committee details, members, and content',
  },
  {
    to: '/admin/events',
    icon: Calendar,
    title: 'Manage events',
    description: 'Create and manage LMSA events',
  },
];

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
}

function typeLabel(value) {
  return (value || '').replace(/^\w/, (character) => character.toUpperCase());
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState(null); // null = unavailable
  const [committees, setCommittees] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partialError, setPartialError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setPartialError(false);
    const [applicationsResult, committeesResult, upcomingResult] = await Promise.allSettled([
      membershipService.getAll(),
      committeeService.getAll(),
      eventService.getAll({ upcoming: true }),
    ]);

    setApplications(applicationsResult.status === 'fulfilled' ? applicationsResult.value || [] : null);
    setCommittees(committeesResult.status === 'fulfilled' ? committeesResult.value || [] : null);
    setUpcomingEvents(upcomingResult.status === 'fulfilled' ? upcomingResult.value || [] : null);
    setPartialError([applicationsResult, committeesResult, upcomingResult].some((result) => result.status === 'rejected'));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pendingCount = applications ? applications.filter((a) => a.application_status === 'pending').length : null;
  const approvedCount = applications ? applications.filter((a) => a.application_status === 'approved').length : null;
  const recentApplications = applications ? applications.slice(0, 5) : [];

  const stats = [
    { label: 'Pending applications', value: pendingCount, accent: 'text-amber-600' },
    { label: 'Approved members', value: approvedCount, accent: 'text-lmsa-600' },
    { label: 'Committees', value: committees ? committees.length : null, accent: 'text-lmsa-600' },
    { label: 'Upcoming events', value: upcomingEvents ? upcomingEvents.length : null, accent: 'text-blue-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage LMSA operations and members
        </p>
      </div>

      {!loading && partialError && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
          <p className="flex-1">Some dashboard data could not be loaded. Figures shown as “—” are unavailable, not zero.</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="font-semibold text-amber-900 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats — real data only; em-dash means unavailable */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, accent }) => (
          <Card key={label}>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{label}</h3>
            <p className={`text-2xl font-bold ${accent}`}>
              {loading || value === null ? '—' : value}
            </p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lmsa-50 text-lmsa-700" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-semibold text-lg">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent applications — real feed */}
      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold">Recent applications</h2>
          <Link to="/admin/membership" className="text-sm font-semibold text-lmsa-700 hover:text-lmsa-900">
            View all applications
          </Link>
        </div>
        <Card>
          {loading ? (
            <div className="space-y-4" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : applications === null ? (
            <p className="py-6 text-center text-sm text-gray-600">
              Applications could not be loaded.{' '}
              <button type="button" onClick={loadDashboard} className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline">
                Try again
              </button>
            </p>
          ) : recentApplications.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-600">No membership applications yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentApplications.map((application) => (
                <li key={application.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{application.applicant_name || application.applicant_email || 'Unnamed applicant'}</p>
                    <p className="text-sm text-gray-600">{typeLabel(application.membership_type)} membership</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded ${STATUS_BADGES[application.application_status] || 'bg-gray-100 text-gray-700'}`}>
                    {application.application_status}
                  </span>
                  {application.submitted_at && (
                    <time dateTime={application.submitted_at} className="text-xs text-gray-500">
                      {formatDate(application.submitted_at)}
                    </time>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
