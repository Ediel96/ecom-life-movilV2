import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../store/slices/authSlice';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const isDark = theme === 'dark';

  const handleAuth = () => {
    if (email && password) {
      dispatch(login({ 
        user: { email, name: email.split('@')[0] },
        token: 'demo-token'
      }));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className={isDark ? 'bg-gray-900' : 'bg-gray-900'}
      >
        <View className="flex-1 items-center justify-center px-6 py-12">
          {/* Logo/Title */}
          <View className="w-full max-w-md mb-8">
            <Text className="text-green-500 text-4xl font-bold mb-2">
              OrganizeLife
            </Text>
            <Text className="text-gray-400 text-base">
              Organiza tus finanzas fácilmente
            </Text>
          </View>

          {/* Auth Card */}
          <View 
            className="w-full max-w-md bg-gray-800 rounded-3xl p-8 border border-gray-700"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }}
          >
            <Text className="text-white text-3xl font-bold mb-2">
              {isLogin ? 'Sign in' : 'Create account'}
            </Text>
            <Text className="text-gray-400 text-base mb-6">
              {isLogin ? 'Enter your email below to sign in' : 'Enter your details to create an account'}
            </Text>

            {/* OAuth Buttons */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity className="flex-1 bg-gray-700 border border-gray-600 rounded-xl py-3 flex-row items-center justify-center">
                <Text className="text-2xl mr-2">👤</Text>
                <Text className="text-white font-semibold">Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 bg-gray-700 border border-gray-600 rounded-xl py-3 flex-row items-center justify-center">
                <Text className="text-2xl mr-2">🔍</Text>
                <Text className="text-white font-semibold">Google</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-600" />
              <Text className="text-gray-400 px-4 text-sm">OR CONTINUE WITH</Text>
              <View className="flex-1 h-px bg-gray-600" />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-white font-semibold mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-4 text-white text-base"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#6B7280"
                secureTextEntry
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-4 text-white text-base"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleAuth}
              className="bg-green-500 rounded-xl py-4 items-center mb-3"
              activeOpacity={0.8}
            >
              <Text className="text-gray-900 font-bold text-lg">
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              className="bg-green-500 rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-gray-900 font-bold text-lg">
                {isLogin ? 'Create account' : 'Back to Login'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text className="text-gray-500 text-sm mt-8 text-center">
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
