import { Calendar, CheckCircle, Heart, Users } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import Photo from '@components/common/Photo';
import { stockPhotos } from '@config/images';

const opportunities = [
  { title: 'Community health screenings', description: 'Provide free health screenings and education to underserved communities across Liberia.', timeCommitment: '4-8 hours/month', icon: Heart },
  { title: 'Health education workshops', description: 'Teach community members about disease prevention, nutrition, and healthy lifestyles.', timeCommitment: '2-4 hours/month', icon: Users },
  { title: 'Medical supply drives', description: 'Organize and coordinate collection and distribution of medical supplies to clinics.', timeCommitment: 'Flexible', icon: Calendar },
  { title: 'Research assistance', description: 'Support ongoing public health research projects in your area of interest.', timeCommitment: '5-10 hours/month', icon: Heart },
];

const benefits = [
  'Gain practical clinical experience',
  'Develop leadership and communication skills',
  'Make a positive impact in communities',
  'Network with healthcare professionals',
  'Strengthen your medical school application',
  'Fulfill community service requirements',
];

export default function VolunteerPage() {
  return (
    <main className="editorial-page w-full max-w-full overflow-x-hidden">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="Volunteer with LMSA" title="What a few hours can do." description="LMSA volunteers gain practical experience while helping expand healthcare access and education across Liberia." />
            <div className="editorial-prose">
              <p>Bring your skills, energy, and attention to the communities we hope to serve. There are different ways to contribute, and meaningful work does not always require a large amount of time.</p>
              <section aria-label="Leadership workshop" className="mt-10 rise">
                <Photo src={stockPhotos.sections.lead.src} alt={stockPhotos.sections.lead.alt} width={3} height={2} fallbackGradient="bg-lmsa-900" className="w-full" />
                <p className="mt-2 text-[13px] text-gray-500">{stockPhotos.sections.lead.credit}</p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Ways to serve" title="Find a commitment that fits your season." description="Choose the kind of work that speaks to your interests and the time you can share." />
          <div className="grid gap-4 md:grid-cols-2">
            {opportunities.map(({ title, description, timeCommitment, icon: Icon }, index) => (
              <article key={index} className="editorial-link-card rise" style={{ animationDelay: `${index * 70}ms` }}>
                <span className="editorial-link-card-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                <div className="editorial-link-card-copy"><h3>{title}</h3><p>{description}</p></div>
                <div className="mt-6 flex items-center justify-between gap-4"><span className="text-[13px] font-semibold text-gray-500">{timeCommitment}</span><button type="button" className="text-sm font-semibold text-lmsa-700 hover:text-lmsa-900">Sign up →</button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Community health outreach" className="rise">
        <Photo src={stockPhotos.stories.medicalCamp.src} alt={stockPhotos.stories.medicalCamp.alt} width={21} height={9} fallbackGradient="bg-lmsa-900" className="w-full" />
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <div>
              <EditorialSectionHeader eyebrow="Why volunteer?" title="Service teaches the whole picture." description="Community work builds habits that stay with you long after a single event ends." />
              <section aria-label="Learning through service" className="mt-10 rise">
                <Photo src={stockPhotos.sections.learn.src} alt={stockPhotos.sections.learn.alt} width={4} height={3} fallbackGradient="bg-lmsa-900" className="w-full" />
                <p className="mt-2 text-[13px] text-gray-500">{stockPhotos.sections.learn.credit}</p>
              </section>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-lmsa-200 pb-4 rise" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="flex gap-2 text-base leading-7 text-gray-700"><CheckCircle size={18} className="mt-1.5 shrink-0 text-lmsa-600" aria-hidden="true" /><span>{benefit}</span></div>
                </div>
              ))}
              <section aria-label="Networking" className="rise">
                <Photo src={stockPhotos.sections.connect.src} alt={stockPhotos.sections.connect.alt} width={3} height={2} fallbackGradient="bg-lmsa-900" className="col-span-full w-full sm:col-span-2" />
                <p className="mt-2 text-[13px] text-gray-500">{stockPhotos.sections.connect.credit}</p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout eyebrow="Start where you are" title="Ready to make a difference?" description="Join the volunteer network and help LMSA serve communities across Liberia." action={{ label: 'Contact LMSA', to: '/contact' }} />
        </div>
      </section>
    </main>
  );
}