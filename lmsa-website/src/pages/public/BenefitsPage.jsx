import { BookOpen, Calendar, CheckCircle, Heart, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialLinkCard, EditorialSectionHeader } from '@components/common/EditorialSections';

const benefits = [
  { icon: BookOpen, title: 'Academic resources', description: 'Access exclusive study materials, past exams, and learning resources.' },
  { icon: Users, title: 'Networking opportunities', description: 'Connect with peers, mentors, and medical professionals across Liberia.' },
  { icon: Calendar, title: 'Events & conferences', description: 'Attend symposia, workshops, and medical conferences at member rates.' },
  { icon: Heart, title: 'Mentorship program', description: 'Get paired with senior students for academic and career guidance.' },
  { icon: Star, title: 'Leadership development', description: 'Run for office, join committees, and build leadership skills.' },
  { icon: CheckCircle, title: 'Professional recognition', description: 'Receive certificates and recognition for academic achievements.' },
];

const perks = [
  'Discounted medical textbooks and resources',
  'Free access to online medical databases',
  'Priority registration for workshops and training',
  'Eligibility for LMSA scholarships and grants',
  'Representation in national medical forums',
  'Access to alumni network and career opportunities',
  'Invitation to exclusive social and professional events',
  'Voting rights in LMSA elections',
];

export default function BenefitsPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Membership / Benefits"
            title="The value of membership is in what it helps you do next."
            description="LMSA membership is designed to be useful in the classroom, in community, and in the leadership opportunities between them."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <EditorialLinkCard to="/academics/resources" eyebrow="Learn" title="Study with more support" description="Find tools and people that make the work of medical school more navigable." icon={BookOpen} />
            <EditorialLinkCard to="/academics/mentorship" eyebrow="Connect" title="Meet people ahead of you" description="Build relationships with peers, mentors, and the alumni network." icon={Users} />
            <EditorialLinkCard to="/leadership#stand" eyebrow="Lead" title="Practice responsibility" description="Use committees, elections, and service to grow beyond the classroom." icon={Star} />
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="The everyday benefits" title="Six ways LMSA can move with you." description="Membership follows the real shape of student life: learning, belonging, contribution, and preparation." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="editorial-link-card">
                <span className="editorial-link-card-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></span>
                <div className="editorial-link-card-copy">
                  <span className="editorial-card-eyebrow">0{index + 1} / Benefit</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Beyond the headline"
              title="Small advantages add up over a year of training."
              description="The additional perks make it easier to stay informed, participate fully, and keep building a professional network."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {perks.map((perk, index) => (
                <div key={perk} className="flex gap-3 border-b border-gray-200 pb-4">
                  <span className="text-sm font-bold text-lmsa-700">0{index + 1}</span>
                  <p className="text-sm leading-6 text-gray-700">{perk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Put the benefits to work"
            title="Choose the membership path that fits your next season."
            description="Review the categories, then start your application when you are ready."
            action={{ label: 'Explore membership', to: '/membership' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Need the practical details? <Link to="/membership/dues" className="font-semibold text-lmsa-700 hover:text-lmsa-900">View dues and payment options</Link>
          </p>
        </div>
      </section>
    </main>
  );
}