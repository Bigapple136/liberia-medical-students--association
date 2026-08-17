import { useEffect, useState } from 'react';
import Card from '@components/common/Card';
import { committeeService } from '@services/committee.service';
import { eventService } from '@services/event.service';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    committees: 0,
    upcomingEvents: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [committees, upcoming, allEvents] = await Promise.all([
          committeeService.getAll(),
          eventService.getAll({ upcoming: true }),
          eventService.getAll(),
        ]);

        const totalMembers = committees.reduce(
          (sum, c) => sum + (c.member_count || 0),
          0
        );

        setStats({
          members: totalMembers,
          committees: committees.length,
          upcomingEvents: upcoming.length,
          totalEvents: allEvents.length,
        });
      } catch (e) {
        // Leave zeros if the requests fail; cards still render.
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage LMSA operations and members
        </p>
      </div>

      {/* Admin Stats (real data) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Members</h3>
          <p className="text-2xl font-bold text-lmsa-600">
            {loading ? '—' : stats.members}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Committees</h3>
          <p className="text-2xl font-bold text-lmsa-600">
            {loading ? '—' : stats.committees}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Upcoming Events</h3>
          <p className="text-2xl font-bold text-blue-600">
            {loading ? '—' : stats.upcomingEvents}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Events</h3>
          <p className="text-2xl font-bold text-purple-600">
            {loading ? '—' : stats.totalEvents}
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="font-semibold text-lg mb-2">👥 Manage Committees</h3>
            <p className="text-gray-600 text-sm">Edit committee details, members, and content</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="font-semibold text-lg mb-2">📅 Manage Events</h3>
            <p className="text-gray-600 text-sm">Create and manage LMSA events</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="font-semibold text-lg mb-2">📊 View Reports</h3>
            <p className="text-gray-600 text-sm">Analytics and performance reports</p>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const recentActivity = [
  {
    action: 'New Member Registered',
    details: 'John Doe completed registration and is pending approval',
    timestamp: '2 hours ago'
  },
  {
    action: 'Event Created',
    details: 'Annual Medical Symposium scheduled for April 25, 2026',
    timestamp: '5 hours ago'
  },
  {
    action: 'Membership Renewed',
    details: 'Jane Smith renewed her membership for 2026-2027',
    timestamp: '1 day ago'
  },
  {
    action: 'Payment Received',
    details: 'Membership dues payment of $25.00 processed',
    timestamp: '1 day ago'
  }
];
