import { Pressable, ScrollView, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { PlaceCategory } from '@/types/database';

export function CategoryFilterChips({
  categories,
  selected,
  onSelect,
}: {
  categories: PlaceCategory[];
  selected: PlaceCategory | 'all';
  onSelect: (category: PlaceCategory | 'all') => void;
}) {
  const { t } = useTranslation();
  const options: (PlaceCategory | 'all')[] = ['all', ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="mb-2 h-14"
    >
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            className={`h-14 items-center justify-center rounded-full border px-4 ${
              isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-white'
            }`}
          >
            <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
              {option === 'all' ? t('common.all') : t(`category.${option}`)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
