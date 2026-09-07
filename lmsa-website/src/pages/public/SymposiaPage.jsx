import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import { eventService } from '@services/event.service';

// Symposia are events with event_type: 'symposium' — created and managed
// through the existing admin Events flow (EventsAdminPage.jsx already has
// a Symposium option in its event-type selector). No separate admin UI or
// data source for symposia; this page just filters the same events API
// the rest of the site already uses.

function isUpcoming(event) {
  const end = new Date(event.end_datetime || event.start_datetime);
  return end >= new Date();
}

function formatDateRange(startDatetime, endDatetime) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const start = new Date(startDatetime);
  const end = endDatetime ? new Date(endDatetime) : start;
  if (start.toDateString() === end.toDateString()) return start.toLocaleDateString('default', options);
  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  if (sameMonth) {
    const monthYear = start.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    const [month, year] = [monthYear.split(' ')[0], start.getFullYear()];
    return `${month} ${start.getDate()}–${end.getDate()}, ${year}`;
  }
  return `${start.toLocaleDateString('default', options)} – ${end.toLocaleDateString('default', options)}`;
}

function SymposiumCard({ event, upcoming }) {
  return (
    <article className={`border p-6 md:p-8 ${upcoming ? 'border-lmsa-200 bg-white' : 'border-gray-200 bg-[#ebeae4]'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${upcoming ? 'bg-lmsa-50 text-lmsa-700' : 'bg-gray-200 text-gray-600'}`}>
          {upcoming ? 'Upcoming' : 'Completed'}
        </span>
        <time dateTime={event.start_datetime} className="text-sm text-gray-500">
          {formatDateRange(event.start_datetime, event.end_datetime)}
        </time>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">{event.title}</h3>
      {event.description && (
        <p className="mt-1 text-sm font-semibold text-lmsa-700">{event.description}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <Calendar size={16} className="text-lmsa-600" aria-hidden="true" />
          {formatDateRange(event.start_datetime, event.end_datetime)}
        </span>
        {event.location && (
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-lmsa-600" aria-hidden="true" />
            {event.location}
          </span>
        )}
        {typeof event.registration_count === 'number' && (
          <span className="flex items-center gap-2">
            <Users size={16} className="text-lmsa-600" aria-hidden="true" />
            {event.registration_count} registered{event.max_attendees ? ` of ${event.max_attendees}` : ''}
          </span>
        )}
      </div>
      {upcoming && (
        <Link
          to={`/events/${event.slug}`}
          className="mt-6 inline-flex items-center gap-2 bg-lmsa-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
        >
          View & register
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}

export default function SymposiaPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await eventService.getAll({ type: 'symposium' });
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load symposia:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upcoming = events.filter(isUpcoming);
  const past = events.filter((event) => !isUpcoming(event));

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Learn & lead / Symposia"
            title="Ideas become momentum when we gather around them."
            description="LMSA symposia create space for students to present research, learn from experts, and connect with professionals."
          />
          <div className="editorial-note max-w-3xl">
            <p>Academic events are cornerstones of our mission because they make learning public, collaborative, and connected to the future of care.</p>
            <span>Learn, present, connect</span>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Coming up" title="Upcoming symposia." description="Plan ahead for the conversations and communities you want to be part of." />
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 animate-pulse border border-gray-200 bg-gray-50" />
              ))}
            </div>
          ) : error ? (
            <div className="border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-600">Couldn&apos;t load symposia right now. Please try again shortly.</p>
            </div>
          ) : upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((event) => (
                <SymposiumCard key={event.id} event={event} upcoming />
              ))}
            </div>
          ) : (
            <div className="border border-gray-200 bg-white p-10 text-center">
              <Calendar size={36} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <p className="text-lg font-semibold tracking-[-0.02em] text-lmsa-900">No symposia scheduled right now</p>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                The next one is being planned. In the meantime, other gatherings are on the calendar.
              </p>
              <Link
                to="/events"
                className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                See upcoming events
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="The archive" title="Past symposia." description="The conversations may be over, but the questions they raised continue to shape our work." />
          {!loading && !error && past.length > 0 ? (
            <div className="space-y-4">
              {past.map((event) => (
                <SymposiumCard key={event.id} event={event} upcoming={false} />
              ))}
            </div>
          ) : !loading && !error ? (
            <p className="max-w-2xl text-gray-600">Past symposia will be archived here after they conclude.</p>
          ) : null}
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout eyebrow="Bring an idea to the room" title="Have a topic the LMSA community should explore?" description="Connect with the team about a future symposium, workshop, or academic conversation." action={{ label: 'Contact LMSA', to: '/contact' }} />
        </div>
      </section>
    </main>
  );
}
