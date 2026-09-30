import { Text, TextInput, View } from 'react-native';

export function FormField({
  label,
  value,
  onChangeText,
  required,
  multiline,
  keyboardType,
  autoCapitalize,
  placeholder,
  noMargin,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'numbers-and-punctuation' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
  placeholder?: string;
  noMargin?: boolean;
}) {
  return (
    <View className={noMargin ? '' : 'mb-4'}>
      <Text className="mb-1 text-sm font-medium text-gray-600">
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className={`rounded-xl border border-gray-200 px-3 py-2 text-base text-gray-900 ${
          multiline ? 'h-24' : ''
        }`}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}
