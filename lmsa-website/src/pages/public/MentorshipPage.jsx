import { CheckCircle, Heart, MessageCircle, Users } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const steps = [
  { title: 'Reach out', description: 'Contact the team with your goals, interests, and what kind of support you’re looking for', icon: MessageCircle },
  { title: 'Get matched', description: 'We pair you with a compatible mentor', icon: Users },
  { title: 'Connect', description: 'Meet regularly with your mentor', icon: Heart },
  { title: 'Grow', description: 'Achieve your academic and career goals', icon: CheckCircle },
];

const benefits = [
  'Academic support and study strategies',
  'Career guidance and specialty exploration',
  'Emotional support during challenging times',
  'Networking opportunities',
  'Research collaboration opportunities',
  'Leadership skill development',
  'Transition support between clinical years',
  'Exam preparation assistance',
];

export default function MentorshipPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Mentorship"
              title="You should not have to figure out medical school alone."
              description="The LMSA Mentorship Program connects junior students with senior students who can offer guidance, perspective, and honest support."
            />
            <div className="editorial-prose">
              <p>
                Mentors are matched based on academic interests, career goals, and personal
                preferences to help relationships become productive and meaningful.
              </p>
              <p>
                Peer guidance can make a demanding season feel more navigable—and can give
                experienced students a way to turn what they have learned into support for someone else.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="How it works" title="A simple process, a meaningful relationship." description="The program is structured enough to help you begin and flexible enough to grow with the people involved." />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <li key={title} className="flex min-h-[190px] flex-col border border-gray-200 bg-white p-6">
                <span className="mb-8 flex h-11 w-11 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true">
                  <Icon size={21} strokeWidth={1.5} />
                </span>
                <span className="editorial-card-eyebrow">Step 0{index + 1}</span>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="What support can look like" title="The best mentorship is practical, personal, and mutual." description="Some conversations are about exams. Others are about finding your confidence or making a decision about what comes next." />
            <ul className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <li key={benefit} className="flex gap-3 border-b border-gray-200 pb-4">
                  <span className="text-sm font-bold text-lmsa-700" aria-hidden="true">0{index + 1}</span>
                  <p className="text-sm leading-6 text-gray-700">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Find your place"
            title="Need support—or ready to share what you know?"
            description="Whether you want a mentor or want to become one, one message starts the match."
            action={{ label: 'Ask about mentorship', to: '/contact' }}
          />
        </div>
      </section>
    </main>
  );
}
