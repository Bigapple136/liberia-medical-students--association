import { useAuth } from '@context/AuthContext';
import Card from '@components/common/Card';

export default function DashboardPage() {
  useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your LMSA membership
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Membership Status</h3>
          <p className="text-2xl font-bold text-lmsa-600">Active</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Events Attended</h3>
          <p className="text-2xl font-bold">12</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Resources Accessed</h3>
          <p className="text-2xl font-bold">28</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Community Rank</h3>
          <p className="text-2xl font-bold">#15</p>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <Card key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.date}</p>
                  <p className="text-gray-600 text-sm">{event.location}</p>
                </div>
                <button className="btn btn-primary text-sm">Register</button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Announcements */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Announcements</h2>
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <Card key={index}>
              <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
              <p className="text-gray-600 text-sm">{announcement.excerpt}</p>
              <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const upcomingEvents = [
  {
    title: 'Annual Medical Symposium',
    date: 'April 25, 2026',
    location: 'A.M. Dogliotti College of Medicine'
  },
  {
    title: 'Community Health Camp',
    date: 'May 5, 2026',
    location: 'Monrovia Community Center'
  },
  {
    title: 'Study Group: Anatomy Review',
    date: 'May 12, 2026',
    location: 'Library Conference Room'
  }
];

const announcements = [
  {
    title: 'Membership Renewal Now Open',
    excerpt: 'Don\'t forget to renew your LMSA membership for the 2026-2027 academic year. Early bird discount available until May 1st.',
    date: 'April 10, 2026'
  },
  {
    title: 'New Research Opportunities',
    excerpt: 'Several research positions are now available for LMSA members. Check the opportunities board for more details.',
    date: 'April 8, 2026'
  }
];
