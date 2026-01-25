import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { PieChart } from 'react-native-gifted-charts';
import TransactionModal from '../components/TransactionModal';
import { Category } from '../types';

interface CategoryWithTotal extends Category {
  total: number;
}

export default function DashboardScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories.list);
  const transactions = useAppSelector((state) => state.transactions.list);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'expenses' | 'income'>('expenses');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const isDark = theme === 'dark';

  // Calculate totals per category
  const categoryTotals: CategoryWithTotal[] = categories.map(cat => {
    const total = transactions
      .filter(t => t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...cat, total };
  });

  const totalExpenses = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  // Pie chart data
  const pieData = categoryTotals
    .filter(cat => cat.total > 0)
    .map(cat => ({
      value: cat.total,
      color: cat.color,
      text: cat.name,
    }));

  // Get recent transactions
  const recentTransactions = transactions
    .slice(-5)
    .reverse()
    .map(t => ({
      ...t,
      category: categories.find(c => c.id === t.categoryId),
    }));

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 px-4 pt-12">
        {/* Header */}
        <Text className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          OrganizeLife
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

        {/* Period Selector */}
        <View className="flex-row mb-6 gap-2">
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === period
                  ? 'bg-gray-700 border border-gray-600'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-white'
              }`}
            >
              <Text
                className={
                  selectedPeriod === period
                    ? 'text-white font-semibold'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Expenses Overview Card */}
        <View className={`rounded-2xl p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Expenses Overview
          </Text>
          <Text className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedPeriod} - Current Period
          </Text>
          <Text className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedPeriod} - Current Period
          </Text>

          {/* Donut Chart */}
          {pieData.length > 0 ? (
            <View className="items-center mb-4">
              <PieChart
                data={pieData}
                donut
                radius={120}
                innerRadius={80}
                centerLabelComponent={() => (
                  <View className="items-center">
                    <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${totalExpenses}
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total
                    </Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <View className="items-center py-8">
              <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                No hay transacciones aún
              </Text>
            </View>
          )}

          {/* Trending */}
          <View className="flex-row items-center justify-center mb-4">
            <Text className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Trending up by 5.2% this month 
            </Text>
            <Text className="ml-2">📈</Text>
          </View>

          <Text className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing total expenses for the current {selectedPeriod}
          </Text>
        </View>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <View className="mb-6">
            <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Transactions
            </Text>
            {recentTransactions.map((transaction, index) => (
              <View
                key={transaction.id || index}
                className={`rounded-2xl p-4 mb-3 flex-row items-center justify-between ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-green-500 rounded-full w-12 h-12 items-center justify-center mr-4">
                    <Text className="text-2xl">{transaction.category?.icon || '💰'}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.category?.name || 'Unknown'}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        📅 {transaction.date}
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        💪 {transaction.description || transaction.category?.name}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-red-500 font-bold text-lg">
                  - ${transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 bg-green-500 rounded-full w-16 h-16 items-center justify-center"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>

      <TransactionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}
