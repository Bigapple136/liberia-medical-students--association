import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Calendar, Clock, MapPin, Newspaper } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Card from '@components/common/Card';
import { dashboardService } from '@services/dashboard.service';
import { eventService } from '@services/event.service';
import { newsService } from '@services/news.service';

function formatStatus(status) {
  if (!status) return null;
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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

  const membershipStatus = stats ? formatStatus(stats.membership_status) : null;

  const statCards = [
    {
      label: 'Membership Status',
      value: membershipStatus || (stats ? null : undefined),
      accent: 'text-lmsa-600',
      // stats loaded but no status -> show apply link instead of a dead dash
      emptyAction: stats && !membershipStatus ? { label: 'Apply for membership', to: '/membership#apply' } : null,
    },
    { label: 'Events Registered', value: stats ? stats.events_registered_count : undefined, accent: '' },
    { label: 'My Committees', value: stats ? stats.committees_count : undefined, accent: '' },
    { label: 'Upcoming LMSA Events', value: upcomingSiteEvents ?? undefined, accent: 'text-blue-600' },
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

      {/* ── Quick Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map(({ label, value, accent, emptyAction }) => (
          <Card key={label} className="p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{label}</h3>
            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-gray-100" aria-hidden="true" />
            ) : emptyAction ? (
              <Link to={emptyAction.to} className="inline-block text-sm font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline">
                {emptyAction.label}
              </Link>
            ) : (
              <p className={`text-xl sm:text-2xl font-bold ${accent}`}>{value ?? '—'}</p>
            )}
          </Card>
        ))}
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
              <Calendar size={32} className="mx-auto text-gray-400 mb-3" />
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
              const body = (
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-lmsa-600 flex-shrink-0 mt-1" aria-hidden="true" />
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
                  {event.slug && <ArrowRight size={16} className="mt-1 flex-shrink-0 text-gray-400" aria-hidden="true" />}
                </div>
              );
              return (
                <Card key={event.id} className="p-4 sm:p-6">
                  {event.slug ? (
                    <Link to={`/events/${event.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
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
              <Newspaper size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No news posts yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {newsPosts.map(post => (
              <Card key={post.id} className="p-4 sm:p-6">
                <Link to={`/news/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
                  <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt || post.content?.slice(0, 150)}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(post.published_at || post.created_at)}
                  </p>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
