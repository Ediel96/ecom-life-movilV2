import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '../store/hooks';

export default function AccountsScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Text className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Cuentas (Próximamente)
      </Text>
    </View>
  );
}
