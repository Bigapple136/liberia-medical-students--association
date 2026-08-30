import { useState, useEffect, useCallback } from 'react';
import { Newspaper, ArrowRight, Calendar, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { newsService } from '@services/news.service';

const PAGE_SIZE = 9;

const CATEGORY_COLORS = {
  news:         'bg-blue-100 text-blue-700',
  announcement: 'bg-purple-100 text-purple-700',
  achievement:  'bg-lmsa-100 text-lmsa-700',
  opportunity:  'bg-amber-100 text-amber-700',
  health:       'bg-red-100 text-red-700',
  academic:     'bg-indigo-100 text-indigo-700',
  event:        'bg-cyan-100 text-cyan-700',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function NewsPage() {
  const [posts, setPosts]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = useCallback(async (pageNum, append) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const { posts: data, total: totalCount } = await newsService.getAll({
        page: pageNum,
        limit: PAGE_SIZE,
      });
      if (append) {
        setPosts(prev => [...prev, ...data]);
      } else {
        setPosts(data || []);
      }
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

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    loadPosts(next, true);
  }

  const hasMore = posts.length < total;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">News</h1>
          <p className="text-lg text-gray-600">Latest Updates and Announcements</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size={32} className="animate-spin text-lmsa-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Newspaper size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No news posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/news/${post.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Newspaper size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar size={14} />
                      <span>{formatDate(post.published_at)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-lmsa-600 font-medium text-sm">
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 text-sm font-medium text-lmsa-700 bg-lmsa-50 border border-lmsa-200 rounded-lg hover:bg-lmsa-100 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <Loader size={14} className="animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    'Load more'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
