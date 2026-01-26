import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCategories, deleteCategoryThunk } from '../store/slices/categoriesSlice';

export default function CategoriesScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const { list: categories, loading, error } = useAppSelector((state) => state.categories);
  const [selectedTab, setSelectedTab] = useState<'all' | 'expense' | 'income'>('all');

  const isDark = theme === 'dark';

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter categories by transaction_type
  const filteredCategories = selectedTab === 'all' 
    ? categories 
    : categories.filter(c => c.transaction_type === selectedTab);

  const handleDeleteCategory = (id: number, name: string) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de eliminar "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => dispatch(deleteCategoryThunk(id))
        }
      ]
    );
  };

  if (loading && categories.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, isDark ? styles.bgDark : styles.bgLight]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={[styles.loadingText, isDark ? styles.textGray : styles.textGrayDark]}>
          Cargando categorías...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, isDark ? styles.bgDark : styles.bgLight]}>
        <Text style={[styles.errorText]}>❌ {error}</Text>
        <TouchableOpacity 
          onPress={() => dispatch(fetchCategories())}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.header, isDark ? styles.textWhite : styles.textDark]}>
          Categories
        </Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('all')}
            style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'all' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
              All ({categories.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('expense')}
            style={[styles.tab, selectedTab === 'expense' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'expense' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('income')}
            style={[styles.tab, selectedTab === 'income' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'income' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.grid}>
          {filteredCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, isDark ? styles.cardDark : styles.cardLight]}
              activeOpacity={0.7}
              onLongPress={() => handleDeleteCategory(category.id, category.name)}
            >
              {/* Icon Circle */}
              <View style={[styles.iconCircle, { backgroundColor: category.color_fill }]}>
                <Text style={styles.iconText}>{category.icon}</Text>
              </View>

              {/* Name */}
              <Text style={[styles.categoryName, isDark ? styles.textWhite : styles.textDark]}>
                {category.name}
              </Text>

              {/* Type Badge */}
              <View style={[
                styles.typeBadge,
                category.transaction_type === 'expense' ? styles.expenseBadge : styles.incomeBadge
              ]}>
                <Text style={styles.typeBadgeText}>
                  {category.transaction_type === 'expense' ? '📤' : '📥'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Add Category Placeholder */}
          <TouchableOpacity
            style={[styles.categoryCard, styles.addCard, isDark ? styles.cardDark : styles.cardLight]}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, styles.addIconCircle]}>
              <Text style={styles.addIcon}>+</Text>
            </View>
            <Text style={[styles.categoryName, isDark ? styles.textWhite : styles.textDark]}>
              Add Category
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#10B981',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expenseBadge: {
    backgroundColor: '#FEE2E2',
  },
  incomeBadge: {
    backgroundColor: '#D1FAE5',
  },
  typeBadgeText: {
    fontSize: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#10B981',
  },
  addIconCircle: {
    backgroundColor: '#10B981',
  },
  addIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
