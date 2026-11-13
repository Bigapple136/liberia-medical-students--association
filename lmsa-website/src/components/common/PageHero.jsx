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
    title: 'Name on the ballot.',
    description:
      'The students serving this year, the offices they hold, and how to put your own name forward.',
    action: { label: 'See how to stand', to: '#stand' },
    secondary: { label: 'Browse committees', to: '/leadership/committees' },
    accent: 'green',
    icon: Users,
    photoKey: 'about',
    pattern: 'crosses',
    // The legacy hero hid the photograph under an almost-opaque overlay and put
    // a 64px Users icon where the picture should be, which read as a placeholder.
    // The poster variant shows the photograph and gives the headline full width.
    variant: 'poster',
  },
  {
    match: (path) => path === '/leadership/committees',
    title: 'Where ideas become action',
    description:
      'Find the committee working on the issues, opportunities, and services that matter to medical students.',
    action: { label: 'Join a committee', to: '/get-involved/committees' },
    secondary: { label: 'See the register', to: '#register' },
    accent: 'green',
    icon: Network,
    photoKey: 'leadership',
    pattern: 'diamonds',
    // Left the legacy hero for the same reason as /leadership and the council
    // page: its overlay hid the photograph behind an icon.
    variant: 'poster-compact',
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
    title: 'Meet the executive council',
    description:
      'Class presidents and student representatives bring the priorities of their peers to the work of LMSA.',
    action: { label: 'See all leadership', to: '/leadership' },
    accent: 'green',
    icon: ShieldCheck,
    photoKey: 'membership',
    pattern: 'crosses',
    // Same reason as /leadership: the legacy hero covered the photograph with an
    // overlay and floated an icon where the picture belongs.
    variant: 'poster-compact',
  },
  {
    match: (path) => path === '/membership',
    eyebrow: 'Membership',
    title: 'Your place in LMSA.',
    titleLines: ['Your place', 'in LMSA.'],
    variant: 'poster',
    description:
      'Membership gives you a stronger network, practical support, and more ways to grow throughout medical school.',
    action: { label: 'Join LMSA', to: '/register' },
    secondary: { label: 'View benefits', to: '/membership/benefits' },
    accent: 'green',
    icon: Sparkles,
    photoKey: 'membership',
    pattern: 'circles',
    stats: [
      ['4', 'Ways to belong'],
      ['1', 'Student community'],
      ['1972', 'Founded'],
    ],
  },
  {
    match: (path) => path === '/membership/dues',
    eyebrow: 'Membership / Dues',
    title: 'What dues cost',
    titleLines: ['What dues', 'cost.'],
    variant: 'poster-compact',
    description:
      'The annual fee for each category, the deadline, and how to pay it.',
    action: { label: 'Start membership', to: '/register' },
    secondary: { label: 'Compare categories', to: '/membership/categories' },
    accent: 'green',
    icon: FileText,
    photoKey: 'events',
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
    title: 'Study materials, by stage.',
    titleLines: ['Study materials,', 'by stage.'],
    variant: 'poster-compact',
    description:
      'Guides, notes, and references shared by students, faculty, and alumni who took these courses before you.',
    action: { label: 'Browse the materials', to: '#library' },
    secondary: { label: 'Find a mentor', to: '/academics/mentorship' },
    accent: 'green',
    icon: BookOpen,
    photoKey: 'mentorship',
    pattern: 'grid',
  },
  {
    match: (path) => path === '/academics/research',
    eyebrow: 'Academics / Research',
    title: 'Ask better questions.',
    description:
      'LMSA helps students turn curiosity into research that can make a meaningful difference in Liberia.',
    action: { label: 'View academic resources', to: '/academics/resources' },
    accent: 'green',
    icon: Lightbulb,
    photoKey: 'research',
    pattern: 'hexagons',
    // The legacy hero split its 400px copy column at tablet width, which broke
    // this headline over four lines at 768px. The poster variant gives the same
    // copy the full grid width and the site's academic green.
    variant: 'poster-compact',
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
    title: 'Give time. Improve care.',
    description:
      'Bring your skills and energy to outreach, health education, and community service with LMSA.',
    action: { label: 'Join a committee', to: '/get-involved/committees' },
    accent: 'green',
    icon: HeartPulse,
    photoKey: 'volunteer',
    pattern: 'circles',
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
  green: { surface: 'bg-lmsa-900', text: 'text-lmsa-50', mark: 'bg-lmsa-400', icon: 'text-lmsa-200', overlay: 'bg-lmsa-900/90' },
  blue: { surface: 'bg-blue-800', text: 'text-white', mark: 'bg-blue-400', icon: 'text-blue-100', overlay: 'bg-blue-900/90' },
  gold: { surface: 'bg-amber-800', text: 'text-white', mark: 'bg-amber-400', icon: 'text-amber-100', overlay: 'bg-amber-900/90' },
  rose: { surface: 'bg-rose-800', text: 'text-white', mark: 'bg-rose-400', icon: 'text-rose-100', overlay: 'bg-rose-900/90' },
  ink: { surface: 'bg-gray-900', text: 'text-white', mark: 'bg-lmsa-400', icon: 'text-lmsa-200', overlay: 'bg-gray-900/90' },
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

  // No hero for /leadership/committees/:slug. That page owns its header, because
  // the name, the description and the recruitment state all come from the
  // committee the URL resolves to; a hero here could only print the slug as a
  // title("Research Journal") above the page's own header.

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

  // 'poster' opens a section; 'poster-compact' keeps the same layout with a shorter
  // picture and title, so a page whose first screen belongs to its content can start higher.
  const isPoster = hero.variant === 'poster' || hero.variant === 'poster-compact';
  const isCompactPoster = hero.variant === 'poster-compact';

  if (isPoster) {
    return (
      <section
        className={`relative overflow-hidden ${styles.surface} ${styles.text}`}
        aria-labelledby="page-hero-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 ${
              isCompactPoster
                ? 'items-center pt-8 md:pt-10 lg:pt-12'
                : 'items-end pt-12 md:pt-16 lg:pt-20'
            }`}
          >
            <div className={isCompactPoster ? 'pb-8 lg:pb-10' : 'pb-10 lg:pb-16'}>
              <h1
                id="page-hero-title"
                className={`font-bold tracking-[-0.045em] ${
                  isCompactPoster
                    ? 'text-[clamp(2.5rem,5.2vw,4.5rem)] leading-[0.96]'
                    : 'text-[clamp(2.9rem,7vw,5.75rem)] leading-[0.92]'
                }`}
              >
                {(hero.titleLines || [hero.title]).map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </h1>
              <p
                className={`${isCompactPoster ? 'mt-5' : 'mt-6'} max-w-[44ch] text-lg leading-8 opacity-85 md:text-xl md:leading-9`}
              >
                {hero.description}
              </p>
              <div
                className={`${isCompactPoster ? 'mt-7' : 'mt-9'} flex flex-wrap items-center gap-x-8 gap-y-4`}
              >
                <Link
                  to={hero.action.to}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-sm font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {hero.action.label}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                {hero.secondary && (
                  <Link
                    to={hero.secondary.to}
                    className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
                  >
                    {hero.secondary.label}
                  </Link>
                )}
              </div>
              {hero.stats && (
                <dl className={`${isCompactPoster ? 'mt-8' : 'mt-12'} flex flex-wrap gap-x-12 gap-y-6`}>
                  {hero.stats.map(([value, label]) => (
                    <div key={label} className="flex items-baseline gap-2.5">
                      <dt className="sr-only">{label}</dt>
                      <dd className="text-2xl font-semibold leading-none">{value}</dd>
                      <p className="text-[13px] text-lmsa-100">{label}</p>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {photo && (
              <div className="poster-photo relative lg:-mb-0">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="eager"
                  className={`w-full object-cover ${
                    isCompactPoster
                      ? 'h-[200px] sm:h-[260px] lg:h-[340px]'
                      : 'h-[280px] sm:h-[380px] lg:h-[540px]'
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`page-hero ${styles.surface} ${styles.text} relative`}
      aria-labelledby="page-hero-title"
    >
      {/* Background photo with gradient overlay */}
      {photo && (          <div className="absolute inset-0" aria-hidden="true">
            <img src={photo.src} alt="" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
            <div className={`absolute inset-0 ${styles.overlay}`} />
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
