/** Favoriler ekranı */
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { favoritesStyles } from './styles';
import { useFavorites } from '../../state/favorites/useFavorites';
import { BookCard } from '../../components/book/BookCard';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';

export default function FavoritesScreen({ navigation }) {
  const { favorites, favoritesCount, isLoading, error } = useFavorites();
  
  const handleGoToSearch = () => {
    navigation.navigate('Search');
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  const renderFavoriteBook = ({ item: book }) => (
    <BookCard 
      book={book} 
      onPress={() => handleBookPress(book)} 
    />
  );

  // Duruma göre içerik
  const renderContent = () => {
    // Yükleniyor
    if (isLoading) {
      return (
        <Loading 
          message="Favoriler yükleniyor..."
        />
      );
    }

    // Hata
    if (error) {
      return (
        <ErrorState
          title="Favoriler Yüklenemedi"
          error={error}
          onRetry={() => navigation.goBack()}
          retryText="Geri Dön"
          icon="💔"
        />
      );
    }

    // Boş durum
    if (favoritesCount === 0) {
      return (
        <EmptyState
          title="Favori Listen Boş"
          message="Kitap arayıp yıldız simgesine dokunarak favorilerine ekleyebilirsin."
          iconName="star-outline"
        >
          <TouchableOpacity 
            style={favoritesStyles.ctaButton}
            onPress={handleGoToSearch}
          >
            <Text style={favoritesStyles.ctaButtonText}>Kitap Aramaya Başla</Text>
          </TouchableOpacity>
        </EmptyState>
      );
    }

    // Liste
    return (
      <>
        <View style={favoritesStyles.headerSection}>
          <Text style={favoritesStyles.headerTitle}>Favori Kitaplarım</Text>
          <Text style={favoritesStyles.headerSubtitle}>
            {favoritesCount} kitap favorilerinizde
          </Text>
        </View>
        <View style={favoritesStyles.headerDivider} />

        <FlatList
          data={favorites}
          renderItem={renderFavoriteBook}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={favoritesStyles.listContainer}
        />
      </>
    );
  };

  return (
    <View style={favoritesStyles.container}>
      {renderContent()}
    </View>
  );
}
