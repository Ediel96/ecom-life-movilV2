import React, { useState, useEffect } from 'react';
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
import { addTransactionLocal } from '../store/slices/transactionsSlice';
import { fetchAccounts } from '../store/slices/accountsSilce';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

const ACCOUNT_TYPES = [
  { id: 'cash', icon: '💵', label: 'Cash' },
  { id: 'bank', icon: '🏦', label: 'Bank' },
  { id: 'debit', icon: '💳', label: 'Debit' },
  { id: 'saving', icon: '🐷', label: 'Saving' },
];

export default function TransactionModal({ visible, onClose }: TransactionModalProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories.list);
  const accounts = useAppSelector((state) => state.accounts.list);
  const dispatch = useAppDispatch();

  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const isDark = theme === 'dark';

  // Fetch accounts when modal opens
  useEffect(() => {
    if (visible) {
      dispatch(fetchAccounts());
    }
  }, [visible, dispatch]);

  // Filter categories by transaction type
  const filteredCategories = categories.filter(
    (category) => category.transaction_type === transactionType
  );

  // Set default account to 'cash' when accounts load
  useEffect(() => {
    if (accounts.length > 0 && selectedAccountId === null) {
      const cashAccount = accounts.find(acc => acc.type === 'cash');
      if (cashAccount) {
        setSelectedAccountId(cashAccount.id);
      } else {
        setSelectedAccountId(accounts[0].id);
      }
    }
  }, [accounts, selectedAccountId]);

  const handleSave = () => {
    if (!description || !amount || !selectedCategoryId || !selectedAccountId) {
      alert('Please fill all required fields');
      return;
    }

    const now = new Date().toISOString();

    dispatch(
      addTransactionLocal({
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category_id: selectedCategoryId,
        account_id: selectedAccountId,
        user_id: '',
        date: now,
        transaction_type: transactionType,
        created_at: now,
        updated_at: now,
      })
    );

    // Reset form
    setDescription('');
    setAmount('');
    setSelectedCategoryId(null);
    setSelectedAccountId(null);
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
                {filteredCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryItem,
                      selectedCategoryId === category.id && styles.categoryItemSelected,
                      isDark ? styles.categoryItemDark : styles.categoryItemLight
                    ]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: category.color_fill }]}>
                      <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    </View>
                    <Text style={[styles.categoryName, isDark ? styles.textWhite : styles.textDark]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Account Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Account
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
                {accounts.map((account) => {
                  // Match account.type with ACCOUNT_TYPES.id or account.account_type
                  const accountType = ACCOUNT_TYPES.find(t => 
                    t.id === account.type || t.id === account.account_type
                  );
                  return (
                    <TouchableOpacity
                      key={account.id}
                      onPress={() => setSelectedAccountId(account.id)}
                      style={[
                        styles.accountItem,
                        selectedAccountId === account.id && styles.accountItemSelected,
                        isDark ? styles.accountItemDark : styles.accountItemLight
                      ]}
                    >
                      <Text style={styles.accountIcon}>
                        {accountType?.icon || '💰'}
                      </Text>
                      <Text style={[styles.accountName, isDark ? styles.textWhite : styles.textDark]}>
                        {account.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
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
  accountScroll: {
    flexDirection: 'row',
  },
  accountItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  accountItemDark: {
    backgroundColor: '#374151',
  },
  accountItemLight: {
    backgroundColor: '#F9FAFB',
  },
  accountItemSelected: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  accountIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  accountName: {
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
