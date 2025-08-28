/** useBookSearch - Akıllı debounce, iptal, pagination ve hata yönetimi içerir */
import { useState, useEffect, useCallback, useRef } from 'react';
import { createCancellableSearch } from '../data/api/googleBooks';
import { mapVolumesToBooks } from '../domain/bookMapper';
import { validateBook, sanitizeBook } from '../domain/bookSchema';
import { useDebouncedCallback } from '../utils/debounce';
import { normalizeQuery, mergeUniqueById, getCacheEntry as utilGetCacheEntry, setCacheEntry as utilSetCacheEntry } from '../utils/format';

const DEBOUNCE_DELAY = 2500; // 2.5 seconds for smart debounce
const MIN_QUERY_LENGTH = 2; // Minimum characters to trigger search

/**
 * @param {Object} options
 * @param {number} options.debounceDelay
 * @param {number} options.minQueryLength
 * @param {boolean} options.autoSearch
 * @returns {Object}
 */
export function useBookSearch(options = {}) {
  const {
    debounceDelay = DEBOUNCE_DELAY,
    minQueryLength = MIN_QUERY_LENGTH,
    autoSearch = true,
    cacheTTLMs = 3 * 60 * 1000, // 3 minutes TTL for SWR cache
  } = options;

  // State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    startIndex: 0,
    totalItems: 0,
    hasMore: false,
  });

  // Advanced search states
  const [lastExecutedQuery, setLastExecutedQuery] = useState(''); // Son çalıştırılan query
  const [pendingQuery, setPendingQuery] = useState(''); // Bekleyen query (debounce'ta)
  const [isTyping, setIsTyping] = useState(false); // Kullanıcı yazıyor mu?

  // Refs for cleanup and cancellation
  const currentRequestRef = useRef(null);
  const mountedRef = useRef(true);
  const requestTokenRef = useRef(0); // monotonic increasing token to guard latest-only
  const cacheRef = useRef(new Map()); // Map<string, { items: any[], totalItems: number, ts: number }>

  // Cache helpers
  const getCacheEntry = useCallback((key) => utilGetCacheEntry(cacheRef.current, key, cacheTTLMs), [cacheTTLMs]);
  const setCacheEntry = useCallback((key, value) => utilSetCacheEntry(cacheRef.current, key, value), []);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.cancel();
      }
    };
  }, []);

  /** Aramayı çalıştır (doğrulama, eşleme, cache, sayfalama) */
  const executeSearch = useCallback(async (searchQuery, startIndex = 0, append = false) => {
    const trimmedQuery = normalizeQuery(searchQuery);
    
    // Validate query first
    if (!trimmedQuery || trimmedQuery.length < minQueryLength) {
      if (!append) {
        setResults([]);
        setPagination({ startIndex: 0, totalItems: 0, hasMore: false });
        setLoading(false);
        setLastExecutedQuery('');
      }
      setError(null);
      return;
    }

    // Check if this query was already executed (avoid duplicate requests)
    if (!append && trimmedQuery === lastExecutedQuery && results.length > 0) {
      return;
    }

    // Cancel previous request if exists
    if (currentRequestRef.current) {
      currentRequestRef.current.cancel();
      currentRequestRef.current = null;
    }

    try {
      // Loading state
      if (!append) {
        setLoading(true);
        setLastExecutedQuery(trimmedQuery); // Mark this query as executed
      }
      
      setError(null);

      // SWR: önce cache, sonra revalidate
      if (!append) {
        const cached = getCacheEntry(trimmedQuery);
        if (cached && Array.isArray(cached.items)) {
          setResults(cached.items);
          setTotalItems(cached.totalItems || cached.items.length || 0);
          setHasSearched(true);
        }
      }

      // Cancellable request
      const request = createCancellableSearch(trimmedQuery, {
        startIndex,
        maxResults: 10, // Fixed 10 per page for pagination
        orderBy: 'relevance',
        langRestrict: 'tr',
        debug: false,
      });
      
      currentRequestRef.current = request;
      const myToken = ++requestTokenRef.current;

      const response = await request.promise;

      // Mounted kontrolü
      if (!mountedRef.current) return;

      // İstek bitti
      currentRequestRef.current = null;

      // Eşleme ve doğrulama
      const mappedBooks = mapVolumesToBooks(response.items || [], { debug: false });
      
      // Temizle
      const validBooks = mappedBooks
        .map(book => sanitizeBook(book))
        .filter(book => {
          if (!book) return false;
          
          const validation = validateBook(book);
          if (!validation.isValid) {
            console.warn('Invalid book filtered out:', validation.errors);
            return false;
          }
          
          return true;
        });

      // Sadece son istek geçerli
      if (myToken !== requestTokenRef.current) {
        return;
      }

      // State güncelle (de-dup)
      if (append) {
        setResults(prevResults => {
          const { merged, appendedCount } = mergeUniqueById(prevResults, validBooks);
          // Update pagination and canLoadMore based on real appended count
          const newTotalItems = response.totalItems || 0;
          const newStartIndex = (pagination.startIndex || 0) + appendedCount;
          const hasMoreCalc = appendedCount > 0 && newStartIndex < newTotalItems;
          setTotalItems(newTotalItems);
          setCanLoadMore(hasMoreCalc);
          setPagination({ startIndex: newStartIndex, totalItems: newTotalItems, hasMore: hasMoreCalc });
          return merged;
        });
      } else {
        // Yeni aramada değiştir ve sayfalama kur
        const { merged, appendedCount } = mergeUniqueById([], validBooks);
        setResults(merged);
        setHasSearched(true);
        const newTotalItems = response.totalItems || 0;
        const newStartIndex = appendedCount;
        const hasMoreCalc = appendedCount > 0 && newStartIndex < newTotalItems;
        setTotalItems(newTotalItems);
        setCanLoadMore(hasMoreCalc);
        setPagination({ startIndex: newStartIndex, totalItems: newTotalItems, hasMore: hasMoreCalc });
        // Cache'e yaz
        setCacheEntry(trimmedQuery, { items: merged, totalItems: newTotalItems });
      }

      // Not: sayfalama yukarıda hesaplandı

    } catch (err) {
      // İptal değilse hatayı işle
      if (!mountedRef.current || err.name === 'AbortError') return;

      currentRequestRef.current = null;

      // Türkçe hata mesajları
      let errorMessage = 'Arama sırasında bir hata oluştu';
      if (err?.name === 'NetworkError') {
        errorMessage = 'İnternet bağlantınızda sorun var. Lütfen bağlantınızı kontrol edin.';
      } else if (err?.name === 'TimeoutError') {
        errorMessage = 'İstek zaman aşımına uğradı. Biraz sonra tekrar deneyin.';
      } else if (err?.name === 'HttpError') {
        const status = err?.status;
        if (status === 400) errorMessage = 'Geçersiz arama sorgusu. Lütfen girdinizi kontrol edin.';
        else if (status === 403) errorMessage = 'API erişim sınırına ulaşıldı. Biraz sonra tekrar deneyin.';
        else if (status === 404) errorMessage = 'İstenen kaynak bulunamadı.';
        else if (status >= 500) errorMessage = 'Sunucu tarafında bir sorun oluştu. Lütfen tekrar deneyin.';
        else errorMessage = `İstek başarısız oldu (HTTP ${status}).`;
      } else if (typeof err?.message === 'string' && err.message.trim().length > 0) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      if (mountedRef.current && !append) {
        // Yalnızca son istekse loading'i kapat
        if (!currentRequestRef.current) {
          setLoading(false);
        }
      }
    }
  }, [minQueryLength, loading, getCacheEntry, setCacheEntry, normalizeQuery, lastExecutedQuery, results.length]);

  // Debounce
  const [debouncedSearch] = useDebouncedCallback(
    (searchQuery) => {
      const trimmedQuery = normalizeQuery(searchQuery);
      if (trimmedQuery !== lastExecutedQuery) {
        setPendingQuery('');
        setIsTyping(false);
        executeSearch(trimmedQuery, 0, false);
      } else {
        setPendingQuery('');
        setIsTyping(false);
      }
    },
    debounceDelay,
    [lastExecutedQuery, executeSearch],
    { leading: false, trailing: true }
  );

  // Yazma takibi ile akıllı auto-search
  useEffect(() => {
    const trimmedQuery = normalizeQuery(query);
    
    if (autoSearch && trimmedQuery.length >= minQueryLength) {
      setIsTyping(true);
      setPendingQuery(trimmedQuery);
      debouncedSearch(trimmedQuery);
    } else if (trimmedQuery.length < minQueryLength && trimmedQuery.length > 0) {
      setIsTyping(false);
      setPendingQuery('');
    } else if (trimmedQuery.length === 0) {
      setIsTyping(false);
      setPendingQuery('');
      setLastExecutedQuery('');
    }
  }, [query, debouncedSearch, autoSearch, minQueryLength, debounceDelay, normalizeQuery]);

  // İlk yüklemede arama yok

  /** Manuel arama tetikle */
  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);
    if (!autoSearch) {
      executeSearch(searchQuery, 0, false);
    }
  }, [executeSearch, autoSearch]);

  /** Daha fazla yükle (pagination) */
  const loadMore = useCallback(async () => {
    if (loading || isLoadingMore || !canLoadMore || !query.trim()) {
      return;
    }

    setIsLoadingMore(true);
    
    try {
      await executeSearch(query, pagination.startIndex, true);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore, canLoadMore, query, pagination.startIndex, executeSearch]);

  /** Temizle */
  const clear = useCallback(() => {
    // Cancel any ongoing request
    if (currentRequestRef.current) {
      currentRequestRef.current.cancel();
      currentRequestRef.current = null;
    }

    // Reset everything to initial empty state
    setQuery('');
    setResults([]);
    setError(null);
    setLoading(false);
    setIsLoadingMore(false);
    setHasSearched(false);
    setCanLoadMore(false);
    setTotalItems(0);
    setPagination({ startIndex: 0, totalItems: 0, hasMore: false });
    
    // Reset advanced search states
    setLastExecutedQuery('');
    setPendingQuery('');
    setIsTyping(false);
    
    console.log('🧹 Complete search state cleared');
  }, []);

  /** Yeniden dene */
  const retry = useCallback(() => {
    if (query.trim().length >= minQueryLength) {
      executeSearch(query, 0, false);
    }
  }, [query, minQueryLength, executeSearch]);

  /** Aramayı tetiklemeden query ayarla */
  const setQueryOnly = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  // Helper messages for UI components with smart states
  const getLoadingMessage = () => {
    if (isTyping && pendingQuery) {
      return `"${pendingQuery}" yazımı bekleniyor...`;
    }
    if (loading && lastExecutedQuery) {
      return `"${lastExecutedQuery}" için arama yapılıyor...`;
    }
    if (query.trim().length > 0) {
      return `"${query}" aranıyor...`;
    }
    return 'Arama yapılıyor...';
  };

  const getEmptyStateConfig = () => {
    // Calculate isEmpty inline to avoid circular dependency
    const isCurrentlyEmpty = hasSearched && results.length === 0 && !loading && !error;
    
    // Only show empty state for actual empty search results
    if (isCurrentlyEmpty) {
      return {
        title: 'Sonuç Bulunamadı',
        message: `"${query}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`,
        icon: '🤷‍♂️'
      };
    }

    return null;
  };

  const getErrorStateConfig = () => {
    if (!error) return null;
    
    return {
      title: 'Arama Hatası',
      error: error,
      retryText: 'Tekrar Ara',
      icon: '🔌'
    };
  };

  return {
    // Current state
    query,
    results,
    loading,
    error,
    hasSearched,
    isLoadingMore,
    
    // Advanced search states
    isTyping,
    pendingQuery,
    lastExecutedQuery,
    
    // Pagination info
    pagination,
    canLoadMore,
    totalItems,
    
    // Computed properties
    isEmpty: hasSearched && results.length === 0 && !loading && !error,
    resultsCount: results.length,
    
    // UI Helper functions
    getLoadingMessage,
    getEmptyStateConfig,
    getErrorStateConfig,
    
    // Actions
    setQuery,
    search,
    loadMore,
    clear,
    retry,
  };
}

/**
 * Simplified hook for basic search functionality
 * @param {string} initialQuery - Initial search query
 * @returns {Object} Basic search state and functions
 */
export function useSimpleBookSearch(initialQuery = '') {
  const {
    query,
    results,
    loading,
    error,
    isEmpty,
    setQuery,
    clear,
  } = useBookSearch({
    minQueryLength: 1,
    maxResults: 10,
    autoSearch: true,
  });

  // Set initial query
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery, setQuery]);

  return {
    query,
    results,
    loading,
    error,
    isEmpty,
    setQuery,
    clear,
  };
}
