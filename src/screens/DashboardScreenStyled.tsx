import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { PieChart } from 'react-native-gifted-charts';
import TransactionModal from '../components/TransactionModalStyled';
import { Category } from '../types';
import { fetchTransactions } from '../store/slices/transactionsSlice';

interface CategoryWithTotal extends Category {
  total: number;
}

export default function DashboardScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories?.list ?? []);
  const transactionsRaw = useAppSelector((state) => state.transactions?.list);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'expenses' | 'income'>('expenses');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const isDark = theme === 'dark';

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Ensure transactions is always an array - extra defensive
  const transactions = React.useMemo(() => {
    if (!transactionsRaw) return [];
    if (!Array.isArray(transactionsRaw)) return [];
    return transactionsRaw;
  }, [transactionsRaw]);

  // Calculate totals per category
  console.log('Transactions:', transactions, 'Type:', typeof transactions, 'IsArray:', Array.isArray(transactions));
  const categoryTotals: CategoryWithTotal[] = categories.map(cat => {
    const total = transactions
      .filter(t => t.category_id === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...cat, total };
  });

  const totalExpenses = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  // Pie chart data
  const pieData = categoryTotals
    .filter(cat => cat.total > 0)
    .map(cat => ({
      value: cat.total,
      color: cat.color_fill,
      text: cat.name,
    }));

  // Get recent transactions
  const recentTransactions = transactions
    .slice(-5)
    .reverse()
    .map(t => ({
      ...t,
      category: categories.find(c => c.id === t.category_id),
    }));

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
          OrganizeLife
        </Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('expenses')}
            style={[styles.tab, selectedTab === 'expenses' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'expenses' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('income')}
            style={[styles.tab, selectedTab === 'income' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'income' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                selectedPeriod === period
                  ? styles.periodButtonActive
                  : (isDark ? styles.periodButtonInactive : styles.periodButtonInactiveLight)
              ]}
            >
              <Text
                style={selectedPeriod === period ? styles.periodTextActive : (isDark ? styles.textGray : styles.textGrayDark)}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Expenses Overview Card */}
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.cardTitle, isDark ? styles.textWhite : styles.textDark]}>
            Expenses Overview
          </Text>
          <Text style={[styles.cardSubtitle, isDark ? styles.textGray : styles.textGrayDark]}>
            {selectedPeriod} - Current Period
          </Text>

          {/* Donut Chart */}
          {pieData.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                donut
                radius={120}
                innerRadius={80}
                centerLabelComponent={() => (
                  <View style={[styles.centerLabel, isDark ? styles.centerLabelDark : styles.centerLabelLight]}>
                    <Text style={[styles.totalAmount, isDark ? styles.textWhite : styles.textDark]}>
                      ${totalExpenses}
                    </Text>
                    <Text style={[styles.totalLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                      Total
                    </Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={isDark ? styles.textGray : styles.textGrayDark}>
                No hay transacciones aún
              </Text>
            </View>
          )}

          {/* Trending */}
          <View style={styles.trendingContainer}>
            <Text style={isDark ? styles.textWhite : styles.textDark}>
              Trending up by 5.2% this month 
            </Text>
            <Text style={styles.trendingIcon}>📈</Text>
          </View>

          <Text style={[styles.centerText, isDark ? styles.textGray : styles.textGrayDark]}>
            Showing total expenses for the current {selectedPeriod}
          </Text>
        </View>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <View style={styles.transactionsSection}>
            <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
              Recent Transactions
            </Text>
            {recentTransactions.map((transaction, index) => (
              <View
                key={transaction.id || index}
                style={[styles.transactionCard, isDark ? styles.cardDark : styles.cardLight]}
              >
                <View style={styles.transactionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: transaction.category?.color_fill || '#10B981' }]}>
                    <Text style={styles.iconText}>{transaction.category?.icon || '💰'}</Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionName, isDark ? styles.textWhite : styles.textDark]}>
                      {transaction.category?.name || 'Unknown'}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Text style={[styles.metaText, isDark ? styles.textGray : styles.textGrayDark]}>
                        📅 {transaction.date ? format(parseISO(transaction.date), 'dd MMM yyyy, HH:mm') : ''}
                      </Text>
                      <Text style={[styles.metaText, isDark ? styles.textGray : styles.textGrayDark]}>
                        💪 {transaction.description || transaction.category?.name}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.amountText}>
                  - ${(transaction.amount || 0).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TransactionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
    paddingBottom: 100,
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#10B981',
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  periodButtonInactive: {
    backgroundColor: '#1F2937',
  },
  periodButtonInactiveLight: {
    backgroundColor: '#FFFFFF',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelDark: {
    backgroundColor: '#1F2937',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  centerLabelLight: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  totalLabel: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  trendingIcon: {
    marginLeft: 8,
  },
  centerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#10B981',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionMeta: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 8,
  },
  metaText: {
    fontSize: 14,
  },
  amountText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#10B981',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
