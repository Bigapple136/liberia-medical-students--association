import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Photo from '../../components/common/Photo';
import { stockPhotos } from '../../config/images';

// One row per category, priced the same way as the membership-types ledger.
const duesCategories = [
  { name: 'Full Member', audience: 'Currently enrolled medical students', price: '$25', period: 'a year' },
  { name: 'Associate Member', audience: 'Prospective students and affiliates', price: '$15', period: 'a year' },
  { name: 'Honorary Member', audience: 'Faculty and alumni supporters', price: 'By invitation', period: '' },
  { name: 'Veteran Member', audience: 'Alumni and past members', price: 'Free', period: '' },
];

const paymentTerms = [
  ['Payment deadline', '31 October, each year'],
  ['Grace period', '30 days after the deadline'],
  ['Financial hardship', 'Payment plans and waivers on request'],
  ['Receipt', 'Always request and keep your payment receipt'],
];

const paymentRoutes = [
  {
    name: 'Online payment',
    methods: ['Mobile money (MTN, Orange)', 'Bank transfer', 'Payment portal (coming soon)'],
  },
  {
    name: 'In person',
    methods: ['Cash to your class representative', 'Direct to the LMSA office', 'At LMSA events'],
  },
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
    <main className="editorial-page dues-page">
      {/* The fee is the reason anyone opens this page, so it comes first. */}
      <section className="editorial-section editorial-section-muted py-16 md:py-24">
        <div className="site-container">
          <div className="reveal-on-scroll max-w-2xl">
            <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
              Four categories, four amounts.
            </h2>
            <p className="mt-5 max-w-[56ch] text-pretty text-base leading-7 text-gray-700">
              Prices are annual and cover a full year of membership. Honorary membership is by
              invitation only.
            </p>
          </div>

          <ol className="mt-10 lg:mt-12">
            {duesCategories.map((category) => (
              <li
                key={category.name}
                className="grid gap-y-2 py-7 lg:grid-cols-[1.05fr_1fr_auto] lg:items-baseline lg:gap-x-10 lg:py-8"
              >
                <h3 className="reveal-on-scroll font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
                  {category.name}
                </h3>
                <p
                  className="reveal-on-scroll text-base leading-7 text-gray-700"
                  style={{ transitionDelay: '60ms' }}
                >
                  {category.audience}
                </p>
                {/* Phones stack the amount under the audience; the third column takes over at lg. */}
                <p
                  className="reveal-on-scroll justify-self-end whitespace-nowrap font-serif text-[1.75rem] font-bold leading-none tracking-[-0.02em] text-lmsa-800"
                  style={{ transitionDelay: '120ms' }}
                >
                  {category.price}
                  {category.period && (
                    <span className="ml-2 text-base font-normal tracking-normal text-gray-600">
                      {category.period}
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ol>

          {/* The terms read as the footer of the same statement, not a second list. */}
          <dl className="mt-8 grid gap-x-10 gap-y-8 bg-white p-7 sm:grid-cols-2 lg:grid-cols-4 lg:p-10">
            {paymentTerms.map(([label, detail], index) => (
              <div
                key={label}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <dt className="text-[13px] font-semibold text-lmsa-700">{label}</dt>
                <dd className="mt-2 text-pretty text-base leading-7 text-gray-700">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The community the fees belong to. */}
      <section className="editorial-section py-0">
        <div className="site-container">
          <div className="grid gap-5 sm:grid-cols-[1.12fr_0.88fr] sm:items-start lg:gap-6">
            <figure className="reveal-on-scroll">
              <Photo
                src={stockPhotos.sections.connect.src}
                alt={stockPhotos.sections.connect.alt}
                fallbackGradient="bg-lmsa-800"
                className="aspect-[4/3] w-full sm:aspect-[16/10]"
                imgClassName="photo-drift"
              />
            </figure>
            <figure
              className="reveal-on-scroll sm:mt-14"
              style={{ transitionDelay: '90ms' }}
            >
              <Photo
                src={stockPhotos.stories.medicalCamp.src}
                alt={stockPhotos.stories.medicalCamp.alt}
                fallbackGradient="bg-lmsa-900"
                className="aspect-[4/3] w-full sm:aspect-[4/5]"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="editorial-section py-16 md:py-24">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="reveal-on-scroll">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                Two ways to pay.
              </h2>
              <p className="mt-5 max-w-[42ch] text-pretty text-base leading-7 text-gray-700">
                If you are unsure which option to use, ask before sending your dues.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-lmsa-900 hover:decoration-lmsa-900"
              >
                Ask about a payment plan
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
              {paymentRoutes.map((route, index) => (
                <div
                  key={route.name}
                  className="reveal-on-scroll"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <h3 className="font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
                    {route.name}
                  </h3>
                  <ul className="mt-5 space-y-3 text-base leading-7 text-gray-700">
                    {route.methods.map((method) => (
                      <li key={method} className="flex gap-3">
                        <span
                          className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600"
                          aria-hidden="true"
                        />
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section pb-16 pt-0 md:pb-24">
        <div className="site-container">
          <div className="grid overflow-hidden lg:grid-cols-[1.12fr_0.88fr]">
            <div className="reveal-on-scroll bg-lmsa-900 p-8 text-lmsa-50 md:p-12 lg:p-14">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] md:text-[2.25rem]">
                Activate your membership.
              </h2>
              <p className="mt-4 max-w-[40ch] text-pretty text-base leading-7 text-lmsa-100">
                Review your category, then start the application process.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to="/membership#apply"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-semibold text-lmsa-900 transition-colors hover:bg-lmsa-50"
                >
                  Start your membership
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/membership/categories"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
                >
                  Compare the four categories
                </Link>
              </div>
            </div>

            <figure className="reveal-on-scroll relative min-h-[260px] lg:min-h-0" style={{ transitionDelay: '90ms' }}>
              <Photo
                src={stockPhotos.hero.leadership.src}
                alt={stockPhotos.hero.leadership.alt}
                fallbackGradient="bg-gray-900"
                className="h-full w-full"
              />
            </figure>
          </div>

          <p className="mt-6 max-w-[64ch] text-base leading-7 text-gray-600">
            Photographs on this page are licensed stock images used while LMSA’s own photography is
            being collected: You X Ventures, Nappy, and Mimi Thian via Unsplash.
          </p>
        </div>
      </section>
    </main>
  );
}
