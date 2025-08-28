/**
 * BookCard - Displays book information in a card format
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatAuthors, formatPublisher, formatYear, formatPages } from '../../utils/format';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/index';
import { BookCover } from './BookCover';
import { FavoriteToggle } from './FavoriteToggle';
import { useFavorites } from '../../state/favorites/useFavorites';

export function BookCard({ book, onPress }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFavoriteToggle = (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    toggleFavorite(book);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      <View style={styles.content}>
        <View style={styles.coverWrapper}>
          <BookCover source={book.thumbnail} size="large" />
        </View>

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={3} ellipsizeMode="tail">{book.title}</Text>

          <View style={styles.rowCenter}>
            <MaterialCommunityIcons name="account-outline" size={14} color={colors.text.secondary} style={styles.icon} />
            <Text style={styles.bookAuthors} numberOfLines={2} ellipsizeMode="tail">{formatAuthors(book.authors)}</Text>
          </View>

          {/* Publisher full line (wraps) */}
          <View style={styles.publisherRow}>
            <MaterialCommunityIcons name="office-building" size={13} color={colors.text.light} style={styles.icon} />
            <Text style={styles.bookPublisher} numberOfLines={2} ellipsizeMode="tail">{formatPublisher(book.publisher)}</Text>
          </View>

          {/* Year + Page row (compact) */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={13} color={colors.text.light} style={styles.icon} />
              <Text style={styles.bookYear}>{formatYear(book.publishedDate)}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="book-outline" size={13} color={colors.text.light} style={styles.icon} />
              <Text style={styles.bookYear}>{formatPages(book.pageCount)}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); onPress?.(); }}
            activeOpacity={0.8}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText} numberOfLines={1} ellipsizeMode="tail">Detayları Gör</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sideActions}>
          <FavoriteToggle isFavorite={isFavorite(book.id)} onToggle={handleFavoriteToggle} size={18} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },

  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  coverWrapper: {
    width: 120,
    alignItems: 'flex-start',
  },

  // Book Info Styles
  bookInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  bookTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: fontSize.md * 1.3,
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: 6,
  },

  bookAuthors: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },

  bookPublisher: {
    fontSize: fontSize.xs,
    color: colors.text.light,
    marginRight: spacing.xs,
  },

  publisherRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookYear: {
    fontSize: fontSize.xs,
    color: colors.text.light,
  },

  bookPages: {
    fontSize: fontSize.xs,
    color: colors.text.light,
    marginLeft: spacing.xs,
  },

  // Removed category/rating for a more minimal premium layout

  // Favorite Section
  sideActions: {
    width: 32,
    alignItems: 'flex-end',
    paddingTop: spacing.sm,
  },

  // CTA
  ctaButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: spacing.xs,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // remove extra right margin to allow full text width
    marginRight: 0,
    flexWrap: 'nowrap',
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  ctaText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    flexShrink: 1,
    maxWidth: 140,
  },
});
