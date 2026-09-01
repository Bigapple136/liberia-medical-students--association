import { BookOpen, Lightbulb, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EditorialCallout,
  EditorialLinkCard,
  EditorialSectionHeader,
  EditorialStat,
} from '@components/common/EditorialSections';

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'Commitment to the highest standards in medical education and patient care.',
  },
  {
    icon: Users,
    title: 'Unity',
    description: 'Standing together to support and uplift every medical student.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Embracing new ideas and technologies to advance medical education.',
  },
];

export default function AboutPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="A student-led institution"
              title="A stronger voice for the people becoming Liberia&apos;s doctors."
              description="LMSA brings medical students together around the work that matters: learning well, looking after one another, and preparing to serve."
            />
            <div className="editorial-prose">
              <p>
                The Liberia Medical Students&apos; Association was established in 1972 at
                the A.M. Dogliotti College of Medicine, University of Liberia. For over five
                decades, LMSA has served as the unified voice of medical students.
              </p>
              <p>
                From its beginnings with a few dozen students, LMSA has grown to represent
                hundreds of medical students across all years of study. Our members have gone
                on to become physicians, surgeons, researchers, and healthcare administrators
                in Liberia and around the world.
              </p>
              <div className="editorial-note mt-8">
                <p>We are building the community we want to practice medicine in.</p>
                <span>LMSA today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="history" className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Know the work"
            title="Start with the part of LMSA you want to understand."
            description="Our story, direction, and governance are connected. Explore each one to see how students turn shared purpose into action."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <EditorialLinkCard
              to="/about/history"
              eyebrow="01 / Our story"
              title="A legacy worth carrying"
              description="Trace the generations of students who have kept the association moving."
              icon={BookOpen}
            />
            <EditorialLinkCard
              to="/about/mission-vision"
              eyebrow="02 / Our direction"
              title="What guides our work"
              description="See the commitments behind our advocacy, learning, and service."
              icon={Target}
            />
            <EditorialLinkCard
              to="/about/constitution"
              eyebrow="03 / Our foundation"
              title="How we are governed"
              description="Understand the principles and structures that keep LMSA accountable."
              icon={Users}
            />
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="The way we show up"
            title="Three values. One shared standard."
            description="Our values are practical commitments for how we learn, lead, and serve together."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="editorial-link-card">
                <span className="editorial-link-card-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <div className="editorial-link-card-copy">
                  <span className="editorial-card-eyebrow">0{index + 1} / Value</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="editorial-stat-grid mt-14">
            <EditorialStat value="1972" label="Founded" detail="A student association with more than five decades of purpose." />
            <EditorialStat value="500+" label="Students represented" detail="A community spanning every stage of medical training." />
            <EditorialStat value="1" label="Shared voice" detail="Students speaking together for better healthcare in Liberia." />
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Your place in the story"
            title="The next chapter is shaped by the students who show up."
            description="Join a community that turns connection into support, ideas into action, and training into service."
            action={{ label: 'Become a member', to: '/register' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Already a member? <Link to="/login" className="font-semibold text-lmsa-700 hover:text-lmsa-900">Sign in to your portal</Link>
          </p>
        </div>
      </section>
    </main>
  );
}