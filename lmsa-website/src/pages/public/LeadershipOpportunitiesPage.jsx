import { CheckCircle, Target, Users } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const leadershipLevels = [
  {
    level: 'Executive Committee',
    positions: ['President', 'Vice President', 'Secretary General', 'Treasurer', 'Public Relations Officer'],
    term: '1 year',
    eligibility: 'Full members in good standing',
  },
  {
    level: 'Class Representatives',
    positions: ['Class President', 'Assistant Class President'],
    term: '1 year',
    eligibility: 'All medical students',
  },
  {
    level: 'Committee Chairs',
    positions: ['Committee Chairperson', 'Deputy Chairperson'],
    term: '1 year',
    eligibility: 'Appointed by Executive Committee',
  },
];

const benefits = [
  'Develop essential leadership skills',
  'Build your professional network',
  'Make meaningful organizational impact',
  'Enhance your CV/resume',
  'Gain event planning experience',
  'Learn conflict resolution',
  'Improve public speaking abilities',
  'Prepare for future medical leadership',
];

export default function LeadershipOpportunitiesPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="Get involved / Leadership" title="Leadership is a skill you build by taking responsibility." description="LMSA gives members practical opportunities to represent their peers, coordinate work, and help shape the association." />
            <div className="editorial-prose"><p>From class representatives to executive committee positions, leadership is a way to practice the habits of listening, clarity, and follow-through that healthcare needs.</p></div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Where you can lead" title="Different roles. The same chance to make an impact." description="Find the level of responsibility that fits your experience, interest, and current season." />
          <div className="space-y-4">
            {leadershipLevels.map((level, index) => (
              <article key={level.level} className="border border-gray-200 bg-white p-6 md:p-7">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">0{index + 1} / Leadership level</span>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">{level.level}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {level.positions.map((position) => <span key={position} className="bg-lmsa-50 px-3 py-2 text-sm text-lmsa-800">{position}</span>)}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t border-gray-200 pt-5 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><Target size={15} className="text-lmsa-600" aria-hidden="true" />Term: {level.term}</span>
                  <span className="flex items-center gap-2"><Users size={15} className="text-lmsa-600" aria-hidden="true" />{level.eligibility}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="What you take with you" title="The role ends. The skills stay." description="Leadership experience is valuable because it changes how you approach the work after the position is over." />
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => <div key={benefit} className="flex gap-3 border-b border-gray-200 pb-4"><span className="text-sm font-bold text-lmsa-700">0{index + 1}</span><div className="flex gap-2 text-sm leading-6 text-gray-700"><CheckCircle size={18} className="mt-1 shrink-0 text-lmsa-600" aria-hidden="true" /><span>{benefit}</span></div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout eyebrow="Prepare your candidacy" title="Elections are held annually. Your first step can start today." description="Explore committees, meet the current leadership team, and learn where your contribution could be most useful." action={{ label: 'Explore committees', to: '/leadership/committees' }} />
        </div>
      </section>
    </main>
  );
}