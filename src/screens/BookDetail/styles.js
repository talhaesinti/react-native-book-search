/** Kitap detay stilleri */
import { StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight } from "../../theme/index";

export const bookDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  /* HERO */
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,   // header ile çakışmasın; daha az boşluk
    paddingBottom: spacing.sm,
    backgroundColor: "transparent",
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: spacing.lg,
  },

  coverCenter: {
    alignItems: "center",
    marginBottom: spacing.md,
  },

  favoriteFloating: {
    position: 'absolute',
    right: spacing.xl - 2,
    top: spacing.sm,
    backgroundColor: colors.background.primary,
    borderRadius: 24,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },

  coverXL: {
    width: 200,
    aspectRatio: 2 / 3,
  },

  coverShadow: {
    // Kapak daha “objekt” gibi dursun
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderRadius: 6,
    overflow: "hidden",
    width: 136,        // ~128-140 ideal
    aspectRatio: 2 / 3 // 2:3
  },

  heroInfo: {
    flex: 1,
    paddingTop: spacing.xs,
  },

  // Overlay favoriyi kaldırdık — headerRight kullanılıyor
  favoriteOverlay: { display: "none" },

  heroDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  /* Başlıklar */
  title: {
    fontSize: fontSize.xl, // 26
    lineHeight: Math.round(fontSize.xl * 1.25),
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: fontSize.lg, // 22
    lineHeight: Math.round(fontSize.lg * 1.3),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },

  /* Meta */
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },

  metaIcon: { marginRight: spacing.xs },

  metaText: {
    fontSize: fontSize.sm, // 16
    lineHeight: Math.round(fontSize.sm * 1.45),
    color: colors.text.primary,
    flexShrink: 1,
  },

  metaTextLight: {
    fontSize: fontSize.xs, // 14
    lineHeight: Math.round(fontSize.xs * 1.4),
    color: colors.text.tertiary,
    flexShrink: 1,
  },

  inlineStats: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: spacing.md,
    marginTop: spacing.md,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: spacing.xs,
  },

  statText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },

  statSubText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },

  /* İçerik */
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },

  block: { marginBottom: spacing.lg },

  sectionTitle: {
    fontSize: fontSize.lg,
    lineHeight: Math.round(fontSize.lg * 1.25),
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  tagText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    lineHeight: Math.round(fontSize.xs * 1.35),
  },

  description: {
    fontSize: fontSize.sm, // 16
    lineHeight: Math.round(fontSize.sm * 1.6),
    color: colors.text.primary,
    textAlign: "left",
    letterSpacing: 0.15,
  },

  readMore: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },

  infoLine: {
    fontSize: fontSize.xs,
    lineHeight: Math.round(fontSize.xs * 1.5),
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },

  // İçerik akışı sade
});
