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

// The four dates and rules that decide whether a payment counts.
const paymentTerms = [
  { label: 'Payment deadline, each year', value: '31 October' },
  { label: 'Grace period after the deadline', value: '30 days' },
  { label: 'Hardship: plans and waivers on request', value: 'Ask first' },
  { label: 'Receipt: ask for one with every payment', value: 'Keep it' },
];

// The four parts of the year members reach for most; full detail on the benefits page.
const included = [
  {
    title: 'Academic resources',
    copy: 'Study materials and learning resources shared through the member library.',
  },
  {
    title: 'Mentorship',
    copy: 'Pairing with senior students for academic and career guidance.',
  },
  {
    title: 'Events and conferences',
    copy: 'Symposia, workshops, and medical conferences through your member account.',
  },
  {
    title: 'Leadership development',
    copy: 'Run for office, join committees, and build leadership skills.',
  },
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
      {/* The fee, set beside a face rather than stretched across the page. */}
      <section className="editorial-section py-16 md:py-24">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[1.28fr_0.72fr] lg:gap-16">
            <div>
              <h2 className="reveal-on-scroll font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                What each member pays.
              </h2>
              <p className="reveal-on-scroll mt-5 max-w-[46ch] text-pretty text-xl leading-8 text-gray-700" style={{ transitionDelay: '60ms' }}>
                Prices are annual and cover a full year of membership. Honorary membership is by
                invitation only.
              </p>

              <ol className="mt-10">
                {duesCategories.map((category) => (
                  <li
                    key={category.name}
                    className="grid gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-8 sm:py-7"
                  >
                    <div className="reveal-on-scroll">
                      <h3 className="font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-base leading-7 text-gray-700">{category.audience}</p>
                    </div>
                    {/* Phones stack the amount under the audience, right-aligned. */}
                    <p
                      className="reveal-on-scroll justify-self-end whitespace-nowrap font-serif text-[1.75rem] font-bold leading-none tracking-[-0.02em] text-lmsa-800"
                      style={{ transitionDelay: '60ms' }}
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
            </div>

            <figure className="reveal-on-scroll flex flex-col lg:h-full" style={{ transitionDelay: '90ms' }}>
              <Photo
                src={stockPhotos.stories.medicalCamp.src}
                alt={stockPhotos.stories.medicalCamp.alt}
                fallbackGradient="bg-lmsa-800"
                className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[440px]"
                imgClassName="photo-drift"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* The rules around the payment, as four facts you can read in one pass. */}
      <section className="editorial-section editorial-section-muted py-16 md:py-24">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
            <div className="reveal-on-scroll">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                How the year runs.
              </h2>
              <p className="mt-4 max-w-[34ch] text-pretty text-base leading-7 text-gray-700">
                The four dates and rules that decide whether a payment counts.
              </p>
            </div>

            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {paymentTerms.map(({ label, value }, index) => (
                <div
                  key={label}
                  className="reveal-on-scroll"
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <dt className="text-base leading-7 text-gray-700">{label}</dt>
                  <dd className="mt-2 font-serif text-[1.75rem] font-bold leading-none tracking-[-0.02em] text-lmsa-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Answers the question the fee raises: what does the year actually hold? */}
      <section className="editorial-section py-16 md:py-24">
        <div className="site-container">
          <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <figure className="reveal-on-scroll">
              <Photo
                src={stockPhotos.sections.connect.src}
                alt={stockPhotos.sections.connect.alt}
                fallbackGradient="bg-lmsa-800"
                className="aspect-[4/3] w-full"
              />
            </figure>

            <div>
              <h2 className="reveal-on-scroll font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                What the year includes.
              </h2>
              <p className="reveal-on-scroll mt-4 max-w-[46ch] text-pretty text-base leading-7 text-gray-700">
                Membership runs for a year. These are four parts of it.
              </p>

              <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                {included.map(({ title, copy }, index) => (
                  <li
                    key={title}
                    className="reveal-on-scroll"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <h3 className="font-serif text-xl font-semibold text-lmsa-900">{title}</h3>
                    <p className="mt-1 text-base leading-7 text-gray-700">{copy}</p>
                  </li>
                ))}
              </ul>

              <Link
                to="/membership/benefits"
                className="reveal-on-scroll mt-8 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-lmsa-900 hover:decoration-lmsa-900"
              >
                See all benefits
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The page's dark anchor: the two routes money can take. */}
      <section className="bg-lmsa-900 py-16 text-lmsa-50 md:py-24">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="reveal-on-scroll">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[2.25rem]">
                Two ways to pay.
              </h2>
              <p className="mt-4 max-w-[40ch] text-pretty text-base leading-7 text-lmsa-100">
                If you are unsure which option to use, ask before sending your dues.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
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
                  <h3 className="font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-white">
                    {route.name}
                  </h3>
                  <ul className="mt-5 space-y-3 text-base leading-7 text-lmsa-100">
                    {route.methods.map((method) => (
                      <li key={method} className="flex gap-3">
                        <span
                          className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-400"
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

      <section className="editorial-section pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="site-container">
          <div className="grid overflow-hidden lg:grid-cols-[1.12fr_0.88fr]">
            <div className="reveal-on-scroll bg-lmsa-50 p-8 md:p-12 lg:p-14">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                Activate your membership.
              </h2>
              <p className="mt-4 max-w-[40ch] text-pretty text-base leading-7 text-gray-700">
                Review your category, then start the application process.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to="/membership#apply"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-lmsa-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-lmsa-800"
                >
                  Start your membership
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/membership/categories"
                  className="inline-flex min-h-11 items-center text-base font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-800"
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
            being collected: Priscilla Du Preez, Nappy, You X Ventures, and Mimi Thian via Unsplash.
          </p>
        </div>
      </section>
    </main>
  );
}
