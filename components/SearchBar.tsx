import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="mx-4 mb-2 flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm shadow-black/10">
      <Ionicons name="search" size={18} color="#9ca3af" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('common.searchPlaceholder')}
        placeholderTextColor="#9ca3af"
        className="ml-2 flex-1 text-sm text-gray-900"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}
