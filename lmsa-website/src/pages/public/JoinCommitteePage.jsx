import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import { committeeService } from '@services/committee.service';
import { useAuth } from '@context/AuthContext';
import {
  committeeFallbackList,
  formatDeadline,
  getCommitteeVisual,
  hasDeadlinePassed,
  isAcceptingApplications,
} from '@config/committees';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';

const benefits = [
  { title: 'Hands-on experience', description: 'Gain practical experience in your area of interest.' },
  { title: 'Learn from leaders', description: 'Work closely with experienced medical professionals.' },
  { title: 'Develop skills', description: 'Build project management and leadership capabilities.' },
  { title: 'Expand your network', description: 'Connect with peers, faculty, and healthcare leaders.' },
  { title: 'Make an impact', description: 'Contribute to meaningful healthcare initiatives.' },
  { title: 'Boost your CV', description: 'Enhance your resume with leadership experience.' },
];

const faqs = [
  ['Who can join a committee?', 'All active LMSA members in good standing are eligible to apply for committee positions.'],
  ['How long is the commitment?', 'Committee members are appointed annually. You can reapply each year or choose to step down.'],
  ['Can I join multiple committees?', 'We recommend joining one committee to ensure focused contributions, but exceptions can be made.'],
  ['What is the time commitment?', 'Most committees meet monthly and work on projects throughout the academic year. Expect 3-5 hours per month.'],
];

const steps = [
  { title: 'Apply', description: 'Tell us which committee interests you and why.' },
  { title: 'Review', description: 'The committee reads every application after the window closes.' },
  { title: 'Interview', description: 'A short conversation, only where the committee needs one.' },
  { title: 'Join', description: 'Successful applicants are seated and begin committee work.' },
];

const YEAR_LEVELS = ['Pre-clinical 1', 'Pre-clinical 2', 'Clinical 1', 'Clinical 2', 'Clinical 3', 'Final year', 'Graduate / Alumni'];

export default function JoinCommitteePage() {
  const { user } = useAuth();
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [applied, setApplied] = useState([]);
  const [applyingTo, setApplyingTo] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await committeeService.getAll();
      setCommittees(Array.isArray(data) ? data : []);
      setOffline(false);
    } catch {
      // API unreachable: show the committee list with no recruitment window
      // rather than a fabricated deadline. Live openings need the database.
      setCommittees(committeeFallbackList);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCommittees = useMemo(() => committees.filter(isAcceptingApplications), [committees]);

  const totalOpenings = useMemo(
    () => openCommittees.reduce((sum, c) => sum + (Number(c.openings) || 0), 0),
    [openCommittees]
  );

  const sharedDeadline = useMemo(() => {
    const deadlines = [...new Set(openCommittees.map(c => c.application_deadline).filter(Boolean))];
    return deadlines.length === 1 ? deadlines[0] : null;
  }, [openCommittees]);

  const activeCommittee = applyingTo ? committees.find(c => c.id === applyingTo) : null;

  return (
    <div className="editorial-page join-committee-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Get involved / Join a committee"
              title="You do not need to wait for a title to start doing meaningful work."
              description="Committees are where LMSA’s mission becomes practical: one project, one conversation, and one contribution at a time."
            />
            <div className="editorial-prose">
              <p>Choose a committee where your interests can strengthen student welfare, academics, advocacy, service, or connection.</p>
              <div className="editorial-stat-grid editorial-stat-grid-two mt-8">
                {loading ? (
                  <>
                    <EditorialStat value="—" label="Committees recruiting" />
                    <EditorialStat value="—" label="Open positions" />
                  </>
                ) : (
                  <>
                    <EditorialStat value={String(openCommittees.length)} label="Committees recruiting" />
                    <EditorialStat
                      value={totalOpenings > 0 ? String(totalOpenings) : openCommittees.length > 0 ? 'Open' : '0'}
                      label="Open positions"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow={openCommittees.length ? 'Applications open' : 'Applications closed'}
            title="Find the committee that fits your interests."
            description={
              openCommittees.length === 0
                ? 'No committee is recruiting right now. Everything else you need to know is still here — including when to look again.'
                : sharedDeadline
                  ? `Applications close ${formatDeadline(sharedDeadline)}. Read each focus area, then choose where you want to contribute.`
                  : 'Each committee lists its own closing date. Read each focus area, then choose where you want to contribute.'
            }
          />

          {offline && (
            <p className="committee-notice">
              <AlertCircle size={17} aria-hidden="true" />
              <span>
                Committee openings are not loading right now, so no recruitment window is shown. The list below is still
                accurate — try again shortly, or write to us directly.
              </span>
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <div key={index} className="committee-card committee-card-skeleton" aria-hidden="true" />)
              : committees.map(committee => (
                  <CommitteeCard
                    key={committee.id}
                    committee={committee}
                    user={user}
                    applied={applied.includes(committee.id)}
                    onApply={() => setApplyingTo(committee.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Why join a committee?"
            title="Small teams are where confidence becomes capability."
            description="Committee work gives you a place to practice skills while making a visible contribution to the association."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(benefit => (
              <article key={benefit.title} className="border-t border-gray-200 pt-5">
                <h3 className="mt-2 text-xl font-semibold text-lmsa-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="The application process"
            title="Four steps from interest to impact."
            description="The process is designed to help you find a good fit and start with clarity."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step.title} className="border border-gray-200 bg-white p-5">
                <span className="text-3xl font-semibold tracking-[-0.05em] text-lmsa-700">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-8 text-xl font-semibold text-lmsa-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Questions, answered"
            title="Before you apply."
            description="A few practical details about committee membership."
          />
          <dl className="editorial-article-list">
            {faqs.map(([question, answer]) => (
              <div key={question} className="editorial-article-row">
                <dt className="font-semibold text-lmsa-900">{question}</dt>
                <dd>{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Find your place in the work"
            title="A committee is a practical first step into LMSA leadership."
            description={
              openCommittees.length
                ? 'Choose a focus area above and send in your application — it takes about two minutes.'
                : 'Nothing is recruiting today. Write to us and we will tell you when the next round opens.'
            }
            action={{ label: 'Contact LMSA', to: '/contact?topic=committees' }}
          />
        </div>
      </section>

      {activeCommittee && (
        <ApplyDialog
          committee={activeCommittee}
          onClose={() => setApplyingTo(null)}
          onSubmitted={id => setApplied(prev => (prev.includes(id) ? prev : [...prev, id]))}
        />
      )}
    </div>
  );
}

// ─── Committee card ───────────────────────────────────────────────────────────
function CommitteeCard({ committee, user, applied, onApply }) {
  const { icon: Icon, focus } = getCommitteeVisual(committee.slug);
  const open = isAcceptingApplications(committee);
  const expired = hasDeadlinePassed(committee);
  const deadline = formatDeadline(committee.application_deadline);
  const full = open && Number(committee.openings) > 0 && Number(committee.openings) <= 0;

  return (
    <article className={`committee-card ${open ? 'committee-card-open' : ''}`}>
      <span className="editorial-link-card-icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.5} />
      </span>

      <div>
        <h3 className="mt-7 text-lg font-semibold text-lmsa-900">{committee.name}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">{committee.description || focus}</p>
      </div>

      <div className="committee-card-state">
        {open && !applied && (
          <>
            <span className="font-bold uppercase tracking-[0.12em] text-lmsa-700">
              {Number(committee.openings) > 0 ? `${committee.openings} openings` : 'Open recruitment'}
            </span>
            <span className="text-gray-500">{deadline ? `Closes ${deadline}` : 'No closing date'}</span>
          </>
        )}
        {open && applied && (
          <>
            <span className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.12em] text-lmsa-700">
              <CheckCircle2 size={15} aria-hidden="true" />
              Application received
            </span>
            <span className="text-gray-500">Pending review</span>
          </>
        )}
        {!open && expired && (
          <>
            <span className="font-bold uppercase tracking-[0.12em] text-gray-700">Applications closed</span>
            <span className="text-gray-500">Closed {deadline}</span>
          </>
        )}
        {!open && !expired && !full && (
          <>
            <span className="font-bold uppercase tracking-[0.12em] text-gray-700">Not recruiting</span>
            <span className="text-gray-500">Check back soon</span>
          </>
        )}
        {full && (
          <>
            <span className="font-bold uppercase tracking-[0.12em] text-gray-700">All positions filled</span>
            <span className="text-gray-500">Check back next round</span>
          </>
        )}
      </div>

      <div className="committee-card-actions">
        {open && !applied ? (
          user ? (
            <button type="button" className="committee-apply-button" onClick={onApply}>
              Apply now
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <Link to="/login" className="committee-apply-button">
              Log in to apply
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )
        ) : (
          <Link to={`/leadership/committees/${committee.slug}`} className="committee-detail-link">
            What this committee does
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
        {open && !applied && (
          <Link to={`/leadership/committees/${committee.slug}`} className="committee-detail-link">
            Read more first
          </Link>
        )}
      </div>
    </article>
  );
}

// ─── Apply dialog ─────────────────────────────────────────────────────────────
function ApplyDialog({ committee, onClose, onSubmitted }) {
  const [statement, setStatement] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const textareaRef = useRef(null);
  const titleId = 'committee-apply-title';
  const errorId = 'committee-apply-error';

  useEffect(() => {
    textareaRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event) {
      if (event.key === 'Escape' && !submitting) onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, submitting]);

  const deadline = formatDeadline(committee.application_deadline);

  async function handleSubmit(event) {
    event.preventDefault();
    if (statement.trim().length === 0) {
      setError('Tell us why you want to join — a short statement is required.');
      textareaRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await committeeService.applyToCommittee(committee.slug, {
        statement: statement.trim(),
        year_level: yearLevel || null,
        phone: phone.trim() || null,
      });
      setDone(true);
      onSubmitted?.(committee.id);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'We could not send your application just now. Your answers are still here — try again in a moment.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="committee-dialog-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div className="committee-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="committee-dialog-head">
          <div>
            <p className="editorial-overline">Apply to {committee.name}</p>
            <h2 id={titleId} className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">
              {done ? 'Your application is in' : 'Tell the committee about you'}
            </h2>
          </div>
          <button type="button" className="committee-dialog-close" onClick={onClose} aria-label="Close application form">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        {done ? (
          <div className="committee-dialog-body">
            <p className="text-sm leading-7 text-gray-700">
              Your application to <strong className="font-semibold text-lmsa-900">{committee.name}</strong> has been
              received. The committee reviews applications
              {deadline ? ` after ${deadline}` : ''} and will be in touch by email.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-700">
              Meanwhile, you can read more about the committee’s work or apply to another one.
            </p>
            <div className="committee-dialog-actions">
              <Link to={`/leadership/committees/${committee.slug}`} className="committee-apply-button">
                See the committee’s work
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <button type="button" className="committee-dialog-secondary" onClick={onClose}>
                Back to committees
              </button>
            </div>
          </div>
        ) : (
          <form className="committee-dialog-body" onSubmit={handleSubmit} noValidate>
            <label className="committee-field">
              <span>Why this committee?</span>
              <textarea
                ref={textareaRef}
                rows={5}
                value={statement}
                maxLength={2000}
                onChange={event => setStatement(event.target.value)}
                placeholder="What draws you to this work, and what would you want to help build?"
                aria-describedby={error ? errorId : undefined}
              />
              <small>{statement.length} / 2000</small>
            </label>

            <div className="committee-field-row">
              <label className="committee-field">
                <span>Year level (optional)</span>
                <select value={yearLevel} onChange={event => setYearLevel(event.target.value)}>
                  <option value="">Prefer not to say</option>
                  {YEAR_LEVELS.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="committee-field">
                <span>Phone (optional)</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder="+231 …"
                  autoComplete="tel"
                />
              </label>
            </div>

            {error && (
              <p id={errorId} className="committee-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}

            <div className="committee-dialog-actions">
              <button type="submit" className="committee-apply-button" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send application
                    <ArrowRight size={15} aria-hidden="true" />
                  </>
                )}
              </button>
              <button type="button" className="committee-dialog-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
