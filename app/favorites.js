import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { styles } from '../styles/styles';

const API_URL = 'https://jsonplaceholder.typicode.com';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      const favIds = stored ? JSON.parse(stored) : [];
      setFavorites(favIds);

      const promises = favIds.map((id) =>
        axios.get(`${API_URL}/posts/${id}`).then(res => res.data)
      );
      const results = await Promise.all(promises);
      const articlesMap = {};
      results.forEach(a => { articlesMap[a.id] = a; });
      setArticles(articlesMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⭐</Text>
        <Text style={styles.emptyTitle}>Aucun favori pour le moment</Text>
        <Text style={styles.emptySubtitle}>Ajoutez-en depuis la page d&apos;accueil</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.header}>⭐ Mes Favoris</Text>
        <FlatList
          data={favorites}
          keyExtractor={(id) => id.toString()}
          renderItem={({ item }) => {
            const article = articles[item];
            if (!article) return null;
            return (
              <Pressable
                style={styles.articleItem}
                onPress={() => router.push(`/article/${article.id}`)}
              >
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleBody} numberOfLines={2}>
                  {article.body}
                </Text>
              </Pressable>
            );
          }}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
