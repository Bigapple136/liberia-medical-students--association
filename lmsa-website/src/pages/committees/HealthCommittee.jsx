import { Heart } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function HealthCommittee() {
  return (
    <CommitteePageTemplate
      name="Health Committee"
      icon={Heart}
      description="The Health Committee ensures the general sanitation of dormitories, academic buildings, and their environs while planning health-related functions for LMSA members."
      mandate={[
        'Ensure satisfactory sanitation of dormitories and academic buildings',
        'Maintain acceptable health standards in all LMSA facilities',
        'Plan and execute health-related functions for members',
        'Coordinate with health authorities on student health matters',
        'Conduct regular health and sanitation inspections',
        'Promote health awareness among students',
      ]}
      keyActivities={[
        'Campus Health Inspections',
        'Health Awareness Campaigns',
        'First Aid Training',
        'Mental Health Support Programs',
        'COVID-19 Prevention Measures',
        'Vaccination Drives',
      ]}
      currentChair={{
        name: 'Mary Johnson',
        year: 'Year 3',
        email: 'health@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
