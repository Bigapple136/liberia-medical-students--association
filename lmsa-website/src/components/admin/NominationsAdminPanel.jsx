import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Check, Loader, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { nominationService } from '@services/nomination.service';

const STATUS_FILTERS = [
  { value: 'pending', label: 'Pending', chip: 'bg-amber-100 text-gray-900 border-amber-400' },
  { value: 'approved', label: 'Approved', chip: 'bg-lmsa-50 text-lmsa-700 border-lmsa-200' },
  { value: 'rejected', label: 'Rejected', chip: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'all', label: 'All', chip: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const LEVEL_LABELS = {
  executive: 'Executive Committee',
  class_rep: 'Class Representative',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Election cycle settings + nomination review.
 *
 * This is what turns "Elections are held annually" into a real process: an
 * admin sets the window, members nominate themselves, and the review happens
 * here. Approving or rejecting emails the nominee best-effort.
 */
export default function NominationsAdminPanel() {
  const [cycleState, setCycleState] = useState(null);
  const [cycleForm, setCycleForm] = useState({
    academic_year: '',
    nomination_opens: '',
    nomination_closes: '',
    election_date: '',
    accepting_nominations: false,
  });
  const [savingCycle, setSavingCycle] = useState(false);

  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [notes, setNotes] = useState({});
  const [savingId, setSavingId] = useState(null);

  const loadCycle = useCallback(async () => {
    try {
      const data = await nominationService.getCycle();
      setCycleState(data);
      if (data?.cycle) {
        setCycleForm({
          academic_year: data.cycle.academic_year || '',
          nomination_opens: data.cycle.nomination_opens || '',
          nomination_closes: data.cycle.nomination_closes || '',
          election_date: data.cycle.election_date || '',
          accepting_nominations: Boolean(data.cycle.accepting_nominations),
        });
      }
    } catch {
      toast.error('Failed to load the election cycle');
    }
  }, []);

  const loadNominations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await nominationService.getAll({
        status: filter === 'all' ? undefined : filter,
      });
      setNominations(data || []);
    } catch {
      setNominations([]);
      toast.error('Failed to load nominations');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadCycle();
  }, [loadCycle]);

  useEffect(() => {
    loadNominations();
  }, [loadNominations]);

  async function handleSaveCycle(e) {
    e.preventDefault();
    if (!cycleForm.academic_year.trim()) {
      toast.error('Academic year is required (e.g. 2026-2027)');
      return;
    }
    setSavingCycle(true);
    try {
      const saved = await nominationService.saveCycle(cycleForm);
      setCycleState(saved);
      toast.success(`Election cycle saved — ${saved.state}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save the election cycle');
    } finally {
      setSavingCycle(false);
    }
  }

  async function handleReview(id, status) {
    setSavingId(id);
    try {
      await nominationService.updateStatus(id, status, notes[id]);
      toast.success(status === 'approved' ? 'Nomination accepted' : 'Nomination rejected');
      setNominations(prev => prev.filter(n => n.id !== id));
      setNotes(prev => ({ ...prev, [id]: undefined }));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update nomination');
    } finally {
      setSavingId(null);
    }
  }

  const counts = nominations.reduce(
    (acc, n) => ({ ...acc, [n.status]: (acc[n.status] || 0) + 1 }),
    {}
  );

  return (
    <div className="space-y-6">
      {/* ── Election cycle ─────────────────────────────────────────────── */}
      <form onSubmit={handleSaveCycle} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-lmsa-50 flex items-center justify-center">
              <CalendarDays size={17} className="text-lmsa-700" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Election cycle</h2>
              <p className="text-sm text-gray-500">
                {cycleState ? `${cycleState.state} — ${cycleState.message}` : 'No cycle configured'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadCycle}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label htmlFor="cycle-year">Academic year</Label>
            <input
              id="cycle-year"
              className="input"
              value={cycleForm.academic_year}
              onChange={e => setCycleForm(f => ({ ...f, academic_year: e.target.value }))}
              placeholder="2026-2027"
            />
          </div>
          <div>
            <Label htmlFor="cycle-opens">Nominations open</Label>
            <input
              id="cycle-opens"
              type="date"
              className="input"
              value={cycleForm.nomination_opens}
              onChange={e => setCycleForm(f => ({ ...f, nomination_opens: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cycle-closes">Nominations close</Label>
            <input
              id="cycle-closes"
              type="date"
              className="input"
              value={cycleForm.nomination_closes}
              onChange={e => setCycleForm(f => ({ ...f, nomination_closes: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cycle-election">Election date</Label>
            <input
              id="cycle-election"
              type="date"
              className="input"
              value={cycleForm.election_date}
              onChange={e => setCycleForm(f => ({ ...f, election_date: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-lmsa-600 focus:ring-lmsa-500"
              checked={cycleForm.accepting_nominations}
              onChange={e => setCycleForm(f => ({ ...f, accepting_nominations: e.target.checked }))}
            />
            Accepting nominations
          </label>
          <button
            type="submit"
            disabled={savingCycle}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 disabled:opacity-50"
          >
            {savingCycle ? <Loader size={14} className="animate-spin" /> : null}
            Save cycle
          </button>
          <p className="text-xs text-gray-500">
            Nominations are rejected outside the open date range even when this is checked.
          </p>
        </div>
      </form>

      {/* ── Review ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(s => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              filter === s.value
                ? `${s.chip} border-current`
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s.label}
            {s.value !== 'all' && counts[s.value] ? ` (${counts[s.value]})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader className="animate-spin text-lmsa-600" size={24} aria-label="Loading nominations" />
        </div>
      ) : nominations.length === 0 ? (
        <p className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500">
          No {filter === 'all' ? '' : filter} nominations.
        </p>
      ) : (
        <div className="space-y-3">
          {nominations.map(n => (
            <article key={n.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-lmsa-700">
                    {LEVEL_LABELS[n.level] || n.level}
                  </p>
                  <h3 className="mt-1 font-bold text-gray-900">{n.position_name}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {n.nominee_name || 'Unknown member'}
                    {n.nominee_email ? ` · ${n.nominee_email}` : ''}
                    {n.nominee_year_level ? ` · Year ${n.nominee_year_level}` : ''}
                    {n.nominee_student_id ? ` · ${n.nominee_student_id}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Submitted {formatDate((n.submitted_at || '').split('T')[0])}
                    {n.cycle_id && cycleState?.cycle?.id === n.cycle_id
                      ? ` · ${cycleState.cycle.academic_year}`
                      : ''}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    n.status === 'approved'
                      ? 'bg-lmsa-50 text-lmsa-700 border-lmsa-200'
                      : n.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-100 text-gray-900 border-amber-400'
                  }`}
                >
                  {n.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-700 whitespace-pre-line">
                {n.statement}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  className="input flex-1 min-w-[220px]"
                  placeholder="Reviewer notes (sent to the nominee)"
                  value={notes[n.id] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [n.id]: e.target.value }))}
                  aria-label={`Reviewer notes for ${n.position_name}`}
                />
                <button
                  type="button"
                  onClick={() => handleReview(n.id, 'approved')}
                  disabled={savingId === n.id}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 disabled:opacity-50"
                >
                  <Check size={13} /> Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleReview(n.id, 'rejected')}
                  disabled={savingId === n.id}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                >
                  <X size={13} /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
    </label>
  );
}
