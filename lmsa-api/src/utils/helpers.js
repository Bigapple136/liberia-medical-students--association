// For values interpolated into an HTML email body. Contact-form fields are
// visitor-supplied, so they must never be pasted into markup as-is: a message
// containing `<a href="...">` would render as a live link in a mail that
// appears to come from LMSA.
export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// A capacity of 0 means "no limit", not "nobody may register", so it is stored
// as null. Both admin forms send the field as a string, and a plain
// `max_attendees || null` kept '0' but turned a real 0 into null, leaving the
// column to mean two different things depending on which route wrote it.
// Returns undefined when the input is not a whole number of 0 or more.
export const normalizeMaxAttendees = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;

  const capacity = Number(value);
  if (!Number.isInteger(capacity) || capacity < 0) return undefined;

  return capacity === 0 ? null : capacity;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};