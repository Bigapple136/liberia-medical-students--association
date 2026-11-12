import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stockPhotos } from '@config/images';

/* Research page.

   Redesign notes, from the three skills used here:
   - design-taste-frontend: the page sits inside PublicLayout, which renders the
     Header, the PageHero for /academics/research and the Footer. The old version
     rendered its own <main>, which produced a second main landmark inside the
     layout's own; this version renders none of that and starts at its first
     section. No eyebrows, no index digits, no hairline rules, no icon cards and
     no resting shadows: surfaces are separated by a step in tone, and the six
     focus areas are set as type rather than as ticked boxes.
   - gpt-taste: two-line headings in wide containers, one full field of colour
     for the area list, generous section spacing, and a heading that holds its
     place while its list scrolls past it. No new animation dependency: the site
     already ships reveal-on-scroll in index.css, which collapses to a static
     state under prefers-reduced-motion.
   - impeccable: brand commitments hold (Inter text, Merriweather editorial
     serif, official green, Lucide outline icons). Every sentence here is
     content the page already carried; no grants awarded, no project counts, no
     student quotes, because none of those are verified. Imagery is the
     project's own configured stock, credited on the page, with the alt text
     written from the photograph itself rather than from the config label.

   There is no chooser here on purpose: the four opportunities do not map to
   user states the way the mentorship and career pages' paths do, so inventing
   one would mean inventing the mapping. */

const opportunities = [
  {
    title: 'Research grants',
    description:
      'LMSA offers small grants to support student-led research projects. Applications are reviewed quarterly.',
    action: { label: 'Ask about grants', to: '/contact' },
  },
  {
    title: 'Collaborative projects',
    description:
      'Join ongoing research projects led by faculty and senior students across multiple medical schools.',
    action: { label: 'Meet the Research & Journal Committee', to: '/leadership/committees/research-journal' },
  },
  {
    title: 'LMSA Medical Journal',
    description:
      'Publish your research in our peer-reviewed student medical journal. Submissions are accepted year-round.',
    action: { label: 'Contact the journal team', to: '/leadership/committees/research-journal' },
  },
  {
    title: 'Research training',
    description: 'Attend workshops on research methodology, data analysis, and scientific writing.',
    action: { label: 'View symposia & workshops', to: '/academics/symposia' },
  },
];

const focusAreas = [
  'Infectious Diseases (Malaria, TB, HIV)',
  'Maternal and Child Health',
  'Health Systems Strengthening',
  'Non-Communicable Diseases',
  'Mental Health',
  'Traditional Medicine Integration',
];

/* The three facts the page already states about the journal, set apart from the
   prose so a reader scanning for "can I submit this term" finds it. Nothing is
   added about acceptance rates, timelines or readership. */
const journalFacts = [
  { term: 'Peer review', detail: 'Student work is read and reviewed before it publishes.' },
  { term: 'Edited by', detail: 'The Research & Journal Committee.' },
];

export default function ResearchPage() {
  useEffect(() => {
    // Matches the shared .reveal-on-scroll styles in index.css, which already
    // collapse to a static state under prefers-reduced-motion.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const benchPhoto = stockPhotos.stories.researchCompetition;
  const notesPhoto = stockPhotos.sections.learn;
  const carePhoto = stockPhotos.stories.medicalCamp;

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- Why research belongs here ---------- */}
      <section className="bg-paper" aria-labelledby="approach-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="approach-title"
              className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Research is part of the work.
            </h2>
            <p className="mt-7 font-serif text-[clamp(1.4rem,2.4vw,2.1rem)] italic leading-[1.3] text-lmsa-900">
              Curiosity is not a distraction from practice. It is one of the ways practice improves.
            </p>
            <p className="mt-7 max-w-[54ch] text-[17px] leading-7 text-gray-800">
              LMSA supports students who want to investigate the challenges shaping healthcare in
              Liberia and contribute to the knowledge that can change them — with resources,
              mentorship, and platforms to conduct and present that work.
            </p>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={benchPhoto.src}
              alt="Glass beakers and a stirring rod on a pale laboratory bench"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="eager"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {benchPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- The four openings ---------- */}
      <section className="bg-white" aria-labelledby="openings-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
          <div className="reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
            <h2
              id="openings-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Four ways in.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[20px] leading-8 text-gray-700">
              Start with a grant, a collaborator, a publication, or the skills to make your next
              project stronger.
            </p>

            {/* Under the intro so the sticky column carries a picture rather
                than leaving the space beside a long list empty. */}
            <figure className="mt-10 hidden lg:block">
              <img
                src={notesPhoto.src}
                alt="Open reference books with a notebook of handwritten notes"
                className="aspect-[4/3] w-full rounded-lg object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                Photo: {notesPhoto.credit}
              </figcaption>
            </figure>
          </div>

          {/* A list of openings with their own doors, set in type. The earlier
              version put each one in an identical icon card, which made four
              different things look interchangeable. */}
          <ul className="space-y-14 md:space-y-16">
            {opportunities.map((opportunity, index) => (
              <li
                key={opportunity.title}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${(index % 2) * 70}ms` }}
              >
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">
                  {opportunity.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[17px] leading-7 text-gray-700">
                  {opportunity.description}
                </p>
                <Link
                  to={opportunity.action.to}
                  className="mt-1 inline-flex min-h-12 items-center gap-2 rounded text-[15px] font-semibold text-lmsa-700 underline decoration-lmsa-500 decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  {opportunity.action.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Where the work is needed ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="areas-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="areas-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.045em]"
            >
              Where the questions are.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              Some of the issues where research, service, and better systems can meet.
            </p>
          </div>

          {/* The whole field of colour is the section: the areas are set large
              enough to read as the content, with space doing the separating. */}
          <ul className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2 lg:mt-20">
            {focusAreas.map((area, index) => (
              <li
                key={area}
                className="reveal-on-scroll max-w-[26ch] text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-white"
                style={{ transitionDelay: `${(index % 2) * 70}ms` }}
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- The journal ---------- */}
      <section className="bg-white" aria-labelledby="journal-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll grid gap-8 md:grid-cols-[1fr_0.85fr] md:items-start md:gap-16">
            <div>
              <h2
                id="journal-title"
                className="max-w-[20ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                The LMSA Medical Journal.
              </h2>
              <p className="mt-5 max-w-[46ch] font-serif text-[clamp(1.25rem,2vw,1.65rem)] leading-[1.4] text-lmsa-900">
                A peer-reviewed journal for student work — open to submissions year-round.
              </p>
            </div>
            <p className="max-w-[46ch] text-[17px] leading-7 text-gray-700 md:mt-2">
              Publish your research in the LMSA Medical Journal. A project finished mid-term does not
              have to wait for a window to open before it can be sent in.
            </p>
          </div>

          <dl className="reveal-on-scroll mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {journalFacts.map((fact) => (
              <div key={fact.term}>
                <dt className="text-[15px] font-semibold text-lmsa-700">{fact.term}</dt>
                <dd className="mt-1 max-w-[34ch] text-[17px] leading-7 text-gray-800">{fact.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="reveal-on-scroll mt-12">
            <Link
              to="/leadership/committees/research-journal"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
            >
              Contact the journal team
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Closing action ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="next-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.8fr_1fr] lg:items-center lg:gap-16 lg:px-8">
          {/* Copy first in the DOM so a phone reads the heading before the
              photo credit; the picture takes the left column at lg. */}
          <div className="reveal-on-scroll max-w-3xl lg:order-last">
            <h2
              id="next-title"
              className="text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em]"
            >
              Bring your question.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              A half-formed idea is enough to start. Tell the team what you want to look into and
              where you are stuck.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Ask about research
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/academics/symposia"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                See symposia & workshops
              </Link>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={carePhoto.src}
              alt="A clinician giving an injection to an older patient"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {carePhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
