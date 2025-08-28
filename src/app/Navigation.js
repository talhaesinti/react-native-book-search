/**
 * Navigation - Main navigation stack configuration
 */
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Theme imports
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../theme/index';

// Screen imports
import SearchScreen from '../screens/Search/SearchScreen';
import BookDetailScreen from '../screens/BookDetail/BookDetailScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';

const Stack = createNativeStackNavigator();

// Header button component
function FavoritesButton() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Favorites')}
      style={{ marginRight: 8 }}
    >
      <MaterialCommunityIcons name="star" size={24} color={'#FFC107'} />
    </TouchableOpacity>
  );
}

// Global floating Search FAB (visible on all screens)
function GlobalSearchFAB() {
  const navigation = useNavigation();
  return (
    <View pointerEvents="box-none" style={styles.fabWrapper}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        activeOpacity={0.85}
        style={styles.fab}
      >
        <MaterialCommunityIcons name="magnify" size={26} color={colors.text.white} />
      </TouchableOpacity>
    </View>
  );
}

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={({}) => ({
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.text.white,
          headerTitleStyle: {
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.lg,
          },
          headerRight: () => <FavoritesButton />,
        })}
      >
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            title: 'Kitap Ara',
          }}
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetailScreen}
          options={({ route }) => ({
            title: route.params?.book?.title ? 
              route.params.book.title.length > 20 
                ? route.params.book.title.substring(0, 17) + '...'
                : route.params.book.title
              : 'Kitap Detay',
          })}
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{
            title: 'Favorilerim',
          }}
        />
      </Stack.Navigator>
      <GlobalSearchFAB />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
});
