import { useEffect } from 'react';
import { ArrowDown, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Photo from '@components/common/Photo';
import { stockPhotos } from '@config/images';

const benefits = [
  { title: 'Academic resources', description: 'Study materials and learning resources shared through the member library.' },
  { title: 'Networking', description: 'Peers, mentors, and medical professionals across Liberia.' },
  { title: 'Events & conferences', description: 'Symposia, workshops, and medical conferences through your member account.' },
  { title: 'Mentorship', description: 'Pairing with senior students for academic and career guidance.' },
  { title: 'Leadership development', description: 'Run for office, join committees, and build leadership skills.' },
  { title: 'Professional recognition', description: 'Certificates and recognition for academic achievements.' },
];

const perks = [
  'Discounted medical textbooks and resources',
  'Free access to online medical databases',
  'Member registration for workshops and training',
  'Eligibility for LMSA scholarships and grants',
  'Representation in national medical forums',
  'Access to alumni network and career opportunities',
  'Invitation to social and professional events',
  'Voting rights in LMSA elections',
];

const paths = [
  {
    to: '/academics/resources',
    title: 'Study with more support',
    description: 'Tools and people that make the work of medical school more navigable.',
    photo: stockPhotos.sections.learn,
  },
  {
    to: '/academics/mentorship',
    title: 'Meet people ahead of you',
    description: 'Relationships with peers, mentors, and the alumni network.',
    photo: stockPhotos.sections.connect,
  },
  {
    to: '/leadership#stand',
    title: 'Practice responsibility',
    description: 'Committees, elections, and service that grow beyond the classroom.',
    photo: stockPhotos.stories.symposium,
  },
];

export default function BenefitsPage() {
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
      {/* Opener: the page's own masthead — no shared hero band. */}
      <section className="editorial-section pb-10">
        <div className="site-container">
          <div className="grid items-end gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div className="reveal-on-scroll">
              <h1 className="max-w-[20ch] font-serif text-[clamp(2.4rem,5.6vw,4.75rem)] font-bold leading-[1.04] tracking-[-0.015em] text-lmsa-900">
                More support, at every stage.
              </h1>
              <p className="mt-7 max-w-[54ch] text-lg leading-8 text-gray-800">
                LMSA membership is designed to be useful in the classroom, in community, and in the
                leadership opportunities between them.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  to="/membership/categories"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-lmsa-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700"
                >
                  Choose your membership
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/membership"
                  className="inline-flex min-h-12 items-center text-sm font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-800"
                >
                  See all membership options
                </Link>
              </div>
              <nav aria-label="On this page" className="mt-9">
                <ul className="flex flex-wrap gap-x-8 gap-y-3">
                  {[
                    ['Six benefits', '#benefits'],
                    ['What is included', '#included'],
                    ['Where it leads', '#paths'],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-lmsa-700 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-700"
                      >
                        {label}
                        <ArrowDown size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <figure className="reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
              <Photo
                src={stockPhotos.hero.membership.src}
                alt={stockPhotos.hero.membership.alt}
                width={4}
                height={3}
                fallbackGradient="bg-lmsa-800"
                className="w-full"
              />
              <figcaption className="mt-2 text-[13px] text-gray-600">
                {stockPhotos.hero.membership.credit}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Six benefits as staggered editorial columns, no cards, no icons. */}
      <section id="benefits" className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="reveal-on-scroll max-w-2xl">
            <h2 className="text-[clamp(1.7rem,3.2vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-lmsa-900">
              Six ways LMSA moves with you.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
              Membership follows the real shape of student life: learning, belonging, contribution,
              and preparation.
            </p>
          </div>
          <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2 md:gap-y-14">
            {benefits.map(({ title, description }, index) => (
              <article
                key={title}
                className={`reveal-on-scroll ${index % 2 === 1 ? 'md:mt-14' : ''}`}
                style={{ transitionDelay: `${(index % 2) * 70 + index * 30}ms` }}
              >
                <h3 className="font-serif text-2xl font-bold leading-snug tracking-[-0.01em] text-lmsa-900 md:text-[1.75rem]">
                  {title}
                </h3>
                <p className="mt-2 max-w-[46ch] text-base leading-7 text-gray-700">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The eight perks composed as one panel, not eight loose rows. */}
      <section id="included" className="editorial-section">
        <div className="site-container">
          <div className="reveal-on-scroll bg-white p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <h2 className="max-w-[14ch] font-serif text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.01em] text-lmsa-900">
                  Included with membership.
                </h2>
                <p className="mt-4 max-w-[38ch] text-base leading-7 text-gray-700">
                  The smaller advantages add up over a year of training — easier to stay informed,
                  participate fully, and keep building a professional network.
                </p>
              </div>
              <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {perks.map((perk, index) => (
                  <li
                    key={perk}
                    className="reveal-on-scroll flex items-start gap-3"
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <CheckCircle size={18} className="mt-1 shrink-0 text-lmsa-700" aria-hidden="true" />
                    <span className="text-base leading-7 text-gray-700">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* A photograph-led band: the community side of membership, bled to the edge. */}
      <section className="bg-lmsa-900">
        <div className="grid items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div className="reveal-on-scroll px-6 py-14 sm:px-10 md:py-20 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-16">
            <h2 className="max-w-[16ch] font-serif text-[clamp(1.9rem,3.4vw,3rem)] font-bold leading-[1.06] tracking-[-0.015em] text-white">
              The work is shared.
            </h2>
            <p className="mt-4 max-w-[44ch] text-base leading-7 text-lmsa-100">
              Members serve on committees, organise campus events, and take health camps into
              counties without a resident doctor.
            </p>
            <p className="mt-8 text-[13px] text-lmsa-200">
              Photograph: {stockPhotos.stories.medicalCamp.credit}
            </p>
          </div>
          <Photo
            src={stockPhotos.stories.medicalCamp.src}
            alt={stockPhotos.stories.medicalCamp.alt}
            fallbackGradient="bg-lmsa-800"
            className="h-[300px] w-full sm:h-[380px] lg:h-full lg:min-h-[460px]"
          />
        </div>
      </section>

      {/* Where the benefits lead: three image-led paths, not link cards. */}
      <section id="paths" className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="reveal-on-scroll max-w-2xl">
            <h2 className="text-[clamp(1.7rem,3.2vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-lmsa-900">
              Where it leads.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              Three practical places to put a membership to work this term.
            </p>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {paths.map(({ to, title, description, photo }, index) => (
              <article
                key={title}
                className="reveal-on-scroll group"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Link
                  to={to}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 sm:grid sm:grid-cols-[0.75fr_1.25fr] sm:items-start sm:gap-6 lg:block"
                >
                  <Photo
                    src={photo.src}
                    alt={photo.alt}
                    width={4}
                    height={3}
                    fallbackGradient="bg-lmsa-800"
                    className="w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="mt-4 sm:mt-0 lg:mt-5">
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{title}</h3>
                    <p className="mt-2 max-w-[38ch] text-base leading-7 text-gray-700">{description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lmsa-700">
                      Open
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
                <p className="mt-3 text-[13px] text-gray-600">{photo.credit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing: one decision on the page's own cream, not a repeated callout card. */}
      <section className="editorial-section">
        <div className="site-container">
          <div className="reveal-on-scroll grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h2 className="max-w-[18ch] font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.015em] text-lmsa-900">
                Choose the path that fits your next season.
              </h2>
              <p className="mt-4 max-w-[46ch] text-base leading-7 text-gray-600">
                Review the categories, then start your application when you are ready.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end">
              <Link
                to="/membership"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-lmsa-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700"
              >
                Explore membership
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/membership/dues"
                className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-800"
              >
                View dues and payment options
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
