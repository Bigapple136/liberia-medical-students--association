import { FileText } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function ResearchJournalCommittee() {
  return (
    <CommitteePageTemplate
      name="Research & Journal Committee"
      icon={FileText}
      description="The Research & Journal Committee gathers, organizes, edits, and publishes data for LMSA's official journal and newsletters while promoting research among members."
      mandate={[
        'Publish one journal per academic year',
        'Publish at least two newsletters per semester',
        'Gather and organize content for publications',
        'Edit and review submitted articles',
        'Promote research culture among students',
        'May publish yearbook',
      ]}
      keyActivities={[
        'LMSA Journal Publication',
        'Quarterly Newsletters',
        'Research Symposium',
        'Student Research Projects',
        'Publication Workshops',
        'Medical Writing Training',
      ]}
      currentChair={{
        name: 'Peter Davis',
        year: 'Year 4',
        email: 'research@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
