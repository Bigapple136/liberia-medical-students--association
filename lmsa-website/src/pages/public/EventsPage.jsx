import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock, Loader, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import { eventService } from '@services/event.service';

function formatDate(start, end) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  if (!start) return 'Date TBD';
  const startDate = new Date(start).toLocaleDateString('default', options);
  if (end && new Date(end).toDateString() !== new Date(start).toDateString()) {
    return `${startDate} – ${new Date(end).toLocaleDateString('default', options)}`;
  }
  return startDate;
}

function formatTime(start, end) {
  if (!start) return 'Time TBD';
  const startTime = new Date(start).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
  if (!end) return startTime;
  const endTime = new Date(end).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
  return `${startTime} – ${endTime}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadEvents();
  }, []);

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Stories & events / Upcoming events"
            title="The moments where LMSA becomes a room full of people."
            description="Stay close to the conversations, workshops, service activities, and gatherings shaping our student community."
          />
          <div className="editorial-note max-w-3xl">
            <p>Good events do more than fill a calendar. They give students a reason to exchange ideas, find a collaborator, and feel part of the work.</p>
            <span>Gather, learn, contribute</span>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="On the calendar" title="What is happening across LMSA." description="Open an event to see the schedule, location, and ways to take part." />
          {loading ? (
            <div className="flex h-64 items-center justify-center"><Loader size={32} className="animate-spin text-lmsa-600" aria-label="Loading events" /></div>
          ) : events.length === 0 ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <Calendar size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <p className="text-gray-500">No events scheduled yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`} className="group flex flex-col border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-lmsa-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
                  <div className="flex h-48 items-center justify-center overflow-hidden bg-lmsa-50">
                    {event.image_url ? <img src={event.image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <Calendar size={48} className="text-lmsa-300" aria-hidden="true" />}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="self-start bg-lmsa-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-lmsa-700">{event.event_type}</span>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{event.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{event.description}</p>
                    <div className="mt-5 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Calendar size={14} className="text-lmsa-600" aria-hidden="true" /><span>{formatDate(event.start_datetime, event.end_datetime)}</span></div>
                      <div className="flex items-center gap-2"><Clock size={14} className="text-lmsa-600" aria-hidden="true" /><span>{formatTime(event.start_datetime, event.end_datetime)}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-lmsa-600" aria-hidden="true" /><span>{event.location}</span></div>
                    </div>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-lmsa-700">View details <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Bring something to the calendar"
            title="Have an idea for an event, workshop, or conversation?"
            description="Reach out to the LMSA team and help create the next moment for students to gather."
            action={{ label: 'Contact LMSA', to: '/contact' }}
          />
        </div>
      </section>
    </main>
  );
}