/**
 * styles.js - Simple global styles
 */
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { fontSize, fontWeight } from './typography';
import { borderRadius, shadow } from './tokens';

// Global common styles
export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  containerPadding: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Cards
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadow.sm,
  },
  
  // Buttons
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Text
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.normal,
    color: colors.text.primary,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.white,
  },
  buttonTextSecondary: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  
  // Status containers
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  warningContainer: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  successContainer: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  infoContainer: {
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
});

// Legacy export for backward compatibility
export const commonStyles = globalStyles;
