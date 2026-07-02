import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { useColors } from '@/hooks/useColors';

type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Net Banking' | 'Credit Account';

const PAYMENT_OPTS: { id: PaymentMethod; icon: string; iconLib?: 'mci'; desc: string }[] = [
  { id: 'Credit Account', icon: 'card-account-details-outline', iconLib: 'mci', desc: 'Pay from existing credit limit' },
  { id: 'UPI', icon: 'qr-code-outline', desc: 'Pay via UPI / PhonePe / GPay' },
  { id: 'Card', icon: 'card-outline', desc: 'Debit or Credit Card' },
  { id: 'Net Banking', icon: 'globe-outline', desc: 'Internet banking' },
  { id: 'Cash', icon: 'cash-outline', desc: 'Cash on delivery' },
];

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [payment, setPayment] = useState<PaymentMethod>('Credit Account');
  const [address, setAddress] = useState(
    `${profile.address}, ${profile.city}, ${profile.state} - ${profile.pincode}`,
  );
  const [placing, setPlacing] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const gst = Math.round(subtotal * 0.12);
  const delivery = subtotal >= 2000 ? 0 : 60;
  const total = subtotal + gst + delivery;

  async function handlePlaceOrder() {
    if (!address.trim()) return;
    setPlacing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const orderId = await placeOrder(items, address, payment);
      clearCart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/order/${orderId}`);
    } catch {
      setPlacing(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Checkout</Text>
        <Text style={[styles.step, { color: colors.mutedForeground }]}>{items.length} items</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 120, gap: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Delivery Address */}
        <Section title="Delivery Address" icon="location-outline" colors={colors}>
          <View style={[styles.addrWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.addrHeader}>
              <View style={[styles.addrIcon, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
                <Ionicons name="business-outline" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.addrBiz, { color: colors.foreground }]}>{profile.businessName}</Text>
            </View>
            <TextInput
              style={[styles.addrInput, { color: colors.foreground }]}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </Section>

        {/* Order Summary */}
        <Section title="Order Summary" icon="receipt-outline" colors={colors}>
          {items.slice(0, 3).map((item) => (
            <View key={item.medicine.id} style={styles.orderItemRow}>
              <MaterialCommunityIcons name={item.medicine.iconName as any} size={18} color={item.medicine.iconColor} />
              <Text style={[styles.orderItemName, { color: colors.foreground }]} numberOfLines={1}>
                {item.medicine.name}
              </Text>
              <Text style={[styles.orderItemQty, { color: colors.mutedForeground }]}>×{item.qty}</Text>
              <Text style={[styles.orderItemPrice, { color: colors.foreground }]}>
                ₹{(item.medicine.wholesalePrice * item.qty).toLocaleString()}
              </Text>
            </View>
          ))}
          {items.length > 3 && (
            <Text style={[styles.moreItems, { color: colors.mutedForeground }]}>
              +{items.length - 3} more items
            </Text>
          )}
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          {[
            { label: 'Subtotal', value: `₹${subtotal.toLocaleString()}` },
            { label: 'GST (12%)', value: `₹${gst.toLocaleString()}` },
            { label: 'Delivery', value: delivery === 0 ? 'FREE' : `₹${delivery}`, highlight: delivery === 0 },
          ].map(({ label, value, highlight }) => (
            <View key={label} style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
              <Text style={[styles.summaryValue, { color: highlight ? colors.primary : colors.foreground }]}>{value}</Text>
            </View>
          ))}
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
          </View>
        </Section>

        {/* Payment Method */}
        <Section title="Payment Method" icon="wallet-outline" colors={colors}>
          {PAYMENT_OPTS.map((opt) => (
            <Pressable
              key={opt.id}
              style={[
                styles.payRow,
                {
                  backgroundColor: payment === opt.id ? colors.successLight ?? '#E6F4ED' : colors.card,
                  borderColor: payment === opt.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => { setPayment(opt.id); Haptics.selectionAsync(); }}
            >
              <View style={[styles.payIcon, { backgroundColor: payment === opt.id ? colors.primary : colors.muted }]}>
                {opt.iconLib === 'mci'
                  ? <MaterialCommunityIcons name={opt.icon as any} size={20} color={payment === opt.id ? '#FFF' : colors.foreground} />
                  : <Ionicons name={opt.icon as any} size={20} color={payment === opt.id ? '#FFF' : colors.foreground} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.payName, { color: colors.foreground }]}>{opt.id}</Text>
                <Text style={[styles.payDesc, { color: colors.mutedForeground }]}>{opt.desc}</Text>
              </View>
              <View style={[styles.radio, { borderColor: payment === opt.id ? colors.primary : colors.border }]}>
                {payment === opt.id && (
                  <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </Pressable>
          ))}
        </Section>
      </ScrollView>

      {/* Place Order bar */}
      <View style={[styles.placeBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 16 }]}>
        <View>
          <Text style={[styles.placeTotal, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
          <Text style={[styles.placeItems, { color: colors.mutedForeground }]}>{items.length} items · {payment}</Text>
        </View>
        <Pressable
          style={[styles.placeBtn, { backgroundColor: placing ? colors.muted : colors.primary }]}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.placeBtnText}>{placing ? 'Placing…' : 'Place Order'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Section({ title, icon, colors, children }: { title: string; icon: string; colors: any; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.sectionHead}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  step: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  addrWrap: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 10 },
  addrHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addrIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addrBiz: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  addrInput: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderItemName: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  orderItemQty: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  orderItemPrice: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold', minWidth: 60, textAlign: 'right' },
  moreItems: { fontSize: 13, fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
  summaryDivider: { height: 1, marginVertical: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  summaryValue: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  totalLabel: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  totalValue: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  payRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, padding: 14, gap: 12 },
  payIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  payName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  payDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  placeBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  placeTotal: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  placeItems: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  placeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14 },
  placeBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
