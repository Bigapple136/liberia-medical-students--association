import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stockPhotos } from '@config/images';

/* Executive Council page.

   Rebuilt to the same roster treatment as /leadership:
   - The page no longer renders its own <h1>: PublicLayout already renders the
     PageHero for this route, so the old "Executive Council" heading was a second
     one on the page. It also no longer renders <main>.
   - The old page was four shadowed, bordered cards with icon-topped headings and
     bullet dots — the template the rest of the public site has moved off. The
     seats now use the same type as the officer roster: office in green, a serif
     line where an officer's name would sit, then the description.
   - There is no council roster in the API (no model stores class presidents or
     student representatives), so the roster here is of *seats*, not people. Each
     serif line states how the seat is filled rather than a name, because there is
     nobody to name and a placeholder person would be a fabricated officer.
   - Text is the page's own: the two introduction paragraphs, the two seat
     descriptions and the six responsibilities, unchanged in meaning. Nothing is
     added about meeting counts, members or campus numbers.
   - Every picture is the project's configured stock, credited, with alt text
     written from the photograph. */

const SEATS = [
  {
    office: 'Class Presidents',
    serif: 'Elected by each class',
    detail:
      'Each medical school class elects a president who represents their cohort in the Executive Council. They serve as the primary liaison between their class and LMSA leadership.',
    action: { label: 'How class elections work', to: '/leadership#stand' },
  },
  {
    office: 'Student Representatives',
    serif: 'Appointed where needed',
    detail:
      'Additional representatives may be appointed to ensure adequate representation from all campuses and special programs.',
    action: { label: 'Read Article IV on appointments', to: '/about/constitution#elections' },
  },
];

const DUTIES = [
  'Represent student concerns and feedback to LMSA leadership',
  'Coordinate campus-wide events and initiatives',
  'Participate in monthly council meetings',
  'Support recruitment and membership drives',
  'Assist with academic support programs',
  'Promote student welfare and engagement',
];

export default function ExecutiveCouncilPage() {
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

  const roomPhoto = stockPhotos.sections.connect;
  // Not the hero's photograph: the same picture twice on one page reads as a
  // mistake at any size.
  const sessionPhoto = stockPhotos.hero.leadership;
  const meetingPhoto = stockPhotos.sections.lead;

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- What the council is ---------- */}
      <section className="bg-paper" aria-labelledby="council-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="council-title"
              className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Every class has a seat.
            </h2>
            <p className="mt-7 max-w-[54ch] text-[17px] leading-7 text-gray-800">
              The Executive Council is the representative body of LMSA, composed of class presidents
              and student representatives from all medical schools in Liberia. This council serves as
              the voice of medical students at the institutional level and ensures that every class
              has direct representation in LMSA governance.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-7 text-gray-800">
              Council members are elected by their peers and serve one-year terms, working closely
              with the Executive Committee to implement programs and address student concerns.
            </p>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={roomPhoto.src}
              alt="Students working together around a table with laptops"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="eager"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {roomPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- The seats ---------- */}
      <section className="bg-white" aria-labelledby="seats-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="seats-title"
              className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Who sits on it.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[20px] leading-8 text-gray-700">
              Two kinds of seat, filled two different ways.
            </p>
          </div>

          {/* The roster treatment: office, then a serif line, then the
              description. Where the leadership page sets an officer's name, this
              page sets how the seat is filled, because no names are published. */}
          <ul className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {SEATS.map((seat, index) => (
              <li
                key={seat.office}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-lmsa-700">
                  {seat.office}
                </h3>
                <p className="mt-1 font-serif text-2xl leading-snug text-lmsa-900">{seat.serif}</p>
                <p className="mt-2 max-w-[42ch] text-[17px] leading-7 text-gray-800">
                  {seat.detail}
                </p>
                <Link
                  to={seat.action.to}
                  className="mt-1 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  {seat.action.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <figure className="reveal-on-scroll mt-16">
            <img
              src={sessionPhoto.src}
              alt="A team working session around a whiteboard covered in notes"
              className="aspect-[16/9] w-full rounded-lg object-cover md:aspect-[21/9]"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {sessionPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- What the council does ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="duties-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="duties-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.045em]"
            >
              What the council does.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              The work is mostly between meetings: carrying what a class raises to the people who can
              act on it.
            </p>
          </div>

          <ul className="mt-14 grid gap-x-14 gap-y-8 md:grid-cols-2 lg:mt-20">
            {DUTIES.map((duty, index) => (
              <li
                key={duty}
                className="reveal-on-scroll max-w-[38ch] text-[20px] leading-8 text-white"
                style={{ transitionDelay: `${(index % 2) * 70}ms` }}
              >
                {duty}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Closing action ---------- */}
      <section className="bg-white" aria-labelledby="council-next-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="council-next-title"
              className="text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em] text-lmsa-900"
            >
              Stand for your class.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Class presidents are elected by their peers for a one-year term. Nominations open with
              the election cycle, and the executive officers carry the same window.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/leadership#stand"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                See how to stand
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/leadership"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                Meet the executive committee
              </Link>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={meetingPhoto.src}
              alt="A meeting in progress, with notes on a wall and people working at a table"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {meetingPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
