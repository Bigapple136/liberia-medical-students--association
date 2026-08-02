import { Utensils } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

export default function DietaryCommittee() {
  return (
    <CommitteePageTemplate
      name="Dietary Committee"
      icon={Utensils}
      description="The Dietary Committee works with dietary staff to ensure quality student meal programs and proper nutrition for LMSA members."
      mandate={[
        'Collaborate with dietary staff on meal planning',
        'Monitor food quality and nutritional standards',
        'Address student dietary concerns and special requirements',
        'Ensure hygienic food handling and preparation',
        'Promote healthy eating habits among students',
        'Review and improve meal service operations',
      ]}
      keyActivities={[
        'Meal Program Evaluation',
        'Nutrition Awareness Campaigns',
        'Dietary Feedback Collection',
        'Food Safety Inspections',
        'Special Dietary Requirements Support',
        'Healthy Cooking Workshops',
      ]}
      currentChair={{
        name: 'Robert Anderson',
        year: 'Year 3',
        email: 'dietary@lmsa.org',
        photo: null,
      }}
      members={[]}
      upcomingEvents={[]}
    />
  );
}
