import { FlaskConical, Globe, GraduationCap, Heart, Megaphone, Palette, Scale, Shield, TrendingUp, Trophy, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';

const committees = [
  { name: 'Medical Education', slug: 'medical-education', focus: 'Curriculum and academic standards', members: 8, icon: GraduationCap },
  { name: 'Community Health', slug: 'community-health', focus: 'Public health outreach', members: 12, icon: Heart },
  { name: 'Research & Innovation', slug: 'research-innovation', focus: 'Scientific research promotion', members: 6, icon: FlaskConical },
  { name: 'Student Welfare', slug: 'student-welfare', focus: 'Student support services', members: 10, icon: Shield },
  { name: 'Professional Development', slug: 'professional-development', focus: 'Career and skills training', members: 9, icon: TrendingUp },
  { name: 'Public Relations', slug: 'public-relations', focus: 'Communications and media', members: 7, icon: Megaphone },
  { name: 'Finance & Budget', slug: 'finance-budget', focus: 'Financial management', members: 5, icon: Wallet },
  { name: 'Ethics & Discipline', slug: 'ethics-discipline', focus: 'Code of conduct enforcement', members: 6, icon: Scale },
  { name: 'Legislative Affairs', slug: 'legislative-affairs', focus: 'Policy and advocacy', members: 8, icon: Globe },
  { name: 'International Relations', slug: 'international-relations', focus: 'Global partnerships', members: 10, icon: Globe },
  { name: 'Sports & Recreation', slug: 'sports-recreation', focus: 'Athletic activities', members: 11, icon: Trophy },
  { name: 'Cultural Affairs', slug: 'cultural-affairs', focus: 'Arts and cultural programs', members: 9, icon: Palette },
];

export default function CommitteesPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Committees"
              title="Where ideas become work that people can feel."
              description="LMSA committees create focused spaces for students to contribute to academic life, welfare, advocacy, service, and community."
            />
            <div className="editorial-prose">
              <p>
                Twelve standing committees help LMSA give focused attention to critical issues
                while creating opportunities for members to contribute meaningfully to the mission.
              </p>
              <div className="editorial-stat-grid mt-8">
                <EditorialStat value="12" label="Committees" />
                <EditorialStat value="101" label="Active members" />
                <EditorialStat value="48+" label="Initiatives" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Find your contribution" title="A committee for the question, skill, or cause you want to carry." description="Committee members are appointed annually and work throughout the year to develop programs, policies, and initiatives that advance LMSA’s goals." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {committees.map(({ name, slug, focus, members, icon: Icon }, index) => (
              <Link key={slug} to={`/leadership/committees/${slug}`} className="editorial-link-card">
                <span className="editorial-link-card-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                <div className="editorial-link-card-copy">
                  <span className="editorial-card-eyebrow">0{String(index + 1).padStart(2, '0')} / Committee</span>
                  <h3>{name}</h3>
                  <p>{focus}</p>
                  <span className="mt-5 block text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{members} members</span>
                </div>
              </Link>
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