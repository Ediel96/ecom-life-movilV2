import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  periodMonths: number;
  createdAt: string;
}

interface GoalsState {
  list: Goal[];
}

const initialState: GoalsState = {
  list: [
    {
      id: '1',
      name: 'Moto',
      icon: '🏍️',
      targetAmount: 15000000,
      savedAmount: 12000000,
      monthlyContribution: 1000000,
      periodMonths: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Home',
      icon: '🏠',
      targetAmount: 150000000,
      savedAmount: 120000000,
      monthlyContribution: 1000000,
      periodMonths: 30,
      createdAt: new Date().toISOString(),
    },
  ],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.list.push(action.payload);
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.list.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(g => g.id !== action.payload);
    },
    updateGoalProgress: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.list.find(g => g.id === action.payload.id);
      if (goal) {
        goal.savedAmount += action.payload.amount;
      }
    },
  },
});

export const { addGoal, updateGoal, deleteGoal, updateGoalProgress } = goalsSlice.actions;
export default goalsSlice.reducer;
