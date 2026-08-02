import { DollarSign } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function AuditingCommittee() {
  return (
    <CommitteePageTemplate
      name="Auditing Committee"
      icon={DollarSign}
      description="The Auditing Committee audits LMSA finances and ensures transparent financial reporting to all members."
      mandate={[
        'Audit LMSA financial records regularly',
        'Ensure transparency in financial management',
        'Report financial status to LMSA members',
        'Review budgets and expenditure proposals',
        'Verify compliance with financial regulations',
        'Recommend improvements to financial practices',
      ]}
      keyActivities={[
        'Annual Financial Audit',
        'Quarterly Financial Reports',
        'Budget Review and Approval',
        'Expenditure Verification',
        'Financial Transparency Workshops',
        'Compliance Monitoring',
      ]}
      currentChair={{
        name: 'Catherine Moore',
        year: 'Year 4',
        email: 'auditing@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
