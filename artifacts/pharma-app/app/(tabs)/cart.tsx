import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useColors } from '@/hooks/useColors';

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const gst = Math.round(subtotal * 0.12);
  const delivery = subtotal >= 2000 ? 0 : 60;
  const total = subtotal + gst + delivery;

  if (items.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <MaterialCommunityIcons name="cart-outline" size={80} color={colors.mutedForeground} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your cart is empty</Text>
        <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
          Browse products and add them to your cart
        </Text>
        <Pressable
          style={[styles.browseBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.browseBtnText}>Browse Products</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Cart</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{totalItems} items</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 160, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.medicine.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.imgBox, { backgroundColor: item.medicine.iconColor + '18' }]}>
              <MaterialCommunityIcons name={item.medicine.iconName as any} size={32} color={item.medicine.iconColor} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>{item.medicine.name}</Text>
              <Text style={[styles.itemSub, { color: colors.mutedForeground }]}>{item.medicine.genericName} · {item.medicine.brand}</Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.medicine.wholesalePrice} / unit</Text>
              <View style={styles.qtyRow}>
                <Pressable
                  style={[styles.qtyBtn, { borderColor: colors.border }]}
                  onPress={() => { Haptics.selectionAsync(); updateQty(item.medicine.id, Math.max(0, item.qty - item.medicine.minOrderQty)); }}
                >
                  <Ionicons name="remove" size={16} color={colors.foreground} />
                </Pressable>
                <Text style={[styles.qtyText, { color: colors.foreground }]}>{item.qty}</Text>
                <Pressable
                  style={[styles.qtyBtn, { borderColor: colors.primary, backgroundColor: colors.primary }]}
                  onPress={() => { Haptics.selectionAsync(); updateQty(item.medicine.id, item.qty + item.medicine.minOrderQty); }}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </Pressable>
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); removeItem(item.medicine.id); }}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.destructive} />
                </Pressable>
              </View>
            </View>
            <Text style={[styles.lineTotal, { color: colors.foreground }]}>
              ₹{(item.medicine.wholesalePrice * item.qty).toLocaleString()}
            </Text>
          </View>
        ))}

        {/* Coupon */}
        <View style={[styles.couponBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
          <Text style={[styles.couponLabel, { color: colors.foreground }]}>Apply Coupon</Text>
          <Pressable><Text style={[styles.couponBtn, { color: colors.accent }]}>Select</Text></Pressable>
        </View>

        {/* Summary */}
        <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Order Summary</Text>
          {[
            { label: 'Subtotal', val: `₹${subtotal.toLocaleString()}` },
            { label: 'GST (12%)', val: `₹${gst.toLocaleString()}` },
            { label: 'Delivery', val: delivery === 0 ? 'FREE' : `₹${delivery}`, green: delivery === 0 },
          ].map(({ label, val, green }) => (
            <View key={label} style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
              <Text style={[styles.summaryVal, { color: green ? colors.primary : colors.foreground }]}>{val}</Text>
            </View>
          ))}
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.totalVal, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
          </View>
          {delivery === 0 && (
            <Text style={[styles.freeNote, { color: colors.primary }]}>🎉 You get free delivery!</Text>
          )}
        </View>
      </ScrollView>

      {/* Checkout */}
      <View style={[styles.checkoutBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 16 }]}>
        <View>
          <Text style={[styles.checkoutTotal, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
          <Text style={[styles.checkoutSub, { color: colors.mutedForeground }]}>Incl. GST & delivery</Text>
        </View>
        <Pressable
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/checkout'); }}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  emptySub: { fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  browseBtn: { marginTop: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  browseBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  title: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  card: { flexDirection: 'row', borderWidth: 1, borderRadius: 16, padding: 14, gap: 12, alignItems: 'flex-start' },
  imgBox: { width: 64, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  itemSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  itemPrice: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold', minWidth: 20, textAlign: 'center' },
  removeBtn: { marginLeft: 4, padding: 4 },
  lineTotal: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  couponBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 16, gap: 10, borderStyle: 'dashed' },
  couponLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  couponBtn: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  summary: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  summaryTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  summaryVal: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  summaryDivider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  totalVal: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  freeNote: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 4 },
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  checkoutTotal: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  checkoutSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14 },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
