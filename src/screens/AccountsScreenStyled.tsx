import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';
import AccountModalStyled from '../components/AccountModalStyled';

export default function AccountsScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const accounts = [
    { id: '1', name: 'Cash', balance: 1250.50, icon: '💵', color: '#10B981' },
    { id: '2', name: 'Bank Account', balance: 5430.25, icon: '🏦', color: '#3B82F6' },
    { id: '3', name: 'Credit Card', balance: -320.75, icon: '💳', color: '#EF4444' },
    { id: '4', name: 'Savings', balance: 12500.00, icon: '🐷', color: '#F59E0B' },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
          Accounts
        </Text>

        {/* Total Balance Card */}
        <View style={[styles.totalCard, isDark ? styles.totalCardDark : styles.totalCardLight]}>
          <Text style={[styles.totalLabel, isDark ? styles.textGray : styles.textGrayDark]}>
            Total Balance
          </Text>
          <Text style={[styles.totalAmount, isDark ? styles.textWhite : styles.textDark]}>
            ${(totalBalance || 0).toFixed(2)}
          </Text>
          <Text style={[styles.totalSubtext, isDark ? styles.textGray : styles.textGrayDark]}>
            Across all accounts
          </Text>
        </View>

        {/* Accounts List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            My Accounts
          </Text>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[styles.accountCard, isDark ? styles.cardDark : styles.cardLight]}
              activeOpacity={0.7}
            >
              <View style={styles.accountContent}>
                <View style={[styles.iconCircle, { backgroundColor: account.color }]}>
                  <Text style={styles.iconText}>{account.icon}</Text>
                </View>
                <View style={styles.accountInfo}>
                  <Text style={[styles.accountName, isDark ? styles.textWhite : styles.textDark]}>
                    {account.name}
                  </Text>
                  <Text style={[styles.accountType, isDark ? styles.textGray : styles.textGrayDark]}>
                    {account.balance < 0 ? 'Credit' : 'Active'}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.accountBalance,
                  account.balance < 0 ? styles.balanceNegative : (isDark ? styles.textWhite : styles.textDark)
                ]}
              >
                ${Math.abs(account.balance || 0).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Account Button */}
        <TouchableOpacity
          style={[styles.addButton, isDark ? styles.addButtonDark : styles.addButtonLight]}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={[styles.addText, isDark ? styles.textWhite : styles.textDark]}>
            Add New Account
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Account Modal */}
      <AccountModalStyled visible={modalVisible} onClose={() => setModalVisible(false)} />
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
    paddingBottom: 32,
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
  totalCard: {
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  totalCardDark: {
    backgroundColor: '#1F2937',
  },
  totalCardLight: {
    backgroundColor: '#FFFFFF',
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalSubtext: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  accountCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 28,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceNegative: {
    color: '#EF4444',
  },
  addButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addButtonDark: {
    borderColor: '#4B5563',
  },
  addButtonLight: {
    borderColor: '#D1D5DB',
  },
  addIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    marginRight: 12,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
