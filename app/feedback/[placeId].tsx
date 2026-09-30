import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/FormField';
import { supabase } from '@/lib/supabase';
import type { Place } from '@/types/database';

const RATINGS = [1, 2, 3, 4, 5];

export default function FeedbackScreen() {
  const { t } = useTranslation();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loadingPlace, setLoadingPlace] = useState(true);

  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single()
      .then(({ data }) => {
        setPlace(data);
        setLoadingPlace(false);
      });
  }, [placeId]);

  const handleSubmit = async () => {
    setStatus(null);

    if (!message.trim()) {
      setStatus({ type: 'error', text: t('feedback.validationError') });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('feedback').insert({
      place_id: placeId,
      author_name: authorName.trim() || null,
      rating,
      message: message.trim(),
    });

    setSubmitting(false);

    if (error) {
      setStatus({ type: 'error', text: error.message });
    } else {
      setStatus({ type: 'success', text: t('feedback.success') });
      setAuthorName('');
      setRating(null);
      setMessage('');
    }
  };

  const handleEmail = () => {
    const adminEmail = process.env.EXPO_PUBLIC_ADMIN_EMAIL;
    const subject = encodeURIComponent(`[Kraków Guide] ${place?.name ?? ''}`);
    const body = encodeURIComponent(
      `${authorName ? `${authorName}\n` : ''}${rating ? `★${rating}\n` : ''}${message}`,
    );
    Linking.openURL(`mailto:${adminEmail}?subject=${subject}&body=${body}`);
  };

  if (loadingPlace) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#c9741f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-1 text-2xl font-bold text-gray-900">{t('feedback.title')}</Text>
        {place ? <Text className="mb-4 text-sm text-gray-500">{place.name}</Text> : null}

        <FormField label={t('feedback.authorName')} value={authorName} onChangeText={setAuthorName} />

        <Text className="mb-1 text-sm font-medium text-gray-600">{t('feedback.ratingLabel')}</Text>
        <View className="mb-4 flex-row gap-2">
          {RATINGS.map((value) => (
            <Pressable
              key={value}
              onPress={() => setRating(rating === value ? null : value)}
              className={`h-10 w-10 items-center justify-center rounded-full border ${
                rating !== null && value <= rating
                  ? 'border-brand-500 bg-brand-500'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  rating !== null && value <= rating ? 'text-white' : 'text-gray-600'
                }`}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </View>

        <FormField
          label={t('feedback.messageLabel')}
          value={message}
          onChangeText={setMessage}
          multiline
          required
        />

        {status ? (
          <Text className={`mb-4 text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
            {status.text}
          </Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          className="mb-3 items-center rounded-xl bg-brand-500 py-3 active:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">{t('feedback.submit')}</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleEmail}
          className="items-center rounded-xl border border-gray-200 py-3 active:bg-gray-50"
        >
          <Text className="font-semibold text-gray-700">{t('feedback.emailButton')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
