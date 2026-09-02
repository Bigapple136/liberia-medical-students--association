import { Award, Check, Info, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const categories = [
  {
    name: 'Full Member',
    price: '$25/year',
    audience: 'All medical students currently enrolled',
    included: ['Full voting rights', 'Eligible to run for office', 'Access to all resources', 'Committee participation', 'Register for LMSA events'],
    limits: [],
    recommended: true,
  },
  {
    name: 'Associate Member',
    price: '$15/year',
    audience: 'Pre-medical and health sciences students',
    included: ['Access to events and resources', 'Committee participation', 'Pathway to full membership'],
    limits: ['No voting rights', 'Cannot hold elected office'],
  },
  {
    name: 'Honorary Member',
    price: 'By invitation',
    audience: 'Faculty and alumni supporters',
    included: ['Recognized contributors', 'Advisory role', 'Lifetime appointment'],
    limits: ['No voting rights', 'Cannot hold office'],
    invitationOnly: true,
  },
];

export default function CategoriesPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Membership / Categories"
              title="There is more than one way to belong to LMSA."
              description="Choose the category that reflects your current relationship to medical education and the association."
            />
            <div className="editorial-note self-start">
              <p>Most medical students qualify as Full Members with complete privileges and responsibilities.</p>
              <span>A simple place to begin</span>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Compare your options" title="Membership that meets you where you are." description="Every category has a clear role, set of privileges, and way to participate in the LMSA community." />
          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category, index) => (
              <article key={category.name} className={`flex flex-col border border-gray-200 bg-white p-6 ${category.recommended ? 'border-t-4 border-t-lmsa-600' : ''}`}>
                {category.recommended && <span className="editorial-card-eyebrow text-lmsa-700">Most common</span>}
                <span className="mt-4 flex h-11 w-11 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true"><Award size={22} strokeWidth={1.5} /></span>
                <div className="mt-5 flex grow flex-col">
                  <span className="editorial-card-eyebrow">0{index + 1} / Membership type</span>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{category.name}</h3>
                  <p className="mt-3 text-2xl font-semibold text-lmsa-700">{category.price}</p>
                  <p className="mt-3 border-l-2 border-lmsa-200 pl-3 text-sm leading-6 text-gray-600">For {category.audience.charAt(0).toLowerCase() + category.audience.slice(1)}</p>
                  <ul className="mt-5 space-y-3">
                    {category.included.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                        <Check size={16} className="mt-1 shrink-0 text-lmsa-600" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {category.limits.map((limit) => (
                      <li key={limit} className="flex items-start gap-2 text-sm leading-6 text-gray-500">
                        <Minus size={16} className="mt-1 shrink-0 text-gray-400" aria-hidden="true" />
                        <span>
                          {limit}
                          <span className="sr-only"> (limitation)</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {category.invitationOnly ? (
                    <p className="mt-auto pt-7 text-sm leading-6 text-gray-600">
                      Offered by invitation — there is no application.{' '}
                      <Link to="/contact" className="font-semibold text-lmsa-700 hover:text-lmsa-900">Suggest someone</Link>
                    </p>
                  ) : (
                    <div className="mt-auto pt-7">
                      <Link
                        to="/membership#apply"
                        className={`flex items-center justify-center px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 ${category.recommended ? 'bg-lmsa-600 text-white hover:bg-lmsa-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <span className="sr-only">{category.name}: </span>
                        Apply now
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="flex items-start gap-4 border-l-2 border-lmsa-600 bg-lmsa-50 p-6">
            <Info size={22} className="mt-1 shrink-0 text-lmsa-700" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-lmsa-900">Need help choosing?</h2>
              <p className="mt-2 text-base leading-7 text-gray-700">
                Questions about eligibility or member rights?{' '}
                <Link to="/contact" className="font-semibold text-lmsa-700 hover:underline">Contact the LMSA team</Link> and we will point you to the right category.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Keep moving"
            title="Once you know your category, the next step is straightforward."
            description="See the annual dues and payment options, then submit your application through LMSA."
            action={{ label: 'View dues and payments', to: '/membership/dues' }}
          />
        </div>
      </section>
    </main>
  );
}
