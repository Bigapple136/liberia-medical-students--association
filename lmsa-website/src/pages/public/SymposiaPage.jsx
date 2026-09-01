import { Calendar, MapPin, Users } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const symposia = [
  { title: 'Annual Medical Symposium 2026', date: 'August 15-17, 2026', location: 'Monrovia, Liberia', theme: 'Innovation in African Healthcare', attendees: '500+', status: 'Upcoming' },
  { title: 'Public Health Conference', date: 'March 20-21, 2026', location: 'Virtual Event', theme: 'Community Health Strategies', attendees: '300+', status: 'Upcoming' },
  { title: 'Research & Innovation Summit', date: 'November 10-12, 2025', location: 'Monrovia, Liberia', theme: 'Student-Led Research', attendees: '250+', status: 'Completed' },
];

function SymposiumCard({ symposium }) {
  return (
    <article className={`border p-6 ${symposium.status === 'Upcoming' ? 'border-lmsa-200 bg-white' : 'border-gray-200 bg-[#ebeae4]'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${symposium.status === 'Upcoming' ? 'bg-lmsa-50 text-lmsa-700' : 'bg-gray-200 text-gray-600'}`}>{symposium.status}</span>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">{symposium.title}</h3>
        </div>
        <span className="text-sm font-semibold text-lmsa-700">{symposium.theme}</span>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
        <span className="flex items-center gap-2"><Calendar size={16} className="text-lmsa-600" aria-hidden="true" />{symposium.date}</span>
        <span className="flex items-center gap-2"><MapPin size={16} className="text-lmsa-600" aria-hidden="true" />{symposium.location}</span>
        <span className="flex items-center gap-2"><Users size={16} className="text-lmsa-600" aria-hidden="true" />{symposium.status === 'Upcoming' ? 'Expected' : 'Attended'}: {symposium.attendees}</span>
      </div>
      {symposium.status === 'Upcoming' && <button type="button" className="mt-6 bg-lmsa-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700">Register now</button>}
    </article>
  );
}

export default function SymposiaPage() {
  const upcoming = symposia.filter((symposium) => symposium.status === 'Upcoming');
  const past = symposia.filter((symposium) => symposium.status === 'Completed');

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Stories & events / Symposia" title="Ideas become momentum when we gather around them." description="LMSA symposia create space for students to present research, learn from experts, and connect with professionals." />
          <div className="editorial-note max-w-3xl">
            <p>Academic events are cornerstones of our mission because they make learning public, collaborative, and connected to the future of care.</p>
            <span>Learn, present, connect</span>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Coming up" title="Upcoming symposia." description="Plan ahead for the conversations and communities you want to be part of." />
          <div className="space-y-4">{upcoming.map((symposium) => <SymposiumCard key={symposium.title} symposium={symposium} />)}</div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="The archive" title="Past symposia." description="The conversations may be over, but the questions they raised continue to shape our work." />
          <div className="space-y-4">{past.map((symposium) => <SymposiumCard key={symposium.title} symposium={symposium} />)}</div>
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