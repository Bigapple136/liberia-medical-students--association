import { HeartHandshake } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function WelfareCommittee() {
  return (
    <CommitteePageTemplate
      name="Welfare Committee"
      icon={HeartHandshake}
      description="The Welfare Committee ensures student welfare, provides support services, and promotes the well-being of all LMSA members."
      mandate={[
        'Ensure the welfare and well-being of all students',
        'Provide support services for students in need',
        'Address student welfare concerns and grievances',
        'Coordinate with counseling and support services',
        'Promote mental health awareness',
        'Create a supportive and inclusive environment',
      ]}
      keyActivities={[
        'Student Welfare Checks',
        'Mental Health Support Programs',
        'Peer Counseling Services',
        'Emergency Assistance Fund',
        'Stress Management Workshops',
        'Wellness Campaigns',
      ]}
      currentChair={{
        name: 'Emily Watson',
        year: 'Year 4',
        email: 'welfare@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
