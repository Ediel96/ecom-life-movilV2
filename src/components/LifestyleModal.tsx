import React, { useState, useEffect } from 'react';
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
import { addLifestyleExpense, updateLifestyleExpense, deleteLifestyleExpense, LifestyleExpense } from '../store/slices/lifestyleSlice';

interface LifestyleModalProps {
  visible: boolean;
  onClose: () => void;
}

const LIFESTYLE_CATEGORIES = [
  { id: 'rent', icon: '🏠', label: 'Arriendo', color: '#3B82F6' },
  { id: 'groceries', icon: '🛒', label: 'Mercado', color: '#10B981' },
  { id: 'utilities', icon: '💡', label: 'Servicios', color: '#F59E0B' },
  { id: 'water', icon: '💧', label: 'Agua', color: '#06B6D4' },
  { id: 'internet', icon: '📡', label: 'Internet', color: '#8B5CF6' },
  { id: 'phone', icon: '📱', label: 'Teléfono', color: '#EC4899' },
  { id: 'transport', icon: '🚗', label: 'Transporte', color: '#EF4444' },
  { id: 'subscription', icon: '📺', label: 'Suscripciones', color: '#6366F1' },
];

const FREQUENCIES = [
  { id: 'monthly', label: 'Mensual' },
  { id: 'weekly', label: 'Semanal' },
  { id: 'yearly', label: 'Anual' },
];

export default function LifestyleModal({ visible, onClose }: LifestyleModalProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const expenses = useAppSelector((state) => state.lifestyle.expenses);
  const transactions = useAppSelector((state) => state.transactions?.list || []);
  const categories = useAppSelector((state) => state.categories?.list || []);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState(LIFESTYLE_CATEGORIES[0]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [editingExpense, setEditingExpense] = useState<LifestyleExpense | null>(null);

  const handleSave = () => {
    if (!name || !amount) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (editingExpense) {
      // Update existing expense
      const updated: LifestyleExpense = {
        ...editingExpense,
        name,
        icon: selectedCategory.icon,
        amount: amountNum,
        frequency,
        category: selectedCategory.id,
      };
      dispatch(updateLifestyleExpense(updated));
    } else {
      // Add new expense
      const newExpense: LifestyleExpense = {
        id: Date.now().toString(),
        name,
        icon: selectedCategory.icon,
        amount: amountNum,
        frequency,
        category: selectedCategory.id,
        createdAt: new Date().toISOString(),
      };
      dispatch(addLifestyleExpense(newExpense));
    }

    // Reset form
    setName('');
    setAmount('');
    setFrequency('monthly');
    setSelectedCategory(LIFESTYLE_CATEGORIES[0]);
    setEditingExpense(null);
  };

  const handleEdit = (expense: LifestyleExpense) => {
    setEditingExpense(expense);
    setName(expense.name);
    setAmount(expense.amount.toString());
    setFrequency(expense.frequency);
    const category = LIFESTYLE_CATEGORIES.find(c => c.id === expense.category);
    if (category) setSelectedCategory(category);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de eliminar este gasto recurrente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => dispatch(deleteLifestyleExpense(id)),
        },
      ]
    );
  };

  const totalMonthly = expenses.reduce((sum, expense) => {
    if (expense.frequency === 'monthly') return sum + expense.amount;
    if (expense.frequency === 'weekly') return sum + (expense.amount * 4);
    if (expense.frequency === 'yearly') return sum + (expense.amount / 12);
    return sum;
  }, 0);

  // Filtrar transacciones de estilo de vida
  const lifestyleCategoryNames = LIFESTYLE_CATEGORIES.map(cat => cat.label.toLowerCase());
  
  const lifestyleTransactions = transactions
    .filter(transaction => {
      const category = categories.find(c => c.id === transaction.category_id);
      if (!category) return false;
      const categoryName = category.name.toLowerCase();
      return lifestyleCategoryNames.some(lifestyle => 
        categoryName.includes(lifestyle) || 
        categoryName === 'arriendo' || 
        categoryName === 'mercado' ||
        categoryName === 'servicios' ||
        categoryName === 'agua' ||
        categoryName === 'internet' ||
        categoryName === 'teléfono' ||
        categoryName === 'telefono' ||
        categoryName === 'transporte' ||
        categoryName === 'suscripciones' ||
        categoryName === 'suscripción'
      );
    })
    .map(t => ({
      ...t,
      category: categories.find(c => c.id === t.category_id),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Últimas 10 transacciones

  const totalLifestyleTransactions = lifestyleTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark ? styles.modalDark : styles.modalLight]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.textWhite : styles.textDark]}>
              Configurar Estilo de Vida
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Total Monthly */}
            <View style={[styles.totalCard, isDark ? styles.totalCardDark : styles.totalCardLight]}>
              <Text style={[styles.totalLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                Total Mensual Estimado
              </Text>
              <Text style={[styles.totalAmount, styles.textGreen]}>
                ${totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Text>
            </View>

            {/* Category Selector */}
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Categoría
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {LIFESTYLE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryItem,
                    selectedCategory.id === category.id && [styles.categoryItemSelected, { borderColor: category.color }],
                    isDark ? styles.categoryItemDark : styles.categoryItemLight,
                  ]}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[styles.categoryLabel, isDark ? styles.textWhite : styles.textDark]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={`ej: ${selectedCategory.label}`}
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>Monto (COP)</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
              />
            </View>

            {/* Frequency */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>Frecuencia</Text>
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
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                {editingExpense ? 'Actualizar' : 'Agregar Gasto'}
              </Text>
            </TouchableOpacity>

            {/* Expenses List */}
            {expenses.length > 0 && (
              <View style={styles.expensesList}>
                <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                  Gastos Recurrentes
                </Text>
                {expenses.map((expense) => (
                  <View
                    key={expense.id}
                    style={[styles.expenseCard, isDark ? styles.expenseCardDark : styles.expenseCardLight]}
                  >
                    <View style={styles.expenseContent}>
                      <Text style={styles.expenseIcon}>{expense.icon}</Text>
                      <View style={styles.expenseInfo}>
                        <Text style={[styles.expenseName, isDark ? styles.textWhite : styles.textDark]}>
                          {expense.name}
                        </Text>
                        <Text style={[styles.expenseFrequency, isDark ? styles.textGray : styles.textGrayDark]}>
                          {expense.frequency === 'monthly' ? 'Mensual' : expense.frequency === 'weekly' ? 'Semanal' : 'Anual'}
                        </Text>
                      </View>
                      <Text style={[styles.expenseAmount, styles.textGreen]}>
                        ${expense.amount.toLocaleString('en-US')}
                      </Text>
                    </View>
                    <View style={styles.expenseActions}>
                      <TouchableOpacity onPress={() => handleEdit(expense)} style={styles.actionBtn}>
                        <Text style={styles.actionText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(expense.id)} style={styles.actionBtn}>
                        <Text style={styles.actionText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Lifestyle Transactions */}
            {lifestyleTransactions.length > 0 && (
              <View style={styles.transactionsList}>
                <View style={styles.transactionsHeader}>
                  <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                    Transacciones de Estilo de Vida
                  </Text>
                  <View style={[styles.totalBadge, isDark ? styles.totalBadgeDark : styles.totalBadgeLight]}>
                    <Text style={[styles.totalBadgeText, styles.textRed]}>
                      ${totalLifestyleTransactions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                </View>
                {lifestyleTransactions.map((transaction) => (
                  <View
                    key={transaction.id}
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
                      <Text style={[styles.transactionAmount, styles.textRed]}>
                        -${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                ))}
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
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
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
  expenseIcon: {
    fontSize: 28,
    marginRight: 12,
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
});
