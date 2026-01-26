import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addGoal } from '../store/slices/goalsSlice';

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function GoalModal({ visible, onClose }: GoalModalProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');

  const handleCreate = () => {
    if (!goalName || !targetAmount || !monthlyContribution) {
      return;
    }

    const target = parseFloat(targetAmount);
    const monthly = parseFloat(monthlyContribution);

    if (isNaN(target) || isNaN(monthly) || target <= 0 || monthly <= 0) {
      return;
    }

    const periodMonths = Math.ceil(target / monthly);

    const newGoal = {
      id: Date.now().toString(),
      name: goalName,
      icon: '🎯', // Default icon, puede agregar selector después
      targetAmount: target,
      savedAmount: 0,
      monthlyContribution: monthly,
      periodMonths,
      createdAt: new Date().toISOString(),
    };

    dispatch(addGoal(newGoal));
    handleClose();
  };

  const handleClose = () => {
    setGoalName('');
    setTargetAmount('');
    setMonthlyContribution('');
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
          <Text style={[styles.title, isDark ? styles.textWhite : styles.textDark]}>
            Add New Goal
          </Text>

          {/* Goal Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Goal Name
            </Text>
            <TextInput
              value={goalName}
              onChangeText={setGoalName}
              placeholder="e.g., New Car, Vacation"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                isDark ? styles.textWhite : styles.textDark,
              ]}
            />
          </View>

          {/* Target Amount */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Target Amount (COP)
            </Text>
            <TextInput
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="15000000"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              keyboardType="numeric"
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                isDark ? styles.textWhite : styles.textDark,
              ]}
            />
          </View>

          {/* Monthly Contribution */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Monthly Contribution (COP)
            </Text>
            <TextInput
              value={monthlyContribution}
              onChangeText={setMonthlyContribution}
              placeholder="1000000"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              keyboardType="numeric"
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
                isDark ? styles.textWhite : styles.textDark,
              ]}
            />
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
              onPress={handleCreate}
              style={[styles.button, styles.createButton]}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.createButtonText]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
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
});
