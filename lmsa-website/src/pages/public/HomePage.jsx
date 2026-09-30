/**
 * TODO: STOCK PHOTOS — Replace all images with real LMSA photography before launch.
 * Current stock photos come from Unsplash (see src/config/images.js).
 * Replace with: real event photos, student portraits, campus shots, volunteer work.
 */
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  FileText,
  Globe,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Network,
  Newspaper,
  RefreshCw,
  Stethoscope,
  Users,
} from 'lucide-react';
import { stockPhotos } from '@config/images';
import Photo from '@components/common/Photo';
import { PatternBackground } from '@components/common/SvgPatterns';
import { newsService } from '@services/news.service';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@utils/constants';

function StorySkeleton() {
  return (
    <div className="flex flex-col border border-gray-200 bg-white">
      <div className="h-48 animate-pulse bg-gray-100" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-4 w-24 animate-pulse bg-gray-100" />
        <div className="h-6 w-4/5 animate-pulse bg-gray-100" />
        <div className="h-4 w-full animate-pulse bg-gray-100" />
        <div className="h-4 w-2/3 animate-pulse bg-gray-100" />
      </div>
    </div>
  );
}

function StoryListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/3 bg-gray-100 rounded" />
      <div className="h-16 w-full bg-gray-100 rounded" />
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { posts: data } = await newsService.getAll({ limit: 3 });
      setPosts(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleRetry = () => loadPosts();

  const hasPosts = posts.length > 0;
  const [featurePost, ...listPosts] = posts;
  // Spec §4.1: signed-in members get a one-click path back to the portal from
  // wherever they land post-login (D1 keeps the homepage as that landing).
  const firstName = user?.full_name?.trim().split(/\s+/)[0];
  return (
    <div className="home-page">
      {user && (
        <section className="border-b border-lmsa-100 bg-lmsa-50" aria-label="Member portal shortcut">
          <div className="section-shell flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-lmsa-900">
                Welcome back{firstName ? `, ${firstName}` : ''}
              </p>
              <p className="text-sm text-gray-600">
                Your membership, events, and profile live in the member portal.
              </p>
            </div>
            <Link
              to={ROUTES.PORTAL_DASHBOARD}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-lmsa-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
            >
              Open your portal
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
      <section className="home-audience section-shell" aria-labelledby="audience-title">
        <div className="home-section-heading home-audience-heading">
          <div>
            <p className="section-kicker">Find your way in</p>
            <h2 id="audience-title">Start with what brings you here.</h2>
          </div>
          <p>
            Whether you are preparing for your first clinical rotation, building a
            partnership, or looking for ways to serve, LMSA has a place for you.
          </p>
        </div>

        <div className="audience-grid">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Link key={audience.label} to={audience.link} className="audience-card">
                <span className="audience-card-number">0{index + 1}</span>
                <span className="audience-card-icon">
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="audience-card-title">{audience.label}</span>
                <span className="audience-card-description">{audience.description}</span>
                <span className="audience-card-action">
                  Explore your path <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-manifesto relative overflow-hidden" aria-labelledby="manifesto-title">
        <PatternBackground pattern="crosses" color="white" opacity={0.03} />
        <div className="section-shell home-manifesto-grid relative z-10">
          <div className="home-manifesto-copy">
            <p className="section-kicker section-kicker-light">Medical education, amplified in Liberia</p>
            <h2 id="manifesto-title">Become the physician your community needs.</h2>
            <p>
              LMSA is a student-led community helping future physicians learn with
              purpose, lead with confidence, and serve with compassion.
            </p>
            <div className="home-action-row">
              <Link to="/about" className="button-light">
                Discover LMSA <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/register" className="button-outline-light">
                Become a member
              </Link>
            </div>
          </div>

          <div className="home-manifesto-note">
            <span className="home-note-index">01</span>
            <div className="home-note-rule" aria-hidden="true" />
            <p>
              We believe medical training is bigger than exams. It is preparation
              for a lifetime of service.
            </p>
            <span className="home-note-signature">LMSA / Since 1972</span>
          </div>
        </div>
      </section>

      <section className="home-focus section-shell" aria-labelledby="focus-title">
        <div className="home-section-heading">
          <div>
            <p className="section-kicker">What moves us forward</p>
            <h2 id="focus-title">One community. Many ways to grow.</h2>
          </div>
          <Link to="/about/mission-vision" className="text-link">
            Read our mission <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="focus-grid">
          {focusAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <article key={area.title} className={`focus-card focus-card-${index + 1}`}>
                <div className="focus-card-topline">
                  <span>0{index + 1}</span>
                  <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <Link to={area.link} className="text-link">
                  Learn more <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-impact" aria-labelledby="impact-title">
        <div className="section-shell home-impact-grid">
          <div className="home-impact-copy">
            <p className="section-kicker">The work behind the name</p>
            <h2 id="impact-title">Student leadership with a lasting impact.</h2>
            <p>
              From the classroom to the community, LMSA creates practical ways for
              medical students to make a difference now and prepare for what comes
              next.
            </p>
            <Link to="/get-involved/volunteer" className="text-link">
              See how we serve <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="impact-stat-list">
            {impactStats.map((stat) => (
              <div className="impact-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-resources section-shell" aria-labelledby="resources-title">
        <div className="home-section-heading">
          <div>
            <p className="section-kicker">Looking to</p>
            <h2 id="resources-title">Make your next move.</h2>
          </div>
          <p>Useful starting points for your studies, leadership, and life in LMSA.</p>
        </div>

        <div className="resource-grid">
          {resourcePaths.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link key={resource.title} to={resource.link} className="resource-path">
                <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
                <span>
                  <strong>{resource.title}</strong>
                  <small>{resource.description}</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-stories section-shell" aria-labelledby="stories-title">
        <div className="home-section-heading">
          <div>
            <p className="section-kicker">From our community</p>
            <h2 id="stories-title">The latest from LMSA.</h2>
          </div>
          {hasPosts && (
            <Link to="/news" className="text-link">
              View all stories <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="story-grid">
          {loading ? (
            <>
              <StorySkeleton />
              <div className="story-list">
                <StoryListSkeleton />
                <StoryListSkeleton />
              </div>
            </>
          ) : error ? (
            <div className="col-span-full border border-gray-200 bg-white p-8 text-center">
              <Newspaper size={32} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-lmsa-900">Couldn&apos;t load latest stories</h3>
              <p className="mt-1 text-gray-600">Something went wrong. Please try again in a moment.</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-4 py-2 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : !hasPosts ? (
            <div className="col-span-full border border-gray-200 bg-white p-8 text-center">
              <Newspaper size={32} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-lmsa-900">News and updates will appear here soon</h3>
              <p className="mt-1 text-gray-600">The first stories from the community are on their way. Check back soon.</p>
            </div>
          ) : (
            <>
              <article className="story-feature">
                {/* Featured story with photo */}
                <Photo
                  src={featurePost.featured_image_url || stockPhotos.stories.symposium.src}
                  alt={featurePost.featured_image_url ? featurePost.title : stockPhotos.stories.symposium.alt}
                  className="story-art story-art-feature"
                  fallbackGradient="bg-gradient-to-br from-lmsa-900 to-lmsa-700"
                  overlay="bg-gradient-to-t from-lmsa-900/80 via-lmsa-900/20 to-transparent"
                >
                  <div className="relative z-10 flex min-h-[230px] items-center justify-between p-8 text-lmsa-100">
                    <span className="self-start text-5xl font-semibold tracking-[-0.06em] text-lmsa-200">{featurePost.published_at ? new Date(featurePost.published_at).getFullYear() : '2026'}</span>
                    <Megaphone size={50} strokeWidth={1.1} className="text-lmsa-200" aria-hidden="true" />
                  </div>
                </Photo>
                <div className="story-content">
                  <p className="story-category">{featurePost.category || 'Featured story'}</p>
                  <h3>{featurePost.title}</h3>
                  <p>{featurePost.excerpt || ''}</p>
                  <Link to={`/news/${featurePost.slug}`} className="text-link">
                    Read the story <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>

              <div className="story-list">
                {listPosts.map((post, index) => (
                  <article className="story-list-item" key={post.slug}>
                    <span className="story-list-index">0{index + 2}</span>
                    <div>
                      <p className="story-category">{post.category || 'Story'}</p>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt || ''}</p>
                      <Link to={`/news/${post.slug}`} className="text-link">
                        Read more <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="home-join relative overflow-hidden" aria-labelledby="join-title">
        <PatternBackground pattern="dots" color="white" opacity={0.05} />
        <div className="section-shell home-join-inner relative z-10">
          <div>
            <p className="section-kicker section-kicker-light">Your next chapter starts here</p>
            <h2 id="join-title">There is more to medical school when we move together.</h2>
          </div>
          <Link to="/register" className="button-light">
            Join LMSA <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const audiences = [
  {
    icon: GraduationCap,
    label: 'Medical student',
    description: 'Find support, resources, and a community for every stage of training.',
    link: '/membership',
  },
  {
    icon: Users,
    label: 'Faculty member',
    description: 'Connect with the students and programs shaping Liberia\u2019s medical future.',
    link: '/about',
  },
  {
    icon: Award,
    label: 'Alumni',
    description: 'Keep building the next generation of physicians through your experience.',
    link: '/leadership/past-presidents',
  },
  {
    icon: Globe,
    label: 'Partner or donor',
    description: 'Invest in medical education, student leadership, and community health.',
    link: '/partnership',
  },
];

const focusAreas = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Study resources, symposia, research guidance, and peer mentorship for the road ahead.',
    link: '/academics/resources',
  },
  {
    icon: Lightbulb,
    title: 'Lead',
    description: 'Build the confidence and practical skills to lead with purpose in medicine and beyond.',
    link: '/leadership#stand',
  },
  {
    icon: HeartPulse,
    title: 'Serve',
    description: 'Turn your training into action through outreach, advocacy, and student welfare.',
    link: '/get-involved/volunteer',
  },
  {
    icon: Network,
    title: 'Connect',
    description: 'Find your people through committees, events, and a network that stays with you.',
    link: '/leadership/committees',
  },
];

const impactStats = [
  { value: '1972', label: 'LMSA founded' },
  { value: '04', label: 'Areas of focus' },
  { value: '01', label: 'Student voice' },
];

const resourcePaths = [
  {
    icon: CalendarDays,
    title: 'Attend an event',
    description: 'See what is happening across LMSA',
    link: '/events',
  },
  {
    icon: MessageCircle,
    title: 'Find a mentor',
    description: 'Learn from someone one step ahead',
    link: '/academics/mentorship',
  },
  {
    icon: FileText,
    title: 'Explore resources',
    description: 'Tools for your academic journey',
    link: '/academics/resources',
  },
  {
    icon: Stethoscope,
    title: 'Join a committee',
    description: 'Find the work that matters to you',
    link: '/get-involved/committees',
  },
];
