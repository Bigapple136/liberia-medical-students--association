import { categoryLabel } from '@utils/newsCategories';

const WORDS_PER_MINUTE = 200;
// A republication within a day and a half is still the same story going out;
// only after that is "Updated" the more honest label.
const REVISION_THRESHOLD_MS = 36 * 60 * 60 * 1000;

export function formatStoryDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function readingMinutes(content) {
  const text = String(content || '').replace(/<[^>]*>/g, ' ').trim();
  if (!text) return null;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * The dateline under a story headline: category, date (or revision date), and
 * reading time. Every item it can show comes from the post itself, so the line
 * shrinks gracefully when a post has no category or content.
 *
 * @param {Object} props
 * @param {string} [props.category] - Category value from utils/newsCategories
 * @param {string} [props.publishedAt] - ISO timestamp
 * @param {string} [props.updatedAt] - ISO timestamp
 * @param {string} [props.content] - Story body, used only to estimate reading time
 * @param {string} [props.className=''] - Extra classes
 */
export default function StoryMeta({ category, publishedAt, updatedAt, content, className = '' }) {
  const published = formatStoryDate(publishedAt);
  const updated = formatStoryDate(updatedAt);
  const revised = Boolean(
    updated && publishedAt && updatedAt && new Date(updatedAt) - new Date(publishedAt) > REVISION_THRESHOLD_MS
  );
  const minutes = readingMinutes(content);

  if (!category && !published && !minutes) return null;

  return (
    <p className={`story-meta ${className}`.trim()}>
      {category && <span className="story-meta-category">{categoryLabel(category)}</span>}
      {revised ? (
        <span>
          Updated <time dateTime={updatedAt}>{updated}</time>
        </span>
      ) : (
        published && <time dateTime={publishedAt}>{published}</time>
      )}
      {minutes && <span>{minutes} min read</span>}
    </p>
  );
}
