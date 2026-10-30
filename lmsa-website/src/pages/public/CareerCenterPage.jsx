import {
  Briefcase,
  Compass,
  FileText,
  Stethoscope,
} from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import { stockPhotos } from '@config/images';

const offerings = {
  feature: {
    title: 'Career advising',
    description:
      'One-on-one conversations with advisors who can help you turn uncertainty about the future into a workable plan.',
    note: 'You bring the questions; the conversation works out the rest.',
    icon: Compass,
  },
  supporting: [
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
  ],
};

const pathways = [
  {
    path: 'Primary care & internal medicine',
    detail: 'The broadest foundation—chronic disease, infectious disease, the whole patient.',
  },
  {
    path: 'Surgery & procedural specialties',
    detail: 'For those drawn to anatomy in the hands: precise, high-stakes, immediate.',
  },
  {
    path: 'Pediatrics & maternal health',
    detail: 'Care shaped by Liberia’s youngest patients and their mothers.',
  },
  {
    path: 'Public health & health systems in Liberia',
    detail: 'Medicine at the scale of communities, policy, and prevention.',
  },
  {
    path: 'Global pathways & residency applications',
    detail: 'Training abroad without losing sight of practice at home.',
  },
  {
    path: 'Research & academic medicine',
    detail: 'Questions, teaching, and the evidence that changes guidelines.',
  },
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
          <article className="border border-lmsa-200 bg-white p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <span className="flex h-14 w-14 items-center justify-center bg-lmsa-600 text-white" aria-hidden="true">
                  <Compass size={26} strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-lmsa-900 md:text-3xl">
                  {offerings.feature.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg md:leading-8">
                  {offerings.feature.description}
                </p>
              </div>
              <div className="flex flex-col justify-center lg:pl-16">
                <p className="font-serif text-xl italic leading-8 text-lmsa-900 md:text-2xl md:leading-9">
                  {offerings.feature.note}
                </p>
              </div>
            </div>
          </article>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {offerings.supporting.map(({ title, description, icon: Icon }) => (
              <article key={title} className="flex flex-col border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true">
                    <Icon size={21} strokeWidth={1.6} />
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
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
          <div className="grid gap-x-10 gap-y-10 pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {pathways.map(({ path, detail }) => (
                <div key={path}>
                  <p className="text-base font-semibold leading-7 text-lmsa-900">{path}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{detail}</p>
                </div>
              ))}
            </div>
            <figure className="flex flex-col">
              <img
                src={stockPhotos.hero.mentorship.src}
                alt={stockPhotos.hero.mentorship.alt}
                className="min-h-[320px] w-full flex-1 object-cover"
              />
              <figcaption className="mt-3 text-sm leading-6 text-gray-500">
                Advisors and alumni who have walked these roads. Photo: {stockPhotos.hero.mentorship.credit}.
              </figcaption>
            </figure>
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
            title="Your career starts in year one."
            description="One message to the career team opens advising, alumni connections, and the board of current opportunities."
            action={{ label: 'Talk to the career team', to: '/contact' }}
          />
        </div>
      </section>
    </main>
  );
}
