import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrders, type OrderStatus } from '@/context/OrdersContext';
import { useColors } from '@/hooks/useColors';

const STEPS: OrderStatus[] = ['Pending', 'Accepted', 'Packed', 'Dispatched', 'Delivered'];

const STEP_META: Record<OrderStatus, { icon: string; label: string; desc: string }> = {
  Pending:    { icon: 'time-outline',                  label: 'Order Placed',     desc: 'Your order has been received' },
  Accepted:   { icon: 'checkmark-circle-outline',      label: 'Accepted',         desc: 'Order confirmed by supplier' },
  Packed:     { icon: 'cube-outline',                  label: 'Packed',           desc: 'Items packed and ready to ship' },
  Dispatched: { icon: 'car-outline',                   label: 'Dispatched',       desc: 'Out for delivery' },
  Delivered:  { icon: 'checkmark-done-circle-outline', label: 'Delivered',        desc: 'Order delivered successfully' },
  Cancelled:  { icon: 'close-circle-outline',          label: 'Cancelled',        desc: 'Order was cancelled' },
};

function TimelineStep({ status, done, active, last, delay }: { status: OrderStatus; done: boolean; active: boolean; last: boolean; delay: number }) {
  const colors = useColors();
  const meta = STEP_META[status];
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 400 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.stepRow}>
      <View style={styles.stepLeft}>
        <Animated.View
          style={[
            styles.stepDot,
            dotStyle,
            {
              backgroundColor: done ? colors.primary : active ? colors.accent : colors.muted,
              borderColor: done ? colors.primary : active ? colors.accent : colors.border,
            },
          ]}
        >
          {done && <Ionicons name="checkmark" size={12} color="#FFF" />}
          {active && !done && <View style={[styles.activePulse, { backgroundColor: colors.accent }]} />}
        </Animated.View>
        {!last && (
          <View
            style={[
              styles.stepLine,
              { backgroundColor: done ? colors.primary : colors.border },
            ]}
          />
        )}
      </View>
      <View style={[styles.stepContent, last && { paddingBottom: 0 }]}>
        <Text style={[styles.stepLabel, { color: done || active ? colors.foreground : colors.mutedForeground, fontWeight: active ? '700' : '500' }]}>
          {meta.label}
        </Text>
        <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{meta.desc}</Text>
      </View>
    </View>
  );
}

export default function OrderDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, cancelOrder } = useOrders();
  const order = getOrder(id ?? '');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!order) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.foreground }]}>Order not found</Text>
        <Pressable onPress={() => router.replace('/(tabs)/orders')}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Go to Orders</Text>
        </Pressable>
      </View>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';
  const currentStep = isCancelled ? -1 : STEPS.indexOf(order.status);
  const isNew = Date.now() - new Date(order.date).getTime() < 5 * 60 * 1000;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: isDelivered ? colors.successLight ?? '#E6F4ED' : colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.replace('/(tabs)/orders')}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.orderId, { color: colors.foreground }]}>{order.id}</Text>
          <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>
            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isDelivered && (
          <View style={[styles.deliveredBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark-done" size={14} color="#FFF" />
            <Text style={styles.deliveredText}>Delivered</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order placed success card (for new orders) */}
        {isNew && !isCancelled && (
          <View style={[styles.successCard, { backgroundColor: colors.successLight ?? '#E6F4ED', borderColor: colors.primary + '33' }]}>
            <Ionicons name="checkmark-circle" size={40} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.successTitle, { color: colors.primary }]}>Order Placed Successfully!</Text>
              <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
                Thank you. Your order is being processed.
              </Text>
            </View>
          </View>
        )}

        {/* Tracking timeline */}
        {!isCancelled ? (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order Tracking</Text>
            <View style={[styles.timeline, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {STEPS.map((step, i) => (
                <TimelineStep
                  key={step}
                  status={step}
                  done={i < currentStep}
                  active={i === currentStep}
                  last={i === STEPS.length - 1}
                  delay={i * 120}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={[styles.cancelledCard, { backgroundColor: '#FEECEB', borderColor: colors.destructive + '33' }]}>
            <Ionicons name="close-circle" size={36} color={colors.destructive} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.cancelledTitle, { color: colors.destructive }]}>Order Cancelled</Text>
              <Text style={[styles.cancelledSub, { color: colors.mutedForeground }]}>This order has been cancelled.</Text>
            </View>
          </View>
        )}

        {/* Delivery info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Delivery Address</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{order.address}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Ionicons name="wallet-outline" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Payment Method</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{order.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Items Ordered</Text>
          <View style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {order.items.map((item, i) => (
              <View key={item.medicineId}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.itemRow}>
                  <View style={[styles.itemIcon, { backgroundColor: colors.muted }]}>
                    <MaterialCommunityIcons name="pill" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>{item.medicineName}</Text>
                    <Text style={[styles.itemBrand, { color: colors.mutedForeground }]}>{item.brand} · Qty: {item.qty}</Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.foreground }]}>
                    ₹{(item.price * item.qty).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bill summary */}
        <View style={[styles.billCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.billTitle, { color: colors.foreground }]}>Bill Summary</Text>
          {[
            { label: 'Subtotal', value: `₹${order.subtotal.toLocaleString()}` },
            { label: 'GST', value: `₹${order.gst.toLocaleString()}` },
            { label: 'Delivery', value: order.delivery === 0 ? 'FREE' : `₹${order.delivery}` },
          ].map(({ label, value }) => (
            <View key={label} style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.mutedForeground }]}>{label}</Text>
              <Text style={[styles.billValue, { color: value === 'FREE' ? colors.primary : colors.foreground }]}>{value}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 4 }]} />
          <View style={styles.billRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total Paid</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{order.total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        {isDelivered ? (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Ionicons name="repeat-outline" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Reorder</Text>
          </Pressable>
        ) : !isCancelled && ['Pending', 'Accepted'].includes(order.status) ? (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.destructive }]}
            onPress={() => { cancelOrder(order.id); router.replace('/(tabs)/orders'); }}
          >
            <Ionicons name="close-outline" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Cancel Order</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Ionicons name="home-outline" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Continue Shopping</Text>
          </Pressable>
        )}
        <Pressable style={[styles.invoiceBtn, { borderColor: colors.border }]}>
          <Ionicons name="document-text-outline" size={20} color={colors.foreground} />
          <Text style={[styles.invoiceBtnText, { color: colors.foreground }]}>Invoice</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFound: { fontSize: 18, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  orderId: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  orderDate: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  deliveredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  deliveredText: { color: '#FFF', fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  successCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  successTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  successSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  cancelledCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  cancelledTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  cancelledSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 10 },
  timeline: { borderWidth: 1, borderRadius: 16, padding: 16 },
  stepRow: { flexDirection: 'row', gap: 14 },
  stepLeft: { alignItems: 'center', gap: 0 },
  stepDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  activePulse: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { flex: 1, width: 2, marginVertical: 4, minHeight: 28 },
  stepContent: { flex: 1, paddingBottom: 20 },
  stepLabel: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  stepDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  infoCard: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', gap: 12, padding: 14, alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Inter_500Medium', lineHeight: 20, marginTop: 2 },
  divider: { height: 1, marginHorizontal: 14 },
  itemsCard: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  itemIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  itemBrand: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  billCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  billTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between' },
  billLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  billValue: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  totalLabel: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  totalValue: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 14 },
  actionBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  invoiceBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  invoiceBtnText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
