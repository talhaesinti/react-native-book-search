/** Arama ekranı */
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { searchStyles } from './styles';
import { useBookSearch } from '../../hooks/useBookSearch';
import { BookCard } from '../../components/book/BookCard';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    results,
    loading,
    error,
    isEmpty,
    isLoadingMore,
    canLoadMore,
    setQuery,
    loadMore,
    clear,
    getLoadingMessage,
    getEmptyStateConfig,
    getErrorStateConfig,
  } = useBookSearch({
    debounceDelay: 2500, // 2.5 seconds for smart typing detection
    minQueryLength: 2,
    autoSearch: true,
  });

  const handleNavigateToDetail = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  const renderBookItem = ({ item: book }) => (
    <BookCard 
      book={book} 
      onPress={() => handleNavigateToDetail(book)} 
    />
  );

  // Duruma göre içerik
  const renderContent = () => {
    // Hata
    const errorConfig = getErrorStateConfig();
    if (errorConfig) {
      return (
        <ErrorState
          title={errorConfig.title}
          error={errorConfig.error}
          onRetry={() => setQuery(searchQuery)}
          retryText={errorConfig.retryText}
          icon={errorConfig.icon}
        />
      );
    }

    // Yükleniyor (ilk yükleme)
    if (loading && !isLoadingMore) {
      return (
        <Loading 
          message={getLoadingMessage()}
          color="#007AFF"
        />
      );
    }

    // Sonuçlar
    if (results.length > 0) {
      return (
        <FlatList
          data={results}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => item?.id ? String(item.id) : `${index}`}
          showsVerticalScrollIndicator={false}
          style={searchStyles.resultsList}
          contentContainerStyle={searchStyles.resultsListContent}
          onEndReached={() => {
            if (canLoadMore && !isLoadingMore) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => (
            <View style={searchStyles.loadMoreContainer}>
              {isLoadingMore && (
                <View style={searchStyles.loadingMoreIndicator}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={searchStyles.loadingMoreText}>Daha fazla yükleniyor...</Text>
                </View>
              )}
              {!canLoadMore && results.length > 0 && (
                <Text style={searchStyles.endOfResultsText}>
                  Tüm sonuçlar gösterildi
                </Text>
              )}
              <View style={searchStyles.footerSpacer} />
            </View>
          )}
        />
      );
    }

    // Boş durum
    const emptyConfig = getEmptyStateConfig();
    if (emptyConfig) {
      return (
        <EmptyState
          title={emptyConfig.title}
          message={emptyConfig.message}
          iconName="magnify"
        />
      );
    }

    // Karşılama
    if (searchQuery.trim() === '' && results.length === 0) {
      return (
        <EmptyState
          title="Kitap Ara"
          message="Yukarıdaki arama kutusuna kitap adı, yazar veya konu yazın"
          iconName="magnify"
        />
      );
    }

    // Fallback
    return null;
  };

  return (
    <View style={searchStyles.container}>
      
      {/* Arama kutusu */}
      <View style={searchStyles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={18} color="#777" style={searchStyles.searchIcon} />
        <TextInput
          style={searchStyles.searchInput}
          value={searchQuery}
          onChangeText={(text) => {
            // Yazmayı engelleme
            setSearchQuery(text);
            setQuery(text);
          }}
          placeholder="Kitap adı, yazar veya konu arayın..."
          placeholderTextColor="#888"
          returnKeyType="search"
          editable={true}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={searchStyles.clearButton}
            onPress={() => {
              console.log('🧹 Clear button pressed - resetting all states');
              setSearchQuery('');
              clear();
            }}
            activeOpacity={0.7}
          >
            <Text style={searchStyles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* İçerik */}
      {renderContent()}
      
    </View>
  );
}
