import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/FormField';
import { supabase } from '@/lib/supabase';
import type { Place } from '@/types/database';

export default function InquiryScreen() {
  const { t } = useTranslation();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loadingPlace, setLoadingPlace] = useState(true);

  const [authorName, setAuthorName] = useState('');
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
      setStatus({ type: 'error', text: t('inquiry.validationError') });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('inquiries').insert({
      place_id: placeId,
      author_name: authorName.trim() || null,
      message: message.trim(),
    });

    setSubmitting(false);

    if (error) {
      setStatus({ type: 'error', text: error.message });
    } else {
      setStatus({ type: 'success', text: t('inquiry.success') });
      setAuthorName('');
      setMessage('');
    }
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
        <Text className="mb-1 text-2xl font-bold text-gray-900">{t('inquiry.title')}</Text>
        {place ? <Text className="mb-4 text-sm text-gray-500">{place.name}</Text> : null}

        <FormField label={t('inquiry.authorName')} value={authorName} onChangeText={setAuthorName} />

        <FormField
          label={t('inquiry.messageLabel')}
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
          className="items-center rounded-xl bg-brand-500 py-3 active:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">{t('inquiry.submit')}</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
