import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addTransaction } from '../store/slices/transactionsSlice';
import { Category } from '../types';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TransactionModal({ visible, onClose }: TransactionModalProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories.list);

  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const isDark = theme === 'dark';

  const handleSave = () => {
    if (!amount || !selectedCategory) return;

    const newTransaction = {
      id: Date.now().toString(),
      categoryId: selectedCategory.id,
      amount: parseFloat(amount),
      description,
      date,
      type: transactionType,
    };

    dispatch(addTransaction(newTransaction));
    setAmount('');
    setDescription('');
    setSelectedCategory(null);
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View 
          className={`w-full max-w-lg rounded-3xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          style={{ maxHeight: '90%' }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create New Transaction
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Fill in the details below to create a new transaction.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Transaction Type */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Transaction Type
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setTransactionType('expense')}
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                    transactionType === 'expense' ? 'bg-red-500' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text className="text-xl mr-2">💸</Text>
                  <Text
                    className={`font-semibold ${
                      transactionType === 'expense' ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTransactionType('income')}
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                    transactionType === 'income' ? 'bg-green-500' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text className="text-xl mr-2">💰</Text>
                  <Text
                    className={`font-semibold ${
                      transactionType === 'income' ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Description <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="e.g., Grocery shopping"
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={description}
                onChangeText={setDescription}
                className={`border rounded-xl px-4 py-3 text-base ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Amount */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Amount <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center">
                <Text className={`text-xl mr-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>$</Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#888' : '#999'}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  className={`flex-1 border rounded-xl px-4 py-3 text-base ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </View>
            </View>

            {/* Category */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Category <Text className="text-red-500">*</Text>
              </Text>
              <View className={`border rounded-xl px-4 py-3 ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              }`}>
                <Text className={selectedCategory ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-500' : 'text-gray-400')}>
                  {selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : 'Select a category'}
                </Text>
              </View>
              
              {/* Category List */}
              <ScrollView className="mt-3" style={{ maxHeight: 150 }}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat)}
                    className={`flex-row items-center p-3 rounded-xl mb-2 ${
                      selectedCategory?.id === cat.id
                        ? 'bg-green-500'
                        : isDark
                        ? 'bg-gray-700'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text className="text-2xl mr-3">{cat.icon}</Text>
                    <Text
                      className={`text-base ${
                        selectedCategory?.id === cat.id ? 'text-white font-bold' : isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Account (Placeholder) */}
            <View className="mb-5">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account <Text className="text-red-500">*</Text>
              </Text>
              <View className={`border rounded-xl px-4 py-3 ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              }`}>
                <Text className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                  Select an account
                </Text>
              </View>
            </View>

            {/* Date */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Date <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={isDark ? '#888' : '#999'}
                className={`border rounded-xl px-4 py-3 text-base ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className={`flex-1 rounded-xl py-3 items-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-green-500 rounded-xl py-3 items-center"
              >
                <Text className="text-white text-base font-semibold">Create Transaction</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
