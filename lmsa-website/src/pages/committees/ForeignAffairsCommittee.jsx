import { Globe } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function ForeignAffairsCommittee() {
  return (
    <CommitteePageTemplate
      name="Foreign Affairs Committee"
      icon={Globe}
      description="The Foreign Affairs Committee coordinates international opportunities, exchanges, and global partnerships for LMSA members."
      mandate={[
        'Coordinate international student exchange programs',
        'Build partnerships with foreign medical institutions',
        'Promote global health opportunities',
        'Facilitate international conference participation',
        'Maintain relationships with international medical associations',
        'Provide information on studying abroad',
      ]}
      keyActivities={[
        'International Exchange Program',
        'Global Health Conference',
        'Partnership Development',
        'Study Abroad Information Sessions',
        'Cross-Cultural Events',
        'International Networking Forums',
      ]}
      currentChair={{
        name: 'Daniel Martinez',
        year: 'Year 4',
        email: 'foreign-affairs@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
