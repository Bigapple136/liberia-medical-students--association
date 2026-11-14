import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, Loader, RefreshCw } from 'lucide-react';
import StoryMeta from '@components/common/StoryMeta';
import { newsService } from '@services/news.service';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const loadPost = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setPost(await newsService.getBySlug(slug));
    } catch (err) {
      setPost(null);
      // A 404 means the story is gone, and no amount of retrying will bring
      // it back. Anything else means the request itself failed, which is
      // worth offering a retry for.
      setFailed(err?.response?.status !== 404);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPost();
  }, [loadPost]);

  if (loading) {
    return (
      <main className="editorial-page">
        <div className="flex min-h-[60vh] items-center justify-center" role="status">
          <Loader size={32} className="animate-spin text-lmsa-600" aria-hidden="true" />
          <span className="sr-only">Loading story…</span>
        </div>
      </main>
    );
  }

  if (failed) {
    return (
      <main className="editorial-page">
        <section className="editorial-section">
          <div className="site-container">
            <div className="mx-auto max-w-2xl bg-white p-10 text-center md:p-14">
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900 md:text-4xl">
                We couldn’t load that story.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Something went wrong on our end or with your connection. The story itself may well still be here.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={loadPost}
                  className="inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Try again
                </button>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:text-lmsa-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back to all news
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="editorial-page">
        <section className="editorial-section">
          <div className="site-container">
            <div className="mx-auto max-w-2xl bg-white p-10 text-center md:p-14">
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900 md:text-4xl">
                We couldn’t find that story.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600">
                It may have been unpublished or the link may be incorrect. The rest of the community’s stories are still
                here.
              </p>
              <Link
                to="/news"
                className="mt-8 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back to all news
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const tags = post.tags || [];
  const paragraphs = (post.content || '')
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="editorial-page">
      <article className="editorial-section">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/news"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-lmsa-700 transition-colors hover:text-lmsa-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
              All news
            </Link>

            <header className="mt-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <StoryMeta
                  category={post.category}
                  publishedAt={post.published_at}
                  updatedAt={post.updated_at}
                  content={post.content}
                />
                {post.views != null && (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    <Eye size={14} aria-hidden="true" />
                    {post.views} view{post.views !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900 md:text-5xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-6 font-serif text-xl italic leading-8 text-gray-600">{post.excerpt}</p>
              )}
            </header>

            {post.featured_image_url && (
              <figure className="mt-10 overflow-hidden border border-gray-200 bg-lmsa-50">
                <img src={post.featured_image_url} alt={post.title} className="w-full object-cover" />
              </figure>
            )}

            {/* Content is stored as plain TEXT in the DB (not HTML), so
                paragraph-per-line rendering is correct. Flag as follow-up
                if rich rendering is ever needed. */}
            <div className="editorial-prose mt-10 border-t border-gray-200 pt-10">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {tags.length > 0 && (
              <footer className="mt-12">
                <p className="text-[13px] font-semibold text-gray-500">Tagged</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag.id} className="bg-white px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </footer>
            )}
          </div>
        </div>
      </article>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <section className="editorial-callout editorial-callout-green">
            <div>
              <h2>More stories from the LMSA community.</h2>
              <p>Announcements, achievements, and opportunities from Liberia’s future physicians.</p>
            </div>
            <Link to="/news" className="editorial-callout-action">
              Browse all news
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
