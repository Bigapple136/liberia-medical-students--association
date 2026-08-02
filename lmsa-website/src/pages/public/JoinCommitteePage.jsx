import { Users, CheckCircle, ArrowRight, Heart, GraduationCap, FlaskConical, Shield, TrendingUp, Megaphone } from 'lucide-react';

const committees = [
  {
    name: 'Medical Education',
    slug: 'medical-education',
    focus: 'Academic standards and curriculum support',
    openings: 3,
    deadline: 'May 31, 2026',
    color: 'teal',
    icon: GraduationCap,
  },
  {
    name: 'Community Health',
    slug: 'community-health',
    focus: 'Public health outreach and education',
    openings: 5,
    deadline: 'May 31, 2026',
    color: 'lmsa',
    icon: Heart,
  },
  {
    name: 'Research & Innovation',
    slug: 'research-innovation',
    focus: 'Scientific research promotion',
    openings: 2,
    deadline: 'May 31, 2026',
    color: 'purple',
    icon: FlaskConical,
  },
  {
    name: 'Student Welfare',
    slug: 'student-welfare',
    focus: 'Student support services',
    openings: 4,
    deadline: 'May 31, 2026',
    color: 'rose',
    icon: Shield,
  },
  {
    name: 'Professional Development',
    slug: 'professional-development',
    focus: 'Career and skills training',
    openings: 3,
    deadline: 'May 31, 2026',
    color: 'amber',
    icon: TrendingUp,
  },
  {
    name: 'Public Relations',
    slug: 'public-relations',
    focus: 'Communications and media',
    openings: 2,
    deadline: 'May 31, 2026',
    color: 'orange',
    icon: Megaphone,
  },
  {
    name: 'International Relations',
    slug: 'international-relations',
    focus: 'Global partnerships',
    openings: 3,
    deadline: 'May 31, 2026',
    color: 'teal',
    icon: Heart,
  },
];

// Color mapping
const colorMap = {
  lmsa: { bg: 'bg-lmsa-100', text: 'text-lmsa-600', bg50: 'bg-lmsa-50', hover: 'hover:bg-lmsa-700' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', bg50: 'bg-teal-50', hover: 'hover:bg-teal-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', bg50: 'bg-purple-50', hover: 'hover:bg-purple-700' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', bg50: 'bg-rose-50', hover: 'hover:bg-rose-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', bg50: 'bg-amber-50', hover: 'hover:bg-amber-700' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', bg50: 'bg-orange-50', hover: 'hover:bg-orange-700' },
};

export default function JoinCommitteePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-lmsa-600 via-amber-500 to-lmsa-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Join a Committee</h1>
              <p className="text-lg text-lmsa-100 mt-1">Get Active in LMSA</p>
            </div>
          </div>
          <p className="text-lmsa-50 max-w-2xl leading-relaxed">
            Committees are the backbone of LMSA's operations. By joining a committee, you'll work
            directly on initiatives that advance our mission, develop professional skills, and make
            lasting connections with fellow students.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        {/* Available Positions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Committees Accepting Applications</h2>
            <span className="bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full">
              7 Open Positions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee, index) => {
              const Icon = committee.icon;
              const colors = colorMap[committee.color];
              return (
                <div key={index} className={`${colors.bg50} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <Icon size={22} className={colors.text} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                      {committee.deadline}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{committee.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{committee.focus}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className={`font-bold ${colors.text}`}>{committee.openings} openings</span>
                  </div>
                  <button className={`w-full bg-lmsa-600 text-white py-2.5 rounded-lg font-medium ${colors.hover} transition-colors flex items-center justify-center gap-2`}>
                    Apply Now
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Join a Committee?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Hands-On Experience', desc: 'Gain practical experience in your area of interest', color: 'teal' },
              { title: 'Learn from Leaders', desc: 'Work closely with experienced medical professionals', color: 'purple' },
              { title: 'Develop Skills', desc: 'Build project management and leadership capabilities', color: 'amber' },
              { title: 'Expand Network', desc: 'Connect with peers, faculty, and healthcare leaders', color: 'orange' },
              { title: 'Make Impact', desc: 'Contribute to meaningful healthcare initiatives', color: 'lmsa' },
              { title: 'Boost Your CV', desc: 'Enhance your resume with leadership experience', color: 'rose' },
            ].map((benefit, index) => {
              const benefitColors = colorMap[benefit.color];
              return (
                <div key={index} className={`${benefitColors.bg50} rounded-xl p-5 border border-gray-200`}>
                  <CheckCircle size={24} className={`${benefitColors.text} mb-3`} />
                  <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-gradient-to-r from-lmsa-50 to-teal-50 rounded-2xl border-2 border-lmsa-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Apply', desc: 'Submit application form', color: 'from-lmsa-600 to-lmsa-700' },
              { step: '2', title: 'Review', desc: 'Committee reviews applications', color: 'from-teal-600 to-teal-700' },
              { step: '3', title: 'Interview', desc: 'Brief interview (if needed)', color: 'from-purple-600 to-purple-700' },
              { step: '4', title: 'Join', desc: 'Begin committee work', color: 'from-amber-500 to-amber-600' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Who can join a committee?',
                a: 'All active LMSA members in good standing are eligible to apply for committee positions.',
              },
              {
                q: 'How long is the commitment?',
                a: 'Committee members are appointed annually. You can reapply each year or choose to step down.',
              },
              {
                q: 'Can I join multiple committees?',
                a: 'We recommend joining one committee to ensure focused contributions, but exceptions can be made.',
              },
              {
                q: 'What is the time commitment?',
                a: 'Most committees meet monthly and work on projects throughout the academic year. Expect 3-5 hours per month.',
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
