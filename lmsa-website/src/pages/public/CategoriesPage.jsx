import { useEffect } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Photo from '../../components/common/Photo';
import { stockPhotos } from '../../config/images';

const categories = [
  {
    name: 'Full Member',
    price: '$25',
    period: 'a year',
    audience: 'Current medical students',
    included:
      'Voting rights, eligibility to run for office, access to all resources, committee participation, and registration for LMSA events.',
    limits: '',
    note: 'Most medical students qualify for this category.',
    apply: true,
  },
  {
    name: 'Associate Member',
    price: '$15',
    period: 'a year',
    audience: 'Pre-medical and health sciences students',
    included:
      'Access to events and resources, committee participation, and a pathway to full membership.',
    limits: 'no voting rights and no elected office',
    apply: true,
  },
  {
    name: 'Honorary Member',
    price: 'By invitation',
    period: '',
    audience: 'Faculty and alumni supporters',
    included:
      'Recognition as a contributor, an advisory role, and a lifetime appointment.',
    limits: 'no voting rights and no elected office',
    note: 'Offered by invitation — there is no application.',
    invite: true,
  },
  {
    name: 'Veteran Member',
    price: 'Free',
    period: '',
    audience: 'Alumni and past members',
    included: 'The alumni network, mentorship opportunities, and reunion events.',
    limits: '',
    apply: true,
  },
];

export default function CategoriesPage() {
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
      {/* Opener: a tariff page, so the four prices are the first thing on screen. */}
      <section className="editorial-section pb-8">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div className="reveal-on-scroll">
              <h1 className="max-w-[13ch] font-serif text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-lmsa-900">
                Four ways to belong.
              </h1>
              <p className="mt-7 max-w-[52ch] text-lg leading-8 text-gray-800">
                Each category carries a different set of rights, responsibilities, and costs. Pick
                the one that matches where you are in your training.
              </p>
              <a
                href="#categories"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-lmsa-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700"
              >
                Compare the four categories
                <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
            <dl className="reveal-on-scroll self-start" style={{ transitionDelay: '80ms' }}>
              {categories.map(({ name, price, period }, index) => (
                <div
                  key={name}
                  className="reveal-on-scroll flex items-baseline justify-between gap-6 py-3"
                  style={{ transitionDelay: `${index * 60 + 120}ms` }}
                >
                  <dt className="text-sm font-medium text-gray-700">{name}</dt>
                  <dd className="whitespace-nowrap text-right font-serif text-xl font-bold text-lmsa-900">
                    {price}
                    {period && <span className="ml-1 text-sm font-normal text-gray-600">{period}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* The ledger: four priced rows instead of four equal cards. */}
      <section id="categories" className="editorial-section editorial-section-muted scroll-mt-28">
        <div className="site-container">
          <div className="reveal-on-scroll max-w-2xl">
            <h2 className="text-[clamp(1.7rem,3.2vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-lmsa-900">
              The four categories, line by line.
            </h2>
            <p className="mt-4 text-balance text-base leading-7 text-gray-700 md:text-lg">
              Prices are annual. Every row lists what the category includes and, where it applies,
              what it does not.
            </p>
          </div>
          <ol className="mt-10">
            {categories.map((category, index) => (
              <li
                key={category.name}
                className="group -mx-2 grid gap-5 px-2 py-9 transition-colors duration-200 focus-within:bg-[#f7f6f2] sm:-mx-3 sm:px-3 md:py-11 lg:-mx-4 lg:grid-cols-[1fr_0.62fr_1.45fr_auto] lg:items-start lg:gap-10 lg:px-4 [@media(hover:hover)]:hover:bg-[#f7f6f2]"
              >
                <div
                  className="reveal-on-scroll"
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <h3 className="font-serif text-2xl font-bold leading-snug tracking-[-0.01em] text-lmsa-900 md:text-[1.75rem]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-balance text-sm leading-6 text-gray-600">For {category.audience.charAt(0).toLowerCase() + category.audience.slice(1)}</p>
                  {category.note && (
                    <p className="mt-3 max-w-[30ch] text-balance text-sm leading-6 text-lmsa-800">{category.note}</p>
                  )}
                </div>
                <p
                  className="reveal-on-scroll whitespace-nowrap font-serif text-[clamp(1.6rem,2.2vw,1.9rem)] font-bold leading-none tracking-[-0.02em] text-lmsa-800"
                  style={{ transitionDelay: `${index * 70 + 60}ms` }}
                >
                  {category.price}
                  {category.period && (
                    <span className="mt-1 block text-sm font-normal tracking-normal text-gray-600">
                      {category.period}
                    </span>
                  )}
                </p>
                <div
                  className="reveal-on-scroll"
                  style={{ transitionDelay: `${index * 70 + 120}ms` }}
                >
                  <p className="max-w-[48ch] text-balance text-base leading-7 text-gray-800">
                    {category.included}
                  </p>
                  {category.limits && (
                    <p className="mt-2 max-w-[48ch] text-balance text-base leading-7 text-gray-600">
                      Limits: {category.limits}.
                    </p>
                  )}
                </div>
                <div
                  className="reveal-on-scroll lg:pt-1 lg:text-right"
                  style={{ transitionDelay: `${index * 70 + 180}ms` }}
                >
                  {category.invite ? (
                    <Link
                      to="/contact"
                      className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-lmsa-900 hover:decoration-lmsa-900 group-focus-within:text-lmsa-900 group-focus-within:decoration-lmsa-900 group-hover:text-lmsa-900 group-hover:decoration-lmsa-900"
                    >
                      Suggest someone
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-focus-within:translate-x-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  ) : (
                    <Link
                      to="/membership#apply"
                      className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-lmsa-900 hover:decoration-lmsa-900 group-focus-within:text-lmsa-900 group-focus-within:decoration-lmsa-900 group-hover:text-lmsa-900 group-hover:decoration-lmsa-900"
                    >
                      Apply
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-focus-within:translate-x-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing: the last word is the people a category belongs to, not a button. */}
      <section className="editorial-section">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-end lg:gap-16">
            <div className="reveal-on-scroll">
              <h2 className="max-w-[20ch] font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.015em] text-lmsa-900">
                Choose a category, then apply.
              </h2>
              <p className="mt-4 max-w-[48ch] text-base leading-7 text-gray-700">
                Applications are submitted through your member account. If you are unsure which
                category fits, ask first — it is a short conversation.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  to="/membership#apply"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-lmsa-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700"
                >
                  Start your application
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/membership/dues"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-800"
                >
                  View dues
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-800"
                >
                  Ask the team
                </Link>
              </div>
            </div>
            <div className="reveal-on-scroll lg:pb-1" style={{ transitionDelay: '90ms' }}>
              <figure>
                <Photo
                  src={stockPhotos.hero.about.src}
                  alt={stockPhotos.hero.about.alt}
                  width={1}
                  height={1}
                  fallbackGradient="bg-lmsa-800"
                  className="w-full"
                />
                <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                  A surgical team gathered around an operating light. Stock photograph by{' '}
                  {stockPhotos.hero.about.credit}.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
