import { useParams, Link } from 'react-router-dom';
import { Users, Target, CheckCircle, ArrowLeft, GraduationCap, Heart, FlaskConical, Shield, TrendingUp, Megaphone, Wallet, Scale, Globe, Trophy, Palette, Briefcase } from 'lucide-react';

const committeesData = {
  'medical-education': {
    name: 'Medical Education',
    slug: 'medical-education',
    focus: 'Curriculum and academic standards',
    description: 'The Medical Education Committee is responsible for monitoring and improving the quality of medical education across Liberian medical institutions. This committee works closely with faculty and students to ensure curriculum relevance, advocate for educational resources, and promote innovative teaching methodologies.',
    mandate: 'To review and provide recommendations on medical curriculum, teaching methods, assessment strategies, and educational resources to ensure the highest standards of medical education in Liberia.',
    members: 8,
    chair: 'Dr. Sarah Johnson',
    color: 'teal',
    icon: 'GraduationCap',
    gradient: 'from-teal-600 via-teal-700 to-lmsa-700',
    initiatives: [
      'Curriculum review and modernization',
      'Peer tutoring program development',
      'Clinical skills assessment standards',
      'Medical library resource enhancement',
    ],
    keyProjects: [
      'Developed standardized clinical skills checklist for all year levels',
      'Established peer tutoring network across all campuses',
      'Organized annual medical education symposium',
    ],
  },
  'community-health': {
    name: 'Community Health',
    slug: 'community-health',
    focus: 'Public health outreach',
    description: 'The Community Health Committee leads LMSA\'s public health initiatives, organizing outreach programs that serve underserved communities across Liberia. This committee mobilizes student volunteers to deliver health education, screenings, and basic healthcare services to those who need them most.',
    mandate: 'To plan and execute community health programs that address pressing public health issues, promote health literacy, and provide accessible healthcare services to underserved populations.',
    members: 12,
    chair: 'James Williams',
    color: 'lmsa',
    icon: 'Heart',
    gradient: 'from-lmsa-600 via-lmsa-700 to-teal-700',
    initiatives: [
      'Rural health outreach programs',
      'Health education campaigns',
      'Disease prevention initiatives',
      'Maternal and child health support',
    ],
    keyProjects: [
      'Conducted 15+ community health screenings reaching 2,000+ individuals',
      'Launched malaria prevention campaign in 5 counties',
      'Established health education program in 10 schools',
    ],
  },
  'research-innovation': {
    name: 'Research & Innovation',
    slug: 'research-innovation',
    focus: 'Scientific research promotion',
    description: 'The Research & Innovation Committee fosters a culture of scientific inquiry and innovation among LMSA members. This committee supports student research projects, organizes research workshops, and connects students with research opportunities both locally and internationally.',
    mandate: 'To promote and facilitate medical research among students, provide research training, and create platforms for sharing research findings within the LMSA community.',
    members: 6,
    chair: 'Dr. Michael Chen',
    color: 'purple',
    icon: 'FlaskConical',
    gradient: 'from-purple-600 via-purple-700 to-lmsa-700',
    initiatives: [
      'Student research grant program',
      'Research methodology workshops',
      'Annual research poster competition',
      'Mentorship matching with senior researchers',
    ],
    keyProjects: [
      'Published first LMSA student research journal',
      'Secured funding for 8 student research projects',
      'Hosted international research collaboration forum',
    ],
  },
  'student-welfare': {
    name: 'Student Welfare',
    slug: 'student-welfare',
    focus: 'Student support services',
    description: 'The Student Welfare Committee is dedicated to ensuring the well-being of all LMSA members. This committee addresses student concerns, provides support services, and creates programs that promote mental health, academic success, and overall student satisfaction.',
    mandate: 'To safeguard student welfare, address grievances, provide support resources, and create an environment where all medical students can thrive academically and personally.',
    members: 10,
    chair: 'Patricia Brown',
    color: 'rose',
    icon: 'Shield',
    gradient: 'from-rose-600 via-rose-700 to-lmsa-700',
    initiatives: [
      'Mental health awareness programs',
      'Financial literacy workshops',
      'Student grievance support system',
      'Wellness and self-care campaigns',
    ],
    keyProjects: [
      'Established peer counseling network',
      'Launched mental health awareness week',
      'Created emergency support fund for students in need',
    ],
  },
  'professional-development': {
    name: 'Professional Development',
    slug: 'professional-development',
    focus: 'Career and skills training',
    description: 'The Professional Development Committee prepares LMSA members for successful medical careers through skills training, career guidance, and professional networking opportunities. This committee organizes workshops, seminars, and mentorship programs.',
    mandate: 'To equip medical students with the professional skills, knowledge, and connections needed to excel in their chosen medical specialties and become leaders in healthcare.',
    members: 9,
    chair: 'Dr. Robert Davis',
    color: 'amber',
    icon: 'TrendingUp',
    gradient: 'from-amber-500 via-amber-600 to-lmsa-700',
    initiatives: [
      'Career exploration seminars',
      'CV writing and interview skills workshops',
      'Medical ethics training',
      'Leadership development programs',
    ],
    keyProjects: [
      'Hosted annual career fair with 20+ medical specialties',
      'Launched professional mentorship program',
      'Organized medical entrepreneurship workshop series',
    ],
  },
  'public-relations': {
    name: 'Public Relations',
    slug: 'public-relations',
    focus: 'Communications and media',
    description: 'The Public Relations Committee manages LMSA\'s public image and communications. This committee handles media relations, social media strategy, internal communications, and promotes LMSA events and initiatives to maximize reach and engagement.',
    mandate: 'To manage LMSA\'s public image, coordinate communications, promote events and initiatives, and maintain effective relationships with media outlets and the public.',
    members: 7,
    chair: 'Emily Taylor',
    color: 'orange',
    icon: 'Megaphone',
    gradient: 'from-orange-500 via-orange-600 to-lmsa-700',
    initiatives: [
      'Social media strategy and content creation',
      'Newsletter publication',
      'Media relations and press releases',
      'Brand consistency across platforms',
    ],
    keyProjects: [
      'Grew social media following by 150%',
      'Launched monthly LMSA newsletter',
      'Redesigned LMSA website and digital presence',
    ],
  },
  'finance-budget': {
    name: 'Finance & Budget',
    slug: 'finance-budget',
    focus: 'Financial management',
    description: 'The Finance & Budget Committee oversees LMSA\'s financial health, ensuring responsible management of resources, transparent budgeting, and strategic financial planning. This committee works closely with the executive team to allocate funds effectively.',
    mandate: 'To oversee financial planning, budgeting, and expenditure review, ensuring transparent and responsible management of LMSA resources for maximum organizational impact.',
    members: 5,
    chair: 'David Martinez',
    color: 'lmsa',
    icon: 'Wallet',
    gradient: 'from-lmsa-600 via-lmsa-700 to-teal-700',
    initiatives: [
      'Annual budget planning and review',
      'Financial transparency reporting',
      'Fundraising strategy development',
      'Grant application support',
    ],
    keyProjects: [
      'Implemented transparent financial reporting system',
      'Secured 3 major grants for LMSA programs',
      'Established emergency reserve fund',
    ],
  },
  'ethics-discipline': {
    name: 'Ethics & Discipline',
    slug: 'ethics-discipline',
    focus: 'Code of conduct enforcement',
    description: 'The Ethics & Discipline Committee upholds the highest standards of professional conduct among LMSA members. This committee develops ethical guidelines, addresses conduct issues, and promotes integrity within the medical student community.',
    mandate: 'To establish and enforce ethical standards, address conduct violations, promote professional integrity, and ensure all members adhere to the highest ethical standards in their academic and professional lives.',
    members: 6,
    chair: 'Dr. Angela White',
    color: 'purple',
    icon: 'Scale',
    gradient: 'from-purple-600 via-purple-700 to-lmsa-700',
    initiatives: [
      'Code of conduct development and updates',
      'Ethics training workshops',
      'Grievance review procedures',
      'Professional integrity campaigns',
    ],
    keyProjects: [
      'Revised LMSA Code of Conduct',
      'Conducted ethics training for 200+ members',
      'Established transparent grievance review process',
    ],
  },
  'legislative-affairs': {
    name: 'Legislative Affairs',
    slug: 'legislative-affairs',
    focus: 'Policy and advocacy',
    description: 'The Legislative Affairs Committee engages with policymakers and government bodies to advocate for medical students\' interests and healthcare policy improvements. This committee monitors legislation affecting medical education and healthcare delivery.',
    mandate: 'To monitor and engage with legislative processes, advocate for policies that benefit medical students and healthcare, and represent LMSA in policy discussions at local and national levels.',
    members: 8,
    chair: 'Thomas Anderson',
    color: 'teal',
    icon: 'Globe',
    gradient: 'from-teal-600 via-teal-700 to-lmsa-700',
    initiatives: [
      'Healthcare policy analysis and position papers',
      'Government engagement and lobbying',
      'Medical education advocacy',
      'Student rights protection',
    ],
    keyProjects: [
      'Successfully advocated for increased medical education funding',
      'Submitted policy brief on healthcare workforce development',
      'Established relationship with Ministry of Health',
    ],
  },
  'international-relations': {
    name: 'International Relations',
    slug: 'international-relations',
    focus: 'Global partnerships',
    description: 'The International Relations Committee builds and maintains partnerships with medical student associations and healthcare organizations worldwide. This committee creates opportunities for international collaboration, exchange programs, and global health initiatives.',
    mandate: 'To develop and maintain international partnerships, facilitate exchange programs, promote global health engagement, and represent LMSA in international medical student forums.',
    members: 10,
    chair: 'Grace Kim',
    color: 'orange',
    icon: 'Globe',
    gradient: 'from-orange-500 via-orange-600 to-lmsa-700',
    initiatives: [
      'International partnership development',
      'Student exchange program coordination',
      'Global health conference participation',
      'Cross-cultural collaboration initiatives',
    ],
    keyProjects: [
      'Established partnerships with 12 international medical schools',
      'Launched student exchange program with 3 countries',
      'Hosted international health diplomacy forum',
    ],
  },
  'sports-recreation': {
    name: 'Sports & Recreation',
    slug: 'sports-recreation',
    focus: 'Athletic activities',
    description: 'The Sports & Recreation Committee promotes physical wellness and team spirit among LMSA members through organized sports activities, tournaments, and recreational programs. This committee believes in the importance of work-life balance for medical students.',
    mandate: 'To organize sports events, promote physical wellness, foster team spirit, and provide recreational opportunities that contribute to the holistic development of medical students.',
    members: 11,
    chair: 'Marcus Thompson',
    color: 'rose',
    icon: 'Trophy',
    gradient: 'from-rose-600 via-rose-700 to-lmsa-700',
    initiatives: [
      'Annual inter-class sports competition',
      'Weekly sports training sessions',
      'Inter-university sports tournaments',
      'Wellness and fitness programs',
    ],
    keyProjects: [
      'Hosted successful annual LMSA Sports Day with 300+ participants',
      'Won regional medical school football championship',
      'Established regular fitness classes for members',
    ],
  },
  'cultural-affairs': {
    name: 'Cultural Affairs',
    slug: 'cultural-affairs',
    focus: 'Arts and cultural programs',
    description: 'The Cultural Affairs Committee celebrates and promotes the rich cultural heritage of Liberian medical students through arts, music, dance, and cultural events. This committee fosters unity in diversity and provides platforms for creative expression.',
    mandate: 'To promote cultural awareness, organize cultural events, celebrate diversity, and provide platforms for creative expression within the LMSA community.',
    members: 9,
    chair: 'Fatima Sesay',
    color: 'amber',
    icon: 'Palette',
    gradient: 'from-amber-500 via-amber-600 to-lmsa-700',
    initiatives: [
      'Annual cultural festival',
      'Talent showcases and open mic nights',
      'Cultural heritage awareness campaigns',
      'Arts and creativity workshops',
    ],
    keyProjects: [
      'Organized successful LMSA Cultural Week',
      'Launched talent showcase platform',
      'Created cultural diversity awareness program',
    ],
  },
};

// Icon mapping
const iconMap = {
  GraduationCap,
  Heart,
  FlaskConical,
  Shield,
  TrendingUp,
  Megaphone,
  Wallet,
  Scale,
  Globe,
  Trophy,
  Palette,
};

// Color class mapping per committee
const colorClasses = {
  lmsa: { bg: 'bg-lmsa-100', text: 'text-lmsa-600', bg50: 'bg-lmsa-50', bg100: 'bg-lmsa-100', border: 'border-lmsa-100', bg500: 'bg-lmsa-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', bg50: 'bg-teal-50', bg100: 'bg-teal-100', border: 'border-teal-100', bg500: 'bg-teal-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', bg50: 'bg-purple-50', bg100: 'bg-purple-100', border: 'border-purple-100', bg500: 'bg-purple-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', bg50: 'bg-rose-50', bg100: 'bg-rose-100', border: 'border-rose-100', bg500: 'bg-rose-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', bg50: 'bg-amber-50', bg100: 'bg-amber-100', border: 'border-amber-100', bg500: 'bg-amber-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', bg50: 'bg-orange-50', bg100: 'bg-orange-100', border: 'border-orange-100', bg500: 'bg-orange-600' },
};

export default function CommitteeDetailPage() {
  const { slug } = useParams();
  const committee = committeesData[slug];

  if (!committee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Committee Not Found</h1>
          <Link to="/leadership/committees" className="text-lmsa-600 hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft size={16} />
            Back to Committees
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[committee.icon] || Briefcase;
  const colors = colorClasses[committee.color];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero Header */}
      <div className={`bg-gradient-to-br ${committee.gradient} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Link */}
          <Link to="/leadership/committees" className="inline-flex items-center gap-2 text-white/80 hover:text-white hover:underline mb-6">
            <ArrowLeft size={16} />
            Back to All Committees
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <IconComponent size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{committee.name} Committee</h1>
              <p className="text-lg text-white/80 mt-2">{committee.focus}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <Users size={20} className={colors.text} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Committee Members</p>
                <p className="font-bold text-gray-900 text-xl">{committee.members}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <Briefcase size={20} className={colors.text} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Committee Chair</p>
                <p className="font-bold text-gray-900">{committee.chair}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <Target size={20} className={colors.text} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Committee</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{committee.description}</p>

          <div className={`p-6 ${colors.bg50} rounded-xl border ${colors.border}`}>
            <h3 className={`text-lg font-bold ${colors.text} mb-2`}>Mandate</h3>
            <p className="text-gray-700 leading-relaxed">{committee.mandate}</p>
          </div>
        </div>

        {/* Current Initiatives */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {committee.initiatives.map((initiative, index) => (
              <div key={index} className={`flex items-start gap-3 p-4 ${colors.bg50} rounded-lg border ${colors.border}`}>
                <Target size={20} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                <p className="text-gray-700">{initiative}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Projects & Achievements</h2>
          <div className="space-y-4">
            {committee.keyProjects.map((project, index) => (
              <div key={index} className={`flex items-start gap-3 p-5 bg-white rounded-lg border-2 ${colors.border} shadow-sm`}>
                <div className={`w-8 h-8 ${colors.bg500} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <CheckCircle size={18} className="text-white" />
                </div>
                <p className="text-gray-700">{project}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div className={`bg-gradient-to-r ${colors.bg50} to-${committee.color === 'lmsa' ? 'teal' : 'lmsa'}-50 rounded-2xl border-2 ${colors.border} p-8 text-center`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join This Committee</h2>
          <p className="text-gray-700 mb-6">
            Interested in contributing to {committee.name}? Apply to become a committee member.
          </p>
          <Link to="/get-involved/committees" className="btn btn-primary inline-block">
            Apply to Join
          </Link>
        </div>
      </div>
    </div>
  );
}
