import { Link } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  FileText,
  Users,
  Utensils,
  Scale,
  Trophy,
  DollarSign,
  Globe,
  UserPlus,
  Megaphone,
  HeartHandshake
} from 'lucide-react';

const committees = [
  {
    name: 'Academic Committee',
    icon: BookOpen,
    description: 'Organizes symposia, conferences, and academic support programs',
    path: '/committees/academic',
  },
  {
    name: 'Health Committee',
    icon: Heart,
    description: 'Ensures sanitation and manages student health initiatives',
    path: '/committees/health',
  },
  {
    name: 'Research & Journal',
    icon: FileText,
    description: 'Publishes LMSA journal, newsletters, and promotes research',
    path: '/committees/research-journal',
  },
  {
    name: 'Social & Program',
    icon: Users,
    description: 'Plans social events, end-of-year program, and initiation',
    path: '/committees/social-program',
  },
  {
    name: 'Dietary Committee',
    icon: Utensils,
    description: 'Works with dietary staff on student meal programs',
    path: '/committees/dietary',
  },
  {
    name: 'Judicial Committee',
    icon: Scale,
    description: 'Handles legal matters and upholds student rights',
    path: '/committees/judicial',
  },
  {
    name: 'Sports Committee',
    icon: Trophy,
    description: 'Promotes sports, athletics, and inter-class competitions',
    path: '/committees/sports',
  },
  {
    name: 'Auditing Committee',
    icon: DollarSign,
    description: 'Audits LMSA finances and reports to members',
    path: '/committees/auditing',
  },
  {
    name: 'Foreign Affairs',
    icon: Globe,
    description: 'Coordinates international opportunities and exchanges',
    path: '/committees/foreign-affairs',
  },
  {
    name: 'Membership Committee',
    icon: UserPlus,
    description: 'Recruits members and manages ID cards',
    path: '/committees/membership',
  },
  {
    name: 'Media & Publicity',
    icon: Megaphone,
    description: 'Manages LMSA media and promotional activities',
    path: '/committees/media-publicity',
  },
  {
    name: 'Welfare Committee',
    icon: HeartHandshake,
    description: 'Ensures student welfare and support services',
    path: '/committees/welfare',
  },
];

export default function CommitteesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Standing Committees
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Our 12 standing committees drive LMSA's mission forward, each focusing on
            specific aspects of student life, academics, and community engagement.
          </p>
        </div>
      </div>

      {/* Committees Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committees.map((committee, index) => (
            <CommitteeCard key={index} committee={committee} />
          ))}
        </div>
      </div>

      {/* Join a Committee CTA */}
      <div className="bg-lmsa-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Join a Committee?
          </h2>
          <p className="text-lmsa-100 mb-8 max-w-2xl mx-auto">
            Get involved in LMSA's work by joining one of our committees.
            Make a difference in student life and develop leadership skills.
          </p>
          <Link
            to="/get-involved/committees"
            className="inline-block px-8 py-3 bg-white text-lmsa-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Join a Committee
          </Link>
        </div>
      </div>
    </div>
  );
}

function CommitteeCard({ committee }) {
  const Icon = committee.icon;

  return (
    <Link
      to={committee.path}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-lmsa-600 transition-all group"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-lmsa-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-lmsa-600 transition-colors">
          <Icon className="w-6 h-6 text-lmsa-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-lmsa-600 transition-colors">
            {committee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {committee.description}
          </p>
          <div className="flex items-center text-sm text-lmsa-600 font-medium">
            Learn more →
          </div>
        </div>
      </div>
    </Link>
  );
}
