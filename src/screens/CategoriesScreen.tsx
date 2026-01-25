import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../store/hooks';

export default function CategoriesScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories.list);
  const transactions = useAppSelector((state) => state.transactions.list);
  const [selectedTab, setSelectedTab] = useState<'expenses' | 'income'>('expenses');

  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 px-4 pt-12">
        {/* Header */}
        <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Categories
        </Text>
        <Text className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your expense and income categories
        </Text>

        {/* Tabs */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setSelectedTab('expenses')}
            className={`flex-1 pb-3 border-b-2 ${
              selectedTab === 'expenses' ? 'border-green-500' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                selectedTab === 'expenses' ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('income')}
            className={`flex-1 pb-3 border-b-2 ${
              selectedTab === 'income' ? 'border-green-500' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                selectedTab === 'income' ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category) => {
            const count = transactions.filter(t => t.categoryId === category.id).length;

            return (
              <TouchableOpacity
                key={category.id}
                className={`w-[48%] rounded-2xl p-6 mb-4 border-2 border-dashed items-center ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                {/* Notification Badge */}
                {count > 0 && (
                  <View className="absolute top-3 right-3 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{count}</Text>
                  </View>
                )}
                
                {/* Icon */}
                <View 
                  className="w-16 h-16 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: category.color }}
                >
                  <Text className="text-3xl">{category.icon}</Text>
                </View>

                {/* Category Name */}
                <Text className={`text-center font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Add Category Placeholder */}
          <TouchableOpacity
            className={`w-[48%] rounded-2xl p-6 mb-4 border-2 border-dashed items-center justify-center ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            }`}
            style={{ minHeight: 140 }}
          >
            <Text className="text-4xl mb-2">+</Text>
            <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Add Category
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
