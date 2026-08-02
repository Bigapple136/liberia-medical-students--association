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