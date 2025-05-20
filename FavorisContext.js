// FavorisContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const FavorisContext = createContext();

export const FavorisProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
        console.error('Erreur chargement favoris :', err);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (articleId) => {
    const updated = favorites.includes(articleId)
      ? favorites.filter(id => id !== articleId)
      : [...favorites, articleId];

    setFavorites(updated);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (err) {
      console.error('Erreur sauvegarde favoris :', err);
    }
  };

  return (
    <FavorisContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavorisContext.Provider>
  );
};
