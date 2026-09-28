import {
  BookOpen,
  DollarSign,
  FileText,
  Globe,
  Heart,
  HeartHandshake,
  Megaphone,
  Scale,
  Trophy,
  UserPlus,
  Users,
  Utensils,
} from 'lucide-react';

/**
 * One committee list, two pages.
 *
 * `/leadership/committees` and `/get-involved/committees` both render
 * `GET /api/committees` — name, slug, description, member_count, openings,
 * application_deadline and accepting_applications all come from the database
 * so admins control the recruitment round. What can't come from the database
 * is presentation: an icon and a fallback one-liner for a committee whose
 * description is still empty.
 *
 * Slugs and icons here must match `src/utils/committeesData.js`
 * (`ALL_COMMITTEES_DATA`) exactly — that file is the single source of
 * truth for the 12 constitutional committees (name, description,
 * mandate, key activities), used by the committee detail page
 * (`CommitteePageTemplate.jsx`) and by the seed migration
 * (`database/008_reset_committees_constitutional.sql`). This file only
 * adds the icon *component* (that one needs a component reference, not
 * a string, since it renders directly) and a short fallback line for
 * this listing page specifically.
 */
export const committeeVisuals = {
  academic:          { icon: BookOpen,       focus: 'Academic affairs, symposia and student support' },
  health:            { icon: Heart,          focus: 'Sanitation and student health initiatives' },
  'research-journal':{ icon: FileText,       focus: "LMSA's journal, newsletters and research culture" },
  'social-program':  { icon: Users,          focus: 'Social events, initiation and the end-of-year program' },
  dietary:           { icon: Utensils,       focus: 'Meal quality and cafeteria standards' },
  judicial:          { icon: Scale,          focus: 'Constitutional matters and student rights' },
  sports:            { icon: Trophy,         focus: 'Inter-class sports and athletics' },
  auditing:          { icon: DollarSign,     focus: 'Financial transparency and accountability' },
  'foreign-affairs': { icon: Globe,          focus: 'International exchange and global health partnerships' },
  membership:        { icon: UserPlus,       focus: 'Member recruitment, registration and ID cards' },
  'media-publicity': { icon: Megaphone,      focus: "LMSA's media presence and communications" },
  welfare:           { icon: HeartHandshake, focus: 'Student wellbeing and support services' },
};

const fallbackVisual = { icon: Users, focus: 'Committee work across LMSA programmes' };

export function getCommitteeVisual(slug) {
  return committeeVisuals[slug] || fallbackVisual;
}

/**
 * Shown only when the API is unreachable (database not migrated yet, or the
 * backend is down). It deliberately carries **no** deadline and
 * `accepting_applications: false`: a hardcoded date that silently goes stale
 * was the defect this replaced, so the honest fallback is "not open yet"
 * rather than an invented closing date.
 */
export const committeeFallbackList = Object.entries(committeeVisuals).map(([slug, visual]) => ({
  id: slug,
  slug,
  name: slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
  description: visual.focus,
  member_count: 0,
  openings: 0,
  approved_count: 0,
  application_deadline: null,
  accepting_applications: false,
  unavailable: true,
}));

/**
 * True when a capped committee has approved as many people as it has openings.
 * `openings` of 0 means "no stated cap" (the column default), never "full" —
 * the same rule applyToCommittee enforces server-side.
 */
export function isCommitteeFull(committee) {
  const cap = Number(committee?.openings) || 0;
  return cap > 0 && (Number(committee?.approved_count) || 0) >= cap;
}

/** Seats still open, or null when the committee has no stated cap. */
export function openPositions(committee) {
  const cap = Number(committee?.openings) || 0;
  if (cap <= 0) return null;
  return Math.max(0, cap - (Number(committee?.approved_count) || 0));
}

/**
 * True when people can apply right now: the admin has switched recruitment on,
 * the deadline hasn't passed, and there is still a seat. Mirrors the checks in
 * the server's applyToCommittee, so a page never offers "Apply now" for a
 * committee that would reject the application at submit.
 */
export function isAcceptingApplications(committee) {
  if (!committee?.accepting_applications) return false;
  if (isCommitteeFull(committee)) return false;
  if (!committee.application_deadline) return true;
  return committee.application_deadline >= new Date().toISOString().split('T')[0];
}

/** True when the window existed but has passed — worth saying out loud. */
export function hasDeadlinePassed(committee) {
  return Boolean(
    committee?.application_deadline &&
      committee.application_deadline < new Date().toISOString().split('T')[0]
  );
}

export function formatDeadline(date) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * One answer to "what should this committee's recruitment notice say?", so
 * pages that show a single committee don't each re-derive it.
 *
 *   unknown        the committee came from offline fallback data (`unavailable`);
 *                  saying "not recruiting" would be a guess, so say nothing
 *   open           applications are open; `remaining` is null when uncapped
 *   full           recruitment is on but every position is taken
 *   closed         the deadline has passed
 *   not-recruiting recruitment is off
 */
export function getRecruitmentStatus(committee) {
  if (!committee || committee.unavailable) return { state: 'unknown' };

  const deadline = formatDeadline(committee.application_deadline);

  if (isAcceptingApplications(committee)) {
    return { state: 'open', remaining: openPositions(committee), deadline };
  }
  if (hasDeadlinePassed(committee)) return { state: 'closed', deadline };
  if (committee.accepting_applications && isCommitteeFull(committee)) return { state: 'full' };
  return { state: 'not-recruiting' };
}
