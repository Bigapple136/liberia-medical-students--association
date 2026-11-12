import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stockPhotos } from '@config/images';

/* Career Center page.

   Rebuilt on the same language as the mentorship page:
   - the page sits inside PublicLayout, which already renders the skip link, the
     site Header, an optional PageHero and the site Footer. There is no hero
     registry entry for this path, so the page renders its own hero — but it
     renders no navigation and no footer of its own.
   - brand commitments hold: Inter for text, Merriweather for the editorial
     voice, the official green family, Lucide icons. The previous version used
     an off-palette magenta/cyan set and a geometric font that is not part of
     the brand.
   - three claims were removed because nothing in the project supports them:
     "Advising since 2024", "Alumni network across 12 countries" and "Free to
     every LMSA student". The contact address was also wrong: the binding
     address for LMSA is dev.lmsa@gmail.com.
   - pathways are described, not sold. The old cards each carried a "Learn
     more" link to the page's own contact anchor, which promised a detail page
     that does not exist.

   The content below is the content the page already had: the six directions
   students explore, the four kinds of support, the three steps of advising,
   and the four questions students ask. */

const steps = [
  {
    title: 'Reach out',
    desc: 'One message to the career team opens advising and current opportunities.',
  },
  {
    title: 'Explore',
    desc: 'Structured exposure to specialties, alongside conversations with people who made similar decisions.',
  },
  {
    title: 'Decide',
    desc: 'A plan that connects your coursework with the practice you want — at home, abroad, or both.',
  },
];

const offerings = [
  {
    title: 'Career advising',
    desc: 'One-on-one conversations with advisors who turn uncertainty into a workable plan.',
  },
  {
    title: 'Specialty exploration',
    desc: 'Structured exposure to clinical fields — what each specialty actually practices daily.',
  },
  {
    title: 'Applications and CV support',
    desc: 'Feedback on CVs, personal statements, and materials before your first deadline.',
  },
  {
    title: 'Opportunities and postings',
    desc: 'Internships, scholarships, and openings shared through LMSA news.',
  },
];

const pathways = [
  {
    title: 'Primary care and internal medicine',
    desc: 'The broadest foundation — chronic disease, infectious disease, the whole patient.',
  },
  {
    title: 'Surgery and procedural specialties',
    desc: 'For those drawn to anatomy in the hands: precise, high-stakes, immediate.',
  },
  {
    title: 'Pediatrics and maternal health',
    desc: 'Care shaped by Liberia’s youngest patients and their mothers.',
  },
  {
    title: 'Public health and health systems',
    desc: 'Medicine at the scale of communities, policy, and prevention.',
  },
  {
    title: 'Global pathways and residency',
    desc: 'Training abroad without losing sight of practice at home.',
  },
  {
    title: 'Research and academic medicine',
    desc: 'Questions, teaching, and the evidence that changes guidelines.',
  },
];

const questions = [
  {
    q: 'I have no idea which specialty fits me. Where do I start?',
    a: 'Start with what you already enjoy: the rotation you did not want to leave, the problem you keep reading about. Bring that to an advising conversation and it becomes something concrete to compare specialties against.',
  },
  {
    q: 'What options exist for training outside Liberia?',
    a: 'Ask about international residencies and scholarships early, and ask what each one requires of you in timing and examinations. Training abroad and practicing at home are not competing choices — but the route between them is easier to plan with time on your side.',
  },
  {
    q: 'When should I start thinking about my career?',
    a: 'Where you are right now. Careers are assembled through rotations, research, volunteering, and the people you meet — the earlier the pieces start, the more options you keep.',
  },
  {
    q: 'Can someone in practice help with my applications?',
    a: 'Yes — say so when you write. Advisors can connect you with physicians and trainees who have recently been through applications and interviews, and who can give you honest feedback rather than encouragement alone.',
  },
];

const paths = [
  {
    id: 'chosen',
    label: 'I know the specialty',
    answer:
      'Say which one and what drew you to it. The next useful step is testing that choice, not restating it — advising can tell you what the training actually demands.',
    tips: ['Which specialty', 'What drew you to it', 'What you want to confirm or rule out'],
    action: 'Ask about that specialty',
  },
  {
    id: 'weighing',
    label: 'I’m weighing a few',
    answer:
      'Name the options and what appeals about each. A conversation is usually enough to hear which reasons are strong and which are borrowed from someone else.',
    tips: ['The two or three options', 'What appeals about each', 'What you would need to know to choose'],
    action: 'Compare options with the team',
  },
  {
    id: 'unsure',
    label: 'No idea yet',
    answer:
      'That is the most common place to start. Say what you have enjoyed so far in your coursework and rotations, and advising works outward from there.',
    tips: ['What parts of medicine you enjoy', 'Which rotation felt right, if any', 'What you want from a career'],
    action: 'Start from the beginning',
  },
];

export default function CareerCenterPage() {
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

  const picked = paths.find((p) => p.id === choice);

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- Hero ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="career-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div className="reveal-on-scroll">
            <h1
              id="career-title"
              className="text-[clamp(2.25rem,5.4vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.045em]"
            >
              You don’t pick a specialty alone.
            </h1>
            <p className="mt-6 max-w-[46ch] text-[20px] leading-8 text-lmsa-50">
              The LMSA Career Center connects coursework with the doctor you want to become — through
              advising, specialty exploration, and a community that has walked these roads.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Start a conversation
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a
                href="#pathways"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                See the pathways
              </a>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={stockPhotos.sections.lead.src}
              alt="A team meeting around a table in front of a wall of sticky notes"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="eager"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {stockPhotos.sections.lead.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- Editorial statement ---------- */}
      <section className="bg-paper" aria-labelledby="statement-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <h2 id="statement-title" className="sr-only">Why the center exists</h2>
          <p className="reveal-on-scroll max-w-[46ch] font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] italic leading-[1.35] text-lmsa-900">
            Choosing a specialty is consequential.
          </p>
          <p className="reveal-on-scroll mt-6 max-w-[54ch] text-[17px] leading-7 text-gray-700">
            Few make it well in isolation — the center exists to change that.
          </p>
        </div>
      </section>

      {/* ---------- Pathways ---------- */}
      <section id="pathways" className="scroll-mt-24 bg-white" aria-labelledby="pathways-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-start md:gap-16">
            <h2
              id="pathways-title"
              className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Paths students are exploring now.
            </h2>
            <p className="max-w-[44ch] text-[20px] leading-8 text-gray-700 md:mt-2">
              Six directions that come up most often. None of them is a commitment — they are places to
              start asking questions.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16">
            {pathways.map((pathway, index) => (
              <li
                key={pathway.title}
                className="reveal-on-scroll rounded-xl bg-paper p-6 md:p-8"
                style={{ transitionDelay: `${(index % 2) * 70}ms` }}
              >
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">
                  {pathway.title}
                </h3>
                <p className="mt-2 max-w-[42ch] text-[17px] leading-7 text-gray-700">{pathway.desc}</p>
              </li>
            ))}
          </ul>

          <p className="reveal-on-scroll mt-10 max-w-[52ch] text-[17px] leading-7 text-gray-700">
            If one of these is already on your mind, say so when you write — that is a better first
            message than a general enquiry.
          </p>
        </div>

        <figure className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
          <img
            src={stockPhotos.stories.symposium.src}
            alt="A doctor in a white coat holding a phone"
            className="aspect-[16/9] w-full rounded-lg object-cover md:aspect-[21/9]"
            loading="lazy"
          />
          <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
            Photo: {stockPhotos.stories.symposium.credit}
          </figcaption>
        </figure>
      </section>

      {/* ---------- How advising works ---------- */}
      <section className="bg-paper" aria-labelledby="how-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="how-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              How advising works.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Three steps, in order. The middle one is where most of the work happens.
            </p>
          </div>

          {/* The steps are a sequence, so they read in order with an arrow pointing
              to the next one — down the page on a phone, across it from lg. */}
          <ol className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="reveal-on-scroll relative lg:pr-10">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900 md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[36ch] text-[17px] leading-7 text-gray-700">{step.desc}</p>
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
            src={stockPhotos.sections.connect.src}
            alt="Three people working at laptops around a wooden table"
            className="aspect-[16/9] w-full rounded-lg object-cover md:aspect-[21/9]"
            loading="lazy"
          />
          <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
            Photo: {stockPhotos.sections.connect.credit}
          </figcaption>
        </figure>
      </section>

      {/* ---------- What the center offers ---------- */}
      <section className="bg-white" aria-labelledby="offers-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="offers-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Practical support for hard choices.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Four things you can ask for, and get, without waiting for an event.
            </p>
          </div>

          {/* A plain typographic list rather than a second card grid, so this
              section does not repeat the shape of the pathways above it. */}
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {offerings.map((offering, index) => (
              <div
                key={offering.title}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${(index % 2) * 70}ms` }}
              >
                <dt className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">
                  {offering.title}
                </dt>
                <dd className="mt-2 max-w-[42ch] text-[17px] leading-7 text-gray-700">{offering.desc}</dd>
              </div>
            ))}
          </dl>

          {/* The hand-off to the page that answers the neighbouring question:
              advice from a student who is a year or two ahead. */}
          <div className="reveal-on-scroll mt-12 max-w-[62ch]">
            <p className="text-[17px] leading-7 text-gray-700">
              Some questions are better answered by someone a year or two ahead of you than by an
              advisor. The Mentorship Program pairs junior students with senior ones.
            </p>
            <Link
              to="/academics/mentorship"
              className="mt-1 inline-flex min-h-12 items-center gap-2 rounded text-[15px] font-semibold text-lmsa-700 underline decoration-lmsa-500 decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
            >
              Go to the Mentorship Program
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Chooser ---------- */}
      <section className="bg-paper" aria-labelledby="where-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="where-title"
              className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Where are you now?
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              The first message is easier when you know what to put in it. Pick the closest answer.
            </p>
          </div>

          <div className="reveal-on-scroll mt-12 rounded-2xl bg-white p-6 md:p-8">
            <fieldset>
              <legend className="text-lg font-semibold text-lmsa-900">Your starting point</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {paths.map((path) => {
                  const selected = choice === path.id;
                  return (
                    <label
                      key={path.id}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-lmsa-600 ${
                        selected ? 'bg-lmsa-900 text-white' : 'bg-paper text-lmsa-900 hover:bg-paper-muted'
                      }`}
                    >
                      <input
                        type="radio"
                        name="career-start"
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
            <div aria-live="polite" className="mt-6 min-h-[10.5rem]">
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
        </div>
      </section>

      {/* ---------- Questions ---------- */}
      <section className="bg-white" aria-labelledby="questions-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-start md:gap-16">
            <h2
              id="questions-title"
              className="max-w-[14ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Questions students ask.
            </h2>
            <p className="max-w-[44ch] text-[20px] leading-8 text-gray-700 md:mt-2">
              If yours is not here, ask it directly — the career team answers every message.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            {questions.map((item) => (
              <details key={item.q} name="career-faq" className="group reveal-on-scroll rounded-xl bg-paper">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] font-semibold leading-7 text-lmsa-900 md:px-6 md:py-5 md:text-[20px] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    className="relative h-4 w-4 shrink-0 text-lmsa-600 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                <p className="max-w-[62ch] px-5 pb-5 text-[17px] leading-7 text-gray-700 md:px-6 md:pb-6">
                  {item.a}
                </p>
              </details>
            ))}
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
              Ready when you are.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              One message opens advising, specialty exploration, and the current stream of opportunities.
              Tell us where you are and what you are weighing.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Talk to the career team
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a
                href="mailto:dev.lmsa@gmail.com"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                dev.lmsa@gmail.com
              </a>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={stockPhotos.stories.medicalCamp.src}
              alt="A clinician giving a patient an injection"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {stockPhotos.stories.medicalCamp.credit}
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
