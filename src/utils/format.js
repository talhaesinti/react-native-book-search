/**
 * format.js - String formatting utilities
 */

/**
 * Normalize search query for consistent comparisons
 * - trims, collapses spaces, lowercases
 */
export function normalizeQuery(q) {
  return (q || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Merge arrays uniquely by id
 * @returns {{ merged: any[], appendedCount: number }}
 */
export function mergeUniqueById(previous, incoming, idKey = 'id') {
  const seen = new Set(previous.map(item => item?.[idKey]));
  const filtered = (incoming || []).filter(item => item && !seen.has(item[idKey]));
  return { merged: [...previous, ...filtered], appendedCount: filtered.length };
}

/**
 * SWR cache helpers over a Map
 */
export function getCacheEntry(cacheMap, key, ttlMs) {
  if (!cacheMap) return null;
  const entry = cacheMap.get(key);
  if (!entry) return null;
  if (typeof ttlMs === 'number' && ttlMs > 0 && Date.now() - entry.ts > ttlMs) {
    cacheMap.delete(key);
    return null;
  }
  return entry;
}

export function setCacheEntry(cacheMap, key, value) {
  if (!cacheMap) return;
  cacheMap.set(key, { ...value, ts: Date.now() });
}

export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function formatAuthors(authors) {
  if (!Array.isArray(authors) || authors.length === 0) return 'Yazar belirtilmemiş';
  return authors.filter(Boolean).join(', ');
}

export function formatPublisher(publisher) {
  if (typeof publisher !== 'string') return '—';
  const trimmed = publisher.trim();
  return trimmed.length > 0 ? trimmed : '—';
}

export function formatYear(publishedDate) {
  if (!publishedDate) return '—';
  try {
    const match = String(publishedDate).match(/^(\d{4})/);
    return match ? match[1] : '—';
  } catch {
    return '—';
  }
}

export function formatPages(pageCount) {
  if (!pageCount || Number(pageCount) <= 0) return '—';
  return `${pageCount} s.`;
}
