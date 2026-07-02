import React, { useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES, getMedicinesByCategory } from '@/data/medicines';
import { useColors } from '@/hooks/useColors';

export default function CategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const enriched = CATEGORIES.map((c) => ({
    ...c,
    count: getMedicinesByCategory(c.id).length,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Categories</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {enriched.length} categories · {enriched.reduce((s, c) => s + c.count, 0)} products
        </Text>
      </View>

      <FlatList
        data={enriched}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        scrollEnabled={enriched.length > 0}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: item.color + '14', borderColor: item.color + '33' }]}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(`/products/${item.id}`);
            }}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.color + '22' }]}>
              <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} />
            </View>
            <Text style={[styles.cardLabel, { color: colors.foreground }]}>{item.label}</Text>
            <Text style={[styles.cardCount, { color: item.color }]}>{item.count} products</Text>
            <View style={[styles.arrow, { backgroundColor: item.color }]}>
              <MaterialCommunityIcons name="arrow-right" size={14} color="#FFF" />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
  card: { flex: 1, borderWidth: 1.5, borderRadius: 20, padding: 16, gap: 8, minHeight: 150, justifyContent: 'space-between' },
  iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  cardCount: { fontSize: 13, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  arrow: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
});
