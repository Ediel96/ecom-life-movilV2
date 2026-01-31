import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { createAccount, updateAccountThunk, deleteAccountThunk } from '../store/slices/accountsSilce';
import { Account } from '../types';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  account?: Account | null;
}

const ACCOUNT_TYPES = [
  { id: 'cash', icon: '💵', label: 'Cash' },
  { id: 'bank', icon: '🏦', label: 'Bank' },
  { id: 'debit', icon: '💳', label: 'Debit' },
  { id: 'saving', icon: '🐷', label: 'Saving' },
];

export default function AccountModal({ visible, onClose, account }: AccountModalProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';
  const isEditing = !!account;

  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedType, setSelectedType] = useState<string>('bank');
  const [isActivated, setIsActivated] = useState(true);

  // Load account data when editing
  useEffect(() => {
    if (account && visible) {
      setAccountName(account.name || '');
      setBankName(account.bank_name || '');
      setBalance(account.balance?.toString() || '0');
      setSelectedType(account.type || account.account_type || 'bank');
      setIsActivated(account.isActivated ?? true);
    } else if (!visible) {
      // Reset when closing
      setAccountName('');
      setBankName('');
      setBalance('');
      setSelectedType('bank');
      setIsActivated(true);
    }
  }, [account, visible]);

  const handleSave = () => {
    if (!accountName || !balance) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum)) {
      Alert.alert('Error', 'Invalid balance amount');
      return;
    }

    if (isEditing && account) {
      // Update existing account
      const updatedAccount: Account = {
        ...account,
        name: accountName,
        bank_name: bankName || accountName,
        type: selectedType,
        account_type: selectedType,
        balance: balanceNum,
        isActivated,
        currency: 'COP',
        updated_at: new Date().toISOString(),
      };
      dispatch(updateAccountThunk(updatedAccount));
    } else {
      // Create new account
      const newAccount = {
        user_id: '',
        name: accountName,
        type: selectedType,
        isActivated,
        balance: balanceNum,
        currency: 'COP',
        account_type: selectedType,
        bank_name: bankName || accountName,
      };
      dispatch(createAccount(newAccount));
    }
    handleClose();
  };

  const handleDelete = () => {
    if (!account) return;

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
            handleClose();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setAccountName('');
    setBankName('');
    setBalance('');
    setSelectedType('bank');
    setIsActivated(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={[styles.modalContent, isDark ? styles.modalDark : styles.modalLight]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, isDark ? styles.textWhite : styles.textDark]}>
              {isEditing ? 'Edit Account' : 'Add New Account'}
            </Text>

            {/* Account Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Account Name
              </Text>
              <TextInput
                value={accountName}
                onChangeText={setAccountName}
                placeholder="e.g., My Savings Account"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[
                  styles.input,
                  isDark ? styles.inputDark : styles.inputLight,
                  isDark ? styles.textWhite : styles.textDark,
                ]}
              />
            </View>

            {/* Bank Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Bank Name
              </Text>
              <TextInput
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g., Bank of Example"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={[
                  styles.input,
                  isDark ? styles.inputDark : styles.inputLight,
                  isDark ? styles.textWhite : styles.textDark,
                ]}
              />
            </View>

            {/* Balance */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Balance (COP)
              </Text>
              <TextInput
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
                style={[
                  styles.input,
                  isDark ? styles.inputDark : styles.inputLight,
                  isDark ? styles.textWhite : styles.textDark,
                ]}
              />
            </View>

            {/* Account Type Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Account Type
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
                {ACCOUNT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    style={[
                      styles.accountItem,
                      selectedType === type.id && styles.accountItemSelected,
                      isDark ? styles.accountItemDark : styles.accountItemLight
                    ]}
                  >
                    <Text style={styles.accountIcon}>
                      {type.icon}
                    </Text>
                    <Text style={[styles.accountName, isDark ? styles.textWhite : styles.textDark]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Active Toggle */}
            <View style={styles.toggleGroup}>
              <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
                Active Account
              </Text>
              <TouchableOpacity
                onPress={() => setIsActivated(!isActivated)}
                style={[
                  styles.toggleButton,
                  isActivated
                    ? styles.toggleButtonActive
                    : [styles.toggleButtonInactive, isDark ? styles.toggleButtonInactiveDark : styles.toggleButtonInactiveLight],
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleButtonText, isActivated ? styles.toggleTextActive : styles.toggleTextInactive]}>
                  {isActivated ? '✓' : '○'}
                </Text>
                <Text
                  style={[
                    styles.toggleLabel,
                    isActivated ? styles.toggleLabelActive : isDark ? styles.textGray : styles.textGrayLight,
                  ]}
                >
                  {isActivated ? 'Activated' : 'Deactivated'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.button, styles.cancelButton, isDark ? styles.cancelButtonDark : styles.cancelButtonLight]}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, isDark ? styles.textWhite : styles.textDark]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.button, styles.createButton]}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.createButtonText]}>
                  {isEditing ? 'Save Changes' : '+ Add Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 440,
    borderRadius: 20,
    padding: 32,
    zIndex: 1,
    maxHeight: '90%',
  },
  modalDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalLight: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
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
    color: '#6B7280',
  },
  textGrayLight: {
    color: '#9CA3AF',
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
    paddingVertical: 16,
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
    backgroundColor: '#0F172A',
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
  toggleGroup: {
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  toggleButtonInactive: {
    borderWidth: 1,
  },
  toggleButtonInactiveDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  toggleButtonInactiveLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: '#9CA3AF',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleLabelActive: {
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  cancelButtonLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#FFFFFF',
  },
  deleteButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
  },
  deleteButtonDark: {
    backgroundColor: '#7F1D1D',
    borderColor: '#991B1B',
  },
  deleteButtonLight: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
});
