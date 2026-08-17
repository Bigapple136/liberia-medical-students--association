import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '@services/event.service';

function formatDate(start, end) {
  const opts = { month: 'long', day: 'numeric', year: 'numeric' };
  if (!start) return 'Date TBD';
  const startDate = new Date(start).toLocaleDateString('default', opts);
  if (end && new Date(end).toDateString() !== new Date(start).toDateString()) {
    return `${startDate} – ${new Date(end).toLocaleDateString('default', opts)}`;
  }
  return startDate;
}

function formatTime(start, end) {
  if (!start) return 'Time TBD';
  const startStr = new Date(start).toLocaleTimeString('default', {
    hour: 'numeric',
    minute: '2-digit',
  });
  if (end) {
    const endStr = new Date(end).toLocaleTimeString('default', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${startStr} – ${endStr}`;
  }
  return startStr;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await eventService.getAll();
      setEvents(data || []);
    } catch {
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-lg text-gray-600">Upcoming Activities and Programs</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size={32} className="animate-spin text-lmsa-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No events scheduled yet. Check back soon!</p>
          </div>
        ) : (
          /* Events List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-6">
                  <span className="bg-lmsa-100 text-lmsa-700 text-xs font-bold px-3 py-1 rounded-full">
                    {event.event_type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-lmsa-600" />
                      <span>{formatDate(event.start_datetime, event.end_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-lmsa-600" />
                      <span>{formatTime(event.start_datetime, event.end_datetime)}</span>
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
        )}
      </div>
    </div>
  );
}
