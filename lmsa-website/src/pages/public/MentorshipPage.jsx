import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
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

/* Each entry below restates something the page already establishes — mentor
   seniority, the basis for matching, the support areas, and the fact that a
   first message commits you to nothing. Nothing here is a claim about how
   often pairs meet, how many students are enrolled, or what anyone said. */
const cycle = [
  {
    title: 'Someone further along',
    desc:
      'Mentors are senior students. The years you are heading into are years they have already been through, so the questions you have now are ones they recognise.',
  },
  {
    title: 'A match on shared ground',
    desc:
      'Pairing considers academic interests, career goals, and personal preferences — so the first conversation starts from something you have in common.',
  },
  {
    title: 'Help with the thing on your desk',
    desc:
      'Exam preparation, study strategy, the move between clinical years, specialty exploration, research, or a difficult stretch. Say which one it is and the pairing can be aimed at it.',
  },
  {
    title: 'A pace you can set',
    desc:
      'The relationship is structured enough to begin and flexible enough to fit around rotations and exams. You start with a message, not an application, and asking commits you to nothing.',
  },
];

const paths = [
  {
    id: 'mentee',
    label: 'I want a mentor',
    answer:
      'Send one message through the contact form and say what you are working on. The team will follow up to understand your goals before introducing anyone.',
    tips: ['What you are working on', 'Which year you are in', 'What kind of support would help'],
    action: 'Send your goals to the team',
  },
  {
    id: 'mentor',
    label: 'I want to mentor',
    answer:
      'Write through the same form and say which year you are in and what you can offer students behind you. The team will follow up on a match.',
    tips: ['Which year you are in', 'What you can offer students behind you', 'How much time you can give'],
    action: 'Offer to mentor',
  },
  {
    id: 'unsure',
    label: 'Not sure yet',
    answer:
      'Start with a question. The team answers every message and can explain what a match involves before you commit to anything.',
    tips: ['Ask what a match involves', 'Ask about timing and expectations', 'Nothing is committed by asking'],
    action: 'Ask a question first',
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
  const picked = paths.find((p) => p.id === choice);

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
      <section id="process" className="scroll-mt-24 bg-white" aria-labelledby="process-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-start md:gap-16">
            <h2
              id="process-title"
              className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              How a match works.
            </h2>
            <p className="max-w-[44ch] text-[20px] leading-8 text-gray-700 md:mt-2">
              Structured enough to help you begin, flexible enough to grow with the people involved.
            </p>
          </div>

          {/* The four steps are a sequence, so they are laid out in reading order
              with an arrow pointing to the next one — on a phone the arrow points
              down. No digits and no rules; the direction does the work. */}
          <ol className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="reveal-on-scroll relative lg:pr-10">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900 md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[34ch] text-[17px] leading-7 text-gray-700">{step.desc}</p>
                {index < steps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    className="absolute -bottom-7 left-0 rotate-90 text-lmsa-500 lg:bottom-auto lg:left-auto lg:right-1 lg:top-1 lg:rotate-0"
                  />
                )}
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

      {/* ---------- What a cycle gives you ---------- */}
      <section className="bg-white" aria-labelledby="cycle-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="cycle-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              What a match is actually for.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Not a mailing list and not a course. A standing conversation about the things you are
              working on now.
            </p>
          </div>

          {/* A plain typographic list, so this section does not repeat the card
              grid above it or the panel below it. */}
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {cycle.map((item, index) => (
              <div
                key={item.title}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${(index % 2) * 70}ms` }}
              >
                <dt className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{item.title}</dt>
                <dd className="mt-2 max-w-[44ch] text-[17px] leading-7 text-gray-700">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Two ways in, with the chooser ---------- */}
      <section className="bg-paper" aria-labelledby="paths-title">
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
            <div className="reveal-on-scroll rounded-2xl bg-white p-6 md:p-8">
              <fieldset>
                <legend className="text-lg font-semibold text-lmsa-900">Where would you start?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {paths.map((path) => {
                    const selected = choice === path.id;
                    return (
                      <label
                        key={path.id}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-lmsa-600 ${
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
              </fieldset>

              {/* One live region holds the whole answer, including the action, so
                  the change is announced once instead of piece by piece. */}
              <div aria-live="polite" className="mt-6 min-h-[9.5rem]">
                {picked ? (
                  <div>
                    <p className="max-w-[52ch] text-[17px] leading-7 text-gray-800">{picked.answer}</p>
                    <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">
                      What to include
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {picked.tips.map((tip) => (
                        <li key={tip} className="flex items-center gap-2.5 text-[15px] leading-6 text-gray-800">
                          <Check size={15} className="shrink-0 text-lmsa-600" aria-hidden="true" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/contact"
                      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-lmsa-600 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                    >
                      {picked.action}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <p className="max-w-[46ch] text-[17px] leading-7 text-gray-600">
                    Choose one and the next step appears here.
                  </p>
                )}
              </div>
            </div>

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
