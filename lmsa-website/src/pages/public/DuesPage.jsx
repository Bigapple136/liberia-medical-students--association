import { useEffect } from 'react';
import { CreditCard, DollarSign, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const paymentNotes = [
  { icon: CreditCard, title: 'Online payment', items: ['Mobile money (MTN, Orange)', 'Bank transfer', 'Payment portal (coming soon)'] },
  { icon: DollarSign, title: 'In-person payment', items: ['Cash to class representative', 'Direct to LMSA office', 'At LMSA events'] },
];

const importantInformation = [
  ['Payment deadline', 'Dues must be paid by October 31st each year'],
  ['Grace period', '30-day grace period after deadline'],
  ['Financial hardship', 'Payment plans and waivers available upon request'],
  ['Receipt', 'Always request and keep your payment receipt'],
];

// One row per category, priced the same way as the membership-types ledger.
const duesCategories = [
  { name: 'Full Member', audience: 'currently enrolled medical students', price: '$25', period: 'a year' },
  { name: 'Associate Member', audience: 'prospective students and affiliates', price: '$15', period: 'a year' },
  { name: 'Honorary Member', audience: 'faculty and alumni supporters', price: 'By invitation', period: '' },
  { name: 'Veteran Member', audience: 'alumni and past members', price: 'Free', period: '' },
];

export default function DuesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            title="A transparent contribution to a shared student infrastructure."
            description="Review the current fee structure, payment routes, and the practical details that keep your membership active."
          />
          <div className="editorial-stat-grid">
            <div className="editorial-stat"><strong>$25</strong><span>Full member</span><small>Annual membership for currently enrolled medical students.</small></div>
            <div className="editorial-stat"><strong>$15</strong><span>Associate member</span><small>Annual membership for prospective students and affiliates.</small></div>
            <div className="editorial-stat"><strong>Oct 31</strong><span>Payment deadline</span><small>A 30-day grace period follows the annual deadline.</small></div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            title="Know the cost before you apply."
            description="Dues cover a full year and are due by October 31st each year."
          />
          <ol className="lg:max-w-4xl">
            {duesCategories.map((category, index) => (
              <li
                key={category.name}
                className="-mx-2 grid px-2 py-7 sm:-mx-3 sm:px-3 lg:-mx-4 lg:grid-cols-[1fr_auto] lg:items-baseline lg:gap-12 lg:px-4 lg:py-6"
              >
                <div className="reveal-on-scroll" style={{ transitionDelay: `${index * 70}ms` }}>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="font-serif text-2xl font-bold leading-snug tracking-[-0.01em] text-lmsa-900 md:text-[1.75rem]">
                      {category.name}
                    </h3>
                    {/* The fee reads on the name line; the column takes over at lg. */}
                    <p className="ml-auto whitespace-nowrap font-serif text-lg font-bold leading-none tracking-[-0.02em] text-lmsa-800 lg:hidden">
                      {category.price}
                      {category.period && (
                        <span className="ml-1 text-sm font-normal tracking-normal text-gray-600">
                          {category.period}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="mt-1 text-balance text-sm leading-6 text-gray-600">
                    For {category.audience}
                  </p>
                </div>
                <p
                  className="reveal-on-scroll hidden whitespace-nowrap font-serif text-[clamp(1.6rem,2.2vw,1.9rem)] font-bold leading-none tracking-[-0.02em] text-lmsa-800 lg:block"
                  style={{ transitionDelay: `${index * 70 + 60}ms` }}
                >
                  {category.price}
                  {category.period && (
                    <span className="ml-2 text-sm font-normal tracking-normal text-gray-600">
                      {category.period}
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader title="Choose the route that works for you." description="If you are unsure which payment option to use, reach out before sending your dues." />
          <div className="grid gap-4 md:grid-cols-2">
            {paymentNotes.map(({ icon: Icon, title, items }) => (
              <article key={title} className="border-t-4 border-lmsa-600 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                <h3 className="mt-7 text-2xl font-semibold text-lmsa-900">{title}</h3>
                <ul className="mt-4 space-y-3 text-base leading-7 text-gray-700">
                  {items.map((item) => <li key={item} className="flex gap-3"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <EditorialSectionHeader title="A few details to keep your membership in good standing." description="Save these reminders when you plan your application or renewal." />
            <div className="editorial-article-list">
              {importantInformation.map(([label, detail], index) => (
                <div key={label} className="editorial-article-row">
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span><b className="font-semibold text-lmsa-900">{label}:</b> {detail}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-start gap-4 border-l-2 border-lmsa-600 bg-white p-6">
            <Info size={22} className="mt-1 shrink-0 text-lmsa-700" aria-hidden="true" />
            <p className="text-sm leading-6 text-gray-700">Payment questions and hardship requests can be discussed with the LMSA team before the deadline.</p>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            title="Activate your place in the LMSA community."
            description="Review your membership category, then start the application process."
            action={{ label: 'Start your membership', to: '/membership#apply' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Need a quick comparison? <Link to="/membership/categories" className="font-semibold text-lmsa-700 hover:text-lmsa-900">View membership types</Link>
          </p>
        </div>
      </section>
    </main>
  );
}