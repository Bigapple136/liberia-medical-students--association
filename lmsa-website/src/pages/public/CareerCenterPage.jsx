import {
  Briefcase,
  Compass,
  FileText,
  Stethoscope,
} from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const offerings = [
  {
    title: 'Career advising',
    description:
      'One-on-one conversations with advisors who can help you turn uncertainty about the future into a workable plan.',
    icon: Compass,
  },
  {
    title: 'Specialty exploration',
    description:
      'Structured exposure to clinical fields—what each specialty practices daily, and what training it asks of you.',
    icon: Stethoscope,
  },
  {
    title: 'Applications & CV support',
    description:
      'Feedback on CVs, personal statements, and application materials before your first deadline arrives.',
    icon: FileText,
  },
  {
    title: 'Opportunity board',
    description:
      'A running list of internships, scholarships, and postings shared by partners, alumni, and the association.',
    icon: Briefcase,
  },
];

const pathways = [
  'Primary care & internal medicine',
  'Surgery & procedural specialties',
  'Pediatrics & maternal health',
  'Public health & health systems in Liberia',
  'Global pathways & residency applications',
  'Research & academic medicine',
];

const questions = [
  {
    question: 'I have no idea which specialty fits me. Where do I start?',
    answer:
      'Start with a career advising conversation. Advisors help you connect what you enjoy in preclinical and clinical work with the specialties that reward those same strengths—no commitment required.',
  },
  {
    question: 'What options exist for training outside Liberia?',
    answer:
      'The center maintains information on international residencies and scholarships, and connects interested students with alumni who have completed training abroad. Exploring global pathways and supporting healthcare at home are not competing choices.',
  },
  {
    question: 'When should I start thinking about my career?',
    answer:
      'Earlier than you think. Careers are assembled across every year of medical school—through rotations, research, volunteering, and the people you meet—not decided in the final year.',
  },
  {
    question: 'Can alumni in practice help with applications?',
    answer:
      'Yes. The alumni network includes physicians in practice and training who offer honest feedback on applications, interviews, and the decisions that come with them.',
  },
];

export default function CareerCenterPage() {
  return (
    <main className="editorial-page career-page">
      {/* Intro */}
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Career Center"
              title="You do not have to figure out your future alone."
              description="The LMSA Career Center helps students connect coursework with the doctor they want to become—through advising, specialty exploration, and a community of people who have made similar decisions."
            />
            <div className="editorial-prose">
              <p>
                Choosing a specialty—and deciding whether to practice in Liberia, train abroad, or
                move between both—is one of the most consequential decisions of medical school. Few
                students can make it well in isolation.
              </p>
              <p>
                The career center exists so that no LMSA student has to. Advisors, alumni, and a
                growing record of pathways sit ready for you to use from your first year.
              </p>
              <div className="editorial-note mt-8">
                <p>
                  Careers are not chosen in the final year. They are assembled across every year of
                  medical school.
                </p>
                <span>The case for starting early</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the center offers */}
      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="What the center offers"
            title="Practical support for a consequential decision."
            description="Advising, structured exploration, application feedback, and a live board of opportunities—from people invested in your success."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {offerings.map(({ title, description, icon: Icon }) => (
              <article key={title} className="flex min-h-[180px] flex-col border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true">
                    <Icon size={21} strokeWidth={1.6} />
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600 md:text-base md:leading-7">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Career pathways"
            title="Paths LMSA students are exploring right now."
            description="Every pathway is represented in the alumni network—there is someone who has walked each of these roads and is willing to talk about it."
          />
          <div className="grid gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {pathways.map((pathway, index) => (
              <div key={pathway} className="flex gap-3 border-b border-gray-200 pb-4">
                <span className="text-sm font-bold text-lmsa-700">{`0${index + 1}`}</span>
                <p className="text-base leading-7 text-gray-700">{pathway}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions students ask */}
      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Straight answers"
            title="Questions students ask us."
            description="If yours is not here, ask it directly—the career team answers every message."
          />
          <dl className="editorial-article-list">
            {questions.map(({ question, answer }) => (
              <div key={question} className="editorial-article-row">
                <dt>{question}</dt>
                <dd>{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Plan the next step"
            title="Your career starts earlier than you think."
            description="One message to the career team opens advising, alumni connections, and the board of current opportunities."
            action={{ label: 'Talk to the career team', to: '/contact' }}
          />
        </div>
      </section>
    </main>
  );
}
