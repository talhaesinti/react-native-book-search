/**
 * AppProvider - Global context provider wrapper
 * Composes all context providers for the application
 */
import React from 'react';
import { FavoritesProvider } from '../state/favorites/FavoritesContext';

/**
 * Root provider component that composes all context providers
 * Order matters for provider hierarchy
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AppProvider({ children }) {
  return (
    <FavoritesProvider>
      {/* Future providers can be added here:
          <AuthProvider>
            <ThemeProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </ThemeProvider>
          </AuthProvider>
      */}
      {children}
    </FavoritesProvider>
  );
}
