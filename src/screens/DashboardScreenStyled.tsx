import React, { useEffect, useState, useRef, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { PieChart } from 'react-native-gifted-charts';
import TransactionModal from '../components/TransactionModalStyled';
import LifestyleModal from '../components/LifestyleModal';
import { Category } from '../types';
import { fetchTransactions, deleteTransactionThunk } from '../store/slices/transactionsSlice';
import { useTranslation } from 'react-i18next';

interface CategoryWithTotal extends Category {
  total: number;
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories?.list ?? []);
  const transactionsRaw = useAppSelector((state) => state.transactions?.list);
  const recurringIds = useAppSelector((state) => state.lifestyle?.recurringTransactionIds || []);
  const frequencyConfig = useAppSelector((state) => state.lifestyle?.frequencyConfig || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [lifestyleModalVisible, setLifestyleModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'expenses' | 'income'>('expenses');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const chartScrollRef = useRef<ScrollView>(null);

  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width - 32 - 48;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const transactions = React.useMemo(() => {
    if (!transactionsRaw) return [];
    if (!Array.isArray(transactionsRaw)) return [];
    return transactionsRaw;
  }, [transactionsRaw]);

  // Obtener transacciones recurrentes (gastos de estilo de vida)
  const recurringExpenses = useMemo(() => {
    return transactions
      .filter(t => recurringIds.includes(t.id))
      .map(t => ({
        ...t,
        category: categories.find(c => c.id === t.category_id),
        frequency: frequencyConfig[t.id]?.frequency || 'monthly',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, recurringIds, frequencyConfig, categories]);

  const handleEditTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleDeleteTransaction = (transaction: any) => {
    Alert.alert(
      t('transactions.alerts.deleteTitle'),
      t('transactions.alerts.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => dispatch(deleteTransactionThunk(transaction.id)),
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const renderRightActions = (transaction: any) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => handleEditTransaction(transaction)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>✏️</Text>
        <Text style={styles.actionText}>{t('common.edit')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDeleteTransaction(transaction)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>🗑️</Text>
        <Text style={styles.actionText}>{t('common.delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  const LIFESTYLE_CATEGORY_NAMES = ['arriendo', 'mercado', 'servicios', 'agua', 'internet', 'teléfono', 'telefono', 'transporte', 'suscripciones', 'suscripción'];
  
  const lifestyleCategoryIds = categories
    .filter(cat => LIFESTYLE_CATEGORY_NAMES.some(lifestyle => cat.name.toLowerCase().includes(lifestyle)))
    .map(cat => cat.id);
  
  const lifestyleTransactions = transactions.filter(transaction => 
    lifestyleCategoryIds.includes(transaction.category_id)
  );
  
  const normalTransactions = transactions.filter(transaction => 
    !lifestyleCategoryIds.includes(transaction.category_id)
  );

  const normalCategoryTotals: CategoryWithTotal[] = categories
    .filter(cat => !lifestyleCategoryIds.includes(cat.id))
    .map(cat => {
      const total = normalTransactions
        .filter(t => t.category_id === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, total };
    })
    .filter(cat => cat.total > 0);

  const totalNormalExpenses = normalCategoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  const pieData = normalCategoryTotals.map(cat => ({
    value: cat.total,
    color: cat.color_fill,
    text: cat.name,
  }));

  const lifestyleCategoryTotals: CategoryWithTotal[] = categories
    .filter(cat => lifestyleCategoryIds.includes(cat.id))
    .map(cat => {
      const total = lifestyleTransactions
        .filter(t => t.category_id === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, total };
    })
    .filter(cat => cat.total > 0);

  const totalLifestyleExpenses = lifestyleCategoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  const lifestylePieData = lifestyleCategoryTotals.map(cat => ({
    value: cat.total,
    color: cat.color_fill,
    text: cat.name,
  }));

  const recentTransactions = normalTransactions
    .slice(-5)
    .reverse()
    .map(t => ({
      ...t,
      category: categories.find(c => c.id === t.category_id),
    }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
            {t('dashboard.title')}
          </Text>

          

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setSelectedTab('expenses')}
              style={[styles.tab, selectedTab === 'expenses' && styles.tabActive]}
            >
              <Text style={[styles.tabText, selectedTab === 'expenses' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
                {t('dashboard.expenses')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('income')}
              style={[styles.tab, selectedTab === 'income' && styles.tabActive]}
            >
              <Text style={[styles.tabText, selectedTab === 'income' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
                {t('dashboard.income')}
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
                  {t(`dashboard.period.${period}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lifestyle Button */}
          <TouchableOpacity 
            onPress={() => setLifestyleModalVisible(true)}
            style={[styles.lifestyleButton, isDark ? styles.lifestyleButtonDark : styles.lifestyleButtonLight]}
          >
            <View style={styles.lifestyleButtonContent}>
              <View style={styles.lifestyleIconContainer}>
                <Text style={styles.lifestyleIcon}>🏠</Text>
              </View>
              <View style={styles.lifestyleTextContainer}>
                <Text style={[styles.lifestyleButtonTitle, isDark ? styles.textWhite : styles.textDark]}>
                  {t('lifestyle.title')}
                </Text>
                <Text style={[styles.lifestyleButtonSubtitle, isDark ? styles.textGray : styles.textGrayDark]}>
                  {t('lifestyle.subtitle')}
                </Text>
              </View>
              <Text style={[styles.lifestyleArrow, isDark ? styles.textGray : styles.textGrayDark]}>
                →
              </Text>
            </View>
          </TouchableOpacity>

          {/* Lifestyle Recurring Expenses */}
          {recurringExpenses.length > 0 && (
            <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                  {t('lifestyle.recurringExpenses')}
                </Text>
                <View style={[styles.countBadge, isDark ? styles.countBadgeDark : styles.countBadgeLight]}>
                  <Text style={[styles.countBadgeText, isDark ? styles.textWhite : styles.textDark]}>
                    {recurringExpenses.length}
                  </Text>
                </View>
              </View>
              {recurringExpenses.map((expense) => (
                <View
                  key={expense.id}
                  style={[styles.expenseCard, isDark ? styles.expenseCardDark : styles.expenseCardLight]}
                >
                  <View style={styles.expenseContent}>
                    <View style={[styles.expenseIconContainer, { backgroundColor: expense.category?.color_fill || '#10B981' }]}>
                      <Text style={styles.expenseIcon}>{expense.category?.icon || '💰'}</Text>
                    </View>
                    <View style={styles.expenseInfo}>
                      <Text style={[styles.expenseName, isDark ? styles.textWhite : styles.textDark]}>
                        {expense.description || expense.category?.name || 'Unknown'}
                      </Text>
                      <Text style={[styles.expenseFrequency, isDark ? styles.textGray : styles.textGrayDark]}>
                        {t(`lifestyle.frequency.${expense.frequency}`)}
                      </Text>
                    </View>
                    <Text style={[styles.expenseAmount, styles.textGreen]}>
                      ${expense.amount.toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity 
                onPress={() => setLifestyleModalVisible(true)}
                style={styles.editLifestyleButton}
              >
                <Text style={styles.editLifestyleButtonText}>✏️ {t('common.edit')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Expenses Overview Card */}
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
            {/* Chart Indicators */}
            <View style={styles.chartIndicators}>
              <View style={[styles.indicator, currentChartIndex === 0 && styles.indicatorActive]} />
              <View style={[styles.indicator, currentChartIndex === 1 && styles.indicatorActive]} />
            </View>

            {/* Horizontal Scrollable Charts */}
            <ScrollView
              ref={chartScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: -10 }}
              onScroll={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / screenWidth);
                setCurrentChartIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {/* Chart 1: Normal Transactions */}
              <View style={[styles.chartPage, { width: screenWidth }]}>
                <View style={styles.chartHeaderCenter}>
                  <Text style={[styles.cardTitle, isDark ? styles.textWhite : styles.textDark]}>
                    💰 {t('dashboard.normalTransactions')}
                  </Text>
                  <Text style={[styles.cardSubtitle, isDark ? styles.textGray : styles.textGrayDark]}>
                    {t(`dashboard.period.${selectedPeriod}`)} • {normalTransactions.length} {normalTransactions.length === 1 ? t('dashboard.transaction') : t('dashboard.transactions')}
                  </Text>
                </View>

                {pieData.length > 0 ? (
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={pieData}
                      donut
                      radius={100}
                      innerRadius={65}
                      focusOnPress
                      innerCircleColor={isDark ? '#1F2937' : '#FFFFFF'}
                      showText={false}
                      textColor={isDark ? '#FFFFFF' : '#1F2937'}
                      textSize={10}
                      textBackgroundRadius={4}
                      showTextBackground
                      textBackgroundColor={isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(243, 244, 246, 0.9)'}
                      centerLabelComponent={() => (
                        <View style={styles.centerLabelContainer}>
                          <Text style={[styles.centerLabelAmount, isDark ? styles.textWhite : styles.textDark]}>
                            ${totalNormalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </Text>
                          <Text style={[styles.centerLabelSubtext, isDark ? styles.textGray : styles.textGrayDark]}>
                            {pieData.length} {pieData.length === 1 ? t('common.category') : t('common.categories')}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, isDark ? styles.textGray : styles.textGrayDark]}>
                      {t('dashboard.empty.noTransactions')}
                    </Text>
                  </View>
                )}

                <Text style={[styles.swipeHint, isDark ? styles.textGray : styles.textGrayDark]}>
                  {t('dashboard.swipeHints.toLifestyle')}
                </Text>
              </View>

              {/* Chart 2: Lifestyle Transactions */}
              <View style={[styles.chartPage, { width: screenWidth }]}>
                <View style={styles.chartHeaderCenter}>
                  <Text style={[styles.cardTitle, isDark ? styles.textWhite : styles.textDark]}>
                    🏠 {t('dashboard.lifestyleTransactions')}
                  </Text>
                  <Text style={[styles.cardSubtitle, isDark ? styles.textGray : styles.textGrayDark]}>
                    {t(`dashboard.period.${selectedPeriod}`)} • {lifestyleTransactions.length} {lifestyleTransactions.length === 1 ? t('dashboard.transaction') : t('dashboard.transactions')}
                  </Text>
                </View>

                {lifestylePieData.length > 0 ? (
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={lifestylePieData}
                      donut
                      radius={100}
                      innerRadius={65}
                      focusOnPress
                      innerCircleColor={isDark ? '#1F2937' : '#FFFFFF'}
                      showText = {false}
                      textColor={isDark ? '#FFFFFF' : '#1F2937'}
                      textSize={10}
                      textBackgroundRadius={4}
                      showTextBackground
                      textBackgroundColor={isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(243, 244, 246, 0.9)'}
                      centerLabelComponent={() => (
                        <View style={styles.centerLabelContainer}>
                          <Text style={[styles.centerLabelAmount, isDark ? styles.textWhite : styles.textDark]}>
                            ${totalLifestyleExpenses.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </Text>
                          <Text style={[styles.centerLabelSubtext, isDark ? styles.textGray : styles.textGrayDark]}>
                            {lifestylePieData.length} categoría{lifestylePieData.length === 1 ? '' : 's'}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, isDark ? styles.textGray : styles.textGrayDark]}>
                      {t('dashboard.empty.noLifestyle')}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => setLifestyleModalVisible(true)}
                      style={styles.emptyButton}
                    >
                      <Text style={styles.emptyButtonText}>{t('lifestyle.addCategories')}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={[styles.swipeHint, isDark ? styles.textGray : styles.textGrayDark]}>
                  {t('dashboard.swipeHints.toAll')}
                </Text>
              </View>
            </ScrollView>
          </View>

          {/* Lifestyle Transactions List */}
          {currentChartIndex === 1 && lifestyleTransactions.length > 0 && (
            <View style={styles.transactionsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                  🏠 {t('dashboard.lifestyleTitle')}
                </Text>
                <View style={[styles.countBadge, isDark ? styles.countBadgeDark : styles.countBadgeLight]}>
                  <Text style={[styles.countBadgeText, isDark ? styles.textWhite : styles.textDark]}>
                    {lifestyleTransactions.length}
                  </Text>
                </View>
              </View>
              {lifestyleTransactions.slice(0, 5).map((transaction, index) => {
                const category = categories.find(c => c.id === transaction.category_id);
                return (
                  <Swipeable
                    key={transaction.id || index}
                    renderRightActions={() => renderRightActions(transaction)}
                    overshootRight={false}
                  >
                    <View
                      style={[styles.transactionCard, isDark ? styles.cardDark : styles.cardLight]}
                    >
                      <View style={styles.transactionContent}>
                        <View style={[styles.iconContainer, { backgroundColor: category?.color_fill || '#10B981' }]}>
                          <Text style={styles.iconText}>{category?.icon || '🏠'}</Text>
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={[styles.transactionName, isDark ? styles.textWhite : styles.textDark]}>
                            {category?.name || 'Unknown'}
                          </Text>
                          <View style={styles.transactionMeta}>
                            <Text style={[styles.metaText, isDark ? styles.textGray : styles.textGrayDark]}>
                              📅 {transaction.date ? format(parseISO(transaction.date), 'dd MMM yyyy, HH:mm') : ''}
                            </Text>
                            <Text style={[styles.metaText, isDark ? styles.textGray : styles.textGrayDark]}>
                              💬 {transaction.description || category?.name}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.amountText}>
                        - ${(transaction.amount || 0).toFixed(2)}
                      </Text>
                    </View>
                  </Swipeable>
                );
              })}
            </View>
          )}

          {/* Recent Transactions */}
          {currentChartIndex === 0 && recentTransactions.length > 0 && (
            <View style={styles.transactionsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
                  {t('dashboard.recentTransactions')}
                </Text>
                <View style={[styles.countBadge, isDark ? styles.countBadgeDark : styles.countBadgeLight]}>
                  <Text style={[styles.countBadgeText, isDark ? styles.textWhite : styles.textDark]}>
                    {recentTransactions.length}
                  </Text>
                </View>
              </View>
              {recentTransactions.map((transaction, index) => (
                <Swipeable
                  key={transaction.id || index}
                  renderRightActions={() => renderRightActions(transaction)}
                  overshootRight={false}
                >
                  <View
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
                            💬 {transaction.description || transaction.category?.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.amountText}>
                      - ${(transaction.amount || 0).toFixed(2)}
                    </Text>
                  </View>
                </Swipeable>
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

        <TransactionModal 
          visible={modalVisible} 
          onClose={handleCloseModal}
          transaction={selectedTransaction}
        />

        <LifestyleModal 
          visible={lifestyleModalVisible}
          onClose={() => setLifestyleModalVisible(false)}
        />
      </View>
    </GestureHandlerRootView>
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
  textGreen: {
    color: '#10B981',
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
    backgroundColor: '#E5E7EB',
  },
  periodTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  lifestyleButton: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lifestyleButtonDark: {
    backgroundColor: '#1F2937',
  },
  lifestyleButtonLight: {
    backgroundColor: '#FFFFFF',
  },
  lifestyleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lifestyleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lifestyleIcon: {
    fontSize: 24,
  },
  lifestyleTextContainer: {
    flex: 1,
  },
  lifestyleButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  lifestyleButtonSubtitle: {
    fontSize: 13,
  },
  lifestyleArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  chartIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
  },
  indicatorActive: {
    backgroundColor: '#10B981',
    width: 24,
  },
  chartPage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  chartHeaderCenter: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,      // Más espacio arriba/abajo
    marginHorizontal: 15,    // Espacio a los lados
    paddingVertical: 25,     // Padding interno adicional
    width: '100%',
    minHeight: 80,
  },
  centerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 130,
  },
  centerLabelAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerLabelSubtext: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    marginVertical: 40,
    marginHorizontal: 15,
  },
  emptyText: {
    fontSize: 15,
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 16,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  countBadgeDark: {
    backgroundColor: '#0F172A',
  },
  countBadgeLight: {
    backgroundColor: '#F3F4F6',
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionCard: {
    borderRadius: 16,
    padding: 6,
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
  swipeActions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  expenseCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expenseCardDark: {
    backgroundColor: '#0F172A',
  },
  expenseCardLight: {
    backgroundColor: '#F3F4F6',
  },
  expenseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  expenseFrequency: {
    fontSize: 12,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  editLifestyleButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  editLifestyleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});