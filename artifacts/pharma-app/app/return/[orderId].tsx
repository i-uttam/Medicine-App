import React, { useState } from 'react';
import {
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
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrders } from '@/context/OrdersContext';
import { useColors } from '@/hooks/useColors';

const REASONS = [
  'Damaged / Broken packaging',
  'Wrong product delivered',
  'Expired product',
  'Short quantity',
  'Quality issue',
  'Duplicate order',
  'Other',
];

type Step = 'select' | 'reason' | 'confirm' | 'done';

export default function ReturnScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const order = getOrder(orderId ?? '');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [step, setStep] = useState<Step>('select');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [pickupRequested, setPickupRequested] = useState(true);
  const [refundMode, setRefundMode] = useState<'original' | 'credit'>('original');

  const STEPS: { key: Step; label: string }[] = [
    { key: 'select', label: 'Select Items' },
    { key: 'reason', label: 'Reason' },
    { key: 'confirm', label: 'Review' },
    { key: 'done', label: 'Done' },
  ];
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  if (!order) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Order not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  function toggleItem(itemId: string) {
    Haptics.selectionAsync();
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });
  }

  function goNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'select') setStep('reason');
    else if (step === 'reason') setStep('confirm');
    else if (step === 'confirm') setStep('done');
  }

  const selectedOrderItems = order.items.filter((i) => selectedItems.has(i.medicineId));
  const refundAmount = selectedOrderItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
          onPress={() => step === 'select' ? router.back() : setStep(STEPS[stepIndex - 1].key)}
        >
          <Ionicons name={step === 'done' ? 'close' : 'arrow-back'} size={20} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Return Request</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{order.id}</Text>
        </View>
      </View>

      {/* Progress stepper */}
      {step !== 'done' && (
        <View style={[styles.stepper, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {STEPS.filter((s) => s.key !== 'done').map((s, i) => (
            <View key={s.key} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                { backgroundColor: stepIndex >= i ? colors.primary : colors.border },
              ]}>
                {stepIndex > i ? (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                ) : (
                  <Text style={[styles.stepNum, { color: stepIndex === i ? '#FFF' : colors.mutedForeground }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, { color: stepIndex >= i ? colors.primary : colors.mutedForeground }]}>
                {s.label}
              </Text>
              {i < 2 && <View style={[styles.stepLine, { backgroundColor: stepIndex > i ? colors.primary : colors.border }]} />}
            </View>
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomPad + 100, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Select items */}
        {step === 'select' && (
          <>
            <View style={[styles.infoCard, { backgroundColor: colors.muted }]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                Select the items you want to return. Returns are accepted within 7 days of delivery.
              </Text>
            </View>
            {order.items.map((item) => {
              const sel = selectedItems.has(item.medicineId);
              return (
                <Pressable
                  key={item.medicineId}
                  style={[styles.itemCard, { backgroundColor: colors.card, borderColor: sel ? colors.primary : colors.border }]}
                  onPress={() => toggleItem(item.medicineId)}
                >
                  <View style={[styles.checkbox, { borderColor: sel ? colors.primary : colors.border, backgroundColor: sel ? colors.primary : 'transparent' }]}>
                    {sel && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: colors.foreground }]}>{item.medicineName}</Text>
                    <Text style={[styles.itemSub, { color: colors.mutedForeground }]}>{item.brand} · Qty: {item.qty}</Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{(item.price * item.qty).toLocaleString()}</Text>
                </Pressable>
              );
            })}
          </>
        )}

        {/* STEP 2: Reason */}
        {step === 'reason' && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Why are you returning?</Text>
            {REASONS.map((r) => (
              <Pressable
                key={r}
                style={[styles.reasonRow, { backgroundColor: colors.card, borderColor: reason === r ? colors.primary : colors.border }]}
                onPress={() => { setReason(r); Haptics.selectionAsync(); }}
              >
                <View style={[styles.radio, { borderColor: reason === r ? colors.primary : colors.border }]}>
                  {reason === r && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.reasonText, { color: colors.foreground }]}>{r}</Text>
              </Pressable>
            ))}

            <View style={{ gap: 8 }}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Additional notes (optional)</Text>
              <TextInput
                style={[styles.notesInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Describe the issue in detail…"
                placeholderTextColor={colors.mutedForeground}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={[styles.toggleRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.toggleTitle, { color: colors.foreground }]}>Schedule Pickup</Text>
                <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>We'll arrange pickup from your store</Text>
              </View>
              <Switch
                value={pickupRequested}
                onValueChange={(v) => { setPickupRequested(v); Haptics.selectionAsync(); }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Refund method</Text>
            {(['original', 'credit'] as const).map((mode) => (
              <Pressable
                key={mode}
                style={[styles.reasonRow, { backgroundColor: colors.card, borderColor: refundMode === mode ? colors.primary : colors.border }]}
                onPress={() => { setRefundMode(mode); Haptics.selectionAsync(); }}
              >
                <View style={[styles.radio, { borderColor: refundMode === mode ? colors.primary : colors.border }]}>
                  {refundMode === mode && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reasonText, { color: colors.foreground }]}>
                    {mode === 'original' ? 'Original Payment Method' : 'Store Credit (instant)'}
                  </Text>
                  <Text style={[styles.reasonSub, { color: colors.mutedForeground }]}>
                    {mode === 'original' ? '5–7 business days' : 'Added to your wallet immediately on approval'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {/* STEP 3: Confirm */}
        {step === 'confirm' && (
          <>
            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Items to Return</Text>
              {selectedOrderItems.map((item) => (
                <View key={item.medicineId} style={[styles.summaryRow, { borderTopColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: colors.foreground }]}>{item.medicineName}</Text>
                    <Text style={[styles.itemSub, { color: colors.mutedForeground }]}>Qty: {item.qty}</Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{(item.price * item.qty).toLocaleString()}</Text>
                </View>
              ))}
              <View style={[styles.refundTotalRow, { borderTopColor: colors.border, backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
                <Text style={[styles.refundLabel, { color: colors.primary }]}>Estimated Refund</Text>
                <Text style={[styles.refundAmount, { color: colors.primary }]}>₹{refundAmount.toLocaleString()}</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, gap: 12 }]}>
              <SummaryRow label="Return Reason" value={reason} colors={colors} />
              {notes ? <SummaryRow label="Notes" value={notes} colors={colors} /> : null}
              <SummaryRow label="Pickup" value={pickupRequested ? 'Scheduled (1–2 days)' : 'Self drop-off'} colors={colors} />
              <SummaryRow label="Refund to" value={refundMode === 'original' ? 'Original Payment (5–7 days)' : 'Store Credit (instant)'} colors={colors} />
            </View>

            <View style={[styles.infoCard, { backgroundColor: '#FFF8E1', borderColor: '#F57F1733' }]}>
              <Ionicons name="warning-outline" size={18} color="#F57F17" />
              <Text style={[styles.infoText, { color: '#7B5800' }]}>
                Our team will review your request within 24 hours and contact you before pickup.
              </Text>
            </View>
          </>
        )}

        {/* STEP 4: Done */}
        {step === 'done' && (
          <View style={styles.doneWrap}>
            <View style={[styles.doneIcon, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
              <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
            </View>
            <Text style={[styles.doneTitle, { color: colors.foreground }]}>Return Submitted!</Text>
            <Text style={[styles.doneSub, { color: colors.mutedForeground }]}>
              Your return request has been submitted successfully. We'll review it within 24 hours.
            </Text>

            <View style={[styles.trackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.trackTitle, { color: colors.foreground }]}>Return Tracking</Text>
              {[
                { label: 'Request Submitted', sub: 'Just now', done: true },
                { label: 'Under Review', sub: 'Within 24 hours', done: false },
                { label: 'Pickup Scheduled', sub: '1–2 business days', done: false },
                { label: 'Item Received', sub: '3–4 business days', done: false },
                { label: 'Refund Processed', sub: refundMode === 'original' ? '5–7 business days' : 'Instantly on receipt', done: false },
              ].map((t, i) => (
                <View key={i} style={styles.trackRow}>
                  <View style={styles.trackLeft}>
                    <View style={[styles.trackDot, { backgroundColor: t.done ? colors.primary : colors.border }]}>
                      {t.done && <Ionicons name="checkmark" size={10} color="#FFF" />}
                    </View>
                    {i < 4 && <View style={[styles.trackLine, { backgroundColor: t.done ? colors.primary : colors.border }]} />}
                  </View>
                  <View style={styles.trackInfo}>
                    <Text style={[styles.trackLabel, { color: t.done ? colors.foreground : colors.mutedForeground, fontWeight: t.done ? '600' : '400' }]}>
                      {t.label}
                    </Text>
                    <Text style={[styles.trackSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <Text style={styles.doneBtnText}>Back to Orders</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom action bar */}
      {step !== 'done' && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
          {step === 'select' && (
            <Text style={[styles.selectedCount, { color: colors.mutedForeground }]}>
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </Text>
          )}
          <Pressable
            style={[
              styles.nextBtn,
              { backgroundColor: colors.primary },
              ((step === 'select' && selectedItems.size === 0) || (step === 'reason' && !reason)) && { opacity: 0.4 },
            ]}
            onPress={goNext}
            disabled={(step === 'select' && selectedItems.size === 0) || (step === 'reason' && !reason)}
          >
            <Text style={styles.nextBtnText}>{step === 'confirm' ? 'Submit Return' : 'Continue'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SummaryRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.summaryDetailRow}>
      <Text style={[styles.summaryDetailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.summaryDetailValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  stepper: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, alignItems: 'center' },
  stepItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  stepLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  stepLine: { flex: 1, height: 2, marginHorizontal: 4 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  itemSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionLabel: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  reasonText: { fontSize: 14, fontFamily: 'Inter_500Medium', flex: 1 },
  reasonSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  notesInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 100 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  toggleTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  toggleSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  summaryCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 0 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, gap: 10 },
  refundTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, marginTop: 8 },
  refundLabel: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  refundAmount: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  summaryDetailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  summaryDetailLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  summaryDetailValue: { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1, textAlign: 'right' },
  doneWrap: { alignItems: 'center', gap: 16 },
  doneIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  doneTitle: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  doneSub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
  trackCard: { width: '100%', borderWidth: 1, borderRadius: 16, padding: 16, gap: 0 },
  trackTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 16 },
  trackRow: { flexDirection: 'row', gap: 14 },
  trackLeft: { alignItems: 'center', width: 20 },
  trackDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  trackLine: { width: 2, flex: 1, marginVertical: 4 },
  trackInfo: { flex: 1, paddingBottom: 20, gap: 2 },
  trackLabel: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  trackSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: 14, alignSelf: 'stretch', alignItems: 'center', marginTop: 4 },
  doneBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  selectedCount: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  nextBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14 },
  nextBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
