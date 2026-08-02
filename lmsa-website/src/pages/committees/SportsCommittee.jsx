import { Trophy } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function SportsCommittee() {
  return (
    <CommitteePageTemplate
      name="Sports Committee"
      icon={Trophy}
      description="The Sports Committee promotes sports, athletics, and inter-class competitions among LMSA members."
      mandate={[
        'Organize and promote sports activities for students',
        'Plan and execute inter-class sports competitions',
        'Encourage physical fitness and wellness',
        'Coordinate with other institutions for sports events',
        'Manage sports equipment and facilities',
        'Foster team spirit and sportsmanship',
      ]}
      keyActivities={[
        'Annual Inter-Class Sports Competition',
        'Football Tournament',
        'Basketball League',
        'Track and Field Events',
        'Fitness Training Sessions',
        'Sports Day Celebration',
      ]}
      currentChair={{
        name: 'Marcus Williams',
        year: 'Year 3',
        email: 'sports@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
