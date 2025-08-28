/**
 * ErrorState - Themed error state component
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/index';

export function ErrorState({ 
  title = 'Bir Hata Oluştu',
  error, 
  onRetry,
  retryText = 'Tekrar Dene',
  icon = '⚠️'
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.error}>{error}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
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
  icon: {
    fontSize: fontSize.xxl * 1.5,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  error: {
    fontSize: fontSize.md,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    fontSize: fontSize.md,
    color: colors.text.white,
    fontWeight: fontWeight.semibold,
  },
});
