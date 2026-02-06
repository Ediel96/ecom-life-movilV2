import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { createTransaction, deleteTransactionThunk, updateTransactionThunk } from '../store/slices/transactionsSlice';
import { useTranslation } from 'react-i18next';
import { Transaction, FrequencyType } from '../types';

interface LifestyleModalProps {
  visible: boolean;
  onClose: () => void;
}

const FREQUENCIES = [
  { id: 'monthly', labelKey: 'lifestyle.frequency.monthly' },
  { id: 'weekly', labelKey: 'lifestyle.frequency.weekly' },
  { id: 'yearly', labelKey: 'lifestyle.frequency.yearly' },
];

export default function LifestyleModal({ visible, onClose }: LifestyleModalProps) {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.mode);
  const transactions = useAppSelector((state) => state.transactions?.list || []);
  const categories = useAppSelector((state) => state.categories?.list || []);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('monthly');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Transacciones de estilo de vida (lifestyle === true desde la API)
  const lifestyleTransactions = useMemo(() => {
    return transactions
      .filter(t => t.lifestyle === true)
      .map(t => ({
        ...t,
        category: categories.find(c => c.id === t.category_id),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categories]);

  // Transacciones con frecuencia (recurrentes)
  const recurringTransactions = useMemo(() => {
    return lifestyleTransactions.filter(t => t.frequency && t.frequency !== 'none');
  }, [lifestyleTransactions]);

  // Calcular total mensual estimado
  const totalMonthly = useMemo(() => {
    return recurringTransactions.reduce((sum, t) => {
      const freq = t.frequency;
      if (freq === 'monthly' || freq === 'month') return sum + t.amount;
      if (freq === 'weekly' || freq === 'week') return sum + (t.amount * 4);
      if (freq === 'yearly' || freq === 'year') return sum + (t.amount / 12);
      if (freq === 'day') return sum + (t.amount * 30);
      return sum + t.amount;
    }, 0);
  }, [recurringTransactions]);

  // Transacciones lifestyle sin frecuencia (no recurrentes aún)
  const nonRecurringLifestyle = useMemo(() => {
    return lifestyleTransactions
      .filter(t => !t.frequency || t.frequency === 'none')
      .slice(0, 10);
  }, [lifestyleTransactions]);

  const totalLifestyleTransactions = useMemo(() => {
    return lifestyleTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [lifestyleTransactions]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setFrequency('monthly');
    setSelectedCategoryId(null);
    setEditingTransaction(null);
  };

  const handleSave = () => {
    if (!amount || !selectedCategoryId) {
      Alert.alert(t('common.error'), t('lifestyle.alerts.fillFields'));
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert(t('common.error'), t('lifestyle.alerts.validAmount'));
      return;
    }

    const now = new Date().toISOString();
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    if (editingTransaction) {
      // Actualizar transacción existente vía API
      dispatch(updateTransactionThunk({
        ...editingTransaction,
        description: description || selectedCategory?.name || '',
        amount: amountNum,
        category_id: selectedCategoryId,
        frequency,
        lifestyle: true,
      }));
    } else {
      // Crear nueva transacción lifestyle vía API
      dispatch(createTransaction({
        description: description || selectedCategory?.name || '',
        amount: amountNum,
        category_id: selectedCategoryId,
        account_id: 1,
        user_id: '',
        date: now,
        transaction_type: 'expense',
        notification: false,
        notification_date: null,
        frequency,
        lifestyle: true,
      }));
    }

    resetForm();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description || '');
    setAmount(transaction.amount.toString());
    setFrequency(transaction.frequency || 'monthly');
    setSelectedCategoryId(transaction.category_id);
  };

  const handleDelete = (transactionId: number) => {
    Alert.alert(
      t('lifestyle.alerts.deleteTitle'),
      t('lifestyle.alerts.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTransactionThunk(transactionId));
          },
        },
      ]
    );
  };

  // Marcar una transacción existente como recurrente (actualizar vía API)
  const handleMakeRecurring = (transaction: Transaction) => {
    Alert.alert(
      t('lifestyle.alerts.makeRecurringTitle') || 'Hacer Recurrente',
      t('lifestyle.alerts.makeRecurringMessage') || '¿Marcar esta transacción como gasto recurrente?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm') || 'Confirmar',
          onPress: () => {
            dispatch(updateTransactionThunk({
              ...transaction,
              frequency: 'monthly',
              lifestyle: true,
            }));
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark ? styles.modalDark : styles.modalLight]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.textWhite : styles.textDark]}>
              {t('lifestyle.title')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Total Monthly */}
            <View style={[styles.totalCard, isDark ? styles.totalCardDark : styles.totalCardLight]}>
              <Text style={[styles.totalLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                {t('lifestyle.totalMonthly')}
              </Text>
              <Text style={[styles.totalAmount, styles.textGreen]}>
                ${totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Text>
            </View>

            {/* Category Selector - Usa categorías del sistema */}
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              {t('common.category')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.filter(c => c.transaction_type === 'expense').map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategoryId(category.id)}
                  style={[
                    styles.categoryItem,
                    selectedCategoryId === category.id && [styles.categoryItemSelected, { borderColor: category.color_fill }],
                    isDark ? styles.categoryItemDark : styles.categoryItemLight,
                  ]}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color_fill }]}>
                    <Text style={styles.categoryIconLarge}>{category.icon}</Text>
                  </View>
                  <Text style={[styles.categoryLabel, isDark ? styles.textWhite : styles.textDark]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>{t('common.description')}</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('lifestyle.placeholders.name', { category: '' })}
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>{t('common.amount')} {t('lifestyle.currency')}</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder={t('lifestyle.placeholders.amount')}
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Frequency */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>{t('lifestyle.frequency.label')}</Text>
              <View style={styles.frequencyContainer}>
                {FREQUENCIES.map((freq) => (
                  <TouchableOpacity
                    key={freq.id}
                    onPress={() => setFrequency(freq.id as any)}
                    style={[
                      styles.frequencyButton,
                      frequency === freq.id && styles.frequencyButtonActive,
                      isDark ? styles.frequencyButtonDark : styles.frequencyButtonLight,
                    ]}
                  >
                    <Text
                      style={[
                        styles.frequencyText,
                        frequency === freq.id ? styles.frequencyTextActive : (isDark ? styles.textGray : styles.textGrayDark),
                      ]}
                    >
                      {t(freq.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                {editingTransaction ? t('lifestyle.updateExpense') : t('lifestyle.addExpense')}
              </Text>
            </TouchableOpacity>

            {/* Recurring Transactions List */}
            {recurringTransactions.length > 0 && (
              <View style={styles.expensesList}>
                <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                  {t('lifestyle.recurringExpenses')}
                </Text>
                {recurringTransactions.map((transaction) => (
                  <View
                    key={transaction.id}
                    style={[styles.expenseCard, isDark ? styles.expenseCardDark : styles.expenseCardLight]}
                  >
                    <View style={styles.expenseContent}>
                      <View style={[styles.expenseIconContainer, { backgroundColor: transaction.category?.color_fill || '#10B981' }]}>
                        <Text style={styles.expenseIcon}>{transaction.category?.icon || '💰'}</Text>
                      </View>
                      <View style={styles.expenseInfo}>
                        <Text style={[styles.expenseName, isDark ? styles.textWhite : styles.textDark]}>
                          {transaction.description || transaction.category?.name || 'Unknown'}
                        </Text>
                        <Text style={[styles.expenseFrequency, isDark ? styles.textGray : styles.textGrayDark]}>
                          {t(`lifestyle.frequency.${transaction.frequency}`)}
                        </Text>
                      </View>
                      <Text style={[styles.expenseAmount, styles.textGreen]}>
                        ${transaction.amount.toLocaleString('en-US')}
                      </Text>
                    </View>
                    <View style={styles.expenseActions}>
                      <TouchableOpacity onPress={() => handleEdit(transaction)} style={styles.actionBtn}>
                        <Text style={styles.actionText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(transaction.id)} style={styles.actionBtn}>
                        <Text style={styles.actionText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Lifestyle Transactions (not yet recurring) */}
            {nonRecurringLifestyle.length > 0 && (
              <View style={styles.transactionsList}>
                <View style={styles.transactionsHeader}>
                  <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                    {t('lifestyle.lifestyleTransactions')}
                  </Text>
                  <View style={[styles.totalBadge, isDark ? styles.totalBadgeDark : styles.totalBadgeLight]}>
                    <Text style={[styles.totalBadgeText, styles.textRed]}>
                      ${totalLifestyleTransactions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                </View>
                {nonRecurringLifestyle.map((transaction) => (
                  <TouchableOpacity
                    key={transaction.id}
                    onPress={() => handleMakeRecurring(transaction)}
                    style={[styles.transactionCard, isDark ? styles.transactionCardDark : styles.transactionCardLight]}
                  >
                    <View style={styles.transactionContent}>
                      <View style={[styles.transactionIconContainer, { backgroundColor: transaction.category?.color_fill || '#10B981' }]}>
                        <Text style={styles.transactionIcon}>{transaction.category?.icon || '💰'}</Text>
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={[styles.transactionName, isDark ? styles.textWhite : styles.textDark]}>
                          {transaction.category?.name || 'Desconocido'}
                        </Text>
                        <Text style={[styles.transactionDate, isDark ? styles.textGray : styles.textGrayDark]}>
                          {transaction.date ? format(parseISO(transaction.date), 'dd MMM yyyy, HH:mm') : ''}
                        </Text>
                        {transaction.description && (
                          <Text style={[styles.transactionDescription, isDark ? styles.textGray : styles.textGrayDark]}>
                            {transaction.description}
                          </Text>
                        )}
                      </View>
                      <View style={styles.makeRecurringHint}>
                        <Text style={[styles.makeRecurringText, isDark ? styles.textGray : styles.textGrayDark]}>
                          🔄
                        </Text>
                        <Text style={[styles.transactionAmount, styles.textRed]}>
                          -${Math.abs(transaction.amount).toLocaleString('en-US')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                <Text style={[styles.hintText, isDark ? styles.textGray : styles.textGrayDark]}>
                  {t('lifestyle.tapToMakeRecurring') || 'Toca una transacción para hacerla recurrente'}
                </Text>
              </View>
            )}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#111827' },
  textGray: { color: '#9CA3AF' },
  textGrayDark: { color: '#6B7280' },
  textGreen: { color: '#10B981' },
  totalCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  totalCardDark: {
    backgroundColor: '#0F172A',
  },
  totalCardLight: {
    backgroundColor: '#F9FAFB',
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryItemDark: {
    backgroundColor: '#0F172A',
  },
  categoryItemLight: {
    backgroundColor: '#F9FAFB',
  },
  categoryItemSelected: {
    borderWidth: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconLarge: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  inputDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  inputLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  frequencyButtonDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  frequencyButtonLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  frequencyButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  frequencyTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expensesList: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  expenseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  expenseCardDark: {
    backgroundColor: '#0F172A',
  },
  expenseCardLight: {
    backgroundColor: '#F9FAFB',
  },
  expenseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIcon: {
    fontSize: 22,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseFrequency: {
    fontSize: 12,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 8,
  },
  actionText: {
    fontSize: 20,
  },
  transactionsList: {
    marginTop: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  totalBadgeDark: {
    backgroundColor: '#0F172A',
  },
  totalBadgeLight: {
    backgroundColor: '#FEE2E2',
  },
  totalBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textRed: {
    color: '#EF4444',
  },
  transactionCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  transactionCardDark: {
    backgroundColor: '#0F172A',
  },
  transactionCardLight: {
    backgroundColor: '#F9FAFB',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    fontSize: 22,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  makeRecurringHint: {
    alignItems: 'flex-end',
  },
  makeRecurringText: {
    fontSize: 16,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
