import { Calendar, MapPin, Users } from 'lucide-react';

const symposia = [
  {
    title: 'Annual Medical Symposium 2026',
    date: 'August 15-17, 2026',
    location: 'Monrovia, Liberia',
    theme: 'Innovation in African Healthcare',
    attendees: '500+',
    status: 'Upcoming',
  },
  {
    title: 'Public Health Conference',
    date: 'March 20-21, 2026',
    location: 'Virtual Event',
    theme: 'Community Health Strategies',
    attendees: '300+',
    status: 'Upcoming',
  },
  {
    title: 'Research & Innovation Summit',
    date: 'November 10-12, 2025',
    location: 'Monrovia, Liberia',
    theme: 'Student-Led Research',
    attendees: '250+',
    status: 'Completed',
  },
];

export default function SymposiaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Symposia</h1>
          <p className="text-lg text-gray-600">Academic Conferences and Events</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            LMSA organizes several academic conferences and symposia throughout the year, providing 
            students with opportunities to present research, learn from experts, and network with 
            professionals. These events are cornerstones of our academic mission.
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Symposia</h2>
          <div className="space-y-4">
            {symposia
              .filter((s) => s.status === 'Upcoming')
              .map((symposium, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="bg-lmsa-100 text-lmsa-700 text-xs font-bold px-3 py-1 rounded-full">
                        {symposium.status}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">
                        {symposium.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-lmsa-600 font-medium mb-4">{symposium.theme}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-lmsa-600" />
                      <span>{symposium.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-lmsa-600" />
                      <span>{symposium.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-lmsa-600" />
                      <span>Expected: {symposium.attendees}</span>
                    </div>
                  </div>
                  <button className="mt-4 btn btn-primary">Register Now</button>
                </div>
              ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Symposia</h2>
          <div className="space-y-4">
            {symposia
              .filter((s) => s.status === 'Completed')
              .map((symposium, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{symposium.title}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                      {symposium.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{symposium.theme}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{symposium.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Attended: {symposium.attendees}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
