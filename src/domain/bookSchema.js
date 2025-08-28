/** Sade Book doğrulama/sanitizasyon yardımcıları */

/**
 * @typedef {Object} Book
 * @property {string} id - Unique identifier
 * @property {string} title - Book title
 * @property {string[]} authors - Authors array
 * @property {string|null} description - Book description
 * @property {string|null} thumbnail - Image URL
 * @property {number|null} publishedYear - Publication year
 * @property {number|null} averageRating - Rating (0-5)
 * @property {number} ratingsCount - Rating count
 */

// Helpers
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Book doğrulama
export function validateBook(book) {
  const errors = [];
  
  if (!book || typeof book !== 'object') {
    return { isValid: false, errors: ['Book must be an object'] };
  }

  if (!isNonEmptyString(book.id)) {
    errors.push('ID is required');
  }

  if (!isNonEmptyString(book.title)) {
    errors.push('Title is required');
  }

  if (!Array.isArray(book.authors)) {
    errors.push('Authors must be an array');
  }

  return { isValid: errors.length === 0, errors };
}

// Özet doğrulama
export function validateBookSummary(summary) {
  if (!summary?.id || !summary?.title) {
    return { isValid: false, errors: ['ID and title required'] };
  }
  return { isValid: true, errors: [] };
}

// Sanitizasyon
export function sanitizeBook(book) {
  if (!validateBook(book).isValid) return null;
  
  const sanitized = { ...book };
  
  // Fix invalid URLs
  if (sanitized.thumbnail && !isValidUrl(sanitized.thumbnail)) {
    sanitized.thumbnail = null;
  }
  
  // Ensure arrays
  if (!Array.isArray(sanitized.authors)) {
    sanitized.authors = [];
  }
  
  if (!Array.isArray(sanitized.categories)) {
    sanitized.categories = [];
  }

  return sanitized;
}
