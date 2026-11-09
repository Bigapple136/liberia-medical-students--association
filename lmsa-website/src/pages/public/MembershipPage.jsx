import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Alert from '@components/common/Alert';
import Button from '@components/common/Button';
import Select from '@components/common/Select';
import Photo from '@components/common/Photo';
import { useAuth } from '@context/AuthContext';
import { membershipService } from '@services/membership.service';
import { stockPhotos } from '@config/images';

const MEMBERSHIP_TYPE_OPTIONS = [
  { value: 'full', label: 'Full Member — currently enrolled medical students' },
  { value: 'associate', label: 'Associate Member — prospective students & affiliates' },
  { value: 'veteran', label: 'Veteran Member — alumni & past members' },
];

// The same four rows, wording and amounts as the dues ledger, so the two pages read as one document.
const membershipTypes = [
  {
    name: 'Full Member',
    description: 'Currently enrolled medical students',
    fee: '$25',
    period: 'a year',
    benefits: ['Voting rights', 'All events', 'Study resources', 'Member portal'],
  },
  {
    name: 'Associate Member',
    description: 'Prospective students and affiliates',
    fee: '$15',
    period: 'a year',
    benefits: ['Event participation', 'Newsletter', 'Networking'],
  },
  {
    name: 'Honorary Member',
    description: 'Faculty and alumni supporters',
    fee: 'By invitation',
    period: '',
    benefits: ['Recognition at events', 'Advisory role', 'Network access'],
  },
  {
    name: 'Veteran Member',
    description: 'Alumni and past members',
    fee: 'Free',
    period: '',
    benefits: ['Alumni network', 'Mentorship', 'Reunions'],
  },
];

const benefits = [
  { title: 'Academic resources', description: 'Study materials and learning resources through the member library.' },
  { title: 'Professional development', description: 'Leadership training, research opportunities, and conferences.' },
  { title: 'A stronger network', description: 'Peers, mentors, and medical professionals across Liberia.' },
  { title: 'Career support', description: 'Internship placements, residency guidance, and openings.' },
];

const eligibility = [
  'Currently enrolled at A.M. Dogliotti College of Medicine, University of Liberia',
  'Good academic standing with satisfactory progress',
  'Payment of annual membership dues',
  'Agreement to abide by LMSA constitution and code of conduct',
  'Completion of registration through the member portal',
];

export default function MembershipPage() {
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('full');

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

  useEffect(() => {
    if (!user) return undefined;
    let mounted = true;
    const loadStatus = async () => {
      try {
        setLoadingStatus(true);
        const status = await membershipService.getStatus();
        if (mounted) setApplication(status);
      } catch {
        // The application form remains available if status lookup fails.
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };
    loadStatus();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleApply = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const submitted = await membershipService.apply(selectedType);
      setApplication(submitted);
      toast.success('Your membership application has been submitted for review!');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderApplySection = () => {
    if (!authLoading && !user) {
      return (
        <Alert variant="info">
          <p className="mb-2 font-semibold">Log in to apply for membership</p>
          <p className="mb-3">
            Submitting an application requires a member account. Please sign in or create an
            account to continue.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/login">
              <Button variant="primary" leftIcon={<LogIn size={16} />}>Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="border-0 bg-lmsa-100 text-lmsa-800 hover:bg-lmsa-200">
                Create an account
              </Button>
            </Link>
          </div>
        </Alert>
      );
    }

    if (loadingStatus) {
      return <p className="py-8 text-center text-gray-600">Checking your application status…</p>;
    }

    if (application?.application_status === 'pending') {
      return (
        <Alert variant="warning">
          <p className="font-semibold">Application under review</p>
          <p>
            You already have a <strong>pending</strong> membership application
            ({(application.membership_type || '').replace(/^\w/, (character) => character.toUpperCase())}).
            We&apos;ll notify you by email once it&apos;s reviewed.
          </p>
        </Alert>
      );
    }

    if (application?.application_status === 'approved') {
      return (
        <Alert variant="success">
          <p className="font-semibold">You&apos;re a member!</p>
          <p>
            Your <strong>{(application.membership_type || '').replace(/^\w/, (character) => character.toUpperCase())}</strong>{' '}
            membership application has been approved. Welcome to LMSA!
          </p>
        </Alert>
      );
    }

    return (
      <form onSubmit={handleApply} className="space-y-5">
        <Select
          label="Membership type"
          required
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          options={MEMBERSHIP_TYPE_OPTIONS}
          placeholder="Select a membership type"
          disabled={submitting}
        />
        <Button type="submit" variant="primary" loading={submitting} fullWidth>
          {submitting ? 'Submitting…' : 'Submit application'}
        </Button>
        {application?.application_status === 'rejected' && (
          <p className="text-sm leading-6 text-gray-600">
            Your previous application was not approved. You may submit a new one.
          </p>
        )}
      </form>
    );
  };

  return (
    <main className="editorial-page">
      {/* Statement: one big idea, one photograph, no section furniture. */}
      <section className="editorial-section">
        <div className="site-container">
          <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="reveal-on-scroll">
              <h2 className="max-w-[24ch] font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                Medical school is better together.
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-10">
                <p className="text-pretty text-xl leading-8 text-gray-700">
                  LMSA gives students a place to find support, build relationships, and turn their
                  time in training into something shared.
                </p>
                <p className="text-base leading-7 text-gray-600">
                  Whether you are currently enrolled, preparing for medical school, supporting
                  students, or carrying the LMSA story as an alum, there is a way to stay connected.
                </p>
              </div>
            </div>
            <figure className="reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
              <Photo
                src={stockPhotos.sections.learn.src}
                alt={stockPhotos.sections.learn.alt}
                width={4}
                height={5}
                fallbackGradient="bg-lmsa-800"
                className="w-full"
              />
              <figcaption className="mt-2 text-[13px] text-gray-500">
                {stockPhotos.sections.learn.credit}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* The four paths as a magazine ledger — full-width rows, one inverted. */}
      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="reveal-on-scroll flex flex-wrap items-end justify-between gap-x-16 gap-y-4">
            <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
              Four ways to belong.
            </h2>
            <p className="max-w-[40ch] text-base leading-7 text-gray-600">
              Each category carries a different relationship to LMSA, and each one is a way in.
            </p>
          </div>

          <ol className="mt-10 lg:mt-12">
            {membershipTypes.map((type) => (
              <li
                key={type.name}
                className="grid gap-y-3 py-7 lg:grid-cols-[1.05fr_1.3fr_auto] lg:items-baseline lg:gap-x-10 lg:py-8"
              >
                <div className="reveal-on-scroll">
                  <h3 className="font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
                    {type.name}
                  </h3>
                  <p className="mt-1 text-base leading-7 text-gray-700">{type.description}</p>
                </div>
                <ul
                  className="reveal-on-scroll flex flex-wrap items-baseline gap-x-5 gap-y-2"
                  style={{ transitionDelay: '60ms' }}
                >
                  {type.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-base leading-7 text-gray-700">
                      <span
                        className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600"
                        aria-hidden="true"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
                {/* Amounts match the dues ledger; phones get them on their own right-aligned line. */}
                <p
                  className="reveal-on-scroll justify-self-end whitespace-nowrap font-serif text-[1.75rem] font-bold leading-none tracking-[-0.02em] text-lmsa-800"
                  style={{ transitionDelay: '120ms' }}
                >
                  {type.fee}
                  {type.period && (
                    <span className="ml-2 text-base font-normal tracking-normal text-gray-600">
                      {type.period}
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ol>

          <div className="reveal-on-scroll mt-8 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <p className="max-w-[60ch] text-base leading-7 text-gray-700">
              Fees are annual and due on 31 October.
            </p>
            <Link
              to="/membership/dues"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-lmsa-900 hover:decoration-lmsa-900"
            >
              Read the payment terms
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits: an asymmetric bento — one dark block of type, one tall photograph, two quiet tiles. */}
      <section className="editorial-section">
        <div className="site-container">
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="reveal-on-scroll bg-lmsa-900 p-7 text-lmsa-50 sm:p-9 lg:col-span-2 lg:col-start-1 lg:row-start-1">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[2.25rem]">
                Support you can use.
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-7 text-lmsa-100">
                The best membership benefits are the ones that help you move through the week with
                more confidence.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {benefits.slice(0, 2).map(({ title, description }) => (
                  <div key={title}>
                    <h3 className="font-serif text-xl font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-base leading-7 text-lmsa-100">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-on-scroll relative lg:col-start-3 lg:row-span-2 lg:row-start-1">
              <Photo
                src={stockPhotos.sections.connect.src}
                alt={stockPhotos.sections.connect.alt}
                fallbackGradient="bg-lmsa-800"
                className="h-full min-h-[280px] w-full"
                imgClassName="object-cover"
              >
                <span className="absolute bottom-0 left-0 right-0 bg-lmsa-900/90 px-4 py-3 text-[13px] text-lmsa-100">
                  {stockPhotos.sections.connect.credit}
                </span>
              </Photo>
            </div>

            {benefits.slice(2).map(({ title, description }, index) => (
              <div
                key={title}
                className={`reveal-on-scroll bg-white p-7 sm:p-9 lg:row-start-2 ${
                  index === 0 ? 'lg:col-start-1' : 'lg:col-start-2'
                }`}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <h3 className="font-serif text-xl font-semibold text-lmsa-900">{title}</h3>
                <p className="mt-2 max-w-[42ch] text-base leading-7 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements as a full-bleed band — the page's dark anchor. */}
      <section className="bg-lmsa-900 py-16 text-lmsa-50 md:py-20">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="reveal-on-scroll">
              <h2 className="max-w-[18ch] font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[2.25rem]">
                What it takes to join.
              </h2>
              <p className="mt-4 max-w-[36ch] text-base leading-7 text-lmsa-100">
                Review the basics, then choose the membership path that best describes you.
              </p>
            </div>
            <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {eligibility.map((item, index) => (
                <li
                  key={item}
                  className="reveal-on-scroll flex items-start gap-3"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <CheckCircle size={18} className="mt-1 shrink-0 text-lmsa-200" aria-hidden="true" />
                  <span className="text-base leading-7 text-lmsa-100">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Apply: the form is the destination, so give it a column and a face. */}
      <section id="apply" className="editorial-section">
        <div className="site-container">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
            <div className="reveal-on-scroll">
              <h2 className="max-w-[20ch] font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                Ready to become part of LMSA?
              </h2>
              <p className="mt-4 max-w-[40ch] text-base leading-7 text-gray-600">
                Sign in to submit an application, or create your member account first.
              </p>
              <figure className="mt-10">
                <Photo
                  src={stockPhotos.stories.symposium.src}
                  alt={stockPhotos.stories.symposium.alt}
                  width={4}
                  height={3}
                  fallbackGradient="bg-lmsa-800"
                  className="w-full"
                />
                <figcaption className="mt-2 text-[13px] text-gray-500">
                  {stockPhotos.stories.symposium.credit}
                </figcaption>
              </figure>
            </div>
            <div className="reveal-on-scroll bg-white p-6 sm:p-8" style={{ transitionDelay: '80ms' }}>
              {renderApplySection()}
            </div>
          </div>
        </div>
      </section>

      {/* Closing band: one decision, two real next steps. */}
      <section className="bg-lmsa-900 pb-16 pt-14 text-lmsa-50 md:pb-20 md:pt-16">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="reveal-on-scroll">
              <h2 className="max-w-[22ch] font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[2.25rem]">
                Check the benefits and dues.
              </h2>
              <p className="mt-4 max-w-[46ch] text-base leading-7 text-lmsa-100">
                Take the next practical step with a closer look at what membership includes and how
                dues work.
              </p>
            </div>
            <div className="reveal-on-scroll flex flex-col gap-3 sm:flex-row lg:justify-end" style={{ transitionDelay: '80ms' }}>
              <Link
                to="/membership/benefits"
                className="inline-flex min-h-12 items-center justify-between gap-4 bg-lmsa-50 px-6 text-sm font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 sm:justify-start"
              >
                Review benefits
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/membership/dues"
                className="inline-flex min-h-12 items-center gap-2 px-1 text-sm font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                See dues
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
