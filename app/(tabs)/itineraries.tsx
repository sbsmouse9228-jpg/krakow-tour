import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useItineraries } from '@/hooks/useItineraries';

export default function ItinerariesScreen() {
  const { itineraries, loading, error } = useItineraries();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">추천 일정</Text>
        <Text className="text-sm text-gray-500">여행 일수에 맞는 코스를 선택해보세요</Text>
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
          data={itineraries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/itinerary/${item.id}`)}
              className="mb-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/10"
            >
              <View className="mb-1 self-start rounded-full bg-brand-50 px-2 py-0.5">
                <Text className="text-xs font-medium text-brand-700">
                  {item.duration_days}일 코스
                </Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
              {item.description ? (
                <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </Pressable>
          )}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">등록된 일정이 없습니다.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
