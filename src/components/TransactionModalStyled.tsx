import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addTransaction } from '../store/slices/transactionsSlice';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TransactionModal({ visible, onClose }: TransactionModalProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories.list);
  const dispatch = useAppDispatch();

  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('Cash');

  const isDark = theme === 'dark';

  const handleSave = () => {
    if (!description || !amount || !selectedCategoryId) {
      alert('Please fill all required fields');
      return;
    }

    dispatch(
      addTransaction({
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        date,
        type: transactionType,
      })
    );

    // Reset form
    setDescription('');
    setAmount('');
    setSelectedCategoryId('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark ? styles.modalDark : styles.modalLight]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.textWhite : styles.textDark]}>
              New Transaction
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Transaction Type Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setTransactionType('expense')}
                style={[
                  styles.toggleButton,
                  transactionType === 'expense'
                    ? styles.toggleActive
                    : (isDark ? styles.toggleInactive : styles.toggleInactiveLight)
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    transactionType === 'expense' ? styles.toggleTextActive : (isDark ? styles.textGray : styles.textGrayDark)
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTransactionType('income')}
                style={[
                  styles.toggleButton,
                  transactionType === 'income'
                    ? styles.toggleActive
                    : (isDark ? styles.toggleInactive : styles.toggleInactiveLight)
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    transactionType === 'income' ? styles.toggleTextActive : (isDark ? styles.textGray : styles.textGrayDark)
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Amount
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="decimal-pad"
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryItem,
                      selectedCategoryId === category.id && styles.categoryItemSelected,
                      isDark ? styles.categoryItemDark : styles.categoryItemLight
                    ]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                      <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    </View>
                    <Text style={[styles.categoryName, isDark ? styles.textWhite : styles.textDark]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Account Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Account
              </Text>
              <TextInput
                value={account}
                onChangeText={setAccount}
                placeholder="Select account"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Date
              </Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.buttonCancel, isDark ? styles.buttonCancelDark : styles.buttonCancelLight]}
            >
              <Text style={[styles.buttonText, isDark ? styles.textWhite : styles.textDark]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.buttonSave]}>
              <Text style={[styles.buttonText, styles.buttonTextSave]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  modalDark: {
    backgroundColor: '#1F2937',
  },
  modalLight: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  scrollView: {
    maxHeight: 500,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleInactive: {
    backgroundColor: '#374151',
  },
  toggleInactiveLight: {
    backgroundColor: '#F3F4F6',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputDark: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  inputLight: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryItemDark: {
    backgroundColor: '#374151',
  },
  categoryItemLight: {
    backgroundColor: '#F9FAFB',
  },
  categoryItemSelected: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonCancel: {
    borderWidth: 1,
  },
  buttonCancelDark: {
    borderColor: '#4B5563',
  },
  buttonCancelLight: {
    borderColor: '#E5E7EB',
  },
  buttonSave: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSave: {
    color: '#FFFFFF',
  },
});
