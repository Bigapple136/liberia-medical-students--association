import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, ArrowLeft, Loader, Check,
} from 'lucide-react';
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

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadEvent() {
    setLoading(true);
    try {
      const data = await eventService.getBySlug(slug);
      setEvent(data);
    } catch {
      // 404 or other failure — show Event Not Found state
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!event) return;
    setRegistering(true);
    try {
      await eventService.register(event.id);
      setRegistered(true);
      toast.success('Registered successfully!');
    } catch (err) {
      // Unauthenticated users get a 401 — the api interceptor already
      // redirects to /login. Avoid a confusing raw error toast for that case.
      if (err?.response?.status !== 401) {
        toast.error('Failed to register for event');
      }
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size={32} className="animate-spin text-lmsa-600" />
      </div>
    );
  }

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
            {event.event_type}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-6">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar size={20} className="text-lmsa-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(event.start_datetime, event.end_datetime)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock size={20} className="text-lmsa-600" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">
                  {formatTime(event.start_datetime, event.end_datetime)}
                </p>
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

          {event.registration_required && (
            <button
              onClick={handleRegister}
              disabled={registered || registering}
              className="btn btn-primary mt-8 flex items-center gap-2"
            >
              {registering ? (
                <Loader size={16} className="animate-spin" />
              ) : registered ? (
                <Check size={16} />
              ) : null}
              {registered ? 'Registered' : registering ? 'Registering...' : 'Register for Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
