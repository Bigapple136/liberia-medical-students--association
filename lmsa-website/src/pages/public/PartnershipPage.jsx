import { BookOpen, Building2, CheckCircle, Globe, Heart, Laptop, Mail, Phone, Target, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';

const partners = [
  { name: 'Liberia Medical Association', type: 'Institutional', description: 'National medical association partnership', icon: Building2 },
  { name: 'Ministry of Health', type: 'Government', description: 'Government health sector collaboration', icon: Building2 },
  { name: 'AMAMU Medical College', type: 'Academic', description: 'Academic institution partnership', icon: BookOpen },
  { name: 'Red Cross Liberia', type: 'NGO', description: 'Humanitarian organization partnership', icon: Heart },
  { name: 'WHO Liberia Office', type: 'International', description: 'World Health Organization collaboration', icon: Globe },
  { name: 'Liberia College of Physicians', type: 'Professional', description: 'Professional body partnership', icon: Users },
];

const partnerTypes = [
  { title: 'Sponsor organizations', description: 'Financial and in-kind support for LMSA programs, events, and student initiatives.', examples: 'Corporate sponsors, foundations, donors', icon: Heart },
  { title: 'Institutional partners', description: 'Long-term collaboration with healthcare institutions, universities, and government bodies.', examples: 'Hospitals, medical schools, Ministry of Health', icon: Building2 },
  { title: 'International partners', description: 'Global partnerships with international medical organizations and student associations.', examples: 'IFMSA, AMSA, international medical schools', icon: Globe },
  { title: 'Alumni network', description: 'Engaging LMSA graduates as mentors, speakers, and career development partners.', examples: 'LMSA alumni worldwide, mentorship network', icon: Users },
];

const partnershipBenefits = [
  { title: 'Reach future physicians', description: 'Connect with Liberia’s next generation of medical professionals and healthcare leaders.', icon: Users },
  { title: 'Support healthcare education', description: 'Directly impact the quality of medical education and healthcare delivery in Liberia.', icon: Target },
  { title: 'Build meaningful visibility', description: 'Gain exposure across LMSA’s digital platforms, events, and community outreach programs.', icon: TrendingUp },
];

const tiers = [
  { name: 'Silver Partner', price: '$500', features: ['Logo on LMSA website', 'Mention in newsletter', 'Access to LMSA events', 'Annual impact report', 'Social media recognition'], tone: 'silver' },
  { name: 'Gold Partner', price: '$1,500', features: ['All Silver benefits', 'Featured on partner page', 'Speaking opportunity at events', 'Direct student engagement', 'Quarterly collaboration reports', 'Priority event sponsorship'], tone: 'gold', popular: true },
  { name: 'Platinum Partner', price: '$3,000', features: ['All Gold benefits', 'Exclusive naming rights', 'Dedicated partnership manager', 'Custom collaboration projects', 'Board meeting invitation', 'First access to opportunities', 'Annual partnership review'], tone: 'platinum' },
];

const inKindSupport = [
  { title: 'Educational resources', description: 'Textbooks, medical journals, online subscriptions', icon: BookOpen },
  { title: 'Technology', description: 'Laptops, software licenses, internet access', icon: Laptop },
  { title: 'Venue & logistics', description: 'Event spaces, transportation, catering', icon: Building2 },
  { title: 'Expertise', description: 'Guest lectures, mentorship, training workshops', icon: Target },
];

const tierStyles = {
  silver: 'border-gray-200 bg-white',
  gold: 'border-amber-300 bg-amber-50',
  platinum: 'border-purple-300 bg-purple-50',
};

export default function PartnershipPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader eyebrow="Get involved / Partnerships" title="The future of healthcare is a shared project." description="Partner with LMSA to invest in medical education, student leadership, research, and community health." />
            <div className="editorial-prose"><p>We build relationships with organizations that want to strengthen the people and systems at the heart of healthcare in Liberia.</p><div className="editorial-stat-grid mt-8"><EditorialStat value="6+" label="Active partners" /><EditorialStat value="500+" label="Students impacted" /></div></div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Ways to work together" title="A partnership can start with the kind of support you want to give." description="We offer flexible partnership models to suit your organization’s goals and capacity." />
          <div className="grid gap-4 md:grid-cols-2">{partnerTypes.map(({ title, description, examples, icon: Icon }, index) => <article key={title} className="editorial-link-card"><span className="editorial-link-card-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span><div className="editorial-link-card-copy"><span className="editorial-card-eyebrow">0{index + 1} / Partnership</span><h3>{title}</h3><p>{description}</p></div><span className="mt-5 block text-xs leading-5 text-gray-500">Examples: {examples}</span></article>)}</div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Our current partners" title="Good work gets stronger when it is connected." description="Organizations collaborating with LMSA to advance medical education and student opportunity." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{partners.map(({ name, type, description, icon: Icon }) => <article key={name} className="border border-gray-200 bg-white p-6"><span className="flex h-11 w-11 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span><h3 className="mt-7 text-lg font-semibold text-lmsa-900">{name}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p><span className="mt-5 inline-flex bg-lmsa-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-lmsa-700">{type}</span></article>)}</div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Why partner with LMSA?" title="Your support reaches the people shaping the next generation of care." description="A partnership connects your organization with students, ideas, and programs that can have a long-term effect." />
          <div className="grid gap-4 md:grid-cols-3">{partnershipBenefits.map(({ title, description, icon: Icon }, index) => <article key={title} className="border border-gray-200 bg-white p-6"><span className="text-sm font-bold text-lmsa-700">0{index + 1}</span><span className="mt-6 flex h-11 w-11 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span><h3 className="mt-6 text-xl font-semibold text-lmsa-900">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p></article>)}</div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Choose your level of engagement" title="Partnership tiers with room to grow." description="Choose the level of engagement that works for your organization. Every tier helps strengthen the student community." />
          <div className="grid gap-4 md:grid-cols-3">{tiers.map((tier, index) => <article key={tier.name} className={`relative border-2 p-6 ${tierStyles[tier.tone]}`}>{tier.popular && <span className="absolute -top-3 left-6 bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">Most popular</span>}<span className="text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">0{index + 1} / Tier</span><h3 className="mt-6 text-2xl font-semibold text-lmsa-900">{tier.name}</h3><p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-gray-900">{tier.price}<span className="ml-1 text-sm font-normal text-gray-500">per year</span></p><ul className="mt-6 space-y-3">{tier.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-gray-700"><CheckCircle size={16} className="mt-1 shrink-0 text-lmsa-600" aria-hidden="true" /><span>{feature}</span></li>)}</ul><Link to="/contact" className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-lmsa-600 px-4 py-3 text-sm font-semibold text-white hover:bg-lmsa-700">Get started</Link></article>)}</div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Beyond financial contributions" title="In-kind support can meet an immediate need." description="Your organization can provide practical support that directly benefits our members and programs." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{inKindSupport.map(({ title, description, icon: Icon }) => <article key={title} className="border border-gray-200 bg-white p-5"><span className="flex h-10 w-10 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span><h3 className="mt-6 text-base font-semibold text-lmsa-900">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p></article>)}</div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-stat-grid"><EditorialStat value="6+" label="Active partners" /><EditorialStat value="500+" label="Students impacted" /><EditorialStat value="$15K+" label="Annual support value" /><EditorialStat value="12" label="Collaborative programs" /></div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout eyebrow="Start a partnership" title="Bring your organization into the work." description="Reach out to discuss how we can work together to advance medical education and healthcare in Liberia." action={{ label: 'Use our contact form', to: '/contact' }} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><a href="mailto:partnerships@lmsa.org.lr" className="flex items-center gap-4 border border-gray-200 bg-white p-5 hover:border-lmsa-400"><Mail size={21} className="text-lmsa-700" aria-hidden="true" /><span className="text-sm font-semibold text-lmsa-900">partnerships@lmsa.org.lr</span></a><a href="tel:+231770000000" className="flex items-center gap-4 border border-gray-200 bg-white p-5 hover:border-lmsa-400"><Phone size={21} className="text-lmsa-700" aria-hidden="true" /><span className="text-sm font-semibold text-lmsa-900">+231 77 000 0000</span></a></div>
        </div>
      </section>
    </main>
  );
}