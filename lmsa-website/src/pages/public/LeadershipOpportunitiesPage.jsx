import { Navigate } from 'react-router-dom';

/**
 * Leadership pathways now live on /leadership.
 *
 * These two pages used to duplicate each other: the same closing sentence, the
 * same button, and different answers to "when are the elections". The nominable
 * levels, their term and eligibility, the election cycle dates and the
 * nomination form all sit on /leadership now, under #stand.
 */
export default function LeadershipOpportunitiesPage() {
  return <Navigate to="/leadership#stand" replace />;
}
