export function validateBookInput(input, { requireId = false } = {}) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return 'Request body must be a JSON object.';
  }

  if (requireId && (!Number.isSafeInteger(input.id) || input.id < 1)) {
    return 'id must be a positive integer.';
  }

  if (requireId && (typeof input.title !== 'string' || input.title.trim() === '')) {
    return 'title is required and must be a non-empty string.';
  }

  if (requireId && (typeof input.author !== 'string' || input.author.trim() === '')) {
    return 'author is required and must be a non-empty string.';
  }

  if (requireId && (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price < 0)) {
    return 'price is required and must be a non-negative number.';
  }

  if (input.title !== undefined && (typeof input.title !== 'string' || input.title.trim() === '')) {
    return 'title must be a non-empty string.';
  }

  if (input.author !== undefined && (typeof input.author !== 'string' || input.author.trim() === '')) {
    return 'author must be a non-empty string.';
  }

  if (input.price !== undefined && (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price < 0)) {
    return 'price must be a non-negative number.';
  }

  if (input.category !== undefined && (typeof input.category !== 'string' || input.category.trim() === '')) {
    return 'category must be a non-empty string.';
  }

  return null;
}

export function createBook(input) {
  return {
    id: input.id,
    title: input.title.trim(),
    author: input.author.trim(),
    price: input.price,
    category: input.category?.trim() || 'Uncategorized'
  };
}
