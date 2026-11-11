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