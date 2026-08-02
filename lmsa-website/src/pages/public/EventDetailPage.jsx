import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';

const eventsData = {
  'annual-symposium-2026': {
    title: 'Annual Medical Symposium 2026',
    date: 'August 15-17, 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'Monrovia, Liberia',
    category: 'Conference',
    description: 'Join us for three days of inspiring talks, workshops, and networking with medical professionals from across West Africa. This year\'s theme is "Innovation in African Healthcare."',
  },
  'community-health-outreach-june': {
    title: 'Community Health Outreach',
    date: 'June 20, 2026',
    time: '8:00 AM - 2:00 PM',
    location: 'West Point, Monrovia',
    category: 'Community Service',
    description: 'Free health screenings and education for underserved communities. Volunteers needed!',
  },
};

export default function EventDetailPage() {
  const { slug } = useParams();
  const event = eventsData[slug];

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link to="/events" className="text-lmsa-600 hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link to="/events" className="inline-flex items-center gap-2 text-lmsa-600 hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to Events
        </Link>

        {/* Event Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <span className="bg-lmsa-100 text-lmsa-700 text-sm font-bold px-4 py-1 rounded-full">
            {event.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-6">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar size={20} className="text-lmsa-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock size={20} className="text-lmsa-600" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin size={20} className="text-lmsa-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
          </div>

          <button className="btn btn-primary mt-8">Register for Event</button>
        </div>
      </div>
    </div>
  );
}
