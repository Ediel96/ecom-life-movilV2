import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  count: number;
  spent: number;
}

export default function CategoryCard({ category, count, spent }: CategoryCardProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === 'dark';

  const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;

  return (
    <View className={`rounded-2xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="text-4xl mr-3">{category.icon}</Text>
          <View>
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {category.name}
            </Text>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {count} transacciones
            </Text>
          </View>
        </View>
        <View className="bg-primary-500 rounded-full w-8 h-8 items-center justify-center">
          <Text className="text-white font-bold">{count}</Text>
        </View>
      </View>

      <View className="mb-2">
        <View className="flex-row justify-between mb-1">
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            ${spent.toLocaleString()} / ${category.budget.toLocaleString()}
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
        <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <View
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: category.color,
            }}
            className="h-2 rounded-full"
          />
        </View>
      </View>
    </View>
  );
}
