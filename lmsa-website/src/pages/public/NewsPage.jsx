import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Calendar, Loader, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import { newsService } from '@services/news.service';

const PAGE_SIZE = 9;
const CATEGORY_COLORS = {
  news: 'bg-blue-50 text-blue-700',
  announcement: 'bg-purple-50 text-purple-700',
  achievement: 'bg-lmsa-50 text-lmsa-700',
  opportunity: 'bg-amber-50 text-amber-700',
  health: 'bg-red-50 text-red-700',
  academic: 'bg-indigo-50 text-indigo-700',
  event: 'bg-cyan-50 text-cyan-700',
};

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = useCallback(async (pageNumber, append) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const { posts: data, total: totalCount } = await newsService.getAll({ page: pageNumber, limit: PAGE_SIZE });
      setPosts((current) => (append ? [...current, ...data] : data || []));
      setTotal(totalCount ?? 0);
    } catch {
      toast.error('Failed to load news');
      if (!append) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(1, false);
  }, [loadPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, true);
  };

  const hasMore = posts.length < total;

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Stories & events / News"
            title="Stories from the people making medical education matter."
            description="Read about the ideas, achievements, and moments moving LMSA and healthcare forward in Liberia."
          />
          <div className="editorial-stat-grid">
            <div className="editorial-stat"><strong>{total || '—'}</strong><span>Published stories</span><small>Ideas and updates from the LMSA community.</small></div>
            <div className="editorial-stat"><strong>1</strong><span>Student voice</span><small>A place to share what matters to future physicians.</small></div>
            <div className="editorial-stat"><strong>∞</strong><span>More to come</span><small>The story keeps moving with the community.</small></div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="From the community" title="The latest from LMSA." description="Stay informed about programs, opportunities, achievements, and the people behind the work." />
          {loading ? (
            <div className="flex h-64 items-center justify-center"><Loader size={32} className="animate-spin text-lmsa-600" aria-label="Loading news" /></div>
          ) : posts.length === 0 ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <Newspaper size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <p className="text-gray-500">No news posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} to={`/news/${post.slug}`} className="group flex flex-col border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-lmsa-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2">
                    <div className="flex h-48 items-center justify-center overflow-hidden bg-lmsa-50">
                      {post.featured_image_url ? <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <Newspaper size={48} className="text-lmsa-300" aria-hidden="true" />}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {post.category && <span className={`self-start px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>{post.category}</span>}
                      <h3 className="mt-4 line-clamp-2 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{post.title}</h3>
                      {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{post.excerpt}</p>}
                      <div className="mt-auto flex items-center gap-2 pt-6 text-sm text-gray-500"><Calendar size={14} aria-hidden="true" /><span>{formatDate(post.published_at)}</span></div>
                      <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-lmsa-700">Read more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                    </div>
                  </Link>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-10">
                  <button type="button" onClick={handleLoadMore} disabled={loadingMore} className="border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 disabled:opacity-50">
                    {loadingMore ? <span className="flex items-center gap-2"><Loader size={14} className="animate-spin" />Loading…</span> : 'Load more'}
                  </button>
                </div>
              )}
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