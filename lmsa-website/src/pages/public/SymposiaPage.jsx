import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

// Symposium data. Status is derived from the dates at render time —
// never hand-typed — so cards can't claim a finished event is upcoming.
const symposia = [
  {
    title: 'Annual Medical Symposium 2026',
    startDate: '2026-08-15',
    endDate: '2026-08-17',
    location: 'Monrovia, Liberia',
    theme: 'Innovation in African Healthcare',
    attendees: '500+',
  },
  {
    title: 'Public Health Conference',
    startDate: '2026-03-20',
    endDate: '2026-03-21',
    location: 'Virtual Event',
    theme: 'Community Health Strategies',
    attendees: '300+',
  },
  {
    title: 'Research & Innovation Summit',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    location: 'Monrovia, Liberia',
    theme: 'Student-Led Research',
    attendees: '250+',
  },
];

function isUpcoming(symposium) {
  // A symposium counts as upcoming until the end of its final day.
  const end = new Date(`${symposium.endDate}T23:59:59`);
  return end >= new Date();
}

function formatDateRange(startDate, endDate) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (startDate === endDate) return start.toLocaleDateString('default', options);
  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  if (sameMonth) {
    const monthYear = start.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    const [month, year] = [monthYear.split(' ')[0], start.getFullYear()];
    return `${month} ${start.getDate()}–${end.getDate()}, ${year}`;
  }
  return `${start.toLocaleDateString('default', options)} – ${end.toLocaleDateString('default', options)}`;
}

function SymposiumCard({ symposium, upcoming }) {
  return (
    <article className={`border p-6 md:p-8 ${upcoming ? 'border-lmsa-200 bg-white' : 'border-gray-200 bg-[#ebeae4]'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${upcoming ? 'bg-lmsa-50 text-lmsa-700' : 'bg-gray-200 text-gray-600'}`}>
          {upcoming ? 'Upcoming' : 'Completed'}
        </span>
        <time dateTime={symposium.startDate} className="text-sm text-gray-500">
          {formatDateRange(symposium.startDate, symposium.endDate)}
        </time>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">{symposium.title}</h3>
      <p className="mt-1 text-sm font-semibold text-lmsa-700">Theme: {symposium.theme}</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <Calendar size={16} className="text-lmsa-600" aria-hidden="true" />
          {formatDateRange(symposium.startDate, symposium.endDate)}
        </span>
        <span className="flex items-center gap-2">
          <MapPin size={16} className="text-lmsa-600" aria-hidden="true" />
          {symposium.location}
        </span>
        <span className="flex items-center gap-2">
          <Users size={16} className="text-lmsa-600" aria-hidden="true" />
          {upcoming ? 'Expected' : 'Attended'}: {symposium.attendees}
        </span>
      </div>
      {upcoming && (
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 bg-lmsa-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
        >
          Register your interest
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}

export default function SymposiaPage() {
  const upcoming = symposia.filter(isUpcoming);
  const past = symposia.filter((symposium) => !isUpcoming(symposium));

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            as="h1"
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
          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((symposium) => (
                <SymposiumCard key={symposium.title} symposium={symposium} upcoming />
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
          {past.length > 0 ? (
            <div className="space-y-4">
              {past.map((symposium) => (
                <SymposiumCard key={symposium.title} symposium={symposium} upcoming={false} />
              ))}
            </div>
          ) : (
            <p className="max-w-2xl text-gray-600">Past symposia will be archived here after they conclude.</p>
          )}
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
