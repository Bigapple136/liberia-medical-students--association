/**
 * Leadership levels, and where the position names come from.
 *
 * The critique of this page found two problems this file exists to prevent:
 * the executive titles were hardcoded (while `/leadership` rendered the real
 * ones from `executiveService`), and "Committee Chairs" — an appointment —
 * was listed among the things a member can pursue.
 *
 * So: executive positions come from the database, class-representative roles
 * stay here because nothing models per-class roles yet, and committee chairs
 * are labelled as appointed with no nomination action.
 */

export const LEADERSHIP_LEVELS = [
  {
    id: 'executive',
    level: 'Executive Committee',
    term: '1 year',
    eligibility: 'Full members in good standing',
    summary:
      'Elected officers who run the association day to day and represent it outwardly. Nominations are voted on by the general assembly.',
    nominable: true,
    positionsFrom: 'executive',
  },
  {
    id: 'class_rep',
    level: 'Class Representatives',
    term: '1 year',
    eligibility: 'All medical students',
    summary:
      'Represent your class, carry its concerns to the executive committee, and organise around the things your year needs.',
    nominable: true,
    positions: ['Class President', 'Assistant Class President'],
  },
  {
    id: 'committee_chair',
    level: 'Committee Chairs',
    term: '1 year',
    eligibility: 'Appointed by the Executive Committee',
    summary:
      'Chairs are appointed rather than elected. Committee work is the usual route here — chairs are chosen from members who have already done the work.',
    nominable: false,
    appointed: true,
    positions: ['Committee Chairperson', 'Deputy Chairperson'],
  },
];

export const BENEFITS = [
  'Develop essential leadership skills',
  'Build your professional network',
  'Make meaningful organizational impact',
  'Enhance your CV/resume',
  'Gain event planning experience',
  'Learn conflict resolution',
  'Improve public speaking abilities',
  'Prepare for future medical leadership',
];

/** Roles a member can stand for as a class representative. */
export const CLASS_REP_ROLES = LEADERSHIP_LEVELS.find(l => l.id === 'class_rep').positions;

/** Distinct, ranked executive position names from the API's executive list. */
export function executivePositionNames(executives = []) {
  const seen = new Map();
  for (const exec of executives) {
    const name = exec?.position_name;
    if (!name) continue;
    const rank = Number(exec.position_rank) || 999;
    if (!seen.has(name) || seen.get(name) > rank) seen.set(name, rank);
  }
  return [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([name]) => name);
}

/** Human-readable window line for a cycle, e.g. "Nominations close 30 April 2027". */
export function formatDate(date) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function cycleMessage(cycleState) {
  if (!cycleState) return 'Election dates are published as soon as the next cycle is scheduled.';

  const { state, cycle, message } = cycleState;
  if (state === 'open') {
    const closes = formatDate(cycle?.nomination_closes);
    return closes
      ? `Nominations are open until ${closes}.`
      : 'Nominations are open.';
  }
  if (state === 'scheduled') {
    return message ? `${message}.` : 'Nominations have not opened yet.';
  }
  return 'Nominations are closed.';
}
