import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteGoal } from '../store/slices/goalsSlice';
import GoalModal from '../components/GoalModal';

export default function GoalsScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const goals = useAppSelector((state) => state.goals.list);
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  
  const isDark = theme === 'dark';

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const monthlyExpenses = 1170; // Mock data
  const savingsPercentage = 80;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const getProgressPercentage = (goal: typeof goals[0]) => {
    return Math.round((goal.savedAmount / goal.targetAmount) * 100);
  };

  const handleDeleteGoal = (id: string) => {
    dispatch(deleteGoal(id));
  };

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
          Financial Goals
        </Text>
        <Text style={[styles.subtitle, isDark ? styles.textGray : styles.textGrayDark]}>
          Set and track your financial goals
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
          return (
            <View
              key={goal.id}
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
                <View style={styles.goalActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {/* TODO: Edit goal */}}
                  >
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteGoal(goal.id)}
                  >
                    <Text style={styles.actionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={[styles.progressBar, isDark ? styles.progressBarDark : styles.progressBarLight]}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
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
                  <Text style={[styles.detailValue, styles.textGreen]}>
                    {progress}% savings
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <GoalModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
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
});
