import '../global.css';
import '../i18n';

import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { loadStoredLanguage, setAppLanguage } from '@/i18n';

export default function RootLayout() {
  const { t } = useTranslation();

  useEffect(() => {
    loadStoredLanguage().then((language) => setAppLanguage(language));
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <StatusBar style="dark" />
          <View className="flex-1 items-center bg-gray-200">
            <View className="w-full max-w-md flex-1 bg-white">
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="place/[id]" options={{ headerShown: false }} />
                <Stack.Screen
                  name="itinerary/[id]"
                  options={{ headerShown: true, headerTitle: t('itineraryDetail.title') }}
                />
                <Stack.Screen
                  name="admin/index"
                  options={{ headerShown: true, headerTitle: t('admin.headerTitle') }}
                />
                <Stack.Screen
                  name="review/[placeId]"
                  options={{ headerShown: true, headerTitle: t('review.headerTitle') }}
                />
              </Stack>
            </View>
          </View>
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
