import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Inquiry, Review, PlaceCategory } from '@/types/database';

const CATEGORIES: PlaceCategory[] = ['landmark', 'museum', 'church', 'park', 'food', 'cafe'];

export default function AdminScreen() {
  const { session, loading, signIn, signOut } = useAuth();
  const [tab, setTab] = useState<'newPlace' | 'review' | 'inquiry'>('newPlace');

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#c9741f" />
      </SafeAreaView>
    );
  }

  if (!session) {
    return <LoginForm onSignIn={signIn} />;
  }

  return (
    <AdminHome tab={tab} onTabChange={setTab} onSignOut={signOut} />
  );
}

function LoginForm({
  onSignIn,
}: {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await onSignIn(email.trim(), password);
    if (signInError) setError(signInError);
    setSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6" edges={['top']}>
      <View className="flex-1 justify-center">
        <Text className="mb-6 text-2xl font-bold text-gray-900">{t('admin.loginTitle')}</Text>

        <Text className="mb-1 text-sm font-medium text-gray-600">{t('admin.email')}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="mb-4 rounded-xl border border-gray-200 px-3 py-2 text-base text-gray-900"
        />

        <Text className="mb-1 text-sm font-medium text-gray-600">{t('admin.password')}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-4 rounded-xl border border-gray-200 px-3 py-2 text-base text-gray-900"
        />

        {error ? <Text className="mb-4 text-sm text-red-500">{error}</Text> : null}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting || !email || !password}
          className="items-center rounded-xl bg-brand-500 py-3 active:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">{t('admin.signIn')}</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function AdminHome({
  tab,
  onTabChange,
  onSignOut,
}: {
  tab: 'newPlace' | 'review' | 'inquiry';
  onTabChange: (tab: 'newPlace' | 'review' | 'inquiry') => void;
  onSignOut: () => Promise<void>;
}) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 pt-4">
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => onTabChange('newPlace')}
            className={`rounded-full border px-3 py-1.5 ${
              tab === 'newPlace' ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                tab === 'newPlace' ? 'text-white' : 'text-gray-600'
              }`}
            >
              {t('admin.newPlaceTabLabel')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTabChange('review')}
            className={`rounded-full border px-3 py-1.5 ${
              tab === 'review' ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                tab === 'review' ? 'text-white' : 'text-gray-600'
              }`}
            >
              {t('admin.reviewTabLabel')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTabChange('inquiry')}
            className={`rounded-full border px-3 py-1.5 ${
              tab === 'inquiry' ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                tab === 'inquiry' ? 'text-white' : 'text-gray-600'
              }`}
            >
              {t('admin.inquiryTabLabel')}
            </Text>
          </Pressable>
        </View>
        <Pressable onPress={onSignOut}>
          <Text className="text-sm text-brand-600">{t('admin.signOut')}</Text>
        </Pressable>
      </View>

      {tab === 'newPlace' ? <NewPlaceForm /> : tab === 'review' ? <ReviewList /> : <InquiryList />}
    </SafeAreaView>
  );
}

function NewPlaceForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [nameLocal, setNameLocal] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('landmark');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState('');
  const [priceLevel, setPriceLevel] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetForm = () => {
    setName('');
    setNameLocal('');
    setCategory('landmark');
    setDescription('');
    setAddress('');
    setLat('');
    setLng('');
    setImageUrl('');
    setRating('');
    setPriceLevel('');
    setTags('');
  };

  const handleSubmit = async () => {
    setMessage(null);

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!name.trim() || Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      setMessage({ type: 'error', text: t('admin.validationError') });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('places').insert({
      name: name.trim(),
      name_local: nameLocal.trim() || null,
      category,
      description: description.trim() || null,
      address: address.trim() || null,
      lat: latNum,
      lng: lngNum,
      image_url: imageUrl.trim() || null,
      rating: rating.trim() ? parseFloat(rating) : null,
      price_level: priceLevel.trim() ? parseInt(priceLevel, 10) : null,
      tags: tags.trim()
        ? tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : null,
    });

    setSubmitting(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: t('admin.createSuccess') });
      resetForm();
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="mb-4 text-2xl font-bold text-gray-900">{t('admin.newPlaceTitle')}</Text>

      <FormField label={t('admin.fields.name')} value={name} onChangeText={setName} required />
      <FormField label={t('admin.fields.nameLocal')} value={nameLocal} onChangeText={setNameLocal} />

      <Text className="mb-1 text-sm font-medium text-gray-600">{t('admin.fields.category')}</Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {CATEGORIES.map((option) => (
          <Pressable
            key={option}
            onPress={() => setCategory(option)}
            className={`rounded-full border px-3 py-1.5 ${
              category === option ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                category === option ? 'text-white' : 'text-gray-600'
              }`}
            >
              {t(`category.${option}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FormField
        label={t('admin.fields.description')}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <FormField label={t('admin.fields.address')} value={address} onChangeText={setAddress} />

      <View className="mb-4 flex-row gap-3">
        <View className="flex-1">
          <FormField
            label={t('admin.fields.lat')}
            value={lat}
            onChangeText={setLat}
            keyboardType="numbers-and-punctuation"
            required
            noMargin
          />
        </View>
        <View className="flex-1">
          <FormField
            label={t('admin.fields.lng')}
            value={lng}
            onChangeText={setLng}
            keyboardType="numbers-and-punctuation"
            required
            noMargin
          />
        </View>
      </View>

      <FormField
        label={t('admin.fields.imageUrl')}
        value={imageUrl}
        onChangeText={setImageUrl}
        autoCapitalize="none"
      />

      <View className="mb-4 flex-row gap-3">
        <View className="flex-1">
          <FormField
            label={t('admin.fields.rating')}
            value={rating}
            onChangeText={setRating}
            keyboardType="numbers-and-punctuation"
            noMargin
          />
        </View>
        <View className="flex-1">
          <FormField
            label={t('admin.fields.priceLevel')}
            value={priceLevel}
            onChangeText={setPriceLevel}
            keyboardType="numbers-and-punctuation"
            noMargin
          />
        </View>
      </View>

      <FormField
        label={t('admin.fields.tags')}
        value={tags}
        onChangeText={setTags}
        placeholder="history, must-see"
      />

      {message ? (
        <Text
          className={`mb-4 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}
        >
          {message.text}
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
          <Text className="font-semibold text-white">{t('admin.submit')}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function ReviewList() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*, place:places(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setReviews((data as unknown as Review[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#c9741f" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="mb-4 text-2xl font-bold text-gray-900">{t('admin.reviewTitle')}</Text>

      {reviews.length === 0 ? (
        <Text className="mt-10 text-center text-gray-400">{t('admin.reviewEmpty')}</Text>
      ) : (
        reviews.map((item) => (
          <View key={item.id} className="mb-3 rounded-2xl bg-gray-50 p-4">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                {item.place?.name ?? t('admin.reviewUnknownPlace')}
              </Text>
              {item.rating ? (
                <Text className="text-xs text-brand-600">{'⭐'.repeat(item.rating)}</Text>
              ) : null}
            </View>
            <Text className="text-sm text-gray-700">{item.message}</Text>
            <Text className="mt-2 text-xs text-gray-400">
              {item.author_name ? `${item.author_name} · ` : ''}
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function InquiryList() {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('inquiries')
      .select('*, place:places(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setInquiries((data as unknown as Inquiry[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#c9741f" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="mb-4 text-2xl font-bold text-gray-900">{t('admin.inquiryTitle')}</Text>

      {inquiries.length === 0 ? (
        <Text className="mt-10 text-center text-gray-400">{t('admin.inquiryEmpty')}</Text>
      ) : (
        inquiries.map((item) => (
          <View key={item.id} className="mb-3 rounded-2xl bg-gray-50 p-4">
            <Text className="mb-1 text-sm font-semibold text-gray-900">
              {item.place?.name ?? t('admin.inquiryUnknownPlace')}
            </Text>
            <Text className="text-sm text-gray-700">{item.message}</Text>
            <Text className="mt-2 text-xs text-gray-400">
              {item.author_name ? `${item.author_name} · ` : ''}
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
