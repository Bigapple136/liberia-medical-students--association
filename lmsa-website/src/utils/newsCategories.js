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

export function categoryLabel(category) {
  return NEWS_CATEGORIES.find((entry) => entry.value === category)?.label || category;
}
