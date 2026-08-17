import { Heart, Users, Calendar, CheckCircle } from 'lucide-react';

const opportunities = [
  {
    title: 'Community Health Screenings',
    description: 'Provide free health screenings and education to underserved communities across Liberia.',
    timeCommitment: '4-8 hours/month',
    icon: Heart,
  },
  {
    title: 'Health Education Workshops',
    description: 'Teach community members about disease prevention, nutrition, and healthy lifestyles.',
    timeCommitment: '2-4 hours/month',
    icon: Users,
  },
  {
    title: 'Medical Supply Drives',
    description: 'Organize and coordinate collection and distribution of medical supplies to clinics.',
    timeCommitment: 'Flexible',
    icon: Calendar,
  },
  {
    title: 'Research Assistance',
    description: 'Support ongoing public health research projects in your area of interest.',
    timeCommitment: '5-10 hours/month',
    icon: Heart,
  },
];

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Volunteer</h1>
              <p className="text-lg text-gray-600 mt-1">Community Service Opportunities</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            LMSA is committed to serving our communities. Through our volunteer programs, medical students 
            gain valuable experience while making a real difference in people&apos;s lives. Join us in our 
            mission to improve healthcare access and education across Liberia.
          </p>
        </div>

        {/* Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {opportunities.map((opp, index) => {
            const Icon = opp.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-lmsa-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{opp.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{opp.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {opp.timeCommitment}
                  </span>
                  <button className="text-lmsa-600 font-medium text-sm hover:underline">
                    Sign up →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Volunteer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Gain practical clinical experience',
              'Develop leadership and communication skills',
              'Make a positive impact in communities',
              'Network with healthcare professionals',
              'Strengthen your medical school application',
              'Fulfill community service requirements',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-lmsa-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Make a Difference?</h2>
          <p className="text-gray-700 mb-6">
            Join our volunteer network and help us serve communities across Liberia
          </p>
          <button className="btn btn-primary">Sign Up to Volunteer</button>
        </div>
      </div>
    </div>
  );
}
