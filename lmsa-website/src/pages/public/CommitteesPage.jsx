import { Users, Briefcase, GraduationCap, Heart, FlaskConical, Shield, TrendingUp, Megaphone, Wallet, Scale, Globe, Trophy, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const committees = [
  {
    name: 'Medical Education',
    slug: 'medical-education',
    focus: 'Curriculum and academic standards',
    members: 8,
    color: 'teal',
    icon: GraduationCap,
  },
  {
    name: 'Community Health',
    slug: 'community-health',
    focus: 'Public health outreach',
    members: 12,
    color: 'lmsa',
    icon: Heart,
  },
  {
    name: 'Research & Innovation',
    slug: 'research-innovation',
    focus: 'Scientific research promotion',
    members: 6,
    color: 'purple',
    icon: FlaskConical,
  },
  {
    name: 'Student Welfare',
    slug: 'student-welfare',
    focus: 'Student support services',
    members: 10,
    color: 'rose',
    icon: Shield,
  },
  {
    name: 'Professional Development',
    slug: 'professional-development',
    focus: 'Career and skills training',
    members: 9,
    color: 'amber',
    icon: TrendingUp,
  },
  {
    name: 'Public Relations',
    slug: 'public-relations',
    focus: 'Communications and media',
    members: 7,
    color: 'orange',
    icon: Megaphone,
  },
  {
    name: 'Finance & Budget',
    slug: 'finance-budget',
    focus: 'Financial management',
    members: 5,
    color: 'lmsa',
    icon: Wallet,
  },
  {
    name: 'Ethics & Discipline',
    slug: 'ethics-discipline',
    focus: 'Code of conduct enforcement',
    members: 6,
    color: 'purple',
    icon: Scale,
  },
  {
    name: 'Legislative Affairs',
    slug: 'legislative-affairs',
    focus: 'Policy and advocacy',
    members: 8,
    color: 'teal',
    icon: Globe,
  },
  {
    name: 'International Relations',
    slug: 'international-relations',
    focus: 'Global partnerships',
    members: 10,
    color: 'orange',
    icon: Globe,
  },
  {
    name: 'Sports & Recreation',
    slug: 'sports-recreation',
    focus: 'Athletic activities',
    members: 11,
    color: 'rose',
    icon: Trophy,
  },
  {
    name: 'Cultural Affairs',
    slug: 'cultural-affairs',
    focus: 'Arts and cultural programs',
    members: 9,
    color: 'amber',
    icon: Palette,
  },
];

// Color mapping for dynamic classes
const colorMap = {
  lmsa: { bg: 'bg-lmsa-100', text: 'text-lmsa-600', hover: 'group-hover:bg-lmsa-200', hoverText: 'group-hover:text-lmsa-600', cta: 'text-lmsa-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'group-hover:bg-teal-200', hoverText: 'group-hover:text-teal-600', cta: 'text-teal-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'group-hover:bg-purple-200', hoverText: 'group-hover:text-purple-600', cta: 'text-purple-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', hover: 'group-hover:bg-rose-200', hoverText: 'group-hover:text-rose-600', cta: 'text-rose-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', hover: 'group-hover:bg-amber-200', hoverText: 'group-hover:text-amber-600', cta: 'text-amber-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'group-hover:bg-orange-200', hoverText: 'group-hover:text-orange-600', cta: 'text-orange-600' },
};

export default function CommitteesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-lmsa-600 via-lmsa-700 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Standing Committees</h1>
              <p className="text-lg text-lmsa-100 mt-1">The Backbone of LMSA Operations</p>
            </div>
          </div>
          <p className="text-lmsa-50 max-w-2xl leading-relaxed">
            12 specialized committees driving focused action across medical education,
            community health, research, and student welfare.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Committees', value: '12', icon: Briefcase },
            { label: 'Active Members', value: '101', icon: Users },
            { label: 'Current Initiatives', value: '48+', icon: TrendingUp },
            { label: 'Annual Projects', value: '36', icon: GraduationCap },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Icon size={24} className="text-lmsa-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Committee Structure</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            LMSA operates through 12 standing committees, each responsible for specific areas of the organization&apos;s
            work. These committees ensure focused attention on critical issues and provide opportunities for members
            to contribute meaningfully to our mission.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Committee members are appointed annually and work throughout the year to develop programs, policies,
            and initiatives that advance LMSA&apos;s goals.
          </p>
        </div>

        {/* Committees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committees.map((committee, index) => {
            const Icon = committee.icon;
            const colors = colorMap[committee.color];
            return (
              <Link
                key={index}
                to={`/leadership/committees/${committee.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.hover} transition-colors`}>
                    <Icon size={22} className={colors.text} />
                  </div>
                  <span className={`text-xs font-medium ${colors.text} bg-gray-50 px-3 py-1 rounded-full`}>
                    {committee.members} members
                  </span>
                </div>
                <h3 className={`text-lg font-bold text-gray-900 mb-2 ${colors.hoverText} transition-colors`}>
                  {committee.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{committee.focus}</p>
                <span className={`font-medium text-sm ${colors.cta} group-hover:underline`}>
                  Learn more →
                </span>
              </Link>
            );
          })}
        </div>

        {/* Join CTA */}
        <div className="mt-8 bg-gradient-to-r from-lmsa-50 to-teal-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join a Committee</h2>
          <p className="text-gray-700 mb-6">
            Get actively involved in LMSA and contribute to our mission
          </p>
          <a href="/get-involved/committees" className="btn btn-primary inline-block">
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
