import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CategoriesState, Category } from '../../types';
import api from '../../services/api';

const initialState: CategoriesState = {
  list: [],
  loading: false,
  error: null,
};

// 🔥 Async Thunks para llamadas API
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.categories.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al cargar categorías');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await api.categories.create(category);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al crear categoría');
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'categories/updateCategory',
  async (category: Category, { rejectWithValue }) => {
    try {
      const response = await api.categories.update(category.id, category);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al actualizar categoría');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.categories.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al eliminar categoría');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Reducers síncronos (opcional, para actualizaciones locales)
    addCategoryLocal: (state, action: PayloadAction<Category>) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // 📥 Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ➕ Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✏️ Update Category
    builder
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });

    // 🗑️ Delete Category
    builder
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(cat => cat.id !== action.payload);
      });
  },
});

export const { addCategoryLocal } = categoriesSlice.actions;
export default categoriesSlice.reducer;