import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicineCard from '@/components/MedicineCard';
import { CATEGORIES, MEDICINES, searchMedicines } from '@/data/medicines';
import { useColors } from '@/hooks/useColors';

const SEARCH_HISTORY_KEY = '@pharma_search_history';
const TRENDING = ['Paracetamol', 'Amoxicillin', 'Vitamin D3', 'Omeprazole', 'Metformin', 'Insulin'];

const DISCOUNT_OPTIONS = [
  { label: '10%+', value: 10 },
  { label: '20%+', value: 20 },
  { label: '30%+', value: 30 },
  { label: '40%+', value: 40 },
];

const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: '< ₹50', min: 0, max: 50 },
  { label: '₹50–200', min: 50, max: 200 },
  { label: '₹200–500', min: 200, max: 500 },
  { label: '₹500+', min: 500, max: Infinity },
];

const ALL_BRANDS = Array.from(new Set(MEDICINES.map((m) => m.brand))).sort();

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const activeFilterCount =
    (priceRangeIndex > 0 ? 1 : 0) +
    selectedBrands.size +
    (minDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
    AsyncStorage.getItem(SEARCH_HISTORY_KEY)
      .then((s) => { if (s) setHistory(JSON.parse(s)); })
      .catch(() => {});
  }, []);

  function saveToHistory(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...history.filter((h) => h !== trimmed)].slice(0, 8);
    setHistory(updated);
    AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated)).catch(() => {});
  }

  function clearHistory() {
    setHistory([]);
    AsyncStorage.removeItem(SEARCH_HISTORY_KEY).catch(() => {});
  }

  function clearFilters() {
    setPriceRangeIndex(0);
    setSelectedBrands(new Set());
    setMinDiscount(0);
    setInStockOnly(false);
  }

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  }

  const results = useMemo(() => {
    let list = searchMedicines(query);
    if (activeCategory) list = list.filter((m) => m.category === activeCategory);
    const pr = PRICE_RANGES[priceRangeIndex];
    if (pr.min > 0 || pr.max < Infinity) {
      list = list.filter((m) => m.wholesalePrice >= pr.min && m.wholesalePrice < pr.max);
    }
    if (selectedBrands.size > 0) {
      list = list.filter((m) => selectedBrands.has(m.brand));
    }
    if (minDiscount > 0) {
      list = list.filter((m) => m.discount >= minDiscount);
    }
    if (inStockOnly) {
      list = list.filter((m) => m.stock > 0);
    }
    return list;
  }, [query, activeCategory, priceRangeIndex, selectedBrands, minDiscount, inStockOnly]);

  const showResults = query.length > 0 || activeCategory !== null || activeFilterCount > 0;

  const brandsInResults = useMemo(() => {
    const base = query.length > 0 ? searchMedicines(query) : MEDICINES;
    return Array.from(new Set(base.map((m) => m.brand))).sort();
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          {/* Back button */}
          <Pressable
            style={[styles.navBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </Pressable>

          {/* Search input — takes all remaining space */}
          <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: showFilters ? colors.primary : colors.border }]}>
            <Ionicons name="search" size={18} color={colors.mutedForeground} style={{ flexShrink: 0 }} />
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search medicines…"
              placeholderTextColor={colors.mutedForeground}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={() => saveToHistory(query)}
              autoCapitalize="none"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
              </Pressable>
            ) : (
              <Ionicons name="barcode-outline" size={18} color={colors.mutedForeground} style={{ flexShrink: 0 }} />
            )}
          </View>

          {/* Filter button — fixed size, never squishes */}
          <Pressable
            style={[
              styles.filterToggleBtn,
              { backgroundColor: activeFilterCount > 0 ? colors.primary : colors.muted, borderColor: activeFilterCount > 0 ? colors.primary : colors.border },
            ]}
            onPress={() => setShowFilters((v) => !v)}
            hitSlop={4}
          >
            <Ionicons name="options-outline" size={18} color={activeFilterCount > 0 ? '#FFF' : colors.foreground} />
            {activeFilterCount > 0 && (
              <View style={[styles.filterCountBadge, { backgroundColor: '#FFF' }]}>
                <Text style={[styles.filterCountText, { color: colors.primary }]}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Filter panel */}
      {showFilters && (
        <View style={[styles.filterPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.foreground }]}>Price Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {PRICE_RANGES.map((pr, i) => (
                <Pressable
                  key={pr.label}
                  style={[styles.chip, { borderColor: priceRangeIndex === i ? colors.primary : colors.border }, priceRangeIndex === i && { backgroundColor: colors.primary }]}
                  onPress={() => setPriceRangeIndex(i)}
                >
                  <Text style={[styles.chipText, { color: priceRangeIndex === i ? '#FFF' : colors.mutedForeground }]}>{pr.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Min Discount */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.foreground }]}>Discount</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              <Pressable
                style={[styles.chip, { borderColor: minDiscount === 0 ? colors.primary : colors.border }, minDiscount === 0 && { backgroundColor: colors.primary }]}
                onPress={() => setMinDiscount(0)}
              >
                <Text style={[styles.chipText, { color: minDiscount === 0 ? '#FFF' : colors.mutedForeground }]}>Any</Text>
              </Pressable>
              {DISCOUNT_OPTIONS.map((d) => (
                <Pressable
                  key={d.value}
                  style={[styles.chip, { borderColor: minDiscount === d.value ? colors.primary : colors.border }, minDiscount === d.value && { backgroundColor: colors.primary }]}
                  onPress={() => setMinDiscount(d.value)}
                >
                  <Text style={[styles.chipText, { color: minDiscount === d.value ? '#FFF' : colors.mutedForeground }]}>{d.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Brand */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.foreground }]}>Brand</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {brandsInResults.slice(0, 20).map((b) => {
                const sel = selectedBrands.has(b);
                return (
                  <Pressable
                    key={b}
                    style={[styles.chip, { borderColor: sel ? colors.primary : colors.border }, sel && { backgroundColor: colors.primary }]}
                    onPress={() => toggleBrand(b)}
                  >
                    <Text style={[styles.chipText, { color: sel ? '#FFF' : colors.mutedForeground }]}>{b}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* In stock toggle */}
          <View style={styles.filterSection}>
            <View style={styles.toggleRow}>
              <Text style={[styles.filterSectionTitle, { color: colors.foreground }]}>In Stock Only</Text>
              <Switch
                value={inStockOnly}
                onValueChange={setInStockOnly}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {activeFilterCount > 0 && (
            <Pressable onPress={clearFilters} style={styles.clearFiltersBtn}>
              <Text style={[styles.clearFiltersText, { color: colors.destructive }]}>Clear All Filters</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Category filter chips */}
      {showResults && (
        <View style={styles.chipScroll}>
          <Pressable
            style={[styles.catChip, !activeCategory && { backgroundColor: colors.primary }]}
            onPress={() => setActiveCategory(null)}
          >
            <Text style={[styles.catChipText, { color: !activeCategory ? '#FFF' : colors.mutedForeground }]}>All</Text>
          </Pressable>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={[
                styles.catChip,
                { borderColor: c.color + '55' },
                activeCategory === c.id && { backgroundColor: c.color },
              ]}
              onPress={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
            >
              <MaterialCommunityIcons name={c.icon as any} size={13} color={activeCategory === c.id ? '#FFF' : c.color} />
              <Text style={[styles.catChipText, { color: activeCategory === c.id ? '#FFF' : colors.foreground }]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {!showResults ? (
        /* Home state — no query */
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomPad + 80, gap: 24 }}>
          {/* History */}
          {history.length > 0 && (
            <View style={{ gap: 12 }}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Searches</Text>
                <Pressable onPress={clearHistory}>
                  <Text style={[styles.clearText, { color: colors.destructive }]}>Clear</Text>
                </Pressable>
              </View>
              {history.map((h) => (
                <Pressable key={h} style={styles.historyRow} onPress={() => setQuery(h)}>
                  <Ionicons name="time-outline" size={18} color={colors.mutedForeground} />
                  <Text style={[styles.historyText, { color: colors.foreground }]}>{h}</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
                </Pressable>
              ))}
            </View>
          )}

          {/* Trending */}
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Trending Searches</Text>
            <View style={styles.trendingWrap}>
              {TRENDING.map((t) => (
                <Pressable
                  key={t}
                  style={[styles.trendingChip, { backgroundColor: colors.muted }]}
                  onPress={() => setQuery(t)}
                >
                  <Ionicons name="trending-up-outline" size={14} color={colors.primary} />
                  <Text style={[styles.trendingText, { color: colors.foreground }]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Browse categories */}
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Browse by Category</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.slice(0, 8).map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.catCard, { backgroundColor: c.color + '14', borderColor: c.color + '33' }]}
                  onPress={() => router.push(`/products/${c.id}`)}
                >
                  <MaterialCommunityIcons name={c.icon as any} size={24} color={c.color} />
                  <Text style={[styles.catCardText, { color: colors.foreground }]}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        /* Results state */
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 80 }}
          onScrollBeginDrag={() => saveToHistory(query)}
          ListHeaderComponent={
            query.length > 0 ? (
              <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                {activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied` : ''}
              </Text>
            ) : activeFilterCount > 0 ? (
              <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
                {results.length} result{results.length !== 1 ? 's' : ''} · {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No results found</Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                Try adjusting your filters or search for a different term
              </Text>
              {activeFilterCount > 0 && (
                <Pressable
                  style={[styles.clearFiltersBtn2, { borderColor: colors.primary }]}
                  onPress={clearFilters}
                >
                  <Text style={[styles.clearFiltersBtn2Text, { color: colors.primary }]}>Clear Filters</Text>
                </Pressable>
              )}
            </View>
          }
          renderItem={({ item }) => <MedicineCard medicine={item} compact />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, height: 44, minWidth: 0 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', minWidth: 0 },
  filterToggleBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' },
  filterCountBadge: { position: 'absolute', top: -5, right: -5, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: 'transparent' },
  filterCountText: { fontSize: 9, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  filterPanel: { borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 12, gap: 14 },
  filterSection: { gap: 8 },
  filterSectionTitle: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clearFiltersBtn: { alignSelf: 'flex-start' },
  clearFiltersText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  chipScroll: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  catChipText: { fontSize: 12, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  clearText: { fontSize: 13, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  trendingWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendingChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  trendingText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: { width: '47%', borderWidth: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 8 },
  catCardText: { fontSize: 13, fontWeight: '500', fontFamily: 'Inter_500Medium', textAlign: 'center' },
  resultCount: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  clearFiltersBtn2: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  clearFiltersBtn2Text: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
