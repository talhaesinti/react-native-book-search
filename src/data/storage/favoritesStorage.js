/**
 * favoritesStorage.js - AsyncStorage wrapper for favorites
 * Handles serialization, deserialization, and error recovery
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app/favorites:v1';

/**
 * Load favorites from AsyncStorage
 * @returns {Promise<Object|null>} Favorites object or null if not found
 */
export async function loadFavorites() {
  try {
    const favoritesJson = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (favoritesJson === null) {
      // No data found - first time user
      return null;
    }

    const favorites = JSON.parse(favoritesJson);
    
    // Validate data structure
    if (!favorites || typeof favorites !== 'object') {
      console.warn('Invalid favorites data structure, resetting...');
      return null;
    }

    // Ensure required fields exist
    const validatedFavorites = {
      byId: favorites.byId || {},
      allIds: favorites.allIds || [],
    };

    // Additional validation - ensure allIds matches byId keys
    const validIds = validatedFavorites.allIds.filter(id => 
      validatedFavorites.byId[id] !== undefined
    );

    if (validIds.length !== validatedFavorites.allIds.length) {
      console.warn('Inconsistent favorites data, fixing...');
      validatedFavorites.allIds = validIds;
    }

    return validatedFavorites;
    
  } catch (error) {
    console.warn('Failed to load favorites from storage:', error);
    
    // Try to clear corrupted data
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.warn('Failed to clear corrupted favorites data:', clearError);
    }
    
    return null;
  }
}

/**
 * Save favorites to AsyncStorage
 * @param {Object} favorites - Favorites object { byId: {}, allIds: [] }
 * @returns {Promise<boolean>} Success status
 */
export async function saveFavorites(favorites) {
  try {
    // Validate input
    if (!favorites || typeof favorites !== 'object') {
      throw new Error('Invalid favorites data structure');
    }

    const { byId = {}, allIds = [] } = favorites;

    // Validate data types
    if (typeof byId !== 'object' || !Array.isArray(allIds)) {
      throw new Error('Invalid favorites data types');
    }

    // Create clean data structure
    const dataToSave = {
      byId,
      allIds,
      savedAt: new Date().toISOString(), // Metadata for debugging
      version: 1, // For future migrations
    };

    const favoritesJson = JSON.stringify(dataToSave);
    await AsyncStorage.setItem(STORAGE_KEY, favoritesJson);
    
    return true;
    
  } catch (error) {
    console.warn('Failed to save favorites to storage:', error);
    return false;
  }
}

/**
 * Clear all favorites from storage
 * Useful for debugging or user logout
 * @returns {Promise<boolean>} Success status
 */
export async function clearFavorites() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Failed to clear favorites from storage:', error);
    return false;
  }
}

/**
 * Get favorites storage info for debugging
 * @returns {Promise<Object>} Storage info
 */
export async function getFavoritesInfo() {
  try {
    const favoritesJson = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (favoritesJson === null) {
      return { exists: false, size: 0 };
    }

    const favorites = JSON.parse(favoritesJson);
    
    return {
      exists: true,
      size: favoritesJson.length,
      count: favorites.allIds?.length || 0,
      savedAt: favorites.savedAt || 'unknown',
      version: favorites.version || 'unknown',
    };
    
  } catch (error) {
    return { exists: false, error: error.message };
  }
}
