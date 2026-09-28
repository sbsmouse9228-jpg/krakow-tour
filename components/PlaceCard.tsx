import { Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { Place, PlaceCategory } from '@/types/database';

const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  landmark: '명소',
  museum: '박물관',
  church: '성당',
  park: '공원',
  food: '맛집',
  cafe: '카페',
};

export function PlaceCard({ place }: { place: Place }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/place/${place.id}`)}
      className="mb-3 flex-row overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/10"
    >
      {place.image_url ? (
        <Image source={{ uri: place.image_url }} className="h-24 w-24" resizeMode="cover" />
      ) : (
        <View className="h-24 w-24 items-center justify-center bg-brand-100">
          <Text className="text-2xl">🏛️</Text>
        </View>
      )}
      <View className="flex-1 justify-center px-3 py-2">
        <View className="mb-1 self-start rounded-full bg-brand-50 px-2 py-0.5">
          <Text className="text-xs font-medium text-brand-700">
            {CATEGORY_LABEL[place.category]}
          </Text>
        </View>
        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
          {place.name}
        </Text>
        {place.address ? (
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {place.address}
          </Text>
        ) : null}
        {place.rating ? (
          <Text className="mt-1 text-xs text-brand-600">⭐ {place.rating.toFixed(1)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
