import { ArrowUpRight, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EditorialCallout,
  EditorialSectionHeader,
  EditorialStat,
} from '@components/common/EditorialSections';

const milestones = [
  {
    year: '1972',
    title: 'The beginning',
    description:
      'The Liberia Medical Students&apos; Association was founded by a small group of visionary medical students who recognized the need for a unified voice in medical education. What started as a modest gathering of 15 students began a lasting tradition of student leadership.',
  },
  {
    year: '1980s–1990s',
    title: 'Growth through resilience',
    description:
      'Despite the challenges of civil unrest, LMSA continued to advocate for medical students and maintain its commitment to academic excellence. This era brought international partnerships, the first annual medical symposium, and standing committees for specialized work.',
  },
  {
    year: '2000s–today',
    title: 'A wider horizon',
    description:
      'LMSA continues to evolve with technology, global health initiatives, and new approaches to medical education while staying true to its founding principles. Its work reaches students across Liberia and prepares them for a changing healthcare landscape.',
  },
];

export default function HistoryPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <EditorialSectionHeader
              eyebrow="Since 1972"
              title="Every generation leaves LMSA stronger than it found it."
              description="The association’s history is a record of students choosing to stay connected through change."
            />
            <div className="editorial-note self-start">
              <p>Education is the foundation of progress, but unity is the bridge that takes us there.</p>
              <span>Founding members, 1972</span>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
            <div>
              <EditorialSectionHeader
                eyebrow="The timeline"
                title="A story still being written."
                description="LMSA has changed with the needs of medical students, but its reason for existing has stayed clear."
              />
              <div className="editorial-timeline">
                {milestones.map((milestone) => (
                  <article key={milestone.year} className="editorial-timeline-item">
                    <span className="editorial-timeline-year">{milestone.year}</span>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="bg-lmsa-900 p-7 text-lmsa-50">
              <Landmark size={28} className="text-lmsa-300" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-lmsa-200">What carries forward</p>
              <p className="mt-4 text-xl font-serif italic leading-8">A commitment to represent students and improve the future of care.</p>
              <Link to="/about/mission-vision" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-lmsa-200">
                Read our direction
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="By the numbers"
            title="The legacy is measured in people."
            description="These milestones give shape to the scale of LMSA’s service and the generations still ahead."
          />
          <div className="editorial-stat-grid">
            <EditorialStat value="50+" label="Years of service" detail="From the first student gathering to today’s association." />
            <EditorialStat value="12" label="Standing committees" detail="Specialized spaces for students to contribute and lead." />
            <EditorialStat value="1000s" label="Members represented" detail="A growing network of current students and alumni." />
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Carry it forward"
            title="History matters most when it gives the next generation room to lead."
            description="Meet the students serving LMSA today and find the place where your own contribution can begin."
            tone="gold"
            action={{ label: 'Meet our leaders', to: '/leadership' }}
          />
        </div>
      </section>
    </main>
  );
}