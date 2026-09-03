import {
  FlaskConical,
  Globe,
  GraduationCap,
  Heart,
  Megaphone,
  Network,
  Palette,
  Scale,
  Shield,
  TrendingUp,
  Trophy,
  Wallet,
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
 */
export const committeeVisuals = {
  'medical-education': { icon: GraduationCap, focus: 'Academic standards and curriculum support' },
  'community-health': { icon: Heart, focus: 'Public health outreach and education' },
  'research-innovation': { icon: FlaskConical, focus: 'Scientific research promotion' },
  'student-welfare': { icon: Shield, focus: 'Student support services' },
  'professional-development': { icon: TrendingUp, focus: 'Career and skills training' },
  'public-relations': { icon: Megaphone, focus: 'Communications and media' },
  'international-relations': { icon: Globe, focus: 'Global partnerships' },
  'finance-budget': { icon: Wallet, focus: 'Financial management' },
  'ethics-discipline': { icon: Scale, focus: 'Code of conduct enforcement' },
  'legislative-affairs': { icon: Globe, focus: 'Policy and advocacy' },
  'sports-recreation': { icon: Trophy, focus: 'Athletic activities' },
  'cultural-affairs': { icon: Palette, focus: 'Arts and cultural programmes' },
};

const fallbackVisual = { icon: Network, focus: 'Committee work across LMSA programmes' };

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
  application_deadline: null,
  accepting_applications: false,
  unavailable: true,
}));

/** True when a committee's application window is open right now. */
export function isAcceptingApplications(committee) {
  if (!committee?.accepting_applications) return false;
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
