import { useEffect, useState } from 'react';
import { BookOpen, Briefcase, LogIn, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Alert from '@components/common/Alert';
import Button from '@components/common/Button';
import Select from '@components/common/Select';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';
import { useAuth } from '@context/AuthContext';
import { membershipService } from '@services/membership.service';

const MEMBERSHIP_TYPE_OPTIONS = [
  { value: 'full', label: 'Full Member — currently enrolled medical students' },
  { value: 'associate', label: 'Associate Member — prospective students & affiliates' },
  { value: 'veteran', label: 'Veteran Member — alumni & past members' },
];

const membershipTypes = [
  {
    name: 'Full Member',
    description: 'For currently enrolled medical students',
    featured: true,
    benefits: ['Voting rights', 'Access to all events', 'Study resources', 'Member portal access'],
  },
  {
    name: 'Associate Member',
    description: 'For prospective students and affiliates',
    benefits: ['Event participation', 'Newsletter access', 'Networking opportunities'],
  },
  {
    name: 'Honorary Member',
    description: 'For distinguished supporters',
    invitationOnly: true,
    benefits: ['Recognition at events', 'Advisory role', 'Network access'],
  },
  {
    name: 'Veteran Member',
    description: 'For alumni and past members',
    benefits: ['Alumni network', 'Mentorship opportunities', 'Reunion events'],
  },
];

const benefits = [
  { icon: BookOpen, title: 'Academic resources', description: 'Access study materials and learning resources through the member library.' },
  { icon: Target, title: 'Professional development', description: 'Find leadership training, research opportunities, and conferences.' },
  { icon: Users, title: 'A stronger network', description: 'Connect with peers, mentors, and medical professionals across Liberia.' },
  { icon: Briefcase, title: 'Career support', description: 'Explore internship placements, residency guidance, and opportunities.' },
];

const eligibility = [
  'Currently enrolled at A.M. Dogliotti College of Medicine, University of Liberia',
  'Good academic standing with satisfactory progress',
  'Payment of annual membership dues',
  'Agreement to abide by LMSA constitution and code of conduct',
  'Completion of registration process through the member portal',
];

export default function MembershipPage() {
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('full');

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
              <Button variant="secondary">Create an account</Button>
            </Link>
          </div>
        </Alert>
      );
    }

    if (loadingStatus) {
      return <p className="py-8 text-center text-gray-500">Checking your application status…</p>;
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
      <form onSubmit={handleApply} className="mx-auto max-w-xl space-y-5">
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
          <p className="text-center text-sm text-gray-600">
            Your previous application was not approved. You may submit a new one.
          </p>
        )}
      </form>
    );
  };

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="A community for the journey"
              title="Membership should make medical school feel less like a solo experience."
              description="LMSA gives students a place to find support, build relationships, and turn their time in training into something shared."
            />
            <div className="editorial-prose">
              <p>
                Whether you are currently enrolled, preparing for medical school, supporting
                students, or carrying the LMSA story as an alum, there is a way to stay connected.
              </p>
              <div className="editorial-stat-grid mt-8">
                <EditorialStat value="4" label="Membership paths" />
                <EditorialStat value="1" label="Student community" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Choose your path"
            title="Find the membership that fits your place in the community."
            description="Every category comes with a different relationship to LMSA, but each one creates a way to participate."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {membershipTypes.map((type, index) => (
              <article key={type.name} className={`flex flex-col border border-gray-200 bg-white p-6 ${type.featured ? 'border-t-4 border-t-lmsa-600' : ''}`}>
                {type.featured && <span className="editorial-card-eyebrow text-lmsa-700">Most common</span>}
                {type.invitationOnly && <span className="editorial-card-eyebrow text-gray-500">By invitation</span>}
                <div>
                  <span className="mt-2 block text-xs font-bold text-gray-500">0{index + 1}</span>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-lmsa-900">{type.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{type.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-gray-700">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="What membership unlocks"
            title="Useful support, not just a name on a list."
            description="The best membership benefits are the ones that help you move through the week with more confidence."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title} className="flex gap-4 border-t border-gray-200 pt-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-lmsa-50 text-lmsa-700">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-lmsa-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <EditorialSectionHeader
              eyebrow="Before you apply"
              title="A clear start makes for a better membership experience."
              description="Review the basic requirements, then choose the membership path that best describes you."
            />
            <ul className="editorial-article-list">
              {eligibility.map((item, index) => (
                <li key={item} className="editorial-article-row">
                  <strong>0{index + 1}</strong>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="apply" className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Your next step"
            title="Ready to become part of LMSA?"
            description="Sign in to submit an application, or create your member account first."
            align="center"
          />
          <div className="mx-auto max-w-3xl">{renderApplySection()}</div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Still deciding?"
            title="See the full benefits and fee structure before you choose."
            description="Take the next practical step with a closer look at what membership includes and how dues work."
            action={{ label: 'Review membership benefits', to: '/membership/benefits' }}
          />
        </div>
      </section>
    </main>
  );
}