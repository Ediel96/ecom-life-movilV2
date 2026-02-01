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
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addGoal, updateGoal } from '../store/slices/goalsSlice';
import type { Goal } from '../store/slices/goalsSlice';

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  goal?: Goal | null;
}

export default function GoalModal({ visible, onClose, goal }: GoalModalProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';
  const isEditing = !!goal;

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');

  const icons = ['🎯', '🏍️', '🏠', '✈️', '🚗', '💻', '🎓', '💰', '💍', '🎸'];

  // Load goal data when editing
  useEffect(() => {
    if (goal && visible) {
      setGoalName(goal.name || '');
      setTargetAmount(goal.targetAmount?.toString() || '');
      setMonthlyContribution(goal.monthlyContribution?.toString() || '');
      setSelectedIcon(goal.icon || '🎯');
    } else if (!visible) {
      // Reset when closing
      setGoalName('');
      setTargetAmount('');
      setMonthlyContribution('');
      setSelectedIcon('🎯');
    }
  }, [goal, visible]);

  const handleSave = () => {
    if (!goalName || !targetAmount || !monthlyContribution) {
      return;
    }

    const target = parseFloat(targetAmount);
    const monthly = parseFloat(monthlyContribution);

    if (isNaN(target) || isNaN(monthly) || target <= 0 || monthly <= 0) {
      return;
    }

    const periodMonths = Math.ceil(target / monthly);

    if (isEditing && goal) {
      // Update existing goal
      const updatedGoal: Goal = {
        ...goal,
        name: goalName,
        icon: selectedIcon,
        targetAmount: target,
        monthlyContribution: monthly,
        periodMonths,
      };
      dispatch(updateGoal(updatedGoal));
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: goalName,
        icon: selectedIcon,
        targetAmount: target,
        savedAmount: 0,
        monthlyContribution: monthly,
        periodMonths,
        createdAt: new Date().toISOString(),
      };
      dispatch(addGoal(newGoal));
    }
    handleClose();
  };

  const handleClose = () => {
    setGoalName('');
    setTargetAmount('');
    setMonthlyContribution('');
    setSelectedIcon('🎯');
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
            {isEditing ? 'Edit Goal' : 'Add New Goal'}
          </Text>

          {/* Icon Selector */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Select Icon
            </Text>
            <View style={styles.iconContainer}>
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon && styles.iconButtonSelected,
                    isDark ? styles.iconButtonDark : styles.iconButtonLight,
                  ]}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
              onPress={handleSave}
              style={[styles.button, styles.createButton]}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.createButtonText]}>
                {isEditing ? 'Save Changes' : 'Create Goal'}
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
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonDark: {
    backgroundColor: '#0F172A',
  },
  iconButtonLight: {
    backgroundColor: '#F9FAFB',
  },
  iconButtonSelected: {
    borderColor: '#10B981',
  },
  iconText: {
    fontSize: 24,
  },
});
