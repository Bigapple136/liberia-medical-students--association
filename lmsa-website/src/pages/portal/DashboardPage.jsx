import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Calendar, Users, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import Card from '@components/common/Card';
import { dashboardService } from '@services/dashboard.service';
import { eventService } from '@services/event.service';
import { newsService } from '@services/news.service';

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    membership_status: null,
    events_registered_count: 0,
    committees_count: 0,
    upcoming_site_events: 0,
  });
  const [myEvents, setMyEvents] = useState([]);
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [statsData, myEventsData, newsData, siteEventsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getMyUpcomingEvents(),
        newsService.getAll({ limit: 3 }),
        eventService.getAll({ upcoming: true }),
      ]);

      setStats({
        membership_status: statsData.membership_status,
        events_registered_count: statsData.events_registered_count,
        committees_count: statsData.committees_count,
        upcoming_site_events: (siteEventsData || []).length,
      });
      setMyEvents(myEventsData || []);
      setNewsPosts(newsData.posts || []);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  function formatStatus(status) {
    if (!status) return '—';
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size={32} className="animate-spin text-lmsa-600" />
      </div>
    );
  }

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

      {/* ── Quick Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Membership Status</h3>
          <p className="text-xl sm:text-2xl font-bold text-lmsa-600">
            {formatStatus(stats.membership_status)}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Events Registered</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.events_registered_count}</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">My Committees</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats.committees_count}</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Upcoming Site Events</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.upcoming_site_events}</p>
        </Card>
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

        {myEvents.length === 0 ? (
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
            {myEvents.map(event => (
              <Card key={event.id} className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-lmsa-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="flex-shrink-0" />
                        {formatDate(event.start_datetime)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <BookOpen size={14} className="flex-shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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

        {newsPosts.length === 0 ? (
          <Card>
            <div className="text-center py-6">
              <Users size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No news posts yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {newsPosts.map(post => (
              <Card key={post.id} className="p-4 sm:p-6">
                <Link to={`/news/${post.slug}`} className="block hover:shadow-md transition-shadow">
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
