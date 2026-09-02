import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
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

function isPastEvent(event) {
  const reference = event.end_datetime || event.start_datetime;
  if (!reference) return false;
  return new Date(reference) < new Date();
}

function EventCard({ event, past = false }) {
  return (
    <Link
      to={`/events/${event.slug}`}
      className="group flex flex-col border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-lmsa-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
    >
      <div className="flex h-48 items-center justify-center overflow-hidden bg-lmsa-50">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${past ? 'opacity-80 grayscale-[35%]' : ''}`}
          />
        ) : (
          <Calendar size={48} className="text-lmsa-300" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${past ? 'bg-gray-200 text-gray-600' : 'bg-lmsa-50 text-lmsa-700'}`}>
            {event.event_type}
          </span>
          {past && <span className="px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] bg-[#ebeae4] text-gray-500">Concluded</span>}
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{event.description}</p>
        <div className="mt-5 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-lmsa-600" aria-hidden="true" />
            <time dateTime={event.start_datetime || undefined}>{formatDate(event.start_datetime, event.end_datetime)}</time>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-lmsa-600" aria-hidden="true" />
            <span>{formatTime(event.start_datetime, event.end_datetime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-lmsa-600" aria-hidden="true" />
            <span>{event.location}</span>
          </div>
        </div>
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-lmsa-700">
          View details
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function EventCardSkeleton() {
  return (
    <div className="flex flex-col border border-gray-200 bg-white">
      <div className="h-48 animate-pulse bg-gray-100" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-4 w-24 animate-pulse bg-gray-100" />
        <div className="h-6 w-4/5 animate-pulse bg-gray-100" />
        <div className="h-4 w-full animate-pulse bg-gray-100" />
        <div className="h-4 w-1/2 animate-pulse bg-gray-100" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await eventService.getAll();
      setEvents(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // API returns all events ascending by start date; partition so past
  // events never appear under an "upcoming" banner. Most recent past first.
  const upcoming = events.filter((event) => !isPastEvent(event));
  const past = events.filter(isPastEvent).reverse();

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
          <EditorialSectionHeader eyebrow="On the calendar" title="Coming up across LMSA." description="Open an event to see the schedule, location, and ways to take part." />
          {loading ? (
            <div role="status" aria-label="Loading events">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))}
              </div>
              <span className="sr-only">Loading events…</span>
            </div>
          ) : error ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <Calendar size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">We couldn’t load the events</h3>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Something went wrong on our end or with your connection. Try again in a moment.
              </p>
              <button
                type="button"
                onClick={loadEvents}
                className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : upcoming.length === 0 ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <Calendar size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">Nothing on the calendar right now</h3>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                The next gathering is being planned. Have an idea for one? The team would love to hear it.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                Suggest an event
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {!loading && !error && past.length > 0 && (
        <section className="editorial-section">
          <div className="site-container">
            <EditorialSectionHeader eyebrow="The archive" title="Recently held." description="A record of the workshops, ceremonies, and gatherings the community has already shared." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          </div>
        </section>
      )}

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
