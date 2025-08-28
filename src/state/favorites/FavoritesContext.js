/** Favoriler context'i (normalized state: byId/allIds) */
import React, { createContext, useReducer, useEffect } from 'react';
import { loadFavorites, saveFavorites } from '../../data/storage/favoritesStorage';

// Context
const FavoritesContext = createContext();

// Başlangıç state
const initialState = {
  byId: {},
  allIds: [],
  isLoaded: false,
  isLoading: true,
  error: null,
};

// Aksiyon tipleri
export const FAVORITES_ACTIONS = {
  HYDRATE_FROM_STORAGE: 'HYDRATE_FROM_STORAGE',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

/** Reducer */
function favoritesReducer(state, action) {
  switch (action.type) {
    case FAVORITES_ACTIONS.HYDRATE_FROM_STORAGE: {
      const { favorites } = action.payload;
      return {
        ...state,
        byId: favorites.byId || {},
        allIds: favorites.allIds || [],
        isLoaded: true,
        isLoading: false,
        error: null,
      };
    }

    case FAVORITES_ACTIONS.TOGGLE_FAVORITE: {
      const { book } = action.payload;
      const { byId, allIds } = state;
      const isCurrentlyFavorite = allIds.includes(book.id);

      if (isCurrentlyFavorite) {
        // Sil
        const newById = { ...byId };
        delete newById[book.id];
        
        return {
          ...state,
          byId: newById,
          allIds: allIds.filter(id => id !== book.id),
          error: null,
        };
      } else {
        // Ekle
        return {
          ...state,
          byId: {
            ...byId,
            [book.id]: book,
          },
          allIds: [...allIds, book.id],
          error: null,
        };
      }
    }

    case FAVORITES_ACTIONS.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case FAVORITES_ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}

/** Provider */
export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // İlk yüklemede storage'dan oku
  useEffect(() => {
    const initializeFavorites = async () => {
      try {
        dispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
        
        const savedFavorites = await loadFavorites();
        
        dispatch({ 
          type: FAVORITES_ACTIONS.HYDRATE_FROM_STORAGE, 
          payload: { favorites: savedFavorites || { byId: {}, allIds: [] } }
        });
      } catch (error) {
        console.warn('Failed to load favorites from storage:', error);
        dispatch({ 
          type: FAVORITES_ACTIONS.SET_ERROR, 
          payload: 'Favoriler yüklenirken hata oluştu' 
        });
      }
    };

    initializeFavorites();
  }, []);

  // Değiştikçe storage'a yaz
  useEffect(() => {
    const saveToStorage = async () => {
      if (!state.isLoaded) return; // Don't save until initial load is complete

      try {
        await saveFavorites({
          byId: state.byId,
          allIds: state.allIds,
        });
      } catch (error) {
        console.warn('Failed to save favorites to storage:', error);
        dispatch({ 
          type: FAVORITES_ACTIONS.SET_ERROR, 
          payload: 'Favoriler kaydedilirken hata oluştu' 
        });
      }
    };

    saveToStorage();
  }, [state.byId, state.allIds, state.isLoaded]);

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export { FavoritesContext };
