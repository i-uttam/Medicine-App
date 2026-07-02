import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getMedicineById } from '@/data/medicines';
import { useColors } from '@/hooks/useColors';

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicine = getMedicineById(id ?? '');
  const { addItem, getItemQty, updateQty } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [activeTab, setActiveTab] = useState<'info' | 'details' | 'bulk'>('info');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!medicine) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Product not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const qty = getItemQty(medicine.id);
  const wishlisted = isWishlisted(medicine.id);
  const isOutOfStock = medicine.stock === 0;
  const gstAmount = Math.round(medicine.wholesalePrice * medicine.gstRate / 100);

  const BULK_TIERS = [
    { min: medicine.minOrderQty, max: 49, price: medicine.wholesalePrice, label: 'Standard' },
    { min: 50, max: 199, price: Math.round(medicine.wholesalePrice * 0.95), label: '5% extra off' },
    { min: 200, max: 999, price: Math.round(medicine.wholesalePrice * 0.90), label: '10% extra off' },
    { min: 1000, max: null, price: Math.round(medicine.wholesalePrice * 0.85), label: '15% extra off' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={[medicine.iconColor + 'CC', medicine.iconColor + '66', 'transparent']}
        style={[styles.heroGradient, { paddingTop: topPad }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.headerBtn, wishlisted && styles.headerBtnWishlisted]}
              onPress={() => { toggle(medicine.id); Haptics.selectionAsync(); }}
            >
              <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={22} color={wishlisted ? '#FFFFFF' : '#FFFFFF'} />
            </Pressable>
            <Pressable style={styles.headerBtn}>
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Hero image area */}
        <View style={styles.heroImageWrap}>
          <MaterialCommunityIcons name={medicine.iconName as any} size={100} color={medicine.iconColor} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {/* Title block */}
          <View style={styles.titleBlock}>
            <View style={[styles.catChip, { backgroundColor: medicine.iconColor + '18' }]}>
              <Text style={[styles.catChipText, { color: medicine.iconColor }]}>
                {medicine.category.charAt(0).toUpperCase() + medicine.category.slice(1)}
              </Text>
            </View>
            {medicine.prescriptionRequired && (
              <View style={[styles.rxBadge, { backgroundColor: '#FEECEB' }]}>
                <Ionicons name="medical" size={12} color={colors.destructive} />
                <Text style={[styles.rxText, { color: colors.destructive }]}>Rx Required</Text>
              </View>
            )}
            <Text style={[styles.medicineName, { color: colors.foreground }]}>{medicine.name}</Text>
            <Text style={[styles.medicineGeneric, { color: colors.mutedForeground }]}>
              {medicine.genericName} · {medicine.brand}
            </Text>
            <Text style={[styles.packSizeText, { color: colors.mutedForeground }]}>
              {medicine.packSize} · Mfr: {medicine.manufacturer}
            </Text>
          </View>

          {/* Price card */}
          <View style={[styles.priceCard, { backgroundColor: colors.successLight ?? '#E6F4ED', borderColor: colors.primary + '33' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.wholesaleLabel, { color: colors.primary }]}>Wholesale Price</Text>
              <Text style={[styles.wholesalePrice, { color: colors.primary }]}>₹{medicine.wholesalePrice}</Text>
              <Text style={[styles.mrpText, { color: colors.mutedForeground }]}>MRP ₹{medicine.mrp} · GST {medicine.gstRate}% (₹{gstAmount})</Text>
            </View>
            <View style={[styles.discPill, { backgroundColor: colors.primary }]}>
              <Text style={styles.discPillText}>{medicine.discount}% OFF</Text>
            </View>
          </View>

          {/* Stock / MOQ */}
          <View style={[styles.infoRow, { borderColor: colors.border }]}>
            <View style={styles.infoItem}>
              <Ionicons name="cube-outline" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Stock</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{medicine.stock.toLocaleString()} units</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
            <View style={styles.infoItem}>
              <Ionicons name="bag-outline" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Min Order</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{medicine.minOrderQty} units</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
            <View style={styles.infoItem}>
              <Ionicons name="receipt-outline" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>GST Rate</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{medicine.gstRate}%</Text>
            </View>
          </View>

          {/* Tab switcher */}
          <View style={[styles.tabBar, { borderColor: colors.border }]}>
            {(['info', 'details', 'bulk'] as const).map((t) => (
              <Pressable
                key={t}
                style={[styles.tabBtn, activeTab === t && { backgroundColor: colors.primary }]}
                onPress={() => { setActiveTab(t); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.tabBtnText, activeTab === t ? { color: '#FFF' } : { color: colors.mutedForeground }]}>
                  {t === 'info' ? 'Overview' : t === 'details' ? 'Clinical' : 'Bulk Pricing'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab content */}
          {activeTab === 'info' && (
            <View style={styles.tabContent}>
              <InfoSection title="Description" content={medicine.description} colors={colors} />
              <InfoSection title="Composition" content={medicine.composition} colors={colors} />
              <ListSection title="Uses / Indications" items={medicine.uses} colors={colors} iconColor={colors.primary} />
              <InfoSection title="Storage" content={medicine.storage} colors={colors} />
            </View>
          )}

          {activeTab === 'details' && (
            <View style={styles.tabContent}>
              <InfoSection title="Dosage & Administration" content={medicine.dosage} colors={colors} />
              <ListSection title="Side Effects" items={medicine.sideEffects} colors={colors} iconColor={colors.warning} />
              <View style={[styles.warningBox, { backgroundColor: '#FFF8E1', borderColor: colors.warning + '44' }]}>
                <Ionicons name="warning-outline" size={20} color="#F57F17" />
                <Text style={[styles.warningText, { color: '#7B5800' }]}>
                  Always dispense as per manufacturer guidelines. Keep out of reach of children.
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'bulk' && (
            <View style={styles.tabContent}>
              <Text style={[styles.bulkTitle, { color: colors.foreground }]}>Volume Discount Tiers</Text>
              {BULK_TIERS.map((tier, i) => (
                <View key={i} style={[styles.tierRow, { backgroundColor: i === 0 ? colors.card : colors.muted, borderColor: colors.border }]}>
                  <View>
                    <Text style={[styles.tierQty, { color: colors.foreground }]}>
                      {tier.min}+ units{tier.max ? ` (up to ${tier.max})` : ''}
                    </Text>
                    <Text style={[styles.tierLabel, { color: colors.primary }]}>{tier.label}</Text>
                  </View>
                  <Text style={[styles.tierPrice, { color: colors.primary }]}>₹{tier.price}/unit</Text>
                </View>
              ))}
              <Text style={[styles.bulkNote, { color: colors.mutedForeground }]}>
                * Bulk pricing applied automatically in cart. Contact your sales rep for custom quotes above 5000 units.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        {qty > 0 ? (
          <View style={styles.qtyBarRow}>
            <View>
              <Text style={[styles.qtyBarLabel, { color: colors.mutedForeground }]}>In cart</Text>
              <Text style={[styles.qtyBarTotal, { color: colors.primary }]}>
                {qty} units · ₹{(qty * medicine.wholesalePrice).toLocaleString()}
              </Text>
            </View>
            <View style={styles.qtyControl}>
              <Pressable
                style={[styles.qtyBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
                onPress={() => { Haptics.selectionAsync(); updateQty(medicine.id, qty - medicine.minOrderQty); }}
              >
                <Ionicons name="remove" size={18} color={colors.foreground} />
              </Pressable>
              <Text style={[styles.qtyNum, { color: colors.foreground }]}>{qty}</Text>
              <Pressable
                style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
                onPress={() => { Haptics.selectionAsync(); updateQty(medicine.id, qty + medicine.minOrderQty); }}
              >
                <Ionicons name="add" size={18} color="#FFF" />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.bottomBtns}>
            <Pressable
              style={[styles.wishlistBarBtn, { borderColor: colors.border }]}
              onPress={() => { toggle(medicine.id); Haptics.selectionAsync(); }}
            >
              <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={22} color={wishlisted ? colors.destructive : colors.foreground} />
            </Pressable>
            <Pressable
              style={[styles.addToCartBtn, { backgroundColor: isOutOfStock ? colors.muted : colors.primary }]}
              onPress={() => {
                if (isOutOfStock) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                addItem(medicine, medicine.minOrderQty);
              }}
              disabled={isOutOfStock}
            >
              <Ionicons name="cart-outline" size={20} color="#FFF" />
              <Text style={styles.addToCartText}>{isOutOfStock ? 'Out of Stock' : `Add to Cart · Min ${medicine.minOrderQty}`}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function InfoSection({ title, content, colors }: { title: string; content: string; colors: any }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>{content}</Text>
    </View>
  );
}

function ListSection({ title, items, colors, iconColor }: { title: string; items: string[]; colors: any; iconColor: string }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.listRow}>
          <View style={[styles.bullet, { backgroundColor: iconColor }]} />
          <Text style={[styles.listItem, { color: colors.mutedForeground }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  heroGradient: { paddingHorizontal: 16, paddingBottom: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  headerBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.30)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  headerBtnWishlisted: { backgroundColor: 'rgba(234,67,53,0.75)', borderColor: 'rgba(255,255,255,0.25)' },
  headerActions: { flexDirection: 'row', gap: 10 },
  heroImageWrap: { alignItems: 'center', paddingVertical: 24 },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -16, paddingHorizontal: 20, paddingTop: 24, gap: 16 },
  titleBlock: { gap: 6 },
  catChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  catChipText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  rxBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  rxText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  medicineName: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold', lineHeight: 28 },
  medicineGeneric: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  packSizeText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  priceCard: { borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center' },
  wholesaleLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 2 },
  wholesalePrice: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  mrpText: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  discPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  discPillText: { color: '#FFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  infoRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 14, padding: 14 },
  infoItem: { flex: 1, alignItems: 'center', gap: 4 },
  infoLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  infoDivider: { width: 1, marginVertical: 4 },
  tabBar: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 4, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabBtnText: { fontSize: 13, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  tabContent: { gap: 16 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionBody: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  listRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  listItem: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  warningBox: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  bulkTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  tierRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1 },
  tierQty: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  tierLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tierPrice: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  bulkNote: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 14 },
  qtyBarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyBarLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  qtyBarTotal: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', minWidth: 32, textAlign: 'center' },
  bottomBtns: { flexDirection: 'row', gap: 12 },
  wishlistBarBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  addToCartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 14 },
  addToCartText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
