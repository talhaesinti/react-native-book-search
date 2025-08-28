/** Google Books volume nesnelerini sade Book modeline dönüştürür */

// Helpers
function safeGet(obj, path, defaultValue = null) {
  return path.split('.').reduce((acc, key) => 
    acc?.[key] ?? defaultValue, obj);
}

function getBestThumbnail(imageLinks) {
  if (!imageLinks) return null;
  
  const priorities = ['large', 'medium', 'small', 'thumbnail', 'smallThumbnail'];
  for (const size of priorities) {
    if (imageLinks[size]) {
      return imageLinks[size].replace(/^http:/, 'https:');
    }
  }
  return null;
}

function processAuthors(authors) {
  return Array.isArray(authors) 
    ? authors.filter(a => a && typeof a === 'string').map(a => a.trim()) 
    : [];
}

function processCategories(categories) {
  return Array.isArray(categories) 
    ? categories.filter(c => c && typeof c === 'string').map(c => c.trim()) 
    : [];
}

function extractISBNs(identifiers) {
  const result = { isbn10: null, isbn13: null };
  if (!Array.isArray(identifiers)) return result;
  
  for (const id of identifiers) {
    if (id?.type === 'ISBN_10') result.isbn10 = id.identifier;
    if (id?.type === 'ISBN_13') result.isbn13 = id.identifier;
  }
  return result;
}

function parsePublishedDate(publishedDate) {
  if (!publishedDate) return { year: null, formatted: null };
  
  const yearMatch = publishedDate.match(/^(\d{4})/);
  return {
    year: yearMatch ? parseInt(yearMatch[1], 10) : null,
    formatted: publishedDate,
  };
}

export function mapVolumeToBook(volume, options = {}) {
  const { debug = false } = options;
  
  // Simple validation
  if (!volume?.id || !volume?.volumeInfo) {
    if (debug) console.warn('🚫 Invalid volume:', volume?.id);
    return null;
  }

  if (debug) console.log('MAPPING:', volume.id);

  const info = volume.volumeInfo;
  const { isbn10, isbn13 } = extractISBNs(info.industryIdentifiers);
  const { year, formatted } = parsePublishedDate(info.publishedDate);

  return {
    // Core info
    id: volume.id,
    title: info.title?.trim() || 'Başlık Bilinmiyor',
    subtitle: info.subtitle?.trim() || null,
    authors: processAuthors(info.authors),
    
    // Publication
    publisher: info.publisher?.trim() || null,
    publishedDate: formatted,
    publishedYear: year,
    pageCount: info.pageCount || null,
    language: info.language || 'tr',
    
    // Content
    description: info.description?.trim() || null,
    categories: processCategories(info.categories),
    
    // Identifiers
    isbn10,
    isbn13,
    
    // Media
    thumbnail: getBestThumbnail(info.imageLinks),
    
    // Ratings
    averageRating: info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
    
    // Links
    previewLink: info.previewLink || null,
    infoLink: info.infoLink || null,
    buyLink: volume.saleInfo?.buyLink || null,
  };
}

export function mapVolumesToBooks(volumes, options = {}) {
  const { debug = false } = options;
  
  if (!Array.isArray(volumes)) {
    if (debug) console.warn('🚫 Not array:', volumes);
    return [];
  }

  if (debug) console.log(`Mapping ${volumes.length} volumes...`);

  const books = volumes
    .map(volume => mapVolumeToBook(volume, { debug }))
    .filter(Boolean);

  if (debug) console.log(`MAPPED: ${books.length}/${volumes.length} books`);
  return books;
}

// Create summary for list displays
export function createBookSummary(book) {
  if (!book) return null;
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    thumbnail: book.thumbnail,
    publishedYear: book.publishedYear,
    averageRating: book.averageRating,
    ratingsCount: book.ratingsCount,
    pageCount: book.pageCount,
    language: book.language,
  };
}

// Extract searchable text
export function extractSearchableText(book) {
  if (!book) return '';
  return [
    book.title, book.subtitle, 
    ...(book.authors || []), 
    book.publisher, book.description,
    ...(book.categories || [])
  ].filter(Boolean).join(' ').toLowerCase();
}
