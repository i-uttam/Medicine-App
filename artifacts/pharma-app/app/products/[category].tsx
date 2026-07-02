import React, { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicineCard from '@/components/MedicineCard';
import { CATEGORIES, getMedicinesByCategory } from '@/data/medicines';
import { useColors } from '@/hooks/useColors';

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'discount';

export default function ProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('default');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const catInfo = CATEGORIES.find((c) => c.id === category);
  const allMedicines = useMemo(() => getMedicinesByCategory(category ?? ''), [category]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = q
      ? allMedicines.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.genericName.toLowerCase().includes(q) ||
            m.brand.toLowerCase().includes(q),
        )
      : [...allMedicines];

    if (sort === 'price_asc') list.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    else if (sort === 'price_desc') list.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    else if (sort === 'discount') list.sort((a, b) => b.discount - a.discount);
    return list;
  }, [allMedicines, search, sort]);

  const SORTS: { key: SortKey; label: string }[] = [
    { key: 'default', label: 'Default' },
    { key: 'price_asc', label: 'Price ↑' },
    { key: 'price_desc', label: 'Price ↓' },
    { key: 'discount', label: 'Discount' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Pressable
            style={[styles.backBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>{catInfo?.label ?? category}</Text>
          <Text style={[styles.count, { color: colors.mutedForeground }]}>{allMedicines.length} products</Text>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder={`Search in ${catInfo?.label ?? category}…`}
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Sort chips */}
        <View style={styles.sortRow}>
          {SORTS.map((s) => (
            <Pressable
              key={s.key}
              style={[
                styles.sortChip,
                { borderColor: sort === s.key ? colors.primary : colors.border },
                sort === s.key && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSort(s.key)}
            >
              <Text style={[styles.sortText, { color: sort === s.key ? '#FFF' : colors.mutedForeground }]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: 100, gap: 0 }}
        columnWrapperStyle={{ gap: 10 }}
        scrollEnabled={filtered.length > 0}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={60} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No medicines found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <MedicineCard medicine={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  count: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 42, borderRadius: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  sortText: { fontSize: 12, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
