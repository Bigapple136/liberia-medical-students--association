import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Liberia Medical Students’ Association';
const DEFAULT_DESCRIPTION =
  'LMSA unites future physicians in Liberia through advocacy, education, leadership, and community service.';

const pageMeta = [
  {
    match: (path) => path === '/',
    title: 'The voice of Liberia’s future physicians | LMSA',
    description:
      'Discover how LMSA connects medical students in Liberia through education, advocacy, leadership, and service.',
  },
  {
    match: (path) => path === '/about',
    title: 'More than an association | LMSA',
    description:
      'Learn how the Liberia Medical Students’ Association supports future physicians through community, advocacy, and professional growth.',
  },
  {
    match: (path) => path === '/about/history',
    title: 'Fifty years of student leadership | LMSA',
    description:
      'Explore the history of LMSA and the student leaders who have helped shape medical education and healthcare in Liberia since 1972.',
  },
  {
    match: (path) => path === '/about/mission-vision',
    title: 'Training physicians. Strengthening communities. | LMSA',
    description:
      'Read LMSA’s mission, vision, and values for developing capable, compassionate, and community-minded physicians in Liberia.',
  },
  {
    match: (path) => path === '/about/constitution',
    title: 'The principles that guide us | LMSA',
    description:
      'Review the constitution and governing principles of the Liberia Medical Students’ Association.',
  },
  {
    match: (path) => path === '/leadership',
    title: 'The people moving LMSA forward | LMSA',
    description:
      'Meet the LMSA leadership team serving medical students and advancing the association’s mission in Liberia.',
  },
  {
    match: (path) => path === '/leadership/committees',
    title: 'Where ideas become action | LMSA',
    description:
      'Explore LMSA’s standing committees and find the teams turning student ideas into meaningful action.',
  },
  {
    match: (path) => path === '/leadership/past-presidents',
    title: 'A legacy of service | LMSA',
    description:
      'Honor the past presidents whose service has shaped the Liberia Medical Students’ Association.',
  },
  {
    match: (path) => path === '/leadership/executive-council',
    title: 'Meet the executive council | LMSA',
    description:
      'Learn about the class presidents and student representatives serving on the LMSA Executive Council.',
  },
  {
    match: (path) => path === '/membership',
    title: 'Find your place in the LMSA community | LMSA',
    description:
      'Join LMSA and access a supportive community, academic resources, leadership opportunities, and professional connections.',
  },
  {
    match: (path) => path === '/membership/benefits',
    title: 'More support for every stage of medical school | LMSA',
    description:
      'See the academic, professional, community, and student welfare benefits available to LMSA members.',
  },
  {
    match: (path) => path === '/membership/categories',
    title: 'Membership designed around your journey | LMSA',
    description:
      'Compare LMSA membership categories and find the option that fits your role in the medical student community.',
  },
  {
    match: (path) => path === '/membership/dues',
    title: 'A simple path to active membership | LMSA',
    description:
      'Review LMSA dues, payment information, and the steps to become an active member of the association.',
  },
  {
    match: (path) => path === '/academics/symposia',
    title: 'Ideas that move medicine forward | LMSA',
    description:
      'Discover LMSA symposia, academic conferences, and events created to expand medical knowledge in Liberia.',
  },
  {
    match: (path) => path === '/academics/resources',
    title: 'Tools for the next stage of your training | LMSA',
    description:
      'Find study materials, guides, and practical academic resources for medical students in Liberia.',
  },
  {
    match: (path) => path === '/academics/mentorship',
    title: 'Learn from those one step ahead | LMSA',
    description:
      'Connect with peers and mentors through LMSA’s mentorship program for guidance throughout medical school.',
  },
  {
    match: (path) => path === '/academics/research',
    title: 'Ask better questions. Improve healthcare. | LMSA',
    description:
      'Explore research opportunities and support for medical students who want to improve healthcare in Liberia.',
  },
  {
    match: (path) => path === '/events',
    title: 'What’s happening across LMSA | LMSA',
    description:
      'Browse upcoming LMSA events, workshops, conferences, and community activities for medical students in Liberia.',
  },
  {
    match: (path) => path.startsWith('/events/'),
    title: 'LMSA event details | Liberia Medical Students’ Association',
    description:
      'Get the date, location, and registration details for this Liberia Medical Students’ Association event.',
  },
  {
    match: (path) => path === '/news',
    title: 'Stories from our student community | LMSA',
    description:
      'Read the latest LMSA news, announcements, achievements, and community stories from medical students in Liberia.',
  },
  {
    match: (path) => path.startsWith('/news/'),
    title: 'LMSA news story | Liberia Medical Students’ Association',
    description:
      'Read the latest story and updates from the Liberia Medical Students’ Association.',
  },
  {
    match: (path) => path === '/get-involved/volunteer',
    title: 'Your time can improve someone’s care | LMSA',
    description:
      'Find volunteer opportunities with LMSA and help deliver health education, outreach, and community service in Liberia.',
  },
  {
    match: (path) => path === '/get-involved/committees',
    title: 'Find the work that matters to you | LMSA',
    description:
      'Join an LMSA committee and contribute your skills to academic, welfare, advocacy, service, and professional initiatives.',
  },
  {
    match: (path) => path === '/partnership',
    title: 'Let’s strengthen healthcare together | LMSA',
    description:
      'Partner with LMSA to support medical education, student leadership, research, and healthcare outreach in Liberia.',
  },
  {
    match: (path) => path === '/contact',
    title: 'Start a conversation with LMSA | Liberia Medical Students’ Association',
    description:
      'Contact LMSA with questions about membership, partnerships, events, committees, or student support.',
  },
  {
    match: (path) => path === '/login',
    title: 'Member login | LMSA',
    description: 'Sign in to access your LMSA member portal.',
    robots: 'noindex, nofollow',
  },
  {
    match: (path) => path === '/register',
    title: 'Join LMSA | Liberia Medical Students’ Association',
    description: 'Create your LMSA account and become part of Liberia’s medical student community.',
    robots: 'noindex, nofollow',
  },
];

function getMeta(pathname) {
  const matchedPage = pageMeta.find((entry) => entry.match(pathname));
  if (matchedPage) return matchedPage;

  const isPrivate = pathname.startsWith('/portal') || pathname.startsWith('/admin');
  const slug = pathname.split('/').filter(Boolean).pop();
  const readableSlug = slug
    ? slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Page';

  if (pathname.startsWith('/events/')) {
    return {
      title: `${readableSlug} | LMSA Events`,
      description: `View details, timing, and participation information for ${readableSlug}, an event from the Liberia Medical Students’ Association.`,
    };
  }

  if (pathname.startsWith('/news/')) {
    return {
      title: `${readableSlug} | LMSA News`,
      description: `Read ${readableSlug}, a news story from the Liberia Medical Students’ Association.`,
    };
  }

  if (pathname.startsWith('/leadership/committees/')) {
    return {
      title: `${readableSlug} | LMSA Committee`,
      description: `Learn about the ${readableSlug} and its role in the Liberia Medical Students’ Association.`,
    };
  }

  return {
    title: `${SITE_NAME} | LMSA`,
    description: DEFAULT_DESCRIPTION,
    robots: isPrivate ? 'noindex, nofollow' : undefined,
  };
}

function setMeta(name, content, attribute = 'name') {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

export default function PageMeta() {
  const location = useLocation();

  useEffect(() => {
    const meta = getMeta(location.pathname);
    const path = normalizePath(location.pathname);
    const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://lmsa.org.lr').replace(/\/+$/, '');
    const canonicalUrl = `${siteUrl}${path}`;

    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('robots', meta.robots || 'index, follow');
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:url', canonicalUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [location.pathname]);

  return null;
}