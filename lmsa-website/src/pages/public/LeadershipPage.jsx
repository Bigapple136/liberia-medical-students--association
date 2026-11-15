import { useEffect, useState } from 'react';
import { ArrowRight, Link as LinkIcon, Loader, RefreshCw, User, Vote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stockPhotos } from '@config/images';
import { executiveService } from '@services/executive.service';
import { nominationService } from '@services/nomination.service';
import { useAuth } from '@context/AuthContext';
import NominationDialog from '@components/leadership/NominationDialog';
import {
  LEADERSHIP_LEVELS,
  executivePositionNames,
  formatDate,
  cycleMessage,
} from '@config/leadership';

/* Leadership page.

   Redesign notes, from the three skills used here:
   - design-taste-frontend: this page sits inside PublicLayout, which already
     renders the header, the /leadership PageHero and the footer. The previous
     version rendered its own <main>, which put a second main landmark inside the
     layout's own; this one renders none of that. No eyebrows, no index numerals,
     no hairline rules, and no rows of identical cards: the roster, the cycle and
     the three routes each get their own composition, and surfaces are separated
     by a step in tone rather than by outlines.
   - gpt-taste: wide containers with two-line headings, one full field of colour
     for the election cycle, and generous space between sections. Its Inter ban
     and its GSAP stack are not adopted: the brand fixes Inter and Merriweather,
     and the site already ships reveal-on-scroll, which honours
     prefers-reduced-motion.
   - impeccable: the page keeps every behaviour it had — the live officer list,
     the nominations cycle, the per-level position pickers, the nomination dialog
     and both retry paths. Nothing is invented: when the officer list cannot be
     read, the offices are listed with no names attached instead of the six
     "Student Name" people the old fallback rendered, because a placeholder
     person with a made-up bio reads as a real officer.

   The election panel is the page's one live element: its state and dates come
   from the API and are announced when they change. */

/* The offices, used only when the live list cannot be read. Names, bios and
   photos are deliberately absent: the page shows which offices exist and says
   they are unfilled, rather than inventing holders. */
const FALLBACK_POSITIONS = [
  { position_name: 'President', position_rank: 1 },
  { position_name: 'Vice President', position_rank: 2 },
  { position_name: 'General Secretary', position_rank: 3 },
  { position_name: 'Financial Secretary', position_rank: 4 },
  { position_name: 'Public Relations Officer', position_rank: 5 },
  { position_name: 'Academic Director', position_rank: 6 },
];

/* The three bodies the page already described, with the body's name below its
   claim rather than as a label above it. */
const BODIES = [
  {
    claim: 'The members decide.',
    detail: 'The general assembly is the supreme decision-making body, made up of every registered member.',
    name: 'General assembly',
  },
  {
    claim: 'The officers deliver.',
    detail: 'Elected officers carry the association’s day-to-day operations and represent it outwardly.',
    name: 'Executive committee',
  },
  {
    claim: 'The teams deepen the work.',
    detail: 'The Academic, Finance, Welfare, Events, and Public Relations teams each own a set of priorities.',
    name: 'Standing committees',
  },
];

/** What the primary action should be for a level, given the window and session. */
function actionFor(level, cycleState, user) {
  if (!level.nominable) {
    return { kind: 'link', label: 'Do the committee work first', to: '/leadership/committees' };
  }
  if (cycleState?.state !== 'open') {
    return { kind: 'link', label: 'Read the election rules', to: '/about/constitution#elections' };
  }
  if (!user) {
    return { kind: 'link', label: 'Sign in to nominate yourself', to: '/login?next=/leadership%23stand' };
  }
  return { kind: 'nominate', label: 'Nominate yourself' };
}

/** First letters of a name, for officers with no photograph. */
function initialsOf(name) {
  if (!name) return '';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function LeadershipPage() {
  const { user } = useAuth() || {};
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);

  const [cycleState, setCycleState] = useState(null);
  const [cycleLoading, setCycleLoading] = useState(true);
  const [cycleError, setCycleError] = useState(false);

  const [dialog, setDialog] = useState({ open: false, level: null, positionName: '' });
  const [selectedExec, setSelectedExec] = useState('');
  const [selectedClassRep, setSelectedClassRep] = useState('Class President');

  useEffect(() => {
    loadExecutives();
    loadCycle();
  }, []);

  useEffect(() => {
    // Matches the shared .reveal-on-scroll styles in index.css, which already
    // collapse to a static state under prefers-reduced-motion.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  async function loadExecutives() {
    setLoading(true);
    setError(false);
    try {
      const data = await executiveService.getAll();
      if (data && data.length > 0) {
        setExecutives(data);
        setPlaceholder(false);
      } else {
        setExecutives(FALLBACK_POSITIONS);
        setPlaceholder(true);
      }
    } catch {
      setError(true);
      setExecutives(FALLBACK_POSITIONS);
      setPlaceholder(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadCycle() {
    setCycleLoading(true);
    setCycleError(false);
    try {
      setCycleState(await nominationService.getCycle());
    } catch {
      // No cycle reachable — the page still renders, but it must not claim to
      // know the window is closed when it simply could not be read.
      setCycleState(null);
      setCycleError(true);
    } finally {
      setCycleLoading(false);
    }
  }

  const currentYear = executives[0]?.academic_year || '2025-2026';
  const executiveNames = executivePositionNames(executives);
  // The select can hold a name that no longer exists in the executive list.
  const effectiveExec = executiveNames.includes(selectedExec)
    ? selectedExec
    : executiveNames[0] || '';
  const nominationsOpen = cycleState?.state === 'open';

  const cycleLabel = [
    cycleState?.cycle?.nomination_opens && `Opens ${formatDate(cycleState.cycle.nomination_opens)}`,
    cycleState?.cycle?.nomination_closes && `Closes ${formatDate(cycleState.cycle.nomination_closes)}`,
    cycleState?.cycle?.election_date && `Election ${formatDate(cycleState.cycle.election_date)}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const cycleDates = [
    { term: 'Nominations open', value: formatDate(cycleState?.cycle?.nomination_opens) },
    { term: 'Nominations close', value: formatDate(cycleState?.cycle?.nomination_closes) },
    { term: 'Election date', value: formatDate(cycleState?.cycle?.election_date) },
  ];

  const statusLine = cycleLoading
    ? 'Reading the election calendar…'
    : cycleError
      ? 'We couldn’t load the election dates. Check back shortly.'
      : cycleMessage(cycleState);

  function openDialog(level, positionName) {
    setDialog({ open: true, level, positionName });
  }

  const routesPhoto = stockPhotos.sections.lead;
  const assemblyPhoto = stockPhotos.sections.connect;
  const servicePhoto = stockPhotos.stories.symposium;

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- Who holds office this year ---------- */}
      <section className="bg-white" aria-labelledby="officers-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
            <div className="reveal-on-scroll">
              <h2
                id="officers-title"
                className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                The officers serving this year.
              </h2>
              <p className="mt-5 max-w-[54ch] text-[20px] leading-8 text-gray-700">
                Leadership changes each year, but the responsibility to represent peers thoughtfully
                remains. These are the offices that carry the association’s work between elections.
              </p>
            </div>
            <p className="reveal-on-scroll font-serif text-3xl leading-none text-lmsa-900 lg:mt-2 lg:text-right">
              {currentYear}
            </p>
          </div>

          {loading ? (
            <p className="mt-14 flex items-center gap-3 text-[17px] text-gray-700" aria-live="polite">
              <Loader className="animate-spin text-lmsa-700" size={18} aria-hidden="true" />
              Loading the current officers…
            </p>
          ) : (
            <>
              {placeholder && (
                <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 bg-paper px-6 py-5">
                  <p className="max-w-[56ch] text-[15px] leading-6 text-lmsa-900">
                    {error
                      ? 'The live officer list did not load, so the offices are listed without names. Nothing here is a placeholder person.'
                      : 'No officers have been published for this year yet, so the offices are listed without names.'}
                  </p>
                  <button
                    type="button"
                    onClick={loadExecutives}
                    className="inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                  >
                    <RefreshCw size={15} aria-hidden="true" />
                    Try again
                  </button>
                </div>
              )}

              {/* A roster, not a card grid: the offices hold the same shape but
                  the people differ, which is the information a reader is after. */}
              <ul className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
                {executives.map((exec, index) => (
                  <li
                    key={exec.id || exec.position_name || index}
                    className="reveal-on-scroll flex gap-5"
                    style={{ transitionDelay: `${(index % 2) * 70}ms` }}
                  >
                    <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lmsa-50 text-[15px] font-semibold text-lmsa-800">
                      {exec.holder_photo_url ? (
                        <img
                          src={exec.holder_photo_url}
                          alt={exec.holder_name || exec.position_name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : initialsOf(exec.holder_name) ? (
                        <span aria-hidden="true">{initialsOf(exec.holder_name)}</span>
                      ) : (
                        <User size={22} strokeWidth={1.5} aria-hidden="true" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-lmsa-700">
                        {exec.position_name}
                      </h3>
                      {exec.holder_name ? (
                        <p className="mt-1 font-serif text-2xl leading-snug text-lmsa-900">
                          {exec.holder_name}
                        </p>
                      ) : (
                        <p className="mt-1 font-serif text-2xl italic leading-snug text-gray-700">
                          To be confirmed
                        </p>
                      )}
                      {exec.bio && (
                        <p className="mt-2 max-w-[42ch] text-[17px] leading-7 text-gray-800">
                          {exec.bio}
                        </p>
                      )}
                      {exec.holder_year_level && (
                        <p className="mt-2 text-[15px] text-gray-700">Year {exec.holder_year_level}</p>
                      )}

                      {/* One route for the whole roster: six identical
                          "sign in to stand" links said nothing an officer list
                          does not already say. Signed-in members get the office
                          they are looking at, opened in the dialog. */}
                      {nominationsOpen && user && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => openDialog(LEADERSHIP_LEVELS[0], exec.position_name)}
                            className="inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                          >
                            <Vote size={16} aria-hidden="true" />
                            Stand for this office
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {nominationsOpen && !user && (
                <p className="reveal-on-scroll mt-12 max-w-[54ch] text-[17px] leading-7 text-gray-800">
                  Nominations are open.{' '}
                  <Link
                    to="/login?next=/leadership%23stand"
                    className="font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700"
                  >
                    Sign in
                  </Link>{' '}
                  to stand for one of these offices.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ---------- The cycle: one field of colour, read as a notice board ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="cycle-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="cycle-title"
              className="max-w-[13ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.045em]"
            >
              Where the ballot stands.
            </h2>
            <p
              className="mt-6 max-w-[34ch] font-serif text-2xl leading-[1.35] text-lmsa-50 md:text-3xl"
              aria-live="polite"
            >
              {statusLine}
            </p>

            {cycleError && (
              <button
                type="button"
                onClick={loadCycle}
                className="mt-7 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-4 transition-colors hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try again
              </button>
            )}
          </div>

          <div className="reveal-on-scroll">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
              {cycleDates.map((date) => (
                <div key={date.term}>
                  <dt className="text-[15px] leading-6 text-lmsa-100">{date.term}</dt>
                  <dd className="mt-1 text-[20px] font-semibold leading-6 text-white">
                    {/* A failed read is not the same claim as "not scheduled". */}
                    {cycleLoading || cycleError ? '—' : date.value || 'Not scheduled'}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 max-w-[52ch] text-[17px] leading-7 text-lmsa-100">
              Nominations are voted on by the general assembly. The window above is the only time an
              application can be filed, so a term starting next year is applied for in this one.
            </p>

            <Link
              to="/about/constitution#elections"
              className="mt-7 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-4 transition-colors hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
            >
              <LinkIcon size={15} aria-hidden="true" />
              Article IV: Elections &amp; Appointments
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- The three routes, with the working photo beside them ---------- */}
      <section id="stand" className="scroll-mt-24 bg-white" aria-labelledby="stand-title">
        <div className="mx-auto grid max-w-7xl gap-x-20 gap-y-24 px-4 pt-20 sm:px-6 md:pt-28 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
            <h2
              id="stand-title"
              className="max-w-[15ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Three ways to serve.
            </h2>
            <p className="mt-5 max-w-[44ch] text-[20px] leading-8 text-gray-700">
              Two of them are on the ballot. The third is appointed from members already doing the
              work.
            </p>

            <figure className="mt-10">
              <img
                src={routesPhoto.src}
                alt="A meeting in progress, with notes on a wall and people working at a table"
                className="aspect-[4/3] w-full rounded-lg object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                Photo: {routesPhoto.credit}
              </figcaption>
            </figure>
          </div>

          <div className="space-y-24">
            {LEADERSHIP_LEVELS.map((level) => {
              const action = actionFor(level, cycleState, user);
              const options =
                level.positionsFrom === 'executive' ? executiveNames : level.positions || [];
              const selected =
                level.positionsFrom === 'executive'
                  ? effectiveExec
                  : level.id === 'class_rep'
                    ? selectedClassRep
                    : null;
              const nominate = action.kind === 'nominate' && Boolean(selected);

              return (
                <article
                  key={level.id}
                  className={`reveal-on-scroll ${
                    level.appointed ? 'bg-paper px-6 py-8 md:px-10 md:py-10' : ''
                  }`}
                >
                  <h3 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-lmsa-900">
                    {level.level}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[17px] leading-7 text-gray-800">
                    {level.summary}
                  </p>

                  <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-3">
                    <div>
                      <dt className="text-[15px] font-semibold text-lmsa-900">Term</dt>
                      <dd className="text-[17px] leading-7 text-gray-800">{level.term}</dd>
                    </div>
                    <div>
                      <dt className="text-[15px] font-semibold text-lmsa-900">Eligibility</dt>
                      <dd className="text-[17px] leading-7 text-gray-800">{level.eligibility}</dd>
                    </div>
                  </dl>

                  {level.appointed && (
                    <p className="mt-5 max-w-[52ch] text-[17px] leading-7 font-semibold text-lmsa-900">
                      Appointed, not elected. Chairs are chosen from committee members.
                    </p>
                  )}

                  {/* The picker only appears when there is something to submit:
                      a select beside a link to the rules was a dead control. */}
                  {nominate && (
                    <>
                      <label
                        htmlFor={`leadership-position-${level.id}`}
                        className="mt-8 block text-[15px] font-semibold text-lmsa-900"
                      >
                        Which office?
                      </label>
                      <select
                        id={`leadership-position-${level.id}`}
                        className="input mt-2 w-full max-w-md"
                        value={selected || ''}
                        onChange={(e) => {
                          if (level.positionsFrom === 'executive') setSelectedExec(e.target.value);
                          else setSelectedClassRep(e.target.value);
                        }}
                      >
                        {options.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  <div className="mt-5">
                    {nominate ? (
                      <button
                        type="button"
                        onClick={() => openDialog(level, selected)}
                        className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                      >
                        {action.label}
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    ) : (
                      <Link
                        to={action.to}
                        className="inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                      >
                        {action.label}
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- How the association is organised ---------- */}
      <section className="mt-20 bg-paper md:mt-28" aria-labelledby="structure-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <h2
            id="structure-title"
            className="reveal-on-scroll max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
          >
            Three bodies, one membership.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {BODIES.map((body, index) => (
              <div
                key={body.name}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <h3 className="max-w-[20ch] text-2xl font-semibold leading-snug tracking-[-0.03em] text-lmsa-900">
                  {body.claim}
                </h3>
                <p className="mt-3 max-w-[36ch] text-[17px] leading-7 text-gray-800">{body.detail}</p>
                <p className="mt-4 text-[15px] font-semibold text-lmsa-700">{body.name}</p>
              </div>
            ))}
          </div>

          <figure className="reveal-on-scroll mt-16">
            <img
              src={assemblyPhoto.src}
              alt="Students working together around a table with laptops"
              className="aspect-[16/9] w-full rounded-lg object-cover md:aspect-[21/9]"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {assemblyPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- Closing action ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="serve-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-16 lg:px-8">
          {/* Copy first in the DOM so a phone reads the heading before the photo
              credit; the picture takes the left column at lg. */}
          <div className="reveal-on-scroll max-w-3xl lg:order-last">
            <h2
              id="serve-title"
              className="text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em]"
            >
              Put your name forward.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              Committee work is the usual first step into responsibility — chairs are chosen from
              members who have already done the work.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/leadership/committees"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Browse the committees
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/leadership/executive-council"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Meet the executive council
              </Link>
            </div>
            <p className="mt-8 max-w-[52ch] text-[17px] leading-7 text-lmsa-100">
              The{' '}
              <Link
                to="/about/constitution"
                className="font-semibold text-white underline decoration-lmsa-400 decoration-2 underline-offset-4 transition-colors hover:decoration-white"
              >
                constitution
              </Link>{' '}
              sets out what each body may decide, how officers are elected, and how chairs are
              appointed.
            </p>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={servicePhoto.src}
              alt="A clinician in a white coat with a stethoscope, looking at a phone"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {servicePhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      <NominationDialog
        isOpen={dialog.open}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        positionName={dialog.positionName}
        levelLabel={dialog.level?.level || ''}
        level={dialog.level?.id || 'executive'}
        cycleLabel={cycleLabel}
        user={user}
      />
    </div>
  );
}
