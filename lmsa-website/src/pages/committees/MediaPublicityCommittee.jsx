import { Megaphone } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function MediaPublicityCommittee() {
  return (
    <CommitteePageTemplate
      name="Media & Publicity Committee"
      icon={Megaphone}
      description="The Media & Publicity Committee manages LMSA media presence, promotional activities, and communications."
      mandate={[
        'Manage LMSA social media and digital platforms',
        'Create promotional materials for events and initiatives',
        'Maintain LMSA brand consistency',
        'Coordinate media coverage of LMSA activities',
        'Develop communication strategies',
        'Handle public relations and press inquiries',
      ]}
      keyActivities={[
        'Social Media Management',
        'Event Photography and Videography',
        'Promotional Content Creation',
        'Newsletter Design and Distribution',
        'Brand Management',
        'Media Relations',
      ]}
      currentChair={{
        name: 'Kevin Taylor',
        year: 'Year 3',
        email: 'media@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
