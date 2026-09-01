import { CheckCircle, Heart, MessageCircle, Users } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const steps = [
  { title: 'Apply', description: 'Fill out the mentorship application form', icon: MessageCircle },
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
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className="editorial-link-card">
                <span className="editorial-link-card-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.5} /></span>
                <div className="editorial-link-card-copy">
                  <span className="editorial-card-eyebrow">Step 0{index + 1}</span>
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
            <EditorialSectionHeader eyebrow="What support can look like" title="The best mentorship is practical, personal, and mutual." description="Some conversations are about exams. Others are about finding your confidence or making a decision about what comes next." />
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex gap-3 border-b border-gray-200 pb-4">
                  <span className="text-sm font-bold text-lmsa-700">0{index + 1}</span>
                  <p className="text-sm leading-6 text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Find your place"
            title="Need support—or ready to share what you know?"
            description="Both mentees and mentors help make the LMSA community more generous."
            action={{ label: 'Contact LMSA', to: '/contact' }}
          />
        </div>
      </section>
    </main>
  );
}