/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
     ActivityIndicator,
     FlatList,
     SafeAreaView,
     ScrollView,
     Text,
     TouchableOpacity,
     View,
} from 'react-native';
import { styles } from '../../styles/styles';

const API_URL = 'https://jsonplaceholder.typicode.com';

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorArticle, setErrorArticle] = useState(null);
  const [errorComments, setErrorComments] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        setArticle(response.data);
        setLoadingArticle(false);
      } catch (err) {
          setErrorArticle("Erreur lors du chargement de l'article.");
          setLoadingArticle(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments?postId=${id}`);
        setComments(response.data);
        setLoadingComments(false);
      } catch (err) {
        setErrorComments("Erreur lors du chargement des commentaires.");
        setLoadingComments(false);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id]);

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentName}>{item.name}</Text>
      <Text style={styles.commentEmail}>{item.email}</Text>
      <Text style={styles.commentBody}>{item.body}</Text>
    </View>
  );

  if (loadingArticle) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (errorArticle) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorArticle}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#007bff', marginBottom: 20 }}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleBody}>{article.body}</Text>

        <Text style={styles.commentsHeader}>💬 Commentaires</Text>

        {loadingComments ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : errorComments ? (
          <Text style={styles.errorText}>{errorComments}</Text>
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
