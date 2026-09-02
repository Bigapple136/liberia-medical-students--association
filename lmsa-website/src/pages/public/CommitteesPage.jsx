import {
  BookOpen, DollarSign, FileText, Globe, Heart, HeartHandshake,
  Megaphone, Scale, Trophy, UserPlus, Users, Utensils,
} from 'lucide-react';
import { EditorialCallout, EditorialLinkCard, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';
import { ALL_COMMITTEES_DATA } from '@utils/committeesData';

const ICONS = {
  BookOpen, Heart, FileText, Users, Utensils, Scale,
  Trophy, DollarSign, Globe, UserPlus, Megaphone, HeartHandshake,
};

const committees = Object.entries(ALL_COMMITTEES_DATA).map(([slug, committee]) => ({
  slug,
  name: committee.name,
  description: committee.description,
  icon: ICONS[committee.icon] || Users,
}));

// Honest numbers, derived from the constitutional registry itself.
const committeeCount = committees.length;
const mandateCount = Object.values(ALL_COMMITTEES_DATA).reduce(
  (sum, committee) => sum + (committee.mandate?.length || 0),
  0
);
const activityCount = Object.values(ALL_COMMITTEES_DATA).reduce(
  (sum, committee) => sum + (committee.key_activities?.length || 0),
  0
);

export default function CommitteesPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              as="h1"
              eyebrow="Learn & lead / Committees"
              title="Where ideas become work that people can feel."
              description="LMSA committees create focused spaces for students to contribute to academic life, welfare, advocacy, service, and community."
            />
            <div className="editorial-prose">
              <p>
                Twelve standing committees, established by the LMSA constitution, give focused
                attention to critical issues while creating opportunities for members to
                contribute meaningfully to the mission.
              </p>
              <div className="editorial-stat-grid mt-8">
                <EditorialStat value={String(committeeCount)} label="Standing committees" />
                <EditorialStat value={String(mandateCount)} label="Mandated duties" />
                <EditorialStat value={String(activityCount)} label="Signature activities" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Find your contribution" title="A committee for the question, skill, or cause you want to carry." description="Committee members are appointed annually and work throughout the year to develop programs, policies, and initiatives that advance LMSA’s goals." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {committees.map(({ name, slug, description, icon }, index) => (
              <EditorialLinkCard
                key={slug}
                to={`/leadership/committees/${slug}`}
                eyebrow={`${String(index + 1).padStart(2, '0')} / Standing committee`}
                title={name}
                description={description}
                icon={icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Make your contribution"
            title="You do not need to wait for a title to start doing meaningful work."
            description="Find a committee that fits your interests, then explore how to join the work."
            action={{ label: 'Join a committee', to: '/get-involved/committees' }}
          />
        </div>
      </section>
    </main>
  );
}
