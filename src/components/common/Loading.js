/**
 * Loading - Themed loading indicator component
 */
import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../theme/index';

export function Loading({ 
  size = 'large', 
  color = colors.primary, 
  message = 'Yükleniyor...',
  showMessage = true 
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {showMessage && (
        <Text style={styles.message}>{message}</Text>
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
  message: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
