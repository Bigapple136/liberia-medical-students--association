import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Users,
  Globe,
  ChevronRight,
  Award,
  Heart,
  Lightbulb,
  FileText,
  Calendar,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import Button from '@components/common/Button';
import Card from '@components/common/Card';

export default function HomePage() {
  return (
    <div id="main-content">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-lmsa-600 text-white text-sm rounded-full mb-6 font-medium">
            Established 1972
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight uppercase">
            The Voice of Medical Students in Liberia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 text-balance">
            Uniting future physicians at A.M. Dogliotti College of Medicine to promote
            excellence, advocate for student welfare, and advance healthcare in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Become a Member
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg" rightIcon={<ChevronRight size={16} />}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Persona Selector */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">I Am A...</h2>
            <p className="text-gray-600">Select your role to find relevant information</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {personas.map((persona, index) => (
              <Link
                key={index}
                to={persona.link}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg hover:bg-lmsa-600 hover:text-white text-gray-700 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                {persona.icon}
                <span className="font-medium">{persona.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Service Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tight">What We Do</h2>
            <p className="text-gray-600 text-balance">Supporting medical students through four core pillars</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <Card key={index} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="text-lmsa-600 mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{pillar.description}</p>
                <Link to={pillar.link} className="text-lmsa-600 hover:text-lmsa-700 font-medium inline-flex items-center gap-1 transition-colors duration-200">
                  Learn More <ArrowRight size={16} />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statement of Belonging Banner */}
      <section className="py-16 bg-lmsa-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-serif italic mb-6 text-balance">
            &quot;Together, we are shaping the future of healthcare in Liberia—one student, one community, one mission at a time.&quot;
          </blockquote>
          <p className="text-lmsa-100 text-lg">
            — LMSA Mission Statement
          </p>
        </div>
      </section>

      {/* 5. Dual Value Proposition Tiles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lmsa-600 rounded-lg text-white flex-shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Member Benefits</h3>
                  <p className="text-gray-600 mb-4 text-balance">
                    Access exclusive resources, events, and networking opportunities designed to support your medical journey.
                  </p>
                  <Link to="/membership" className="text-lmsa-600 hover:text-lmsa-700 font-medium inline-flex items-center gap-1 transition-colors duration-200">
                    Explore Benefits <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="card-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lmsa-600 rounded-lg text-white flex-shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Chapter Resources</h3>
                  <p className="text-gray-600 mb-4 text-balance">
                    Everything your chapter needs to thrive: guidelines, templates, event planning tools, and leadership support.
                  </p>
                  <Link to="/portal#resources" className="text-lmsa-600 hover:text-lmsa-700 font-medium inline-flex items-center gap-1 transition-colors duration-200">
                    View Resources <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Benefits Grid (Why Join LMSA?) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tight">Why Join LMSA?</h2>
            <p className="text-gray-600 text-balance">Discover what makes our community exceptional</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center text-lmsa-600">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm text-balance">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<ChevronRight size={16} />}>
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Quick-Access Resource Tiles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tight">Quick Access</h2>
            <p className="text-gray-600 text-balance">Jump to the resources you need</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resources.map((resource, index) => (
              <Link
                key={index}
                to={resource.link}
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-lmsa-50 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <div className="text-lmsa-600">{resource.icon}</div>
                <span className="text-sm font-medium text-center text-gray-700">{resource.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Blog/News Feed */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tight">Latest from LMSA</h2>
            <p className="text-gray-600 text-balance">Stay updated with our newest stories and announcements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {news.map((item, index) => (
              <Card key={index} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
                <div className="aspect-video bg-lmsa-100 rounded-lg mb-4 flex items-center justify-center">
                  <FileText size={48} className="text-lmsa-400" />
                </div>
                <div className="inline-block px-3 py-1 bg-lmsa-100 text-lmsa-700 text-xs rounded-full mb-3 font-medium">
                  {item.category}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-balance">{item.excerpt}</p>
                <Link to={item.link} className="text-lmsa-600 hover:text-lmsa-700 font-medium inline-flex items-center gap-1 transition-colors duration-200">
                  Read More <ArrowRight size={16} />
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/news">
              <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
                View All News
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Data
const personas = [
  { icon: <GraduationCap size={20} />, label: 'Medical Student', link: '/portal' },
  { icon: <Users size={20} />, label: 'Faculty Member', link: '/about' },
  { icon: <Award size={20} />, label: 'Alumni', link: '/portal#alumni' },
  { icon: <Heart size={20} />, label: 'Chapter Leader', link: '/portal#chapters' },
  { icon: <Globe size={20} />, label: 'Partner', link: '/contact' },
];

const pillars = [
  {
    icon: <BookOpen size={32} strokeWidth={1.5} />,
    title: 'Academic Excellence',
    description: 'Study resources, symposia, mentorship programs, and academic support',
    link: '/portal#academics'
  },
  {
    icon: <GraduationCap size={32} strokeWidth={1.5} />,
    title: 'Professional Development',
    description: 'Leadership opportunities, research support, and international exchanges',
    link: '/portal#development'
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: 'Student Welfare',
    description: 'Advocacy, grievance support, mental health resources, and accommodation',
    link: '/portal#welfare'
  },
  {
    icon: <Globe size={32} strokeWidth={1.5} />,
    title: 'Community Impact',
    description: 'Medical camps, blood drives, health education, and outreach programs',
    link: '/portal#community'
  }
];

const benefits = [
  {
    icon: <BookOpen size={24} strokeWidth={1.5} />,
    title: 'Study Resources',
    description: 'Access past papers, notes, and tutoring programs from senior students'
  },
  {
    icon: <Calendar size={24} strokeWidth={1.5} />,
    title: 'Exclusive Events',
    description: 'Participate in symposia, workshops, and networking events'
  },
  {
    icon: <Users size={24} strokeWidth={1.5} />,
    title: 'Peer Network',
    description: 'Connect with fellow students and mentors across all years'
  },
  {
    icon: <Lightbulb size={24} strokeWidth={1.5} />,
    title: 'Research Support',
    description: 'Get guidance and funding for your research projects'
  },
  {
    icon: <MessageCircle size={24} strokeWidth={1.5} />,
    title: 'Advocacy',
    description: 'Your voice matters—we represent student interests at all levels'
  },
  {
    icon: <Award size={24} strokeWidth={1.5} />,
    title: 'Career Guidance',
    description: 'Internship placements, residency guidance, and job opportunities'
  }
];

const resources = [
  { icon: <FileText size={24} />, label: 'Constitution', link: '/resources/constitution' },
  { icon: <Calendar size={24} />, label: 'Events', link: '/portal#events' },
  { icon: <Users size={24} />, label: 'Mentorship', link: '/portal#mentorship' },
  { icon: <Award size={24} />, label: 'Career Center', link: '/portal#careers' },
  { icon: <BookOpen size={24} />, label: 'Study Materials', link: '/portal#study' },
  { icon: <MessageCircle size={24} />, label: 'Support', link: '/contact' },
];

const news = [
  {
    category: 'Announcement',
    title: 'LMSA Annual Symposium 2026',
    excerpt: 'Join us for three days of medical excellence, workshops, and networking opportunities.',
    link: '/news/symposium-2026'
  },
  {
    category: 'Achievement',
    title: 'Students Win Regional Research Competition',
    excerpt: 'Our team took first place at the West African Medical Students Research Challenge.',
    link: '/news/research-competition'
  },
  {
    category: 'Community',
    title: 'Free Medical Camp Serves 500+ Patients',
    excerpt: 'LMSA volunteers provided free healthcare services to communities in Montserrado County.',
    link: '/news/medical-camp'
  }
];
