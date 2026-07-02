import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getMedicineById } from '@/data/medicines';
import { useColors } from '@/hooks/useColors';

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { ids, toggle } = useWishlist();
  const { addItem, getItemQty } = useCart();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const medicines = ids.map((id) => getMedicineById(id)).filter(Boolean) as NonNullable<ReturnType<typeof getMedicineById>>[];

  if (medicines.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Wishlist</Text>
        </View>
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIconWrap, { backgroundColor: colors.muted }]}>
            <Ionicons name="heart-outline" size={48} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No saved items</Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Tap the heart icon on any product to save it here for quick reordering
          </Text>
          <Pressable
            style={[styles.browseBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search-outline" size={18} color="#FFF" />
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Wishlist</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{medicines.length} saved item{medicines.length !== 1 ? 's' : ''}</Text>
        </View>
        <Pressable
          style={[styles.clearBtn, { borderColor: colors.border }]}
          onPress={() => {
            ids.forEach((id) => toggle(id));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }}
        >
          <Text style={[styles.clearText, { color: colors.mutedForeground }]}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 100, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const inCart = getItemQty(item.id) > 0;
          return (
            <Pressable
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.iconColor + '18' }]}>
                <MaterialCommunityIcons name={item.iconName as any} size={36} color={item.iconColor} />
              </View>

              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.medicineName, { color: colors.foreground }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.medicineGeneric, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {item.genericName} · {item.brand}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.primary }]}>₹{item.wholesalePrice}</Text>
                  <Text style={[styles.mrp, { color: colors.mutedForeground }]}>MRP ₹{item.mrp}</Text>
                  <View style={[styles.discBadge, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
                    <Text style={[styles.discText, { color: colors.primary }]}>{item.discount}% off</Text>
                  </View>
                </View>
                {item.stock === 0 && (
                  <Text style={[styles.outOfStock, { color: colors.destructive }]}>Out of Stock</Text>
                )}
              </View>

              <View style={styles.cardActions}>
                <Pressable
                  style={[styles.heartBtn, { borderColor: colors.border }]}
                  onPress={() => { toggle(item.id); Haptics.selectionAsync(); }}
                >
                  <Ionicons name="heart" size={18} color={colors.destructive} />
                </Pressable>
                <Pressable
                  style={[
                    styles.cartBtn,
                    { backgroundColor: inCart ? colors.successLight ?? '#E6F4ED' : colors.primary },
                    item.stock === 0 && { backgroundColor: colors.muted },
                  ]}
                  disabled={item.stock === 0}
                  onPress={() => {
                    if (item.stock === 0) return;
                    addItem(item, item.minOrderQty);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                >
                  <Ionicons
                    name={inCart ? 'checkmark' : 'cart-outline'}
                    size={16}
                    color={inCart ? colors.primary : '#FFF'}
                  />
                  <Text style={[styles.cartBtnText, { color: inCart ? colors.primary : '#FFF' }]}>
                    {inCart ? 'In Cart' : 'Add'}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  clearBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  clearText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 14 },
  emptyIconWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
  browseBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginTop: 6 },
  browseBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 14, gap: 12 },
  iconBox: { width: 60, height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  medicineName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  medicineGeneric: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  price: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  mrp: { fontSize: 12, fontFamily: 'Inter_400Regular', textDecorationLine: 'line-through' },
  discBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  outOfStock: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  cardActions: { gap: 8, alignItems: 'center' },
  heartBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cartBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  cartBtnText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
