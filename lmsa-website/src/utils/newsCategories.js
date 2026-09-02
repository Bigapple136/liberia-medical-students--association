/**
 * Shared news category definitions.
 * Single source of truth for the category filter on the news index
 * and the badge styling on both the index and detail pages.
 */

export const NEWS_CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'achievement', label: 'Achievements' },
  { value: 'opportunity', label: 'Opportunities' },
  { value: 'health', label: 'Health' },
  { value: 'academic', label: 'Academic' },
  { value: 'event', label: 'Events' },
];

export const CATEGORY_BADGE_CLASSES = {
  news: 'bg-blue-50 text-blue-700',
  announcement: 'bg-purple-50 text-purple-700',
  achievement: 'bg-lmsa-50 text-lmsa-700',
  opportunity: 'bg-amber-50 text-amber-700',
  health: 'bg-red-50 text-red-700',
  academic: 'bg-indigo-50 text-indigo-700',
  event: 'bg-cyan-50 text-cyan-700',
};

export function categoryBadgeClass(category) {
  return CATEGORY_BADGE_CLASSES[category] || 'bg-gray-100 text-gray-700';
}

export function categoryLabel(category) {
  return NEWS_CATEGORIES.find((entry) => entry.value === category)?.label || category;
}
