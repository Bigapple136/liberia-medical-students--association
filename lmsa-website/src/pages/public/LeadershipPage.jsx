import { useEffect, useState } from 'react';
import { Crown, Loader, User, Link as LinkIcon, Vote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';
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

const FALLBACK_EXECUTIVES = [
  { position_name: 'President', position_rank: 1, holder_name: 'Student Name', holder_photo_url: null, bio: 'Final year medical student passionate about student advocacy' },
  { position_name: 'Vice President', position_rank: 2, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fourth year student focused on academic excellence' },
  { position_name: 'General Secretary', position_rank: 3, holder_name: 'Student Name', holder_photo_url: null, bio: 'Third year student ensuring transparent communication' },
  { position_name: 'Financial Secretary', position_rank: 4, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fourth year student managing association finances' },
  { position_name: 'Public Relations Officer', position_rank: 5, holder_name: 'Student Name', holder_photo_url: null, bio: 'Second year student building our public presence' },
  { position_name: 'Academic Director', position_rank: 6, holder_name: 'Student Name', holder_photo_url: null, bio: 'Fifth year student leading academic initiatives' },
];

const STATE_STYLES = {
  open: 'border-lmsa-300 bg-lmsa-50 text-lmsa-800',
  scheduled: 'border-amber-400 bg-amber-100 text-gray-900',
  closed: 'border-gray-300 bg-gray-50 text-gray-700',
  none: 'border-gray-300 bg-gray-50 text-gray-700',
};

const STATE_LABELS = {
  open: 'Nominations open',
  scheduled: 'Scheduled',
  closed: 'Nominations closed',
  none: 'Not scheduled',
};

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

export default function LeadershipPage() {
  const { user } = useAuth() || {};
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  async function loadExecutives() {
    setLoading(true);
    try {
      const data = await executiveService.getAll();
      if (data && data.length > 0) {
        setExecutives(data);
      } else {
        setExecutives(FALLBACK_EXECUTIVES);
      }
    } catch {
      setError(true);
      setExecutives(FALLBACK_EXECUTIVES);
    } finally {
      setLoading(false);
    }
  }

  async function loadCycle() {
    setCycleLoading(true);
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
  const cycleYear = cycleState?.cycle?.academic_year || currentYear;
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

  function openDialog(level, positionName) {
    setDialog({ open: true, level, positionName });
  }

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Leadership"
              title="Leadership is service made visible."
              description="Meet the students and officers turning shared priorities into action — and see how to put your own name forward."
            />
            <div className="editorial-prose">
              <p>
                LMSA leadership is a chance to practice listening, responsibility, and
                follow-through while helping the association serve its members well.
              </p>
              <div className="editorial-stat-grid mt-8">
                <EditorialStat value={currentYear} label="Academic year" />
                <EditorialStat value={executives.length || '—'} label="Leadership roles" />
                <EditorialStat
                  value={
                    cycleLoading || cycleError
                      ? '—'
                      : nominationsOpen
                        ? 'Open'
                        : STATE_LABELS[cycleState?.state] || 'Closed'
                  }
                  label="Nominations"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow={`Executive committee / ${currentYear}`}
            title="The students carrying the work forward."
            description="Leadership changes each year, but the responsibility to represent peers thoughtfully remains."
          />
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader className="animate-spin text-lmsa-600" size={28} aria-label="Loading leadership" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {executives.map((exec, index) => (
                <article key={exec.id || index} className="flex flex-col border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-lmsa-50 text-lmsa-700">
                      {exec.holder_photo_url ? (
                        <img src={exec.holder_photo_url} alt={exec.holder_name || exec.position_name} className="h-full w-full object-cover" />
                      ) : (
                        <User size={29} strokeWidth={1.4} />
                      )}
                    </div>
                    {exec.position_rank <= 2 && <Crown size={18} className="text-amber-500" aria-label="Senior executive role" />}
                  </div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">{exec.position_name}</p>
                  <h3 className="mt-2 text-xl font-semibold text-lmsa-900">{exec.holder_name || 'Position Available'}</h3>
                  {exec.bio && <p className="mt-3 text-sm leading-6 text-gray-600">{exec.bio}</p>}
                  {exec.holder_year_level && <p className="mt-4 text-xs text-gray-500">Year {exec.holder_year_level}</p>}
                  {error && <p className="mt-4 text-xs text-amber-600">Using placeholder data</p>}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    {nominationsOpen ? (
                      user ? (
                        <button
                          type="button"
                          onClick={() => openDialog(LEADERSHIP_LEVELS[0], exec.position_name)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-lmsa-700 hover:text-lmsa-900"
                        >
                          <Vote size={15} />
                          Stand for this role
                        </button>
                      ) : (
                        <Link
                          to="/login?next=/leadership%23stand"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-lmsa-700 hover:text-lmsa-900"
                        >
                          <Vote size={15} />
                          Sign in to stand for this role
                        </Link>
                      )
                    ) : (
                      <p className="text-xs text-gray-500">
                        Elected in the {cycleYear} election. Nominations open with the next cycle.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="How the work is organized" title="A shared structure keeps leadership accountable." description="Different bodies carry different responsibilities, but each one exists to keep members represented and the work moving." />
            <div className="editorial-timeline">
              <article className="editorial-timeline-item">
                <span className="editorial-timeline-year">01 / General assembly</span>
                <h3>The members decide.</h3>
                <p>The supreme decision-making body comprising all registered members.</p>
              </article>
              <article className="editorial-timeline-item">
                <span className="editorial-timeline-year">02 / Executive committee</span>
                <h3>The officers deliver.</h3>
                <p>Elected officers responsible for day-to-day operations and representation.</p>
              </article>
              <article className="editorial-timeline-item">
                <span className="editorial-timeline-year">03 / Standing committees</span>
                <h3>The teams deepen the work.</h3>
                <p>Academic, Finance, Welfare, Events, and Public Relations teams focused on specific priorities.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How to stand: the merged pathway section ─────────────────────── */}
      <section id="stand" className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow={`How to stand / ${cycleYear}`}
            title="There are three ways in, and two of them are on the ballot."
            description="Executive officers and class representatives are elected by the general assembly. Committee chairs are appointed from members already doing the work."
          />

          <div className={`editorial-panel ${STATE_STYLES[cycleState?.state] || STATE_STYLES.none}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em]">
                  {cycleLoading ? 'Election cycle' : STATE_LABELS[cycleState?.state] || 'Not scheduled'}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {cycleError
                    ? 'Election dates could not be loaded right now — check back shortly.'
                    : cycleMessage(cycleState)}
                </p>
              </div>
              <Link
                to="/about/constitution#elections"
                className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-2 underline-offset-4"
              >
                <LinkIcon size={15} />
                Article IV: Elections &amp; Appointments
              </Link>
            </div>
            <dl className="editorial-panel-grid">
              <div>
                <dt>Nominations open</dt>
                <dd>{formatDate(cycleState?.cycle?.nomination_opens) || '—'}</dd>
              </div>
              <div>
                <dt>Nominations close</dt>
                <dd>{formatDate(cycleState?.cycle?.nomination_closes) || '—'}</dd>
              </div>
              <div>
                <dt>Election date</dt>
                <dd>{formatDate(cycleState?.cycle?.election_date) || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {LEADERSHIP_LEVELS.map(level => {
              const action = actionFor(level, cycleState, user);
              const options =
                level.positionsFrom === 'executive' ? executiveNames : level.positions || [];
              const selected =
                level.positionsFrom === 'executive'
                  ? effectiveExec
                  : level.id === 'class_rep'
                    ? selectedClassRep
                    : null;

              return (
                <article key={level.id} className="flex flex-col border border-gray-200 bg-white p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">{level.level}</p>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{level.summary}</p>

                  <dl className="mt-6 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-lmsa-900">Term:</dt>
                      <dd className="text-gray-600">{level.term}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-lmsa-900">Eligibility:</dt>
                      <dd className="text-gray-600">{level.eligibility}</dd>
                    </div>
                  </dl>

                  {level.appointed && (
                    <p className="mt-6 border-l-2 border-amber-400 bg-amber-100 p-3 text-xs leading-5 text-gray-800">
                      Appointed, not elected. Chairs are chosen from committee members.
                    </p>
                  )}

                  <div className="mt-auto pt-8">
                    {level.nominable && options.length > 0 && (
                      <>
                        <label
                          htmlFor={`leadership-position-${level.id}`}
                          className="mb-2 block text-sm font-semibold text-lmsa-900"
                        >
                          Position
                        </label>
                        <select
                          id={`leadership-position-${level.id}`}
                          className="input"
                          value={selected || ''}
                          onChange={e => {
                            if (level.positionsFrom === 'executive') setSelectedExec(e.target.value);
                            else setSelectedClassRep(e.target.value);
                          }}
                        >
                          {options.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </>
                    )}

                    {action.kind === 'nominate' ? (
                      <button
                        type="button"
                        onClick={() => openDialog(level, selected)}
                        disabled={!selected}
                        className="btn mt-4 flex w-full items-center justify-center gap-2 bg-lmsa-700 text-white hover:bg-lmsa-800 focus-visible:ring-lmsa-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {action.label}
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <Link
                        to={action.to}
                        className="btn mt-4 flex w-full items-center justify-center gap-2 border-2 border-lmsa-700 text-lmsa-700 hover:bg-lmsa-50 focus-visible:ring-lmsa-700"
                      >
                        {action.label}
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow={nominationsOpen ? `Nominations open / ${cycleYear}` : 'Your turn to lead'}
            title={
              nominationsOpen
                ? 'Nominations are open right now. Put your name forward before the window closes.'
                : 'Elections are held annually. Start by finding the work that matters to you.'
            }
            description={
              nominationsOpen
                ? cycleMessage(cycleState)
                : 'Committees are a practical first step into meaningful responsibility and student service.'
            }
            action={
              nominationsOpen
                ? { label: 'See how to stand', to: '/leadership#stand' }
                : { label: 'Explore committees', to: '/leadership/committees' }
            }
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Read the{' '}
            <Link to="/about/constitution#elections" className="font-semibold text-lmsa-700 hover:text-lmsa-900">
              constitution and election rules
            </Link>{' '}
            or meet the{' '}
            <Link to="/leadership/executive-council" className="font-semibold text-lmsa-700 hover:text-lmsa-900">
              wider executive council
            </Link>
            .
          </p>
        </div>
      </section>

      <NominationDialog
        isOpen={dialog.open}
        onClose={() => setDialog(d => ({ ...d, open: false }))}
        positionName={dialog.positionName}
        levelLabel={dialog.level?.level || ''}
        level={dialog.level?.id || 'executive'}
        cycleLabel={cycleLabel}
        user={user}
      />
    </main>
  );
}
