import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { PlaceCard } from '@/components/PlaceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import { usePlaces } from '@/hooks/usePlaces';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { places, loading, error } = usePlaces();
  const { favoriteIds, loading: favoritesLoading } = useFavorites();

  const favoritePlaces = places.filter((place) => favoriteIds.includes(place.id));
  const isLoading = loading || favoritesLoading;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScreenHeader title={t('favorites.title')} subtitle={t('favorites.subtitle')} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#c9741f" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={favoritePlaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">{t('favorites.empty')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
