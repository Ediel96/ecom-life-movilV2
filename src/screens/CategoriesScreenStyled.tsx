import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';

export default function CategoriesScreen() {
  const theme = useAppSelector((state) => state.theme.mode);
  const categories = useAppSelector((state) => state.categories.list);
  const [selectedTab, setSelectedTab] = useState<'all' | 'expenses' | 'income'>('all');

  const isDark = theme === 'dark';

  // Filter categories (currently all categories are expenses type for demo)
  const filteredCategories = selectedTab === 'all' 
    ? categories 
    : categories.filter(c => c.type === selectedTab);

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
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('expenses')}
            style={[styles.tab, selectedTab === 'expenses' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'expenses' ? styles.tabTextActive : (isDark ? styles.textGray : styles.textGrayDark)]}>
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
            >
              {/* Badge */}
              {category.id === '1' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>8</Text>
                </View>
              )}

              {/* Icon Circle */}
              <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
                <Text style={styles.iconText}>{category.icon}</Text>
              </View>

              {/* Name */}
              <Text style={[styles.categoryName, isDark ? styles.textWhite : styles.textDark]}>
                {category.name}
              </Text>

              {/* Budget */}
              <Text style={[styles.budgetText, isDark ? styles.textGray : styles.textGrayDark]}>
                ${category.budget.toFixed(2)}
              </Text>
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
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  budgetText: {
    fontSize: 14,
  },
  addCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconCircle: {
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  addIcon: {
    fontSize: 32,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
});
