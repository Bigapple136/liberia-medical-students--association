import { CheckCircle, Star, BookOpen, Users, Calendar, Heart } from 'lucide-react';

const benefits = [
  {
    icon: BookOpen,
    title: 'Academic Resources',
    description: 'Access exclusive study materials, past exams, and learning resources',
  },
  {
    icon: Users,
    title: 'Networking Opportunities',
    description: 'Connect with peers, mentors, and medical professionals across Liberia',
  },
  {
    icon: Calendar,
    title: 'Events & Conferences',
    description: 'Attend symposia, workshops, and medical conferences at member rates',
  },
  {
    icon: Heart,
    title: 'Mentorship Program',
    description: 'Get paired with senior students for academic and career guidance',
  },
  {
    icon: Star,
    title: 'Leadership Development',
    description: 'Run for office, join committees, and build leadership skills',
  },
  {
    icon: CheckCircle,
    title: 'Professional Recognition',
    description: 'Receive certificates and recognition for academic achievements',
  },
];

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Member Benefits</h1>
          <p className="text-lg text-gray-600">What You Get as an LMSA Member</p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-lmsa-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Discounted medical textbooks and resources',
              'Free access to online medical databases',
              'Priority registration for workshops and training',
              'Eligibility for LMSA scholarships and grants',
              'Representation in national medical forums',
              'Access to alumni network and career opportunities',
              'Invitation to exclusive social and professional events',
              'Voting rights in LMSA elections',
            ].map((perk, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-lmsa-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{perk}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Join?</h2>
          <p className="text-gray-700 mb-6">
            Become a member today and start enjoying these benefits
          </p>
          <a href="/membership" className="btn btn-primary inline-block">
            Join LMSA Now
          </a>
        </div>
      </div>
    </div>
  );
}
