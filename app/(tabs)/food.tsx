import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlaceCard } from '@/components/PlaceCard';
import { usePlaces } from '@/hooks/usePlaces';

export default function FoodScreen() {
  const { places, loading, error, refetch } = usePlaces(['food', 'cafe']);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">맛집 &amp; 카페</Text>
        <Text className="text-sm text-gray-500">현지인이 추천하는 맛집과 카페 목록입니다</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#c9741f" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">
              등록된 맛집/카페가 없습니다.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
