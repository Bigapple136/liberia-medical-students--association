/**
 * TODO: STOCK PHOTOS — Replace all images in stockPhotos with real LMSA photography
 * before shipping. See src/config/images.js for the full list and replacement plan.
 */
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  HeartPulse,
  History,
  Landmark,
  Lightbulb,
  Mail,
  Megaphone,
  Network,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { stockPhotos } from '@config/images';
import { PatternBackground } from './SvgPatterns';

const heroPages = [
  {
    match: (path) => path === '/',
    eyebrow: 'Liberia Medical Students\u2019 Association',
    title: 'The voice of Liberia\u2019s future physicians',
    description:
      'A student-led community advancing medical education, welfare, leadership, and better health outcomes across Liberia.',
    action: { label: 'Become a member', to: '/register' },
    secondary: { label: 'Discover LMSA', to: '/about' },
    accent: 'green',
    icon: Stethoscope,
    photoKey: 'home',
    pattern: 'dots',
    stats: [
      ['1972', 'Founded'],
      ['4', 'Core pillars'],
      ['1', 'Student voice'],
    ],
  },
  {
    match: (path) => path === '/about',
    eyebrow: 'About LMSA',
    title: 'More than an association',
    description:
      'We bring Liberia\u2019s medical students together to learn, lead, advocate, and serve the communities that need us most.',
    action: { label: 'Explore our history', to: '/about/history' },
    accent: 'green',
    icon: Landmark,
    photoKey: 'about',
    pattern: 'crosses',
  },
  {
    match: (path) => path === '/about/history',
    eyebrow: 'Our story',
    title: 'Fifty years of student leadership',
    description:
      'From one generation of medical students to the next, LMSA continues to build a stronger future for healthcare in Liberia.',
    action: { label: 'Meet our leaders', to: '/leadership' },
    accent: 'gold',
    icon: History,
    photoKey: 'leadership',
    pattern: 'diagonal',
  },
  {
    match: (path) => path === '/about/mission-vision',
    eyebrow: 'Our direction',
    title: 'Training physicians. Strengthening communities.',
    description:
      'Our mission and vision connect professional excellence with the everyday needs of Liberian communities.',
    action: { label: 'Read our constitution', to: '/about/constitution' },
    accent: 'blue',
    icon: Target,
    photoKey: 'about',
    pattern: 'grid',
  },
  {
    match: (path) => path === '/about/constitution',
    eyebrow: 'Governance',
    title: 'The principles that guide us',
    description:
      'Our constitution gives LMSA a clear foundation for accountability, representation, and service.',
    action: { label: 'View leadership', to: '/leadership' },
    accent: 'ink',
    icon: FileText,
    photoKey: 'leadership',
    pattern: 'grid',
  },
  {
    match: (path) => path === '/leadership',
    eyebrow: 'Leadership',
    title: 'The people moving LMSA forward',
    description:
      'Meet the students and officers serving the association and turning our shared mission into action.',
    action: { label: 'Explore committees', to: '/leadership/committees' },
    accent: 'green',
    icon: Users,
    photoKey: 'leadership',
    pattern: 'crosses',
  },
  {
    match: (path) => path === '/leadership/committees',
    eyebrow: 'Leadership / Committees',
    title: 'Where ideas become action',
    description:
      'Find the committee working on the issues, opportunities, and services that matter to medical students.',
    action: { label: 'Join a committee', to: '/get-involved/committees' },
    accent: 'blue',
    icon: Network,
    photoKey: 'mentorship',
    pattern: 'diamonds',
  },
  {
    match: (path) => path === '/leadership/past-presidents',
    eyebrow: 'Leadership / Alumni',
    title: 'A legacy of service',
    description:
      'The leaders who came before us continue to shape the standards and spirit of LMSA.',
    action: { label: 'Meet today\u2019s council', to: '/leadership/executive-council' },
    accent: 'gold',
    icon: Trophy,
    photoKey: 'leadership',
    pattern: 'diagonal',
  },
  {
    match: (path) => path === '/leadership/executive-council',
    eyebrow: 'Leadership / Council',
    title: 'Meet the executive council',
    description:
      'Class presidents and student representatives bring the priorities of their peers to the work of LMSA.',
    action: { label: 'See all leadership', to: '/leadership' },
    accent: 'green',
    icon: ShieldCheck,
    photoKey: 'leadership',
    pattern: 'crosses',
  },
  {
    match: (path) => path === '/membership',
    eyebrow: 'Membership',
    title: 'Find your place in the LMSA community',
    description:
      'Membership gives you a stronger network, practical support, and more ways to grow throughout medical school.',
    action: { label: 'Join LMSA', to: '/register' },
    secondary: { label: 'View benefits', to: '/membership/benefits' },
    accent: 'green',
    icon: Sparkles,
    photoKey: 'membership',
    pattern: 'circles',
  },
  {
    match: (path) => path === '/membership/benefits',
    eyebrow: 'Membership / Benefits',
    title: 'More support for every stage of medical school',
    description:
      'Discover the people, resources, and opportunities that make LMSA membership useful every day.',
    action: { label: 'Choose your membership', to: '/membership/categories' },
    accent: 'gold',
    icon: HeartPulse,
    photoKey: 'membership',
    pattern: 'dots',
  },
  {
    match: (path) => path === '/membership/categories',
    eyebrow: 'Membership / Categories',
    title: 'Membership designed around your journey',
    description:
      'Whether you are a current student, associate, or honorary member, there is a place for you in LMSA.',
    action: { label: 'Review dues', to: '/membership/dues' },
    accent: 'blue',
    icon: Users,
    photoKey: 'membership',
    pattern: 'grid',
  },
  {
    match: (path) => path === '/membership/dues',
    eyebrow: 'Membership / Dues',
    title: 'A simple path to active membership',
    description:
      'See the current fee structure and the next step for activating your LMSA membership.',
    action: { label: 'Start membership', to: '/register' },
    accent: 'green',
    icon: FileText,
    photoKey: 'membership',
    pattern: 'dots',
  },
  {
    match: (path) => path === '/academics/symposia',
    eyebrow: 'Academics / Symposia',
    title: 'Ideas that move medicine forward',
    description:
      'Gather with students, educators, and healthcare professionals for conversations that expand what is possible.',
    action: { label: 'See upcoming events', to: '/events' },
    accent: 'blue',
    icon: CalendarDays,
    photoKey: 'events',
    pattern: 'hexagons',
  },
  {
    match: (path) => path === '/academics/resources',
    eyebrow: 'Academics / Resources',
    title: 'Tools for the next stage of your training',
    description:
      'Find study materials, guides, and practical resources designed for the realities of medical school.',
    action: { label: 'Find a mentor', to: '/academics/mentorship' },
    accent: 'green',
    icon: BookOpen,
    photoKey: 'about',
    pattern: 'grid',
  },
  {
    match: (path) => path === '/academics/mentorship',
    eyebrow: 'Academics / Mentorship',
    title: 'Learn from those one step ahead',
    description:
      'Build confidence through peer guidance, honest conversations, and a community invested in your progress.',
    action: { label: 'Explore research', to: '/academics/research' },
    accent: 'gold',
    icon: Users,
    photoKey: 'mentorship',
    pattern: 'circles',
  },
  {
    match: (path) => path === '/academics/research',
    eyebrow: 'Academics / Research',
    title: 'Ask better questions. Improve healthcare.',
    description:
      'LMSA helps students turn curiosity into research that can make a meaningful difference in Liberia.',
    action: { label: 'View academic resources', to: '/academics/resources' },
    accent: 'blue',
    icon: Lightbulb,
    photoKey: 'research',
    pattern: 'hexagons',
  },
  {
    match: (path) => path === '/events',
    eyebrow: 'Events',
    title: 'What\u2019s happening across LMSA',
    description:
      'Stay close to the conversations, workshops, and service activities shaping our student community.',
    action: { label: 'Explore academic events', to: '/academics/symposia' },
    accent: 'gold',
    icon: CalendarDays,
    photoKey: 'events',
    pattern: 'diamonds',
  },
  {
    match: (path) => path === '/news',
    eyebrow: 'News & stories',
    title: 'Stories from our student community',
    description:
      'Read about the people, ideas, and moments moving medical education and service forward in Liberia.',
    action: { label: 'Get involved', to: '/get-involved/volunteer' },
    accent: 'green',
    icon: Megaphone,
    photoKey: 'news',
    pattern: 'wave',
  },
  {
    match: (path) => path === '/get-involved/volunteer',
    eyebrow: 'Get involved / Volunteer',
    title: 'Your time can improve someone\u2019s care',
    description:
      'Bring your skills and energy to outreach, health education, and community service with LMSA.',
    action: { label: 'Join a committee', to: '/get-involved/committees' },
    accent: 'rose',
    icon: HeartPulse,
    photoKey: 'volunteer',
    pattern: 'circles',
  },
  {
    match: (path) => path === '/get-involved/leadership',
    eyebrow: 'Get involved / Leadership',
    title: 'Build the skills medicine needs',
    description:
      'Take on meaningful responsibility and develop the leadership habits that will serve your future patients.',
    action: { label: 'Meet the leadership team', to: '/leadership' },
    accent: 'gold',
    icon: Trophy,
    photoKey: 'leadership',
    pattern: 'diagonal',
  },
  {
    match: (path) => path === '/get-involved/committees',
    eyebrow: 'Get involved / Committees',
    title: 'Find the work that matters to you',
    description:
      'Choose a committee where your perspective can strengthen student welfare, academics, advocacy, or service.',
    action: { label: 'Browse committees', to: '/leadership/committees' },
    accent: 'blue',
    icon: Network,
    photoKey: 'mentorship',
    pattern: 'crosses',
  },
  {
    match: (path) => path === '/partnership',
    eyebrow: 'Partnerships',
    title: 'Let\u2019s strengthen healthcare together',
    description:
      'Partner with LMSA to invest in medical education, student leadership, research, and community health.',
    action: { label: 'Start a conversation', to: '/contact?topic=partnership' },
    accent: 'green',
    icon: Users,
    photoKey: 'partnership',
    pattern: 'diamonds',
  },
  {
    match: (path) => path === '/contact',
    eyebrow: 'Contact LMSA',
    title: 'Start a conversation with LMSA',
    description:
      'Have a question, an idea, or an opportunity to share? We would be glad to hear from you.',
    action: { label: 'Send a message', to: '#contact-form' },
    accent: 'ink',
    icon: Mail,
    photoKey: 'partnership',
    pattern: 'grid',
  },
];

const accentStyles = {
  green: { surface: 'bg-lmsa-900', text: 'text-lmsa-50', mark: 'bg-lmsa-400', icon: 'text-lmsa-200', overlay: 'from-lmsa-900/95 via-lmsa-900/80 to-lmsa-800/60' },
  blue: { surface: 'bg-blue-800', text: 'text-white', mark: 'bg-blue-400', icon: 'text-blue-100', overlay: 'from-blue-900/95 via-blue-800/80 to-blue-700/60' },
  gold: { surface: 'bg-amber-800', text: 'text-white', mark: 'bg-amber-400', icon: 'text-amber-100', overlay: 'from-amber-900/95 via-amber-800/80 to-amber-700/60' },
  rose: { surface: 'bg-rose-800', text: 'text-white', mark: 'bg-rose-400', icon: 'text-rose-100', overlay: 'from-rose-900/95 via-rose-800/80 to-rose-700/60' },
  ink: { surface: 'bg-gray-900', text: 'text-white', mark: 'bg-lmsa-400', icon: 'text-lmsa-200', overlay: 'from-gray-900/95 via-gray-900/80 to-lmsa-900/60' },
};

function getHero(pathname) {
  const matchedHero = heroPages.find((page) => page.match(pathname));
  if (matchedHero) return matchedHero;

  const slug = pathname.split('/').filter(Boolean).pop();
  const readableSlug = slug
    ? slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'LMSA';

  if (pathname.startsWith('/events/')) {
    return {
      eyebrow: 'Events / Details',
      title: readableSlug,
      description: 'See the schedule, location, and ways to take part in this LMSA event.',
      action: { label: 'Browse all events', to: '/events' },
      accent: 'gold',
      icon: CalendarDays,
      photoKey: 'events',
      pattern: 'diamonds',
    };
  }

  if (pathname.startsWith('/news/')) {
    return {
      eyebrow: 'News / Story',
      title: readableSlug,
      description: 'Read the latest story from the LMSA student community.',
      action: { label: 'Back to news', to: '/news' },
      accent: 'green',
      icon: Megaphone,
      photoKey: 'news',
      pattern: 'wave',
    };
  }

  if (pathname.startsWith('/leadership/committees/')) {
    return {
      eyebrow: 'Leadership / Committee',
      title: readableSlug,
      description: 'Discover the people, priorities, and work behind this LMSA committee.',
      action: { label: 'Browse committees', to: '/leadership/committees' },
      accent: 'blue',
      icon: Network,
      photoKey: 'mentorship',
      pattern: 'crosses',
    };
  }

  return null;
}

export default function PageHero() {
  const { pathname } = useLocation();
  const hero = getHero(pathname);

  if (!hero) return null;

  const styles = accentStyles[hero.accent];
  const Icon = hero.icon;
  const isHome = pathname === '/';
  const photo = hero.photoKey ? stockPhotos.hero[hero.photoKey] : null;

  return (
    <section
      className={`page-hero ${styles.surface} ${styles.text} relative`}
      aria-labelledby="page-hero-title"
    >
      {/* Background photo with gradient overlay */}
      {photo && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={photo.src}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${styles.overlay}`} />
          <PatternBackground
            pattern={hero.pattern || 'dots'}
            color="white"
            opacity={0.04}
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="page-hero-grid">
          <div className="page-hero-copy">
            <div className="flex items-center gap-3 mb-6">
              <span className={`page-hero-mark ${styles.mark}`} aria-hidden="true" />
              <p className="page-hero-eyebrow">{hero.eyebrow}</p>
            </div>
            <h1 id="page-hero-title" className="page-hero-title">
              {hero.title}
            </h1>
            <p className="page-hero-description">{hero.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link to={hero.action.to} className="page-hero-primary">
                {hero.action.label}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              {hero.secondary && (
                <Link to={hero.secondary.to} className="page-hero-secondary">
                  {hero.secondary.label}
                </Link>
              )}
            </div>
          </div>

          <div className="page-hero-visual" aria-hidden="true">
            <div className="page-hero-icon-wrap">
              <Icon size={isHome ? 80 : 64} strokeWidth={1.25} className={styles.icon} />
            </div>
            <div className="page-hero-index">
              <span>01</span>
              <span className="page-hero-index-line" />
              <span>LMSA</span>
            </div>
          </div>
        </div>

        {hero.stats && (
          <div className="page-hero-stats">
            {hero.stats.map(([value, label]) => (
              <div key={label} className="page-hero-stat">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
