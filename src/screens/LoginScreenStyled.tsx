import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
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
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isDark ? styles.bgDark : styles.bgLight}
      >
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              OrganizeLife
            </Text>
            <Text style={styles.tagline}>
              Organiza tus finanzas fácilmente
            </Text>
          </View>

          {/* Auth Card */}
          <View style={[styles.card, styles.shadow, !isDark && styles.cardLight]}>
            <Text style={[styles.cardTitle, !isDark && styles.cardTitleLight]}>
              {isLogin ? 'Sign in' : 'Create account'}
            </Text>
            <Text style={[styles.cardSubtitle, !isDark && styles.cardSubtitleLight]}>
              {isLogin ? 'Enter your email below to sign in' : 'Enter your details to create an account'}
            </Text>

            {/* OAuth Buttons */}
            <View style={styles.oauthContainer}>
              <TouchableOpacity style={[styles.oauthButton, !isDark && styles.oauthButtonLight]}>
                <Text style={styles.emoji}>👤</Text>
                <Text style={[styles.oauthButtonText, !isDark && styles.oauthButtonTextLight]}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.oauthButton, !isDark && styles.oauthButtonLight]}>
                <Text style={styles.emoji}>🔍</Text>
                <Text style={[styles.oauthButtonText, !isDark && styles.oauthButtonTextLight]}>Google</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, !isDark && styles.dividerLineLight]} />
              <Text style={[styles.dividerText, !isDark && styles.dividerTextLight]}>OR CONTINUE WITH</Text>
              <View style={[styles.dividerLine, !isDark && styles.dividerLineLight]} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, !isDark && styles.labelLight]}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, !isDark && styles.inputLight]}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, !isDark && styles.labelLight]}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#6B7280"
                secureTextEntry
                style={[styles.input, !isDark && styles.inputLight]}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleAuth}
              style={[styles.button, styles.primaryButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              style={[styles.button, styles.primaryButton, styles.mt3]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Create account' : 'Back to Login'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={[styles.footer, !isDark && styles.footerLight]}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bgDark: {
    backgroundColor: '#111827', // gray-900
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logoContainer: {
    width: '100%',
    maxWidth: 448,
    marginBottom: 32,
  },
  logoText: {
    color: '#10B981', // green-500
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    color: '#9CA3AF', // gray-400
    fontSize: 16,
  },
  card: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: '#1F2937', // gray-800
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: '#374151', // gray-700
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 24,
  },
  oauthContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  oauthButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  oauthButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4B5563',
  },
  dividerText: {
    color: '#9CA3AF',
    paddingHorizontal: 16,
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: 'white',
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#10B981', // green-500
  },
  primaryButtonText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mt3: {
    marginTop: 12,
  },
  footer: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 32,
    textAlign: 'center',
  },
  /* Light theme overrides */
  bgLight: {
    backgroundColor: '#F9FAFB',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardTitleLight: {
    color: '#111827',
  },
  cardSubtitleLight: {
    color: '#6B7280',
  },
  oauthButtonLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  oauthButtonTextLight: {
    color: '#111827',
  },
  dividerLineLight: {
    backgroundColor: '#E5E7EB',
  },
  dividerTextLight: {
    color: '#6B7280',
  },
  labelLight: {
    color: '#111827',
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    color: '#111827',
  },
  taglineLight: {
    color: '#6B7280',
  },
  footerLight: {
    color: '#6B7280',
  },
});
