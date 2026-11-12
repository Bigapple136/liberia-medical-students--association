import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stockPhotos } from '@config/images';

/* Mentorship page.

   Redesign notes, from the three skills used here:
   - design-taste-frontend: the page sits inside PublicLayout, which already
     renders the site Header, an optional PageHero and the site Footer. The old
     version repeated the navigation and footer inside the page, which produced
     two <main> landmarks and a second set of links; this version renders none
     of that and starts at its own hero. No eyebrows, no index numbers, no
     hairline rules or resting shadows; surfaces are separated by a step in tone.
   - gpt-taste: two-line headline in a wide container, gapless grids, one
     interactive element rather than decoration, generous section spacing.
   - impeccable: brand commitments hold (Inter text, Merriweather editorial
     serif, official green, Lucide outline icons), full real content, honest
     affordances. The program's content is the content that was already here:
     the four steps, the eight kinds of support, and the pairing statement.
     Imagery is the project's own configured stock, credited on the page.

   The headline is short on purpose: at the largest size it holds two lines on
   desktop and three on a phone, and no section heading runs longer than that. */

const steps = [
  { title: 'Reach out', desc: 'Contact the team with your goals, interests, and what kind of support you are looking for.' },
  { title: 'Get matched', desc: 'We pair you with a compatible mentor based on interests and needs.' },
  { title: 'Connect', desc: 'Meet regularly with your mentor in a structured, flexible relationship.' },
  { title: 'Grow', desc: 'Achieve your academic and career goals with guidance and perspective.' },
];

const support = [
  {
    title: 'Academics and exams',
    items: [
      'Academic support and study strategies',
      'Exam preparation assistance',
      'Transition support between clinical years',
    ],
  },
  {
    title: 'Career and research',
    items: [
      'Career guidance and specialty exploration',
      'Research collaboration opportunities',
      'Networking opportunities',
    ],
  },
  {
    title: 'Wellbeing and leadership',
    items: ['Emotional support during challenging times', 'Leadership skill development'],
  },
];

const paths = [
  {
    id: 'mentee',
    label: 'I want a mentor',
    answer:
      'Send one message through the contact form and say what you are working on. The team will follow up to understand your goals before introducing anyone.',
  },
  {
    id: 'mentor',
    label: 'I want to mentor',
    answer:
      'Write through the same form and say which year you are in and what you can offer students behind you. The team will follow up on a match.',
  },
  {
    id: 'unsure',
    label: 'Not sure yet',
    answer:
      'Start with a question. The team answers every message and can explain what a match involves before you commit to anything.',
  },
];

export default function MentorshipPage() {
  const [choice, setChoice] = useState(null);

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

  const photo = stockPhotos.hero.mentorship;
  const answer = paths.find((p) => p.id === choice)?.answer;

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- Hero ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="mentorship-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div className="reveal-on-scroll">
            <h1
              id="mentorship-title"
              className="text-[clamp(2.25rem,5.4vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.045em]"
            >
              Medical school, in pairs.
            </h1>
            <p className="mt-6 max-w-[46ch] text-[20px] leading-8 text-lmsa-50">
              Nobody should have to figure it out alone. The LMSA Mentorship Program connects junior
              students with senior students who can offer guidance, perspective, and honest support.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Ask about mentorship
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a
                href="#process"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                How the program works
              </a>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={photo.src}
              alt="Two people pointing at the same laptop screen"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="eager"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">Photo: {photo.credit}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- Pairing statement ---------- */}
      <section className="bg-paper" aria-labelledby="pairing-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <h2 id="pairing-title" className="sr-only">How students are paired</h2>
          <p className="reveal-on-scroll max-w-[46ch] font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] italic leading-[1.35] text-lmsa-900">
            Mentors are matched on academic interests, career goals, and personal preferences.
          </p>
          <p className="reveal-on-scroll mt-6 max-w-[54ch] text-[17px] leading-7 text-gray-700">
            That shared ground is what the relationship builds on — not a name pulled off a list.
          </p>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="process" className="bg-white" aria-labelledby="process-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
          <div className="reveal-on-scroll lg:sticky lg:top-24 lg:self-start">
            <h2
              id="process-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              How a match works.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[20px] leading-8 text-gray-700">
              Structured enough to help you begin, flexible enough to grow with the people involved.
            </p>
          </div>

          <ol className="space-y-12">
            {steps.map((step) => (
              <li key={step.title} className="reveal-on-scroll">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-lmsa-900">{step.title}</h3>
                <p className="mt-2 max-w-[48ch] text-[17px] leading-7 text-gray-700">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <figure className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
          <img
            src={stockPhotos.sections.learn.src}
            alt="Open textbooks and handwritten notes on a desk"
            className="aspect-[16/9] w-full rounded-lg object-cover md:aspect-[21/9]"
            loading="lazy"
          />
          <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
            Photo: {stockPhotos.sections.learn.credit}
          </figcaption>
        </figure>
      </section>

      {/* ---------- What support looks like ---------- */}
      <section className="bg-paper" aria-labelledby="support-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="support-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Practical, personal, mutual.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Some conversations are about exams. Others are about finding your confidence or deciding
              what comes next.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {support.map((group, index) => (
              <div
                key={group.title}
                className="reveal-on-scroll rounded-xl bg-white p-6 md:p-8"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[17px] leading-7 text-gray-800">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Two ways in, with the chooser ---------- */}
      <section className="bg-white" aria-labelledby="paths-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="paths-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Two ways in.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Most people arrive wanting a mentor and later choose to mentor someone themselves. You can
              take either step now.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <fieldset className="reveal-on-scroll">
              <legend className="text-lg font-semibold text-lmsa-900">Where would you start?</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {paths.map((path) => {
                  const selected = choice === path.id;
                  return (
                    <label
                      key={path.id}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors focus-within:ring-2 focus-within:ring-lmsa-600 focus-within:ring-offset-2 ${
                        selected
                          ? 'bg-lmsa-900 text-white'
                          : 'bg-paper text-lmsa-900 hover:bg-paper-muted'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mentorship-start"
                        value={path.id}
                        checked={selected}
                        onChange={() => setChoice(path.id)}
                        className="h-4 w-4 shrink-0 accent-lmsa-600"
                      />
                      {path.label}
                    </label>
                  );
                })}
              </div>
              <p
                aria-live="polite"
                className={`mt-6 max-w-[56ch] text-[17px] leading-7 ${
                  answer ? 'text-gray-800' : 'text-gray-600'
                }`}
              >
                {answer ?? 'Choose one and the next step appears here.'}
              </p>
            </fieldset>

            <figure className="reveal-on-scroll">
              <img
                src={stockPhotos.sections.connect.src}
                alt={stockPhotos.sections.connect.alt}
                className="aspect-[4/3] w-full rounded-lg object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                Photo: {stockPhotos.sections.connect.credit}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Closing action ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="next-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="next-title"
              className="text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em]"
            >
              One message starts the match.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              Whether you want a mentor or want to become one, tell us where you are and what you need.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Ask about mentorship
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/academics/resources"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Browse study materials
              </Link>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={stockPhotos.stories.symposium.src}
              alt="A doctor in a white coat holding a phone"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {stockPhotos.stories.symposium.credit}
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
