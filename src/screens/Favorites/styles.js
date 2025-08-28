/** Favoriler ekranı stilleri */
import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadow } from '../../theme/index';

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  
  emptyIcon: {
    marginBottom: spacing.md,
  },
  
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  emptyDescription: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  
  // CTA
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    minWidth: 220,
    marginTop: spacing.xl,
  },
  
  ctaButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.white,
    letterSpacing: 0.2,
  },
  
  // Bilgi kutusu
  infoSection: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xl,
  },
  
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  infoText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  
  // Liste (ileride)
  favoritesList: {
    flex: 1,
  },
  
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadow.sm,
  },
  
  favoriteItemCover: {
    width: 50,
    height: 75,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  
  favoriteItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  favoriteItemTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  favoriteItemAuthor: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
  },
  
  favoriteItemActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  
  removeButton: {
    padding: spacing.sm,
  },
  
  // Başlıklar
  sectionHeader: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  
  // İstatistikler
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  
  statLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  // Loading & Error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },

  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
  },

  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },

  retryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.white,
  },

  // Header
  headerSection: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },

  // Liste container
  listContainer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xl,
  },
});
