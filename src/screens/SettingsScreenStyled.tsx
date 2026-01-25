import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';

export default function SettingsScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isDark = theme === 'dark';

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
          Settings
        </Text>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Account
          </Text>
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
            <TouchableOpacity style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Profile
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Update your profile information
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Preferences
          </Text>
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
            <View style={styles.settingItem}>
              <View style={styles.flex1}>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Toggle dark theme
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.flex1}>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Notifications
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Enable push notifications
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Currency
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  USD ($)
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Data
          </Text>
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
            <TouchableOpacity style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Export Data
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Download your data as CSV
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Backup
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Backup your data to cloud
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            About
          </Text>
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
            <TouchableOpacity style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Privacy Policy
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Read our privacy policy
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Terms of Service
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  Read our terms
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                  Version
                </Text>
                <Text style={[styles.settingDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                  1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgDark: {
    backgroundColor: '#111827',
  },
  bgLight: {
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#111827',
  },
  textGray: {
    color: '#9CA3AF',
  },
  textGrayDark: {
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  flex1: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
