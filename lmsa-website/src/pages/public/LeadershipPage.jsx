import { useEffect, useState } from 'react';
import { Crown, Loader, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';
import { executiveService } from '@services/executive.service';

const FALLBACK_EXECUTIVES = [
  { position_name: 'President', position_rank: 1, holder_name: 'Student Name', holder_photo_url: null, bio: 'Final year medical student passionate about student advocacy' },
  { position_name: 'Vice President', position_rank: 2, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fourth year student focused on academic excellence' },
  { position_name: 'General Secretary', position_rank: 3, holder_name: 'Student Name', holder_photo_url: null, bio: 'Third year student ensuring transparent communication' },
  { position_name: 'Financial Secretary', position_rank: 4, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fourth year student managing association finances' },
  { position_name: 'Public Relations Officer', position_rank: 5, holder_name: 'Student Name', holder_photo_url: null, bio: 'Second year student building our public presence' },
  { position_name: 'Academic Director', position_rank: 6, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fifth year student leading academic initiatives' },
];

export default function LeadershipPage() {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadExecutives();
  }, []);

  async function loadExecutives() {
    setLoading(true);
    try {
      const data = await executiveService.getAll();
      if (data && data.length > 0) {
        setExecutives(data);
      } else {
        setExecutives(FALLBACK_EXECUTIVES);
      }
    } catch {
      setError(true);
      setExecutives(FALLBACK_EXECUTIVES);
    } finally {
      setLoading(false);
    }
  }

  const currentYear = executives[0]?.academic_year || '2025-2026';

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Leadership"
              title="Leadership is service made visible."
              description="Meet the students and officers turning shared priorities into action for the LMSA community."
            />
            <div className="editorial-prose">
              <p>
                LMSA leadership is a chance to practice listening, responsibility, and
                follow-through while helping the association serve its members well.
              </p>
              <div className="editorial-stat-grid mt-8">
                <EditorialStat value={currentYear} label="Academic year" />
                <EditorialStat value={executives.length || '—'} label="Leadership roles" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow={`Executive committee / ${currentYear}`} title="The students carrying the work forward." description="Leadership changes each year, but the responsibility to represent peers thoughtfully remains." />
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader className="animate-spin text-lmsa-600" size={28} aria-label="Loading leadership" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {executives.map((exec, index) => (
                <article key={exec.id || index} className="border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-lmsa-50 text-lmsa-700">
                      {exec.holder_photo_url ? (
                        <img src={exec.holder_photo_url} alt={exec.holder_name || exec.position_name} className="h-full w-full object-cover" />
                      ) : (
                        <User size={29} strokeWidth={1.4} />
                      )}
                    </div>
                    {exec.position_rank <= 2 && <Crown size={18} className="text-amber-500" aria-label="Senior executive role" />}
                  </div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">{exec.position_name}</p>
                  <h3 className="mt-2 text-xl font-semibold text-lmsa-900">{exec.holder_name || 'Position Available'}</h3>
                  {exec.bio && <p className="mt-3 text-sm leading-6 text-gray-600">{exec.bio}</p>}
                  {exec.holder_year_level && <p className="mt-4 text-xs text-gray-500">Year {exec.holder_year_level}</p>}
                  {error && <p className="mt-4 text-xs text-amber-600">Using placeholder data</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="How the work is organized" title="A shared structure keeps leadership accountable." description="Different bodies carry different responsibilities, but each one exists to keep members represented and the work moving." />
            <div className="editorial-timeline">
              <article className="editorial-timeline-item">
                <span className="editorial-timeline-year">01 / General assembly</span>
                <h3>The members decide.</h3>
                <p>The supreme decision-making body comprising all registered members.</p>
              </article>
              <article className="editorial-timeline-item">
                <span className="editorial-timeline-year">02 / Executive committee</span>
                <h3>The officers deliver.</h3>
                <p>Elected officers responsible for day-to-day operations and representation.</p>
              </article>
              <article className="editorial-timeline-item">
                <span className="editorial-timeline-year">03 / Standing committees</span>
                <h3>The teams deepen the work.</h3>
                <p>Academic, Finance, Welfare, Events, and Public Relations teams focused on specific priorities.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Your turn to lead"
            title="Elections are held annually. Start by finding the work that matters to you."
            description="Committees are a practical first step into meaningful responsibility and student service."
            action={{ label: 'Explore committees', to: '/leadership/committees' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Interested in opportunities? <Link to="/get-involved/leadership" className="font-semibold text-lmsa-700 hover:text-lmsa-900">See leadership pathways</Link>
          </p>
        </div>
      </section>
    </main>
  );
}