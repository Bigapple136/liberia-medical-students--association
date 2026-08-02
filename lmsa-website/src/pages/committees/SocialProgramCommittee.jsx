import { Users } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function SocialProgramCommittee() {
  return (
    <CommitteePageTemplate
      name="Social & Program Committee"
      icon={Users}
      description="The Social & Program Committee plans and coordinates all social events, the end-of-year program, and initiation ceremonies for LMSA members."
      mandate={[
        'Plan and organize social events throughout the academic year',
        'Coordinate the end-of-year celebration program',
        'Organize initiation ceremonies for new members',
        'Foster community building and networking among students',
        'Plan recreational activities and team-building events',
        'Manage event budgets and logistics',
      ]}
      keyActivities={[
        'Welcome Reception for New Students',
        'End-of-Year Gala',
        'Initiation Ceremony',
        'Social Mixers and Networking Events',
        'Holiday Celebrations',
        'Class Bonding Activities',
      ]}
      currentChair={{
        name: 'Sarah Thompson',
        year: 'Year 3',
        email: 'social@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
