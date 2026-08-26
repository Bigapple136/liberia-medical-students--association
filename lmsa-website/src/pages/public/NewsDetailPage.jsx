import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Loader, Eye, Tag } from 'lucide-react';
import { newsService } from '@services/news.service';

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

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadPost() {
    setLoading(true);
    try {
      const data = await newsService.getBySlug(slug);
      setPost(data);
    } catch {
      // 404 or other failure — show Not Found state
      setPost(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size={32} className="animate-spin text-lmsa-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/news" className="text-lmsa-600 hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft size={16} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const tags = post.tags || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link to="/news" className="inline-flex items-center gap-2 text-lmsa-600 hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to News
        </Link>

        {/* Article */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Category + Meta */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {post.category && (
              <span className={`text-sm font-bold px-4 py-1 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>
                {post.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200 flex-wrap">
            {post.published_at && (
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.views != null && (
              <span className="flex items-center gap-2">
                <Eye size={16} />
                {post.views} view{post.views !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <Tag size={14} className="text-gray-400" />
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-600 mb-6 italic">{post.excerpt}</p>
          )}

          {/* Content — plain text, preserving line breaks.
              Content is admin-authored and trusted, but stored as TEXT
              in the DB (not HTML), so plain rendering is correct.
              Flag as follow-up if rich rendering is needed. */}
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, i) => (
              paragraph.trim() ? (
                <p key={i} className="text-gray-700 leading-relaxed text-lg mb-4">
                  {paragraph}
                </p>
              ) : (
                <br key={i} />
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
