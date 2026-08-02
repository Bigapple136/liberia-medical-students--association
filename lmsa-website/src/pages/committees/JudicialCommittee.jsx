import { Scale } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function JudicialCommittee() {
  return (
    <CommitteePageTemplate
      name="Judicial Committee"
      icon={Scale}
      description="The Judicial Committee handles legal matters, upholds student rights, and ensures fair treatment of all LMSA members."
      mandate={[
        'Handle legal matters affecting LMSA members',
        'Uphold and protect student rights',
        'Review and interpret LMSA constitution and bylaws',
        'Mediate disputes between members',
        'Ensure due process in disciplinary matters',
        'Advise the executive council on legal issues',
      ]}
      keyActivities={[
        'Constitutional Review and Interpretation',
        'Student Rights Advocacy',
        'Dispute Resolution and Mediation',
        'Legal Awareness Workshops',
        'Disciplinary Hearings',
        'Policy Compliance Reviews',
      ]}
      currentChair={{
        name: 'Amanda Richards',
        year: 'Year 4',
        email: 'judicial@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
