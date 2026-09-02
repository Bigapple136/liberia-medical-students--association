import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader, Newspaper, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import { newsService } from '@services/news.service';
import { NEWS_CATEGORIES, categoryBadgeClass, categoryLabel } from '@utils/newsCategories';

const PAGE_SIZE = 9;

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
}

function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${categoryBadgeClass(category)}`}>
      {categoryLabel(category)}
    </span>
  );
}

function StoryCardSkeleton() {
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

function FeatureStory({ post }) {
  return (
    <Link
      to={`/news/${post.slug}`}
      className="group grid border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-lmsa-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 md:grid-cols-[1.15fr_1fr]"
    >
      <div className="flex min-h-[220px] items-center justify-center overflow-hidden bg-lmsa-50 md:min-h-[320px]">
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Newspaper size={64} className="text-lmsa-300" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-col p-6 md:p-10">
        <p className="editorial-overline">Latest story</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CategoryBadge category={post.category} />
          <time dateTime={post.published_at || undefined} className="text-sm text-gray-500">
            {formatDate(post.published_at)}
          </time>
        </div>
        <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.02em] text-lmsa-900 md:text-3xl">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-4 line-clamp-3 text-base leading-7 text-gray-600">{post.excerpt}</p>}
        <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-lmsa-700">
          Read the story
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function StoryCard({ post }) {
  return (
    <Link
      to={`/news/${post.slug}`}
      className="group relative flex flex-col border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-lmsa-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
    >
      <div className="flex h-48 items-center justify-center overflow-hidden bg-lmsa-50">
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Newspaper size={48} className="text-lmsa-300" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 pb-12">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={post.category} />
          <time dateTime={post.published_at || undefined} className="text-sm text-gray-500">
            {formatDate(post.published_at)}
          </time>
        </div>
        <h3 className="mt-4 line-clamp-2 pr-8 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{post.excerpt}</p>}
        <ArrowRight
          size={19}
          className="absolute bottom-6 right-6 text-lmsa-700 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const requestRef = useRef(0);

  const loadPosts = useCallback(async ({ page: pageNumber, category: activeCategory, append }) => {
    const requestId = ++requestRef.current;
    if (append) setLoadingMore(true);
    else {
      setLoading(true);
      setError(false);
    }
    try {
      const params = { page: pageNumber, limit: PAGE_SIZE };
      if (activeCategory !== 'all') params.category = activeCategory;
      const { posts: data, total: totalCount } = await newsService.getAll(params);
      if (requestRef.current !== requestId) return;
      setPosts((current) => (append ? [...current, ...(data || [])] : data || []));
      setTotal(totalCount ?? 0);
      setPage(pageNumber);
    } catch {
      if (requestRef.current !== requestId) return;
      if (append) toast.error('Could not load more stories. Please try again.');
      else setError(true);
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPosts({ page: 1, category, append: false });
  }, [category, loadPosts]);

  const handleLoadMore = () => loadPosts({ page: page + 1, category, append: true });
  const handleRetry = () => loadPosts({ page: 1, category, append: false });

  const hasMore = posts.length < total;
  const [featurePost, ...gridPosts] = posts;
  const activeCategoryLabel = category === 'all' ? null : categoryLabel(category);

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            as="h1"
            eyebrow="Stories & events / News"
            title="Stories from the people making medical education matter."
            description="News, announcements, achievements, and opportunities from the LMSA community — the ideas and moments moving healthcare forward in Liberia."
          />
          <div className="flex flex-wrap gap-2 border-t border-lmsa-200 pt-6" role="group" aria-label="Filter stories by category">
            {[{ value: 'all', label: 'All stories' }, ...NEWS_CATEGORIES].map(({ value, label }) => {
              const active = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(value)}
                  className={`border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 ${
                    active
                      ? 'border-lmsa-900 bg-lmsa-900 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-lmsa-400 hover:text-lmsa-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          {loading ? (
            <div role="status" aria-label="Loading news stories">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <StoryCardSkeleton key={index} />
                ))}
              </div>
              <span className="sr-only">Loading news stories…</span>
            </div>
          ) : error ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <Newspaper size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">We couldn’t load the news</h2>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Something went wrong on our end or with your connection. Your place is saved — try again in a moment.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <Newspaper size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">
                {activeCategoryLabel ? `No ${activeCategoryLabel.toLowerCase()} stories yet` : 'No stories published yet'}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                {activeCategoryLabel
                  ? 'Nothing has been published in this category so far.'
                  : 'The first stories from the community are on their way. Check back soon.'}
              </p>
              {activeCategoryLabel && (
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  Show all stories
                </button>
              )}
            </div>
          ) : (
            <>
              <FeatureStory post={featurePost} />
              {gridPosts.length > 0 && (
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post) => (
                    <StoryCard key={post.id} post={post} />
                  ))}
                </div>
              )}
              <div className="flex flex-col items-center gap-3 pt-10">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                  Showing {posts.length} of {total} {total === 1 ? 'story' : 'stories'}
                </p>
                {hasMore && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex min-w-[170px] items-center justify-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <Loader size={14} className="animate-spin" aria-hidden="true" />
                        Loading…
                      </>
                    ) : (
                      'Load more stories'
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Have a story to share?"
            title="The student community is always becoming something new."
            description="Tell us about an achievement, opportunity, or idea that deserves a wider audience."
            action={{ label: 'Get involved', to: '/get-involved/volunteer' }}
          />
        </div>
      </section>
    </main>
  );
}
