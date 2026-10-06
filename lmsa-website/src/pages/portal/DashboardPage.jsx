import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Newspaper,
  Ticket,
  Users,
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { ADMIN_ROLES } from '@utils/constants';
import Card from '@components/common/Card';
import StatusChip from '@components/common/StatusChip';
import { dashboardService } from '@services/dashboard.service';
import { eventService } from '@services/event.service';
import { newsService } from '@services/news.service';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMonthDay(dateStr) {
  if (!dateStr) return { day: '', month: '' };
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('en-US', { day: 'numeric' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  };
}

function RowSkeleton() {
  return (
    <Card className="p-4 sm:p-6" aria-hidden="true">
      <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-100" />
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // One-time redirect: if we just landed here right after login (see
  // LoginPage.jsx's `justLoggedIn` state) and the account turns out to be
  // admin-tier, send them on to the admin dashboard. Deliberately keyed
  // off location.state rather than running on every visit here — an
  // admin who is also a student may well want to view their own student
  // portal on purpose (e.g. via the "Portal" link in the header), and
  // that visit should never get silently hijacked. By the time this
  // component renders at all, ProtectedRoute has already waited for
  // AuthContext's `loading` to settle, so `user.role` here is already
  // final — no extra fetch, no race.
  const justLoggedIn = location.state?.justLoggedIn;
  useEffect(() => {
    if (justLoggedIn && ADMIN_ROLES.includes(user?.role)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [justLoggedIn, user, navigate]);

  const [stats, setStats] = useState(null); // null = unavailable
  const [myEvents, setMyEvents] = useState(null);
  const [newsPosts, setNewsPosts] = useState(null);
  const [upcomingSiteEvents, setUpcomingSiteEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partialError, setPartialError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setPartialError(false);
    const [statsResult, myEventsResult, newsResult, siteEventsResult] = await Promise.allSettled([
      dashboardService.getStats(),
      dashboardService.getMyUpcomingEvents(),
      newsService.getAll({ limit: 3 }),
      eventService.getAll({ upcoming: true }),
    ]);

    setStats(statsResult.status === 'fulfilled' ? statsResult.value : null);
    setMyEvents(myEventsResult.status === 'fulfilled' ? myEventsResult.value || [] : null);
    setNewsPosts(newsResult.status === 'fulfilled' ? newsResult.value.posts || [] : null);
    setUpcomingSiteEvents(siteEventsResult.status === 'fulfilled' ? (siteEventsResult.value || []).length : null);
    setPartialError(
      [statsResult, myEventsResult, newsResult, siteEventsResult].some((result) => result.status === 'rejected')
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // The page's lead element: membership status + one truthful action.
  // No status on a loaded account means the member hasn't applied yet —
  // offer the application form instead of a dead dash.
  const hasStatus = Boolean(stats?.membership_status);
  const leadAction =
    !loading && stats && !hasStatus
      ? { label: 'Apply for membership', to: '/membership#apply' }
      : null;

  // Secondary stats: only the card with a real, existing destination is
  // clickable (same honesty rule as the shell's Soon chips).
  const statCards = [
    { label: 'Events Registered', value: stats ? stats.events_registered_count : undefined, icon: Ticket, to: null },
    { label: 'My Committees', value: stats ? stats.committees_count : undefined, icon: Users, to: null },
    { label: 'Upcoming LMSA Events', value: upcomingSiteEvents ?? undefined, icon: Calendar, to: '/events' },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome Back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here&apos;s what&apos;s happening with your LMSA membership
        </p>
      </div>

      {!loading && partialError && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
          <p className="flex-1">Some of your dashboard could not be loaded. Anything shown as “—” is unavailable, not zero.</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="font-semibold text-amber-900 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Membership status (lead) ─────────────────────────────────────── */}
      <section aria-labelledby="membership-status-heading" className="mb-6 sm:mb-8">
        <h2 id="membership-status-heading" className="sr-only">Membership status</h2>
        <div className="rounded-xl border-2 border-lmsa-600 bg-white p-4 sm:p-6 shadow-sm">
          {loading ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="h-7 w-36 animate-pulse rounded-full bg-gray-100" aria-hidden="true" />
                <div className="h-6 w-24 animate-pulse rounded bg-gray-100" aria-hidden="true" />
              </div>
              <span className="sr-only" role="status">Loading your membership status…</span>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-gray-600">Membership Status</h3>
                <StatusChip status={stats ? stats.membership_status : undefined} size="lg" />
              </div>
              {leadAction && (
                <Link
                  to={leadAction.to}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
                >
                  {leadAction.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Secondary stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map(({ label, value, icon: Icon, to }) => {
          const body = (
            <>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-gray-600">{label}</h3>
                <Icon size={18} className="text-gray-400" aria-hidden="true" />
              </div>
              {loading ? (
                <div className="mt-1 h-7 w-16 animate-pulse rounded bg-gray-100" aria-hidden="true" />
              ) : (
                <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{value ?? '—'}</p>
              )}
            </>
          );

          return (
            <Card key={label} className="p-4 sm:p-6">
              {to ? (
                <Link
                  to={to}
                  className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  {body}
                  <span className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-lmsa-600 group-hover:text-lmsa-700">
                    View events
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ) : (
                body
              )}
            </Card>
          );
        })}
      </div>

      {/* ── My Upcoming Events ───────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">My Upcoming Events</h2>
          <Link
            to="/events"
            className="text-sm text-lmsa-600 hover:text-lmsa-700 flex items-center gap-1 p-2 -m-2 min-h-[44px] min-w-[44px] justify-center"
          >
            View all events <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : myEvents === null ? (
          <Card>
            <p className="py-6 text-center text-sm text-gray-600">
              Your events could not be loaded.{' '}
              <button type="button" onClick={loadDashboard} className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline">
                Try again
              </button>
            </p>
          </Card>
        ) : myEvents.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <Calendar size={32} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-600 mb-1">No upcoming events registered</p>
              <p className="text-sm text-gray-500">
                Browse{' '}
                <Link to="/events" className="text-lmsa-600 hover:underline">
                  upcoming events
                </Link>{' '}
                to register.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {myEvents.map(event => {
              const { day, month } = formatMonthDay(event.start_datetime);
              const body = (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-lmsa-50 text-center"
                    aria-hidden="true"
                  >
                    <span className="text-lg font-bold leading-none text-lmsa-800">{day || '·'}</span>
                    <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-lmsa-700">
                      {month || '—'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="flex-shrink-0" aria-hidden="true" />
                        {formatDate(event.start_datetime)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {event.slug && <ArrowRight size={16} className="mt-1 flex-shrink-0 text-gray-500" aria-hidden="true" />}
                </div>
              );
              return (
                <Card key={event.id} className="p-4 sm:p-6">
                  {event.slug ? (
                    <Link to={`/events/${event.slug}`} className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Recent News ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Recent News</h2>
          <Link
            to="/news"
            className="text-sm text-lmsa-600 hover:text-lmsa-700 flex items-center gap-1 p-2 -m-2 min-h-[44px] min-w-[44px] justify-center"
          >
            View all news <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : newsPosts === null ? (
          <Card>
            <p className="py-6 text-center text-sm text-gray-600">
              News could not be loaded.{' '}
              <button type="button" onClick={loadDashboard} className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline">
                Try again
              </button>
            </p>
          </Card>
        ) : newsPosts.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <Newspaper size={32} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-600">No news posts yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {newsPosts.map(post => (
              <Card key={post.id} className="p-4 sm:p-6">
                <Link to={`/news/${post.slug}`} className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {formatDate(post.published_at || post.created_at)}
                  </p>
                  <h3 className="mt-1 font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt || post.content?.slice(0, 150)}</p>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
