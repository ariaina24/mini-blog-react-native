/* eslint-disable no-unused-vars */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
     ActivityIndicator,
     FlatList,
     Pressable,
     SafeAreaView,
     ScrollView,
     Text,
     TextInput,
     TouchableOpacity,
     View,
} from 'react-native';
import { styles } from '../styles/styles';

const API_URL = 'https://jsonplaceholder.typicode.com';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/posts`);
      setArticles(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
    loadFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const toggleFavorite = async (articleId) => {
    let updatedFavorites;
    if (favorites.includes(articleId)) {
      updatedFavorites = favorites.filter((id) => id !== articleId);
    } else {
      updatedFavorites = [...favorites, articleId];
    }
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des favoris:', err);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => router.push(`/article/${item.id}`)}
    >
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleBody} numberOfLines={2}>{item.body}</Text>
      <Pressable
        onPress={() => toggleFavorite(item.id)}
        style={[
          styles.favoriteButton,
          favorites.includes(item.id) && styles.favoriteActive,
        ]}
      >
        <Text style={styles.favoriteText}>
          {favorites.includes(item.id) ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
        </Text>
      </Pressable>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={styles.header}>📝 Mini Blog</Text>
          <TextInput
               style={styles.searchBar}
               placeholder="🔍 Rechercher un article..."
               value={search}
               onChangeText={(text) => setSearch(text)}
          />
          <FlatList
               data={filteredArticles}
               renderItem={renderArticle}
               keyExtractor={(item) => item.id.toString()}
               scrollEnabled={false}
               contentContainerStyle={styles.list}
          />

      </ScrollView>
    </SafeAreaView>
  );
}
