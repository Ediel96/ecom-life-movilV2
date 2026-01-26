import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text as RNText } from 'react-native';
import { useAppSelector } from '../store/hooks';
import DashboardScreen from '../screens/DashboardScreenStyled';
import CategoriesScreen from '../screens/CategoriesScreenStyled';
import AccountsScreen from '../screens/AccountsScreenStyled';
import GoalsScreen from '../screens/GoalsScreen';
import SettingsScreen from '../screens/SettingsScreenStyled';
import LoginScreen from '../screens/LoginScreenStyled';

export type RootTabParamList = {
  Dashboard: undefined;
  Categories: undefined;
  Accounts: undefined;
  Goals: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  const theme = useAppSelector((state) => state.theme.mode);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isDark = theme === 'dark';

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: '#00942A',
          background: isDark ? '#1a1a1a' : '#ffffff',
          card: isDark ? '#2d2d2d' : '#ffffff',
          text: isDark ? '#ffffff' : '#000000',
          border: isDark ? '#3d3d3d' : '#e0e0e0',
          notification: '#00942A',
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#00942A',
          tabBarInactiveTintColor: isDark ? '#888' : '#666',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
          },
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ 
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color }) => <RNText style={{ fontSize: 24 }}>📊</RNText>
          }}
        />
        <Tab.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={{ 
            tabBarLabel: 'Categories',
            tabBarIcon: ({ color }) => <RNText style={{ fontSize: 24 }}>📂</RNText>
          }}
        />
        <Tab.Screen 
          name="Accounts" 
          component={AccountsScreen}
          options={{ 
            tabBarLabel: 'Accounts',
            tabBarIcon: ({ color }) => <RNText style={{ fontSize: 24 }}>💳</RNText>
          }}
        />
        <Tab.Screen 
          name="Goals" 
          component={GoalsScreen}
          options={{ 
            tabBarLabel: 'Goals',
            tabBarIcon: ({ color }) => <RNText style={{ fontSize: 24 }}>🎯</RNText>
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => <RNText style={{ fontSize: 24 }}>⚙️</RNText>
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
