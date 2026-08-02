import { UserPlus } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function MembershipCommittee() {
  return (
    <CommitteePageTemplate
      name="Membership Committee"
      icon={UserPlus}
      description="The Membership Committee recruits new members, manages membership records, and handles ID card distribution for LMSA."
      mandate={[
        'Recruit and onboard new LMSA members',
        'Manage membership registration and records',
        'Issue and distribute student ID cards',
        'Maintain updated membership database',
        'Promote membership benefits to students',
        'Handle membership renewals and updates',
      ]}
      keyActivities={[
        'Membership Drive Campaigns',
        'New Student Orientation',
        'ID Card Distribution',
        'Membership Database Management',
        'Benefits Awareness Sessions',
        'Retention Programs',
      ]}
      currentChair={{
        name: 'Lisa Chang',
        year: 'Year 3',
        email: 'membership@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
