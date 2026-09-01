import { Eye, Heart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EditorialCallout,
  EditorialLinkCard,
  EditorialSectionHeader,
} from '@components/common/EditorialSections';

const missionPriorities = [
  'Advocate for medical student rights and welfare',
  'Promote excellence in medical education',
  'Support research and innovation in healthcare',
];

const visionPriorities = [
  'Equitable access to medical education',
  'Student-led healthcare innovation',
  'Global partnerships and collaboration',
];

const values = [
  { title: 'Excellence', description: 'Commitment to the highest standards in education and practice.' },
  { title: 'Unity', description: 'Strength through collaboration and mutual support.' },
  { title: 'Integrity', description: 'Transparency, accountability, and ethical conduct.' },
  { title: 'Service', description: 'Dedication to community health and wellbeing.' },
];

function PriorityList({ items }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base leading-7 text-gray-700">
          <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-lmsa-600" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MissionVisionPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="A direction for the work"
            title="Training physicians. Strengthening communities."
            description="Our mission and vision connect professional excellence with the everyday needs of Liberian communities."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <article className="border-t-4 border-lmsa-600 bg-white p-7 md:p-9">
              <span className="editorial-link-card-icon" aria-hidden="true">
                <Target size={24} strokeWidth={1.5} />
              </span>
              <p className="editorial-overline mt-8">The work in front of us</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-lmsa-900">Our mission</h2>
              <p className="mt-5 text-base leading-8 text-gray-700">
                To unite, represent, and empower medical students across Liberia through advocacy,
                academic support, and professional development, while fostering a commitment to
                improving healthcare outcomes in our communities.
              </p>
              <PriorityList items={missionPriorities} />
            </article>
            <article className="border-t-4 border-blue-600 bg-blue-50 p-7 md:p-9">
              <span className="flex h-11 w-11 items-center justify-center bg-white text-blue-700" aria-hidden="true">
                <Eye size={24} strokeWidth={1.5} />
              </span>
              <p className="editorial-overline mt-8 text-blue-700">The future we are building</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-lmsa-900">Our vision</h2>
              <p className="mt-5 text-base leading-8 text-gray-700">
                A Liberia where every medical student has access to quality education, resources,
                and opportunities to become a competent, compassionate healthcare professional
                who leads the transformation of our nation&apos;s health system.
              </p>
              <PriorityList items={visionPriorities} />
            </article>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="The standard we share"
              title="Values are not wall text. They are how the work gets done."
              description="They shape how we treat one another, how we make decisions, and how we show up for the people we hope to serve."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {values.map((value, index) => (
                <div key={value.title} className="border border-gray-200 bg-white p-5">
                  <span className="text-xs font-bold text-lmsa-700">0{index + 1}</span>
                  <h3 className="mt-7 text-xl font-semibold text-lmsa-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="From principle to practice"
            title="Find the spaces where our direction becomes real."
            description="LMSA turns its commitments into daily work through learning, service, and accountable student leadership."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <EditorialLinkCard
              to="/academics/resources"
              title="Learn together"
              description="Share tools and support that make medical training more accessible."
              icon={Target}
            />
            <EditorialLinkCard
              to="/get-involved/volunteer"
              title="Serve together"
              description="Bring student energy to community health and outreach."
              icon={Heart}
            />
            <EditorialLinkCard
              to="/about/constitution"
              title="Lead responsibly"
              description="Build the transparent structures that let good work last."
              icon={Eye}
            />
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Make it personal"
            title="A mission becomes meaningful when you can see your place in it."
            description="Explore membership and find the next step that fits the way you want to learn, lead, or serve."
            action={{ label: 'Explore membership', to: '/membership' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Want the formal structure? <Link to="/about/constitution" className="font-semibold text-lmsa-700 hover:text-lmsa-900">Read the constitution</Link>
          </p>
        </div>
      </section>
    </main>
  );
}