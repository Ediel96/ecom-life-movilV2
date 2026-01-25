import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoriesState, Category } from '../../types';

const initialState: CategoriesState = {
  list: [
    { id: '1', name: 'Comida', icon: '🍔', color: '#FF6B6B', budget: 500000 },
    { id: '2', name: 'Transporte', icon: '🚗', color: '#4ECDC4', budget: 300000 },
    { id: '3', name: 'Entretenimiento', icon: '🎮', color: '#FFE66D', budget: 200000 },
    { id: '4', name: 'Salud', icon: '💊', color: '#95E1D3', budget: 150000 },
    { id: '5', name: 'Educación', icon: '📚', color: '#A8E6CF', budget: 250000 },
    { id: '6', name: 'Servicios', icon: '💡', color: '#FFDAC1', budget: 400000 },
  ],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.list.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.list.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(cat => cat.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
