import { Link } from 'react-router-dom';
import { BookOpen, Target, Users, Briefcase } from 'lucide-react';
import Button from '@components/common/Button';
import Card from '@components/common/Card';

export default function MembershipPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-tight">Membership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Join the Liberia Medical Students' Association and become part of our community
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

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Ready to Join?</h2>
            <p className="text-gray-600 mb-6 text-balance">
              Start your journey with LMSA today
            </p>
            <Link to="/register">
              <Button variant="primary">Register Now</Button>
            </Link>
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
