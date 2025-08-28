/**
 * BookCover - Displays book cover image with fallback
 */
import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/index';
import { getCoverUri } from '../../utils/image';

const SIZES = {
  small: { width: 52, height: 78 },
  medium: { width: 72, height: 108 },
  large: { width: 120, height: 180 },
  xlarge: { width: 160, height: 240 },
};

export function BookCover({ source, size = 'medium' }) {
  const dimensions = SIZES[size] || SIZES.medium;

  const coverStyles = [
    styles.container,
    dimensions,
  ];

  if (source) {
    return (
      <Image
        source={getCoverUri(source)}
        style={[coverStyles, styles.image]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[coverStyles, styles.placeholder]}>
      <Text style={[styles.placeholderText, size === 'small' && styles.smallText]}>
        📚
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
  },

  image: {
    borderRadius: borderRadius.sm,
  },

  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderStyle: 'dashed',
  },

  placeholderText: {
    fontSize: fontSize.xl,
    opacity: 0.6,
  },

  smallText: {
    fontSize: fontSize.sm,
  },
});
