import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { FavorisProvider } from '../FavorisContext';

export default function Layout() {
  return (
    <FavorisProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: '#555',
          tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoris',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="article/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </FavorisProvider>
  );
}