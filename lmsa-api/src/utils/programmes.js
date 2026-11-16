import { supabase } from '../config/supabase.js';
import { generateSlug } from './helpers.js';

// ─── Derived programme state ─────────────────────────────────────────────────
// A programme stores only draft/published. Whether it is running, upcoming,
// finished or still undated is read off its sessions every time it is asked
// for, so the page cannot claim a programme is still running weeks after its
// last session ended because nobody remembered to change a label.
//
// `sessions` are the programme's own event rows. Cancelled sessions are
// ignored: a cancelled session must not keep a programme "upcoming", and it
// must not make it "running" either.
export const deriveProgrammeState = (sessions = [], now = Date.now()) => {
  const live = (sessions || []).filter((session) => session.status !== 'cancelled');
  if (!live.length) return 'announced';

  const bounds = live.map((session) => {
    const start = new Date(session.start_datetime).getTime();
    const end = session.end_datetime ? new Date(session.end_datetime).getTime() : start;
    return { start, end: Number.isNaN(end) ? start : end };
  });

  // "Running now" means now falls inside a session — not between two of them.
  // A programme with a session in March and another in April is not running
  // during the quiet weeks in between.
  if (bounds.some(({ start, end }) => start <= now && now <= end)) return 'running';
  if (bounds.some(({ start }) => start > now)) return 'upcoming';
  return 'finished';
};

// Used wherever a route accepts an id or a slug and needs to tell them apart:
// a uuid is an id, anything else can only be a slug.
export const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value ?? ''));

// End of a session as milliseconds, used to split sessions into what is still
// ahead of a visitor and what has already happened.
export const sessionEndTime = (session) => {
  const start = new Date(session.start_datetime).getTime();
  const end = session.end_datetime ? new Date(session.end_datetime).getTime() : start;
  return Number.isNaN(end) ? start : end;
};

// Public reading order: what is happening now, then what is coming, then what
// has no dates yet, then what is over. `sort_order` breaks ties so a committee
// can lead the section with its flagship programme.
export const PROGRAMME_STATE_ORDER = {
  running: 0,
  upcoming: 1,
  announced: 2,
  finished: 3,
};

export const compareProgrammes = (a, b) => {
  const byState =
    (PROGRAMME_STATE_ORDER[a.state] ?? 9) - (PROGRAMME_STATE_ORDER[b.state] ?? 9);
  if (byState !== 0) return byState;

  const byOrder = (a.sort_order ?? 0) - (b.sort_order ?? 0);
  if (byOrder !== 0) return byOrder;

  return String(a.name ?? '').localeCompare(String(b.name ?? ''));
};

// ─── Assignment rules for events ─────────────────────────────────────────────
// An event may belong to a programme only if the programme belongs to the same
// committee. Enforced here rather than in SQL because the caller needs a
// readable 400, and because both event endpoints and the committee's own event
// creation go through it.
//
// A falsy programmeId (null, undefined, '') means "no programme", which is the
// normal case: most events are one-offs.
export const resolveProgrammeAssignment = async (programmeId, committeeId) => {
  if (!programmeId) return { programmeId: null, error: null };

  if (!committeeId) {
    return {
      programmeId: null,
      error: 'Choose a committee before choosing a programme',
    };
  }

  const { data: programme, error } = await supabase
    .from('committee_programmes')
    .select('id, committee_id')
    .eq('id', programmeId)
    .maybeSingle();

  if (error || !programme) {
    return { programmeId: null, error: 'Programme not found' };
  }

  if (programme.committee_id !== committeeId) {
    return {
      programmeId: null,
      error: 'That programme belongs to a different committee',
    };
  }

  return { programmeId: programme.id, error: null };
};

// Slugs are unique per committee. Two programmes named "First Aid" and
// "First-Aid" normalise to the same slug, so the second one gets a suffix
// instead of failing the insert on a constraint no one can explain.
export const uniqueProgrammeSlug = async (committeeId, name, excludeId = null) => {
  const base = generateSlug(String(name ?? '')) || 'programme';

  const { data } = await supabase
    .from('committee_programmes')
    .select('id, slug')
    .eq('committee_id', committeeId);

  const taken = new Set(
    (data || [])
      .filter((row) => row.id !== excludeId)
      .map((row) => row.slug)
  );

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
};
