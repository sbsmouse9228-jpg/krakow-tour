import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'favorite_place_ids';

interface FavoritesContextValue {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setFavoriteIds(JSON.parse(stored));
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = useCallback((placeId: string) => {
    setFavoriteIds((current) => {
      const next = current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (placeId: string) => favoriteIds.includes(placeId),
    [favoriteIds],
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
