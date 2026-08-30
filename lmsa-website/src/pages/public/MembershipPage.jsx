import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Users, Briefcase, LogIn } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Select from '@components/common/Select';
import Alert from '@components/common/Alert';
import { membershipService } from '@services/membership.service';

const MEMBERSHIP_TYPE_OPTIONS = [
  { value: 'full', label: 'Full Member — currently enrolled medical students' },
  { value: 'associate', label: 'Associate Member — prospective students & affiliates' },
  { value: 'honorary', label: 'Honorary Member — distinguished supporters' },
  { value: 'veteran', label: 'Veteran Member — alumni & past members' },
];

export default function MembershipPage() {
  const { user, loading: authLoading } = useAuth();

  const [application, setApplication] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('full');

  // Logged-in visitors: fetch their current application status on mount.
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const loadStatus = async () => {
      try {
        setLoadingStatus(true);
        const status = await membershipService.getStatus();
        if (mounted) setApplication(status);
      } catch {
        // Status is best-effort; the apply form still works regardless.
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };
    loadStatus();
    return () => { mounted = false; };
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
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

  // ─── Apply section rendering (auth-gated) ──────────────────────────────
  const renderApplySection = () => {
    // Logged-out visitor: gate the form — don't let them hit a 401 on submit.
    if (!authLoading && !user) {
      return (
        <Alert variant="info">
          <p className="font-semibold mb-2">Log in to apply for membership</p>
          <p className="mb-3">
            Submitting an application requires a member account. Please sign in or create
            an account to continue.
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
      return (
        <div className="flex justify-center py-8">
          <span className="text-gray-500">Checking your application status…</span>
        </div>
      );
    }

    // Already pending — show status instead of the form.
    if (application?.application_status === 'pending') {
      return (
        <Alert variant="warning">
          <p className="font-semibold">Application under review</p>
          <p>
            You already have a <strong>pending</strong> membership application
            ({(application.membership_type || '').replace(/^\w/, c => c.toUpperCase())}).
            We&apos;ll notify you by email once it&apos;s reviewed.
          </p>
        </Alert>
      );
    }

    // Already approved — confirm their standing.
    if (application?.application_status === 'approved') {
      return (
        <Alert variant="success">
          <p className="font-semibold">You&apos;re a member!</p>
          <p>
            Your <strong>{(application.membership_type || '').replace(/^\w/, c => c.toUpperCase())}</strong>{' '}
            membership application has been approved. Welcome to LMSA!
          </p>
        </Alert>
      );
    }

    // Not applied, or previously rejected — show the apply form (reapply allowed).
    return (
      <form onSubmit={handleApply} className="max-w-xl mx-auto space-y-5">
        <Select
          label="Membership type"
          required
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          options={MEMBERSHIP_TYPE_OPTIONS}
          placeholder="Select a membership type"
          disabled={submitting}
        />
        <div>
          <Button type="submit" variant="primary" loading={submitting} fullWidth>
            {submitting ? 'Submitting…' : 'Submit application'}
          </Button>
        </div>
        {application?.application_status === 'rejected' && (
          <p className="text-sm text-gray-600 text-center">
            Your previous application was not approved. You may submit a new one below.
          </p>
        )}
      </form>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">Membership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Join the Liberia Medical Students&apos; Association and become part of our community
          </p>
        </div>
      </section>

      {/* Membership Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">Membership Categories</h2>
            <p className="text-gray-600 text-balance">Choose the membership type that fits your status</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {membershipTypes.map((type, index) => (
              <Card key={index} className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${type.featured ? 'border-2 border-lmsa-600' : ''}`}>
                {type.featured && (
                  <div className="inline-block px-3 py-1 bg-lmsa-600 text-white text-xs rounded-full mb-3">
                    Most Common
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <ul className="space-y-2 text-sm">
                  {type.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-lmsa-600 mr-2 font-bold" aria-hidden="true">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-tight">Member Benefits</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-lmsa-600 flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center uppercase tracking-tight">Eligibility Requirements</h2>
            <Card>
              <ul className="space-y-3">
                {eligibility.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lmsa-600 mr-3 font-bold" aria-hidden="true">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* CTA / Apply */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Ready to Join?</h2>
            <p className="text-gray-600 mb-6 text-balance">
              Start your journey with LMSA today
            </p>
            <div className="max-w-3xl mx-auto">
              {renderApplySection()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const membershipTypes = [
  {
    name: 'Full Member',
    description: 'For currently enrolled medical students',
    featured: true,
    benefits: [
      'Voting rights',
      'Access to all events',
      'Study resources',
      'Member portal access'
    ]
  },
  {
    name: 'Associate Member',
    description: 'For prospective students and affiliates',
    featured: false,
    benefits: [
      'Event participation',
      'Newsletter access',
      'Networking opportunities'
    ]
  },
  {
    name: 'Honorary Member',
    description: 'For distinguished supporters',
    featured: false,
    benefits: [
      'Recognition at events',
      'Advisory role',
      'Network access'
    ]
  },
  {
    name: 'Veteran Member',
    description: 'For alumni and past members',
    featured: false,
    benefits: [
      'Alumni network',
      'Mentorship opportunities',
      'Reunion events'
    ]
  }
];

const benefits = [
  {
    icon: <BookOpen size={32} strokeWidth={1.5} />,
    title: 'Academic Resources',
    description: 'Access to study materials, past papers, and tutoring programs'
  },
  {
    icon: <Target size={32} strokeWidth={1.5} />,
    title: 'Professional Development',
    description: 'Leadership training, research opportunities, and conferences'
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: 'Networking',
    description: 'Connect with peers, mentors, and medical professionals'
  },
  {
    icon: <Briefcase size={32} strokeWidth={1.5} />,
    title: 'Career Support',
    description: 'Internship placements, residency guidance, and job opportunities'
  }
];

const eligibility = [
  'Currently enrolled at A.M. Dogliotti College of Medicine, University of Liberia',
  'Good academic standing with satisfactory progress',
  'Payment of annual membership dues',
  'Agreement to abide by LMSA constitution and code of conduct',
  'Completion of registration process through the member portal'
];
