import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import AccountModalStyled from '../components/AccountModalStyled';
import { fetchAccounts, deleteAccountThunk } from '../store/slices/accountsSilce';

const ACCOUNT_TYPES = [
  { id: 'cash', icon: '💵', label: 'Cash', color: '#10B981' },
  { id: 'bank', icon: '🏦', label: 'Bank', color: '#3B82F6' },
  { id: 'debit', icon: '💳', label: 'Debit', color: '#8B5CF6' },
  { id: 'saving', icon: '🐷', label: 'Saving', color: '#F59E0B' },
  { id: 'DEFAULT', icon: '💰', label: 'Default', color: '#6B7280' },
];

export default function AccountsScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const accounts = useAppSelector((state) => state.accounts.list);
  const loading = useAppSelector((state) => state.accounts.loading);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  // Fetch accounts on mount
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setModalVisible(true);
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setModalVisible(true);
  };

  const handleDeleteAccount = (account: any) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAccountThunk(account.id));
          },
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAccount(null);
  };

  const renderRightActions = (account: any) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => handleEditAccount(account)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>✏️</Text>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDeleteAccount(account)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>🗑️</Text>
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          {loading ? (
            <Text style={[styles.loadingText, isDark ? styles.textGray : styles.textGrayDark]}>
              Loading accounts...
            </Text>
          ) : accounts.length === 0 ? (
            <Text style={[styles.emptyText, isDark ? styles.textGray : styles.textGrayDark]}>
              No accounts yet. Add your first account!
            </Text>
          ) : (
            accounts.map((account) => {
              // Find matching account type from ACCOUNT_TYPES
              const accountTypeData = ACCOUNT_TYPES.find(t => 
                t.id === account.type || t.id === account.account_type
              ) || ACCOUNT_TYPES[ACCOUNT_TYPES.length - 1]; // Default to last item

              return (
                <Swipeable
                  key={account.id}
                  renderRightActions={() => renderRightActions(account)}
                  overshootRight={false}
                >
                  <TouchableOpacity
                    style={[styles.accountCard, isDark ? styles.cardDark : styles.cardLight]}
                    activeOpacity={0.7}
                    onPress={() => handleEditAccount(account)}
                  >
                    <View style={styles.accountContent}>
                      <View style={[styles.iconCircle, { backgroundColor: accountTypeData.color }]}>
                        <Text style={styles.iconText}>{accountTypeData.icon}</Text>
                      </View>
                      <View style={styles.accountInfo}>
                        <Text style={[styles.accountName, isDark ? styles.textWhite : styles.textDark]}>
                          {account.name}
                        </Text>
                        <Text style={[styles.accountType, isDark ? styles.textGray : styles.textGrayDark]}>
                          {account.bank_name || accountTypeData.label} • {account.isActivated ? 'Active' : 'Inactive'}
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
                </Swipeable>
              );
            })
          )}
        </View>

        {/* Add Account Button */}
        <TouchableOpacity
          style={[styles.addButton, isDark ? styles.addButtonDark : styles.addButtonLight]}
          activeOpacity={0.8}
          onPress={handleAddAccount}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={[styles.addText, isDark ? styles.textWhite : styles.textDark]}>
            Add New Account
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Account Modal */}
      <AccountModalStyled 
        visible={modalVisible} 
        onClose={handleCloseModal}
        account={selectedAccount}
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
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 24,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 24,
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
});
