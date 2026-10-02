import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Newspaper,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Card from '@components/common/Card';
import StatusBadge from '@components/common/StatusBadge';
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

const QUICK_ACTIONS = [
  { to: '/events', icon: CalendarDays, label: 'Register for events', description: 'Save your spot' },
  { to: '/get-involved/committees', icon: Users, label: 'Join a committee', description: 'Serve the community' },
  { to: '/portal/profile', icon: User, label: 'Update profile', description: 'Keep details current' },
  { to: '/membership/dues', icon: Wallet, label: 'View dues', description: 'Stay in good standing' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null); // null = unavailable
  const [myEvents, setMyEvents] = useState(null);
  const [newsPosts, setNewsPosts] = useState(null);
  const [upcomingSiteEvents, setUpcomingSiteEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partialError, setPartialError] = useState(false);
  // "Dismissible for the session" (D6) — survives client-side navigation,
  // resets when the tab closes. try/catch for private-mode storage limits.
  const [priorityDismissed, setPriorityDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('lmsa.portal.priority.dismissed') === '1';
    } catch {
      return false;
    }
  });

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
    setUpcomingSiteEvents(siteEventsResult.status === 'fulfilled' ? siteEventsResult.value || [] : null);
    setPartialError(
      [statsResult, myEventsResult, newsResult, siteEventsResult].some((result) => result.status === 'rejected')
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const membershipStatus = stats ? formatStatus(stats.membership_status) : null;
  const firstName = user?.full_name?.trim().split(/\s+/)[0];

  // Soonest future site-wide event (for the next-event widget).
  const nextSiteEvent = useMemo(() => {
    if (!upcomingSiteEvents) return null;
    const now = Date.now() - 24 * 60 * 60 * 1000; // tolerate same-day events
    return (
      [...upcomingSiteEvents]
        .filter((event) => event.start_datetime && new Date(event.start_datetime).getTime() >= now)
        .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))[0] || null
    );
  }, [upcomingSiteEvents]);

  // Member's soonest registered event (for the priority ranking).
  const soonestRegistered = useMemo(() => {
    if (!myEvents) return null;
    return (
      [...myEvents]
        .filter((event) => event.start_datetime)
        .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))[0] || null
    );
  }, [myEvents]);

  // "This month" priority card (spec §4.5, decision D6): the single most
  // time-relevant item for this member, ranked from data the API actually
  // returns today. Moderate emphasis — one calm green-accented card, never
  // red (red stays reserved for suspended status and true errors).
  const priority = useMemo(() => {
    if (loading) return null;
    if (stats && stats.membership_status === 'pending') {
      return {
        key: 'pending',
        title: 'Your membership application is under review',
        body: 'See what happens next and what to expect while the committee reviews it.',
        cta: { label: 'View your application status', to: '/portal/profile' },
      };
    }
    if (soonestRegistered) {
      const daysAway = (new Date(soonestRegistered.start_datetime) - Date.now()) / (24 * 60 * 60 * 1000);
      if (daysAway <= 30) {
        return {
          key: 'registered',
          title: soonestRegistered.title,
          body: `You're registered — ${formatDate(soonestRegistered.start_datetime)}${
            soonestRegistered.location ? ` at ${soonestRegistered.location}` : ''
          }.`,
          cta: {
            label: soonestRegistered.slug ? 'View event details' : 'Browse all events',
            to: soonestRegistered.slug ? `/events/${soonestRegistered.slug}` : '/events',
          },
        };
      }
    }
    if (nextSiteEvent) {
      // Already registered for the site's next event? Never offer a
      // register CTA for it — say so truthfully instead.
      const alreadyRegistered = soonestRegistered && soonestRegistered.id === nextSiteEvent.id;
      const where = `${formatDate(nextSiteEvent.start_datetime)}${
        nextSiteEvent.location ? ` at ${nextSiteEvent.location}` : ''
      }`;
      return alreadyRegistered
        ? {
            key: 'registered-next',
            title: nextSiteEvent.title,
            body: `You're registered — ${where}. See you there.`,
            cta: nextSiteEvent.slug ? { label: 'View event details', to: `/events/${nextSiteEvent.slug}` } : null,
          }
        : {
            key: 'register',
            title: nextSiteEvent.title,
            body: `${where}. Open to members — save your spot.`,
            cta: { label: nextSiteEvent.slug ? 'Register for this event' : 'Browse events', to: nextSiteEvent.slug ? `/events/${nextSiteEvent.slug}` : '/events' },
          };
    }
    if (myEvents && upcomingSiteEvents) {
      return {
        key: 'clear',
        title: 'Nothing due this month',
        body: "You're all caught up — no registrations lapsing and nothing opening right now.",
        cta: null,
      };
    }
    return null;
  }, [loading, stats, soonestRegistered, nextSiteEvent, myEvents, upcomingSiteEvents]);

  // Stat cards are doors (spec §4.5): every number links to where the
  // member acts on it. `door: null` renders a plain card (next-event
  // widget handles its own empty state).
  const statCards = [
    {
      label: 'Membership Status',
      kind: 'badge',
      // When there's no status yet, the apply link inside is the action —
      // the card itself must not become a door (no <a> inside <a>).
      door: stats && !membershipStatus ? null : '/portal/profile',
      applyLink: stats && !membershipStatus ? { label: 'Apply for membership', to: '/membership#apply' } : null,
    },
    { label: 'Events Registered', kind: 'value', value: stats ? stats.events_registered_count : undefined, door: '/portal/events' },
    { label: 'My Committees', kind: 'value', value: stats ? stats.committees_count : undefined, door: '/leadership/committees' },
    { label: 'Next Event', kind: 'nextEvent', door: null },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome Back{firstName ? `, ${firstName}` : ''}!
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

      {/* ── This month (D6 — moderate emphasis, dismissible) ─────────────── */}
      {loading ? (
        <div className="mb-6 h-[86px] animate-pulse rounded-lg bg-gray-100 sm:h-[74px]" aria-hidden="true" />
      ) : priority && !priorityDismissed ? (
        <div className="mb-6 rounded-lg border border-lmsa-200 bg-lmsa-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lmsa-100 text-lmsa-700" aria-hidden="true">
              <CalendarDays size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-lmsa-700">This month</p>
              <h2 className="mt-0.5 font-semibold text-lmsa-900">{priority.title}</h2>
              <p className="mt-0.5 text-sm text-gray-600">{priority.body}</p>
              {priority.cta && (
                <Link
                  to={priority.cta.to}
                  className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  {priority.cta.label} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setPriorityDismissed(true);
                try {
                  sessionStorage.setItem('lmsa.portal.priority.dismissed', '1');
                } catch {
                  /* storage unavailable — dismissal just lasts this visit */
                }
              }}
              className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lmsa-700/70 hover:text-lmsa-900 hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
              aria-label="Dismiss this month's priority"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <section className="mb-6 sm:mb-8" aria-label="Quick actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, description }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3.5 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lmsa-50 text-lmsa-700" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900 leading-tight">{label}</span>
                <span className="block text-xs text-gray-500 leading-tight mt-0.5">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quick Stats — every number is a door ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((card) => {
          const cardBody = (
            <Card className="h-full p-4 sm:p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.label}</h3>
              {loading ? (
                <div className="h-7 w-16 animate-pulse rounded bg-gray-100" aria-hidden="true" />
              ) : card.kind === 'badge' ? (
                card.applyLink ? (
                  <Link
                    to={card.applyLink.to}
                    className="inline-block text-sm font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline"
                  >
                    {card.applyLink.label}
                  </Link>
                ) : (
                  /* Status as the shared badge — text + color, never color alone */
                  <StatusBadge status={membershipStatus?.toLowerCase()} />
                )
              ) : card.kind === 'nextEvent' ? (
                nextSiteEvent ? (
                  <>
                    <p className="text-base font-semibold text-lmsa-700 line-clamp-2">{nextSiteEvent.title}</p>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} aria-hidden="true" />
                        {formatDate(nextSiteEvent.start_datetime)}
                      </span>
                      {nextSiteEvent.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} aria-hidden="true" />
                          {nextSiteEvent.location}
                        </span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No events scheduled right now — check back soon.</p>
                )
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{card.value ?? '—'}</p>
              )}
            </Card>
          );

          // The next-event card is its own door when there is an event to see.
          const door =
            card.kind === 'nextEvent'
              ? nextSiteEvent?.slug
                ? `/events/${nextSiteEvent.slug}`
                : null
              : card.door;

          return door && !loading ? (
            <Link
              key={card.label}
              to={door}
              className="block rounded-xl transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
              aria-label={
                card.kind === 'nextEvent'
                  ? `Open event: ${nextSiteEvent.title}`
                  : `${card.label} — open details`
              }
            >
              {cardBody}
            </Link>
          ) : (
            <div key={card.label}>{cardBody}</div>
          );
        })}
      </div>

      {/* ── My Upcoming Events ───────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">My Upcoming Events</h2>
          <Link
            to="/portal/events"
            className="text-sm text-lmsa-600 hover:text-lmsa-700 flex items-center gap-1 p-2 -m-2 min-h-[44px] min-w-[44px] justify-center"
          >
            Manage my events <ArrowRight size={14} />
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
              <Calendar size={32} className="mx-auto text-gray-400 mb-3" aria-hidden="true" />
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
              <Newspaper size={32} className="mx-auto text-gray-400 mb-3" aria-hidden="true" />
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
