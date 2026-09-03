import { BookOpen, Building2, Check, Globe, Heart, Mail, Minus, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Photo from '@components/common/Photo';
import { stockPhotos } from '@config/images';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const outcomes = [
  {
    title: 'Reach future physicians',
    description: 'Connect with Liberia’s next generation of medical professionals and healthcare leaders.',
  },
  {
    title: 'Support healthcare education',
    description: 'Directly impact the quality of medical education and healthcare delivery in Liberia.',
  },
  {
    title: 'Build meaningful visibility',
    description: 'Gain exposure across LMSA’s digital platforms, events, and community outreach programmes.',
  },
];

const seeking = [
  {
    title: 'Medical and nursing schools',
    description: 'Curriculum support, exchange places, and supervisors for student research.',
    icon: BookOpen,
  },
  {
    title: 'Hospitals and clinics',
    description: 'Clinical placement slots, supervision, and service-learning sites for students.',
    icon: Building2,
  },
  {
    title: 'Government and public health bodies',
    description: 'Joint health campaigns, outreach data, and county-level programmes.',
    icon: Target,
  },
  {
    title: 'NGOs and humanitarian organisations',
    description: 'Community health programmes delivered together, from planning to follow-up.',
    icon: Heart,
  },
  {
    title: 'International medical associations',
    description: 'Exchanges, global health projects, and shared student leadership training.',
    icon: Globe,
  },
  {
    title: 'Companies and employers',
    description: 'Sponsorship, equipment, internships, and mentors from your own teams.',
    icon: Users,
  },
];

const financialSupport = [
  {
    title: 'Underwrite a programme',
    description: 'A symposium, a workshop, or a community health camp, from venue to follow-up.',
  },
  {
    title: 'Fund a bursary',
    description: 'Cover fees, books, or equipment for a student who would otherwise go without.',
  },
  {
    title: 'Back student research',
    description: 'Support the costs of data collection, supervision, and publication.',
  },
];

const inKindSupport = [
  {
    title: 'Educational resources',
    description: 'Textbooks, medical journals, online subscriptions',
  },
  {
    title: 'Technology',
    description: 'Laptops, software licences, internet access',
  },
  {
    title: 'Venue & logistics',
    description: 'Event spaces, transportation, catering',
  },
  {
    title: 'Expertise',
    description: 'Guest lectures, mentorship, training workshops',
  },
];

const levelFeatures = [
  'Logo and link on lmsa.org.lr',
  'Recognition in our newsletter and on social media',
  'Invitations to LMSA events and symposia',
  'Annual impact report',
  'Speaking slot at a symposium or workshop',
  'Direct student engagement — mentoring, placements, recruitment',
  'A named programme built around your organisation',
];

const levels = [
  {
    name: 'Silver',
    summary: 'Programme supporter',
    bestFor: 'Organisations supporting a single programme, event, or cohort.',
    includes: [true, true, true, true, false, false, false],
    featured: false,
  },
  {
    name: 'Gold',
    summary: 'Core partner',
    bestFor: 'Organisations working with us across the academic year.',
    includes: [true, true, true, true, true, true, false],
    featured: true,
  },
  {
    name: 'Platinum',
    summary: 'Strategic partner',
    bestFor: 'Organisations building a named, multi-year programme with us.',
    includes: [true, true, true, true, true, true, true],
    featured: false,
  },
];

const steps = [
  {
    title: 'You tell us what you have in mind',
    description:
      'Write to us with what your organisation can offer and what you would like in return. There is no form to decipher and no package to pick.',
  },
  {
    title: 'We shape it together',
    description:
      'A conversation with the External Relations Committee, then a short written scope: the programme, the students it reaches, and how we report back.',
  },
  {
    title: 'We start, and we show the work',
    description:
      'Once the scope is agreed we begin, and you receive the annual impact report covering every programme your support touched.',
  },
];

export default function PartnershipPage() {
  return (
    <div className="editorial-page partnership-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Why partner with LMSA"
              title="Your support reaches the people who will deliver Liberia’s care."
              description="A partnership connects your organisation with the students, ideas, and programmes shaping healthcare in Liberia."
            />
            <div className="editorial-prose">
              <p>
                LMSA is the national voice of Liberia’s medical students — the people who will be
                practising here long after today’s projects have ended. We bring them together to
                learn, lead, advocate, and serve the communities that need them most.
              </p>
              <p>
                Partners do not fund an abstraction. They fund the symposia where students present
                their first research, the health camps that reach counties without a resident
                doctor, and the training that keeps a newly qualified physician in the country.
              </p>
              <ul className="partnership-ledger">
                {outcomes.map(({ title, description }) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted" id="who-we-are-looking-for">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Who we are looking for"
            title="Start with the kind of partner you are."
            description="LMSA is building its formal partnerships now. These are the organisations we most want to work with — and the shape we imagine the work taking."
          />
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <ul className="partnership-seeking">
              {seeking.map(({ title, description, icon: Icon }) => (
                <li key={title} className="partnership-seeking-row">
                  <span className="partnership-seeking-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Photo
              src={stockPhotos.sections.connect.src}
              alt={stockPhotos.sections.connect.alt}
              className="partnership-figure"
              imgClassName="object-cover"
              fallbackGradient="bg-gradient-to-br from-lmsa-900 to-lmsa-700"
              overlay="bg-gradient-to-t from-lmsa-900/85 via-lmsa-900/25 to-transparent"
            >
              <p className="partnership-figure-caption">
                Already working with LMSA? Write to us and we will add your organisation — and your
                logo — to this page.
              </p>
            </Photo>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Ways to give"
            title="Money is one route. Expertise is another."
            description="Tell us what your organisation can offer and we will build the partnership around it."
          />
          <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="partnership-subhead">Financial support</h3>
              <ul className="partnership-ledger">
                {financialSupport.map(({ title, description }) => (
                  <li key={title}>
                    <h4 className="partnership-ledger-title">{title}</h4>
                    <p>{description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="partnership-subhead">In-kind support</h3>
              <ul className="partnership-ledger">
                {inKindSupport.map(({ title, description }) => (
                  <li key={title}>
                    <h4 className="partnership-ledger-title">{title}</h4>
                    <p>{description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Levels of engagement"
            title="Three ways to work together."
            description="Each level is a scope, not a price list. We agree the commitment with you, in writing, before anything begins."
          />
          <div className="partnership-levels">
            {levels.map((level) => (
              <article
                key={level.name}
                className={`partnership-level ${level.featured ? 'partnership-level-featured' : ''}`}
              >
                <header>
                  {level.featured && <p className="partnership-level-badge">A good place to start</p>}
                  <h3>{level.name}</h3>
                  <p className="partnership-level-summary">{level.summary}</p>
                </header>
                <p className="partnership-level-best">
                  <span>Best for</span>
                  {level.bestFor}
                </p>
                <ul className="partnership-level-list">
                  {levelFeatures.map((feature, index) => {
                    const included = level.includes[index];
                    return (
                      <li
                        key={feature}
                        className={included ? undefined : 'partnership-level-absent'}
                      >
                        {included ? (
                          <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                        ) : (
                          <Minus size={16} strokeWidth={2.25} aria-hidden="true" />
                        )}
                        <span className="sr-only">{included ? 'Included: ' : 'Not included: '}</span>
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="partnership-level-commitment">Commitment agreed together, in writing.</p>
                <Link
                  to={`/contact?topic=partnership&level=${level.name.toLowerCase()}`}
                  className="partnership-level-cta"
                >
                  Talk to us about {level.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="How it works"
            title="Three steps from an email to a programme."
            description="No procurement portal, no fixed packages — a conversation, a written scope, and then the work."
          />
          <ol className="partnership-steps">
            {steps.map(({ title, description }, index) => (
              <li key={title} className="partnership-step">
                <p className="partnership-step-index">Step {index + 1}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Start a partnership"
            title="Bring your organisation into the work."
            description="Write to us about what you can offer and we will come back to you with a first conversation."
            action={{ label: 'Use our contact form', to: '/contact?topic=partnership' }}
          />
          <div className="partnership-contact">
            <a href="mailto:partnerships@lmsa.org.lr?subject=Partnership%20enquiry">
              <Mail size={21} className="text-lmsa-700" aria-hidden="true" />
              <span className="text-sm font-semibold text-lmsa-900">partnerships@lmsa.org.lr</span>
            </a>
            <Link to="/contact?topic=partnership">
              <Users size={21} className="text-lmsa-700" aria-hidden="true" />
              <span className="text-sm font-semibold text-lmsa-900">
                Ask for a call with the External Relations Committee
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
