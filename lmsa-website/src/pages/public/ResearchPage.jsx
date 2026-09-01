import { Award, BookOpen, FlaskConical, Users } from 'lucide-react';
import { EditorialCallout, EditorialLinkCard, EditorialSectionHeader } from '@components/common/EditorialSections';

const opportunities = [
  { title: 'Research grants', description: 'LMSA offers small grants to support student-led research projects. Applications are reviewed quarterly.', icon: Award, action: 'Learn more' },
  { title: 'Collaborative projects', description: 'Join ongoing research projects led by faculty and senior students across multiple medical schools.', icon: Users, action: 'Learn more' },
  { title: 'LMSA Medical Journal', description: 'Publish your research in our peer-reviewed student medical journal. Submissions are accepted year-round.', icon: BookOpen, action: 'Submit paper' },
  { title: 'Research training', description: 'Attend workshops on research methodology, data analysis, and scientific writing.', icon: FlaskConical, action: 'View workshops' },
];

const focusAreas = [
  'Infectious Diseases (Malaria, TB, HIV)',
  'Maternal and Child Health',
  'Health Systems Strengthening',
  'Non-Communicable Diseases',
  'Mental Health',
  'Traditional Medicine Integration',
];

export default function ResearchPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Research"
              title="Better questions can lead to better care."
              description="LMSA supports students who want to investigate the challenges shaping healthcare in Liberia and contribute to the knowledge that can change them."
            />
            <div className="editorial-prose">
              <p>
                We provide resources, mentorship, and platforms for students to conduct and
                present research that advances medical knowledge in Liberia and beyond.
              </p>
              <div className="editorial-note mt-8">
                <p>Curiosity is not a distraction from practice. It is one of the ways practice improves.</p>
                <span>A research culture for students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Ways to begin" title="Find the research opportunity that fits your question." description="Start with a grant, a collaborator, a publication, or the skills to make your next project stronger." />
          <div className="grid gap-4 md:grid-cols-2">
            {opportunities.map(({ title, description, icon: Icon }, index) => (
              <EditorialLinkCard
                key={title}
                eyebrow={`0${index + 1} / Opportunity`}
                title={title}
                description={description}
                icon={Icon}
                className="min-h-[220px]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Questions worth pursuing" title="Priority areas for student-led inquiry." description="These focus areas reflect some of the issues where research, service, and better systems can meet." />
          <div className="grid gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area, index) => (
              <div key={area} className="flex gap-3 border-b border-gray-200 pb-4">
                <span className="text-sm font-bold text-lmsa-700">0{index + 1}</span>
                <p className="text-base leading-7 text-gray-700">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Make the next inquiry count"
            title="Bring your question to the LMSA research community."
            description="Connect your interest with resources, collaborators, and the support to take a first step."
            action={{ label: 'Explore mentorship', to: '/academics/mentorship' }}
          />
        </div>
      </section>
    </main>
  );
}