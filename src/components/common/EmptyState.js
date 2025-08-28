/**
 * EmptyState - Themed empty state component (premium minimal)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/index';

export function EmptyState({ 
  title = 'Henüz İçerik Yok',
  message, 
  icon = '📭', // emoji fallback
  iconName, // MaterialCommunityIcons name (optional)
  children 
}) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        {iconName ? (
          <MaterialCommunityIcons name={iconName} size={40} color={colors.text.light} />
        ) : (
          <Text style={styles.emoji}>{icon}</Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  illustration: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  emoji: {
    fontSize: fontSize.xxl,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.4,
  },
});
