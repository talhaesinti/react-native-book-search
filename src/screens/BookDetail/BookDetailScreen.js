/** Kitap detay ekranı */
import React, { useMemo, useState, useCallback, useLayoutEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { bookDetailStyles as S } from "./styles";
import { BookCover } from "../../components/book/BookCover";
import { FavoriteToggle } from "../../components/book/FavoriteToggle";
import { useFavorites } from "../../state/favorites/useFavorites";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/index";

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params || {};
  const { isFavorite, toggleFavorite } = useFavorites();

  const [descExpanded, setDescExpanded] = useState(false);
  const [descOverflow, setDescOverflow] = useState(false);

  const handleFavoriteToggle = () => {
    if (!book) return;
    toggleFavorite(book);
  };

  // Header'daki favoriyi gizle
  useLayoutEffect(() => {
    if (!book) return;
    navigation.setOptions({
      headerRight: () => null,
      title: book.title?.length > 28 ? `${book.title.slice(0, 28)}…` : book.title || "Kitap",
    });
  }, [navigation, book, isFavorite(book?.id)]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDescLayout = useCallback(
    (e) => {
      if (descExpanded) return;
      const lines = (e?.nativeEvent?.lines?.length ?? 0);
      // iOS'ta onTextLayout, numberOfLines değerine kadar satır döndürür.
      // Bu nedenle >= kontrolü ve içeriğin karakter uzunluğuna göre yedek kontrol ekliyoruz.
      if (lines >= 6) {
        setDescOverflow(true);
        return;
      }
      if ((book?.description?.length ?? 0) > 160) {
        setDescOverflow(true);
      }
    },
    [descExpanded, book?.description]
  );

  // Yayın yılı (defansif)
  const publishedYear = useMemo(() => {
    if (!book?.publishedDate) return null;
    const match = String(book.publishedDate).match(/\d{4}/);
    return match ? match[0] : null;
  }, [book?.publishedDate]);

  const authorsText = useMemo(() => {
    if (!Array.isArray(book?.authors) || book.authors.length === 0) {
      return "Yazar belirtilmemiş";
    }
    return book.authors.join(", ");
  }, [book?.authors]);

  if (!book) {
    return (
      <View style={[S.container, S.center]}>
        <Text style={S.errorText}>Kitap bilgisi bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={S.container} contentInsetAdjustmentBehavior="automatic">
      {/* HERO */}
      <View style={S.hero}>
        <View style={{ position: 'relative' }}>
          <View style={S.coverCenter}>
            <BookCover
              source={book.thumbnail}
              size="xlarge"
              accessibilityLabel="Kitap kapağı"
              style={S.coverXL}
            />
          </View>
          <View style={S.favoriteFloating}>
            <FavoriteToggle
              isFavorite={isFavorite(book.id)}
              onToggle={handleFavoriteToggle}
              size={26}
              variant="minimal"
            />
          </View>
        </View>

        <View style={S.heroInfo}>
            <Text
              style={S.title}
              numberOfLines={2}
              accessibilityRole="header"
              accessibilityLabel={`Başlık: ${book.title}`}
            >
              {book.title}
            </Text>

            <View style={S.metaLine}>
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color={colors.text.secondary}
                style={S.metaIcon}
              />
              <Text style={S.metaText}>
                {authorsText}
              </Text>
            </View>

            {book.publisher ? (
              <View style={S.metaLine}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={16}
                  color={colors.text.tertiary}
                  style={S.metaIcon}
                />
                <Text style={S.metaTextLight}>
                  {book.publisher}
                </Text>
              </View>
            ) : null}

            <View style={S.inlineStats}>
              {publishedYear ? (
                <View style={S.statItem}>
                  <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    size={16}
                    color={colors.text.tertiary}
                  />
                  <Text style={S.statText}>{publishedYear}</Text>
                </View>
              ) : null}

              {book.pageCount ? (
                <View style={S.statItem}>
                  <MaterialCommunityIcons
                    name="book-outline"
                    size={16}
                    color={colors.text.tertiary}
                  />
                  <Text style={S.statText}>{book.pageCount} sf</Text>
                </View>
              ) : null}

              {book.averageRating ? (
                <View style={S.statItem}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
                  <Text style={S.statText}>
                    {Number(book.averageRating).toFixed(1)}
                  </Text>
                  {book.ratingsCount ? (
                    <Text style={S.statSubText}>({book.ratingsCount})</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>

        {/* Ayırıcı */}
        <View style={S.heroDivider} />
      </View>

      {/* İçerik */}
      <View style={S.content}>
        {Array.isArray(book.categories) && book.categories.length > 0 ? (
          <View style={S.block}>
            <Text style={S.sectionTitle}>Kategoriler</Text>
            <View style={S.tagsRow}>
              {book.categories.map((category, index) => (
                <View key={`${category}-${index}`} style={S.tag}>
                  <Text style={S.tagText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={S.block}>
          <Text style={S.sectionTitle}>Açıklama</Text>
          <Text
            style={S.description}
            numberOfLines={descExpanded ? undefined : 6}
            onTextLayout={onDescLayout}
          >
            {book.description || "Bu kitap için henüz açıklama bulunmuyor."}
          </Text>

          {descOverflow ? (
            <TouchableOpacity
              onPress={() => setDescExpanded((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={descExpanded ? "Daha az göster" : "Devamını oku"}
            >
              <Text style={S.readMore}>
                {descExpanded ? "Daha az göster" : "Devamını oku"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={S.block}>
          <Text style={S.sectionTitle}>Bilgiler</Text>
          {book.language ? (
            <Text style={S.infoLine}>Dil: {String(book.language).toUpperCase()}</Text>
          ) : null}
          {book.isbn10 ? <Text style={S.infoLine}>ISBN-10: {book.isbn10}</Text> : null}
          {book.isbn13 ? <Text style={S.infoLine}>ISBN-13: {book.isbn13}</Text> : null}
        </View>
      </View>
    </ScrollView>
  );
}
