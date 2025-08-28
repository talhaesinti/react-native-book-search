/** Favoriler context hook'u (temiz API) */
import { useContext, useMemo, useCallback } from 'react';
import { FavoritesContext, FAVORITES_ACTIONS } from './FavoritesContext';

/** @returns {Object} Favoriler API */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  const { state, dispatch } = context;

  // Seçiciler
  const favorites = useMemo(() => {
    return state.allIds.map(id => state.byId[id]).filter(Boolean);
  }, [state.byId, state.allIds]);

  const favoritesCount = useMemo(() => {
    return state.allIds.length;
  }, [state.allIds]);

  // Aksiyonlar
  const isFavorite = useCallback((bookId) => {
    if (!bookId) return false;
    return state.allIds.includes(bookId);
  }, [state.allIds]);

  const getFavorite = useCallback((bookId) => {
    if (!bookId) return null;
    return state.byId[bookId] || null;
  }, [state.byId]);

  const toggleFavorite = useCallback((book) => {
    if (!book || !book.id) {
      console.warn('toggleFavorite: Invalid book object');
      return;
    }

    dispatch({
      type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
      payload: { book },
    });
  }, [dispatch]);

  const addFavorite = useCallback((book) => {
    if (!book || !book.id) {
      console.warn('addFavorite: Invalid book object');
      return;
    }

    if (!isFavorite(book.id)) {
      toggleFavorite(book);
    }
  }, [isFavorite, toggleFavorite]);

  const removeFavorite = useCallback((bookId) => {
    if (!bookId) {
      console.warn('removeFavorite: Invalid book ID');
      return;
    }

    const book = getFavorite(bookId);
    if (book) {
      toggleFavorite(book);
    }
  }, [getFavorite, toggleFavorite]);

  // Dışa açılan API
  return {
    // Data
    favorites,
    favoritesCount,
    isLoading: state.isLoading,
    isLoaded: state.isLoaded,
    error: state.error,

    // Selectors
    isFavorite,
    getFavorite,

    // Actions
    toggleFavorite,
    addFavorite,
    removeFavorite,

    // Raw state (for advanced use cases)
    rawState: state,
  };
}

/** Belirli bir kitap favori mi? */
export function useIsFavorite(bookId) {
  const { isFavorite } = useFavorites();
  return isFavorite(bookId);
}

/** Favori sayısı */
export function useFavoritesCount() {
  const { favoritesCount } = useFavorites();
  return favoritesCount;
}
