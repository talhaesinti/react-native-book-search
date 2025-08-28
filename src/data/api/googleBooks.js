/** Google Books API istemcisi */
import { httpGet, createCancellableRequest } from './http';

const BASE_URL = 'https://www.googleapis.com/books/v1';
const DEFAULT_MAX_RESULTS = 20;
const MAX_ALLOWED_RESULTS = 40; // Google Books API limit

/** Arama URL'si oluştur */
function buildSearchUrl(query, options = {}) {
  const {
    startIndex = 0,
    maxResults = DEFAULT_MAX_RESULTS,
    orderBy = 'relevance', // relevance | newest
    langRestrict = 'tr', // Turkish books by default
    printType = 'books', // books | magazines | all
  } = options;

  // Parametreleri sınırla
  const safeMaxResults = Math.min(Math.max(1, maxResults), MAX_ALLOWED_RESULTS);
  const safeStartIndex = Math.max(0, startIndex);

  const searchParams = new URLSearchParams({
    q: query.trim(),
    startIndex: safeStartIndex.toString(),
    maxResults: safeMaxResults.toString(),
    orderBy,
    langRestrict,
    printType,
    projection: 'full',
  });

  return `${BASE_URL}/volumes?${searchParams.toString()}`;
}

/** Kitap ara */
export async function searchBooks(query, options = {}) {
  // Validate input
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('Search query is required and must be a non-empty string');
  }

  const { signal, debug = false, ...searchOptions } = options;
  const url = buildSearchUrl(query, searchOptions);

  if (debug) {
    console.log('📖 API REQUEST:', query.trim());
  }

  try {
    const response = await httpGet(url, {
      signal,
      timeout: 15000, // Longer timeout for search requests
      retries: 2, // Fewer retries for user-initiated searches
    });

    if (debug) {
      console.log('📊 API RESPONSE:', response.totalItems, 'books found');
    }

    // Yanıt doğrulama
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format from Google Books API');
    }

    const result = {
      query: query.trim(),
      totalItems: response.totalItems || 0,
      items: response.items || [],
      startIndex: searchOptions.startIndex || 0,
      maxResults: searchOptions.maxResults || DEFAULT_MAX_RESULTS,
      // Meta
      apiUrl: url,
      timestamp: new Date().toISOString(),
      // Debug
      ...(debug && { rawResponse: response }),
    };

    return result;

  } catch (error) {
    // Hata zenginleştirme
    if (error.name === 'HttpError') {
      if (error.status === 400) {
        throw new Error(`Geçersiz arama sorgusu: ${query}`);
      } else if (error.status === 403) {
        throw new Error('Google Books API erişim sınırı aşıldı');
      } else if (error.status === 429) {
        throw new Error('Çok fazla istek yapıldı, lütfen bekleyin');
      }
    }

    // Beklenmeyenler için pass-through
    throw error;
  }
}

/** Detay getir */
export async function getBookById(volumeId, options = {}) {
  if (!volumeId || typeof volumeId !== 'string') {
    throw new Error('Volume ID is required and must be a string');
  }

  const { signal } = options;
  const url = `${BASE_URL}/volumes/${volumeId}`;

  try {
    const response = await httpGet(url, {
      signal,
      timeout: 10000,
      retries: 3,
    });

    if (!response || !response.id) {
      throw new Error('Invalid book data received');
    }

    return response;

  } catch (error) {
    if (error.name === 'HttpError' && error.status === 404) {
      throw new Error(`Kitap bulunamadı: ${volumeId}`);
    }
    throw error;
  }
}

/** İptal edilebilir arama isteği oluştur */
export function createCancellableSearch(query, options = {}) {
  return createCancellableRequest((requestOptions) =>
    searchBooks(query, { ...options, ...requestOptions })
  );
}

/** İptal edilebilir detay isteği oluştur */
export function createCancellableBookDetails(volumeId, options = {}) {
  return createCancellableRequest((requestOptions) =>
    getBookById(volumeId, { ...options, ...requestOptions })
  );
}

/** Gelişmiş arama query'si oluştur */
export function buildAdvancedQuery(criteria = {}) {
  const { title, author, isbn, subject, publisher } = criteria;
  const queryParts = [];

  if (title) queryParts.push(`intitle:${title}`);
  if (author) queryParts.push(`inauthor:${author}`);
  if (isbn) queryParts.push(`isbn:${isbn}`);
  if (subject) queryParts.push(`subject:${subject}`);
  if (publisher) queryParts.push(`inpublisher:${publisher}`);

  if (queryParts.length === 0) {
    throw new Error('At least one search criteria must be provided');
  }

  return queryParts.join(' ');
}

// Geriye dönük uyum
export const searchVolumes = searchBooks;
