import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { FavoriteButton } from '@/components/FavoriteButton';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PlaceMiniMap } from '@/components/PlaceMiniMap';
import { supabase } from '@/lib/supabase';
import type { Place, Review } from '@/types/database';

export default function PlaceDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setPlace(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('place_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []));
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#c9741f" />
      </View>
    );
  }

  if (error || !place) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-red-500">{error ?? t('placeDetail.notFound')}</Text>
      </View>
    );
  }

  const openInMaps = () => {
    const label = encodeURIComponent(place.name);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${label}`);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 pt-4">
        {place.image_url ? (
          <Image
            source={{ uri: place.image_url }}
            className="h-64 w-full rounded-2xl"
            resizeMode="cover"
          />
        ) : (
          <View className="h-40 w-full items-center justify-center rounded-2xl bg-brand-100">
            <Text className="text-4xl">🏛️</Text>
          </View>
        )}
      </View>

      <View className="absolute left-4 top-8">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={8}
          className="h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm shadow-black/20"
        >
          <Ionicons name="chevron-back" size={26} color="#374151" />
        </Pressable>
      </View>

      <View className="absolute right-4 top-8 flex-row items-center gap-2">
        <FavoriteButton placeId={place.id} size={22} />
        <LanguageToggle />
      </View>

      <View className="px-4 pb-8 pt-4">
        <View className="mb-2 self-start rounded-full bg-brand-50 px-2 py-0.5">
          <Text className="text-xs font-medium text-brand-700">
            {t(`category.${place.category}`)}
          </Text>
        </View>

        <Text className="text-2xl font-bold text-gray-900">{place.name}</Text>
        {place.name_local ? (
          <Text className="text-sm text-gray-400">{place.name_local}</Text>
        ) : null}

        {place.rating ? (
          <Text className="mt-2 text-sm text-brand-600">⭐ {place.rating.toFixed(1)}</Text>
        ) : null}

        {place.description ? (
          <Text className="mt-3 text-base leading-6 text-gray-700">{place.description}</Text>
        ) : null}

        {place.address ? (
          <Text className="mt-3 text-sm text-gray-500">📍 {place.address}</Text>
        ) : null}

        {place.tags && place.tags.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {place.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs text-gray-600">#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <PlaceMiniMap lat={place.lat} lng={place.lng} title={place.name} />

        <Pressable
          onPress={openInMaps}
          className="mt-4 items-center rounded-xl bg-brand-500 py-3 active:bg-brand-600"
        >
          <Text className="font-semibold text-white">{t('placeDetail.openInMaps')}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push(`/review/${place.id}`)}
          className="mt-3 items-center rounded-xl border border-gray-200 py-3 active:bg-gray-50"
        >
          <Text className="font-semibold text-gray-700">{t('placeDetail.leaveReview')}</Text>
        </Pressable>

        <Text className="mb-2 mt-6 text-lg font-bold text-gray-900">{t('review.listTitle')}</Text>
        {reviews.length === 0 ? (
          <Text className="text-sm text-gray-400">{t('review.empty')}</Text>
        ) : (
          reviews.map((item) => (
            <View key={item.id} className="mb-3 rounded-2xl bg-gray-50 p-4">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-gray-900">
                  {item.author_name ?? t('review.anonymous')}
                </Text>
                {item.rating ? (
                  <Text className="text-xs text-brand-600">{'⭐'.repeat(item.rating)}</Text>
                ) : null}
              </View>
              <Text className="text-sm text-gray-700">{item.message}</Text>
              <Text className="mt-2 text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
