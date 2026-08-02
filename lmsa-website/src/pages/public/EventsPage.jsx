import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const events = [
  {
    id: 1,
    title: 'Annual Medical Symposium 2026',
    date: 'August 15-17, 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'Monrovia, Liberia',
    category: 'Conference',
    image: null,
    excerpt: 'Join us for three days of inspiring talks, workshops, and networking with medical professionals from across West Africa.',
    slug: 'annual-symposium-2026',
  },
  {
    id: 2,
    title: 'Community Health Outreach',
    date: 'June 20, 2026',
    time: '8:00 AM - 2:00 PM',
    location: 'West Point, Monrovia',
    category: 'Community Service',
    image: null,
    excerpt: 'Free health screenings and education for underserved communities. Volunteers needed!',
    slug: 'community-health-outreach-june',
  },
  {
    id: 3,
    title: 'Research Workshop Series',
    date: 'July 5, 2026',
    time: '2:00 PM - 4:00 PM',
    location: 'Virtual Event',
    category: 'Workshop',
    image: null,
    excerpt: 'Learn research methodology and data analysis skills from experienced faculty.',
    slug: 'research-workshop-july',
  },
  {
    id: 4,
    title: 'Mentorship Program Orientation',
    date: 'July 12, 2026',
    time: '3:00 PM - 5:00 PM',
    location: 'LMSA Headquarters',
    category: 'Orientation',
    image: null,
    excerpt: 'New to the mentorship program? Attend this orientation to learn how to get matched with a mentor.',
    slug: 'mentorship-orientation',
  },
  {
    id: 5,
    title: 'Student Leadership Summit',
    date: 'September 8-9, 2026',
    time: '10:00 AM - 6:00 PM',
    location: 'Monrovia, Liberia',
    category: 'Leadership',
    image: null,
    excerpt: 'Develop leadership skills and network with student leaders from medical schools across Liberia.',
    slug: 'leadership-summit-2026',
  },
  {
    id: 6,
    title: 'Annual General Meeting',
    date: 'October 15, 2026',
    time: '11:00 AM - 3:00 PM',
    location: 'TBD',
    category: 'Meeting',
    image: null,
    excerpt: 'Join us for the annual general meeting to review achievements and plan for the upcoming year.',
    slug: 'agm-2026',
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-lg text-gray-600">Upcoming Activities and Programs</p>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Calendar size={48} className="text-gray-400" />
              </div>
              <div className="p-6">
                <span className="bg-lmsa-100 text-lmsa-700 text-xs font-bold px-3 py-1 rounded-full">
                  {event.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.excerpt}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-lmsa-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-lmsa-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-lmsa-600" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-lmsa-600 font-medium text-sm">
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
