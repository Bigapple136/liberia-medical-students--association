import { ArrowRight, FlaskConical, GraduationCap, Heart, Megaphone, Shield, TrendingUp, Users } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';

const committees = [
  { name: 'Medical Education', focus: 'Academic standards and curriculum support', openings: 3, deadline: 'May 31, 2026', icon: GraduationCap },
  { name: 'Community Health', focus: 'Public health outreach and education', openings: 5, deadline: 'May 31, 2026', icon: Heart },
  { name: 'Research & Innovation', focus: 'Scientific research promotion', openings: 2, deadline: 'May 31, 2026', icon: FlaskConical },
  { name: 'Student Welfare', focus: 'Student support services', openings: 4, deadline: 'May 31, 2026', icon: Shield },
  { name: 'Professional Development', focus: 'Career and skills training', openings: 3, deadline: 'May 31, 2026', icon: TrendingUp },
  { name: 'Public Relations', focus: 'Communications and media', openings: 2, deadline: 'May 31, 2026', icon: Megaphone },
  { name: 'International Relations', focus: 'Global partnerships', openings: 3, deadline: 'May 31, 2026', icon: Users },
];

const benefits = [
  { title: 'Hands-on experience', description: 'Gain practical experience in your area of interest.' },
  { title: 'Learn from leaders', description: 'Work closely with experienced medical professionals.' },
  { title: 'Develop skills', description: 'Build project management and leadership capabilities.' },
  { title: 'Expand your network', description: 'Connect with peers, faculty, and healthcare leaders.' },
  { title: 'Make an impact', description: 'Contribute to meaningful healthcare initiatives.' },
  { title: 'Boost your CV', description: 'Enhance your resume with leadership experience.' },
];

const faqs = [
  ['Who can join a committee?', 'All active LMSA members in good standing are eligible to apply for committee positions.'],
  ['How long is the commitment?', 'Committee members are appointed annually. You can reapply each year or choose to step down.'],
  ['Can I join multiple committees?', 'We recommend joining one committee to ensure focused contributions, but exceptions can be made.'],
  ['What is the time commitment?', 'Most committees meet monthly and work on projects throughout the academic year. Expect 3-5 hours per month.'],
];

export default function JoinCommitteePage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="Get involved / Join a committee" title="You do not need to wait for a title to start doing meaningful work." description="Committees are where LMSA’s mission becomes practical: one project, one conversation, and one contribution at a time." />
            <div className="editorial-prose">
              <p>Choose a committee where your interests can strengthen student welfare, academics, advocacy, service, or connection.</p>
              <div className="editorial-stat-grid mt-8"><EditorialStat value="7" label="Open committees" /><EditorialStat value="22" label="Open positions" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Applications open" title="Find the committee that fits your interests." description="Applications are open through May 31, 2026. Read each focus area, then choose where you want to contribute." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {committees.map(({ name, focus, openings, deadline, icon: Icon }, index) => (
              <article key={name} className="editorial-link-card">
                <span className="editorial-link-card-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                <div className="editorial-link-card-copy"><span className="editorial-card-eyebrow">0{index + 1} / Committee</span><h3>{name}</h3><p>{focus}</p></div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs"><span className="font-bold uppercase tracking-[0.12em] text-lmsa-700">{openings} openings</span><span className="text-gray-500">{deadline}</span></div>
                <button type="button" className="mt-5 inline-flex items-center justify-center gap-2 bg-lmsa-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700">Apply now <ArrowRight size={15} aria-hidden="true" /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Why join a committee?" title="Small teams are where confidence becomes capability." description="Committee work gives you a place to practice skills while making a visible contribution to the association." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{benefits.map((benefit, index) => <article key={benefit.title} className="border-t border-gray-200 pt-5"><span className="text-sm font-bold text-lmsa-700">0{index + 1}</span><h3 className="mt-6 text-xl font-semibold text-lmsa-900">{benefit.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{benefit.description}</p></article>)}</div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="The application process" title="Four steps from interest to impact." description="The process is designed to help you find a good fit and start with clarity." />
          <div className="grid gap-4 md:grid-cols-4">{['Apply', 'Review', 'Interview', 'Join'].map((step, index) => <article key={step} className="border border-gray-200 bg-white p-5"><span className="text-3xl font-semibold tracking-[-0.05em] text-lmsa-700">0{index + 1}</span><h3 className="mt-8 text-xl font-semibold text-lmsa-900">{step}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{['Submit application form', 'Committee reviews applications', 'Brief interview (if needed)', 'Begin committee work'][index]}</p></article>)}</div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Questions, answered" title="Before you apply." description="A few practical details about committee membership." />
          <div className="editorial-article-list">{faqs.map(([question, answer], index) => <div key={question} className="editorial-article-row"><strong>0{index + 1}</strong><span><b className="font-semibold text-lmsa-900">{question}</b><br />{answer}</span></div>)}</div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container"><EditorialCallout eyebrow="Find your place in the work" title="A committee is a practical first step into LMSA leadership." description="If you are ready to contribute, choose a focus area and send in your application." action={{ label: 'Contact LMSA', to: '/contact' }} /></div>
      </section>
    </main>
  );
}