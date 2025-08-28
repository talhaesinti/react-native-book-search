/**
 * FavoriteToggle - Toggle button for adding/removing favorites
 */
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/index';

export function FavoriteToggle({ isFavorite, onToggle, size = 24, variant = 'solid' }) {
  const containerStyle = variant === 'minimal' ? styles.minimal : styles.container;
  const iconColor = isFavorite ? '#FFC107' : colors.text.light;
  const padding = variant === 'minimal' ? 0 : spacing.sm;
  const diameter = size + padding * 2;

  return (
    <TouchableOpacity
      style={[
        containerStyle,
        {
          width: diameter,
          height: diameter,
          borderRadius: Math.ceil(diameter / 2),
          padding,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <MaterialCommunityIcons
        name={isFavorite ? 'star' : 'star-outline'}
        size={size}
        color={iconColor}
        style={{ transform: [{ translateY: Platform.OS === 'ios' ? -0.5 : 0 }] }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  minimal: {
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
});
