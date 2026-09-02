import { useEffect, useRef, useState } from 'react';
import { X, Loader, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { nominationService } from '@services/nomination.service';

/**
 * Expression-of-interest dialog for a leadership position.
 *
 * 409 is the expected response when the window has closed between page load and
 * submit, so it is surfaced as the server's own message rather than a generic
 * failure. The statement survives every error path.
 */
export default function NominationDialog({
  isOpen,
  onClose,
  positionName,
  levelLabel,
  level,
  cycleLabel,
  user,
}) {
  const [statement, setStatement] = useState('');
  const [phone, setPhone] = useState('');
  const [yearLevel, setYearLevel] = useState(user?.year_level || '');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    setStatement('');
    setPhone(user?.phone || '');
    setYearLevel(user?.year_level || '');
    setServerError(null);
    setSubmitted(false);
    const timer = setTimeout(() => textareaRef.current?.focus(), 60);

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, user]);

  if (!isOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!statement.trim() || submitting) return;

    setSubmitting(true);
    setServerError(null);

    try {
      await nominationService.nominate({
        position_name: positionName,
        level,
        statement,
        year_level: yearLevel,
        phone,
      });
      setSubmitted(true);
      toast.success(`Nomination for ${positionName} submitted`);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-lmsa-950/60 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nomination-dialog-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">
              {levelLabel}
            </p>
            <h2 id="nomination-dialog-title" className="mt-2 text-2xl font-semibold text-lmsa-900">
              {positionName}
            </h2>
            {cycleLabel && <p className="mt-1 text-sm text-gray-500">{cycleLabel}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-lmsa-900"
            aria-label="Close nomination form"
          >
            <X size={22} />
          </button>
        </div>

        {submitted ? (
          <div className="mt-8">
            <div className="border-l-4 border-lmsa-600 bg-lmsa-50 p-5">
              <p className="text-sm font-semibold text-lmsa-900">Nomination received.</p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Your nomination for {positionName} is now pending review. We&apos;ll
                contact you on the email tied to your membership.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn bg-lmsa-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-lmsa-800 focus-visible:ring-lmsa-700"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="nomination-statement" className="mb-2 block text-sm font-semibold text-lmsa-900">
                Why are you standing? <span className="text-red-600">*</span>
              </label>
              <textarea
                id="nomination-statement"
                ref={textareaRef}
                rows={6}
                value={statement}
                onChange={e => setStatement(e.target.value)}
                className="input"
                placeholder="Tell members what you want to do in this role and why you're the person for it."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="nomination-year-level" className="mb-2 block text-sm font-semibold text-lmsa-900">
                  Year level
                </label>
                <input
                  id="nomination-year-level"
                  type="text"
                  value={yearLevel}
                  onChange={e => setYearLevel(e.target.value)}
                  className="input"
                  placeholder="e.g. Year 3"
                />
              </div>
              <div>
                <label htmlFor="nomination-phone" className="mb-2 block text-sm font-semibold text-lmsa-900">
                  Phone (optional)
                </label>
                <input
                  id="nomination-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input"
                  placeholder="+231 …"
                />
              </div>
            </div>

            {serverError && (
              <p role="alert" className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">
                {serverError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={submitting || !statement.trim()}
                className="btn bg-lmsa-700 text-white hover:bg-lmsa-800 focus-visible:ring-lmsa-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit nomination
                  </>
                )}
              </button>
              <button type="button" onClick={onClose} className="btn border-2 border-lmsa-700 px-4 py-2.5 text-sm font-medium text-lmsa-700 hover:bg-lmsa-50 focus-visible:ring-lmsa-700">
                Cancel
              </button>
            </div>

            <p className="text-xs leading-5 text-gray-500">
              Submitting as{' '}
              <span className="font-semibold text-gray-700">{user?.full_name || 'you'}</span>
              {user?.email ? ` (${user.email})` : ''}. One open nomination per position.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
