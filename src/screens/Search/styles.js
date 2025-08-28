/** Arama ekranı stilleri */
import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/index';

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  searchContainer: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 48,
    // floating card hissi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  
  searchInput: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: 'transparent',
  },

  searchInputDisabled: {
    color: colors.text.light,
    opacity: 0.6,
  },

  searchIcon: {
    marginRight: spacing.sm,
    opacity: 0.7,
  },
  
  searchPlaceholder: {
    fontSize: fontSize.md,
    color: colors.text.light,
  },
  
  resultsContainer: {
    flex: 1,
  },
  
  bookItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  bookCover: {
    width: 60,
    height: 90,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  bookTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  bookAuthor: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  
  bookDescription: {
    fontSize: fontSize.sm,
    color: colors.text.light,
    lineHeight: 18,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  emptyStateSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.light,
    textAlign: 'center',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  errorContainer: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFEBEE',
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  
  retryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.white,
  },

  // Clear button inside search bar
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginLeft: spacing.xs,
  },

  clearButtonText: {
    fontSize: fontSize.lg,
    color: '#000000', // Dark black
    fontWeight: fontWeight.bold,
  },

  statsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },

  statsText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },

  errorText: {
    fontSize: fontSize.xs,
    color: colors.status.error,
    marginTop: spacing.xs,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  loadingText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },

  resultsList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },

  resultsListContent: {
    paddingTop: spacing.sm,
  },

  bookAuthors: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },

  bookYear: {
    fontSize: fontSize.xs,
    color: colors.text.light,
    marginBottom: spacing.xs,
  },

  debugText: {
    fontSize: fontSize.xs,
    color: colors.text.light,
    marginTop: spacing.xs,
  },

  // Load More Styles
  loadMoreContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },

  loadMoreButton: {
    marginVertical: spacing.md,
  },

  loadingMoreIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },

  loadingMoreText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },

  endOfResultsText: {
    fontSize: fontSize.sm,
    color: colors.text.light,
    textAlign: 'center',
    padding: spacing.md,
    fontStyle: 'italic',
  },

  footerSpacer: {
    height: spacing.xl,
  },

  // Error State
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  errorTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  errorMessage: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: fontSize.md * 1.4,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },

  retryButtonText: {
    fontSize: fontSize.md,
    color: colors.text.white,
    fontWeight: fontWeight.semibold,
  },
});
