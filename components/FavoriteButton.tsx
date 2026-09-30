import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useFavorites } from '@/contexts/FavoritesContext';

export function FavoriteButton({ placeId, size = 20 }: { placeId: string; size?: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(placeId);

  return (
    <Pressable
      onPress={() => toggleFavorite(placeId)}
      hitSlop={8}
      className="h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm shadow-black/10"
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={size}
        color={active ? '#ef4444' : '#9ca3af'}
      />
    </Pressable>
  );
}
