import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteGoal, updateGoal, updateGoalProgress } from '../store/slices/goalsSlice';
import GoalModal from '../components/GoalModal';
import { useTranslation } from 'react-i18next';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.mode);
  const goals = useAppSelector((state) => state.goals.list);
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState('');
  
  const isDark = theme === 'dark';

  console.log('GoalsScreen render, goals count:', goals.length, 'Total saved:', goals.reduce((sum, g) => sum + g.savedAmount, 0));

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const monthlyExpenses = 1170; // Mock data
  const savingsPercentage = 80;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const getProgressPercentage = (goal: typeof goals[0]) => {
    return Math.round((goal.savedAmount / goal.targetAmount) * 100);
  };

  const handleDeleteGoal = (goal: any) => {
    Alert.alert(
      t('goals.alerts.deleteTitle'),
      t('goals.alerts.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => dispatch(deleteGoal(goal.id)),
        },
      ]
    );
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleAddMoney = (goal: any) => {
    setSelectedGoal(goal);
    setAddMoneyModalVisible(true);
  };

  const handleSaveAddMoney = () => {
    if (!selectedGoal || !amountToAdd) return;

    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t('common.error'), t('goals.alerts.validAmount'));
      return;
    }

    console.log('Adding money:', { goalId: selectedGoal.id, amount });
    dispatch(updateGoalProgress({ id: selectedGoal.id, amount }));
    
    // Clear state and close modal
    setAmountToAdd('');
    setAddMoneyModalVisible(false);
    setSelectedGoal(null);
  };

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedGoal(null);
  };

  const renderRightActions = (goal: any) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.actionButtonSwipe, styles.editButton]}
        onPress={() => handleEditGoal(goal)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIconSwipe}>✏️</Text>
        <Text style={styles.actionTextSwipe}>{t('common.edit')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButtonSwipe, styles.deleteButton]}
        onPress={() => handleDeleteGoal(goal)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIconSwipe}>🗑️</Text>
        <Text style={styles.actionTextSwipe}>{t('common.delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
          {t('goals.title')}
        </Text>
        <Text style={[styles.subtitle, isDark ? styles.textGray : styles.textGrayDark]}>
          {t('goals.subtitle')}
        </Text>

        {/* Monthly Overview Card */}
        <View style={[styles.overviewCard, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.overviewTitle, isDark ? styles.textWhite : styles.textDark]}>
            Monthly Overview
          </Text>

          <View style={styles.overviewContent}>
            {/* Savings Circle */}
            <View style={styles.circleContainer}>
              <View style={styles.circleWrapper}>
                <View style={[styles.circleOuter, styles.circleGreen]}>
                  <View style={[styles.circleInner, isDark ? styles.circleInnerDark : styles.circleInnerLight]}>
                    <Text style={[styles.percentageText, styles.textGreen]}>
                      {savingsPercentage}%
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.circleLabel, isDark ? styles.textWhite : styles.textDark]}>
                Savings
              </Text>
            </View>

            {/* VS Text */}
            <Text style={[styles.vsText, isDark ? styles.textGray : styles.textGrayDark]}>
              vs
            </Text>

            {/* Expenses Circle */}
            <View style={styles.circleContainer}>
              <View style={styles.circleWrapper}>
                <View style={[styles.circleOuter, styles.circleGray]}>
                  <View style={[styles.circleInner, isDark ? styles.circleInnerDark : styles.circleInnerLight]}>
                    <Text style={[styles.amountTextSmall, isDark ? styles.textWhite : styles.textDark]}>
                      ${monthlyExpenses}
                    </Text>
                    <Text style={[styles.labelSmall, isDark ? styles.textGray : styles.textGrayDark]}>
                      Total
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.circleLabel, isDark ? styles.textWhite : styles.textDark]}>
                Expenses
              </Text>
            </View>
          </View>

          {/* Totals */}
          <View style={styles.totalsRow}>
            <View style={styles.totalItem}>
              <Text style={[styles.totalAmount, styles.textGreen]}>
                $ {formatCurrency(totalSaved)}
              </Text>
              <Text style={[styles.totalLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                Total saved
              </Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={[styles.totalAmount, styles.textGreen]}>
                $ {monthlyExpenses}
              </Text>
              <Text style={[styles.totalLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                Monthly expenses
              </Text>
            </View>
          </View>
        </View>

        {/* Goals List */}
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal);
          const isCompleted = progress >= 100;
          return (
            <Swipeable
              key={goal.id}
              renderRightActions={() => renderRightActions(goal)}
              overshootRight={false}
            >
              <View
                style={[styles.goalCard, isDark ? styles.cardDark : styles.cardLight]}
              >
                {/* Goal Header */}
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleRow}>
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <View style={styles.goalTitleContainer}>
                      <Text style={[styles.goalName, isDark ? styles.textWhite : styles.textDark]}>
                        {goal.name}
                      </Text>
                      <Text style={[styles.goalAmount, styles.textGreen]}>
                        $ {formatCurrency(goal.targetAmount)}
                      </Text>
                    </View>
                  </View>
                  {!isCompleted && (
                    <TouchableOpacity
                      style={styles.addMoneyButton}
                      onPress={() => handleAddMoney(goal)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addMoneyIcon}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Progress Bar */}
                <View style={[styles.progressBar, isDark ? styles.progressBarDark : styles.progressBarLight]}>
                  <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                </View>

                {/* Goal Details */}
                <View style={styles.goalDetails}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                      Period:
                    </Text>
                    <Text style={[styles.detailValue, isDark ? styles.textWhite : styles.textDark]}>
                      {goal.periodMonths} months
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                      Monthly:
                    </Text>
                    <Text style={[styles.detailValue, isDark ? styles.textWhite : styles.textDark]}>
                      $ {formatCurrency(goal.monthlyContribution)}
                    </Text>
                  </View>
                </View>

                <View style={styles.goalDetails}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, isDark ? styles.textGray : styles.textGrayDark]}>
                      Saved:
                    </Text>
                    <Text style={[styles.detailValue, isDark ? styles.textWhite : styles.textDark]}>
                      $ {formatCurrency(goal.savedAmount)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailValue, isCompleted ? styles.textCompleted : styles.textGreen]}>
                      {progress}% {isCompleted ? '✅ Completed!' : 'savings'}
                    </Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          );
        })}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleAddGoal}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <GoalModal 
        visible={modalVisible} 
        onClose={handleCloseModal}
        goal={selectedGoal}
      />

      {/* Add Money Modal */}
      <Modal
        visible={addMoneyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddMoneyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.addMoneyModal, isDark ? styles.modalDark : styles.modalLight]}>
            <Text style={[styles.modalTitle, isDark ? styles.textWhite : styles.textDark]}>
              Add Money to {selectedGoal?.name}
            </Text>
            <Text style={[styles.modalSubtitle, isDark ? styles.textGray : styles.textGrayDark]}>
              Current: ${formatCurrency(selectedGoal?.savedAmount || 0)} / ${formatCurrency(selectedGoal?.targetAmount || 0)}
            </Text>
            <TextInput
              value={amountToAdd}
              onChangeText={setAmountToAdd}
              placeholder="Enter amount"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              keyboardType="numeric"
              style={[styles.modalInput, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textWhite : styles.textDark]}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setAddMoneyModalVisible(false);
                  setAmountToAdd('');
                }}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={[styles.modalButtonText, isDark ? styles.textWhite : styles.textDark]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveAddMoney}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={[styles.modalButtonText, styles.textWhite]}>
                  Add Money
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgDark: {
    backgroundColor: '#0F172A',
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#111827',
  },
  textGray: {
    color: '#94A3B8',
  },
  textGrayDark: {
    color: '#6B7280',
  },
  textGreen: {
    color: '#10B981',
  },
  textCompleted: {
    color: '#F59E0B',
  },
  
  // Overview Card
  overviewCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  circleContainer: {
    alignItems: 'center',
  },
  circleWrapper: {
    marginBottom: 12,
  },
  circleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGreen: {
    borderColor: '#10B981',
    borderTopColor: '#10B981',
    borderRightColor: '#10B981',
    borderBottomColor: '#334155',
    borderLeftColor: '#334155',
  },
  circleGray: {
    borderColor: '#64748B',
  },
  circleInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInnerDark: {
    backgroundColor: '#1E293B',
  },
  circleInnerLight: {
    backgroundColor: '#FFFFFF',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  amountTextSmall: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelSmall: {
    fontSize: 12,
  },
  circleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalItem: {
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
  },

  // Goal Card
  goalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  
  // Progress Bar
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#334155',
  },
  progressBarLight: {
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  
  // Goal Details
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  // FAB
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
  
  // Swipe Actions
  swipeActions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButtonSwipe: {
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
  actionIconSwipe: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionTextSwipe: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Add Money Button
  addMoneyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addMoneyIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Add Money Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoneyModal: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    textAlign: 'center',
  },
  inputDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  inputLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalLight: {
    backgroundColor: '#FFFFFF',
  },
});
