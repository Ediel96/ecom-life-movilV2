import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 px-4 pt-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Text className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Ajustes
      </Text>

      {/* Theme Toggle */}
      <View className={`rounded-2xl p-4 mb-4 flex-row justify-between items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Modo Oscuro
        </Text>
        <Switch
          value={isDark}
          onValueChange={() => dispatch(toggleTheme())}
          trackColor={{ false: '#ccc', true: '#00942A' }}
          thumbColor={isDark ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* User Info */}
      {isAuthenticated && user && (
        <View className={`rounded-2xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Usuario
          </Text>
          <Text className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            {user.name || 'Usuario Demo'}
          </Text>
        </View>
      )}

      {/* Logout Button */}
      {isAuthenticated && (
        <TouchableOpacity
          onPress={() => dispatch(logout())}
          className="bg-red-500 rounded-2xl p-4 items-center"
        >
          <Text className="text-white text-lg font-bold">Cerrar Sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
