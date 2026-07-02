import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import type { Medicine } from '@/data/medicines';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useColors } from '@/hooks/useColors';

type Props = { medicine: Medicine };

export default function FeaturedProductCard({ medicine }: Props) {
  const colors = useColors();
  const { addItem, getItemQty, updateQty } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const scale = useSharedValue(1);

  const qty = getItemQty(medicine.id);
  const wishlisted = isWishlisted(medicine.id);
  const isOutOfStock = medicine.stock === 0;
  const isLowStock = medicine.stock > 0 && medicine.stock < 50;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleAdd() {
    if (isOutOfStock) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.96, { damping: 12 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    addItem(medicine, medicine.minOrderQty);
  }

  function handleInc() {
    Haptics.selectionAsync();
    updateQty(medicine.id, qty + medicine.minOrderQty);
  }

  function handleDec() {
    Haptics.selectionAsync();
    updateQty(medicine.id, qty - medicine.minOrderQty);
  }

  return (
    <Animated.View style={[styles.wrapper, animStyle]}>
      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/product/${medicine.id}`)}
        android_ripple={{ color: colors.muted }}
      >
        {/* ── Image area ── */}
        <View style={[styles.imageArea, { backgroundColor: medicine.iconColor + '14' }]}>
          {/* Discount badge — top left */}
          <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.discountText}>{medicine.discount}% off</Text>
          </View>

          {/* Wishlist — top right */}
          <Pressable
            style={styles.wishlistBtn}
            onPress={(e) => {
              e.stopPropagation();
              toggle(medicine.id);
              Haptics.selectionAsync();
            }}
            hitSlop={10}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={wishlisted ? colors.destructive : colors.mutedForeground}
            />
          </Pressable>

          {/* Medicine icon */}
          <MaterialCommunityIcons
            name={medicine.iconName as any}
            size={62}
            color={medicine.iconColor}
          />

          {/* Rx badge */}
          {medicine.prescriptionRequired && (
            <View style={styles.rxBadge}>
              <Text style={styles.rxText}>Rx</Text>
            </View>
          )}

          {/* Out-of-stock overlay */}
          {isOutOfStock && (
            <View style={styles.oosOverlay}>
              <Text style={styles.oosText}>Out of{'\n'}Stock</Text>
            </View>
          )}
        </View>

        {/* ── Info area ── */}
        <View style={styles.info}>
          {/* Name */}
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {medicine.name}
          </Text>

          {/* Brand · Generic */}
          <Text
            style={[styles.brand, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {medicine.brand}
          </Text>

          {/* Pack size */}
          <Text
            style={[styles.packSize, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {medicine.packSize}
          </Text>

          {/* ── Price row ── */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ₹{medicine.wholesalePrice}
            </Text>
            <Text style={[styles.mrp, { color: colors.mutedForeground }]}>
              ₹{medicine.mrp}
            </Text>
          </View>

          {/* Stock label */}
          {isLowStock && !isOutOfStock && (
            <Text style={[styles.stockLabel, { color: '#E67E22' }]}>
              Only {medicine.stock} left
            </Text>
          )}
          {medicine.minOrderQty > 1 && !isLowStock && (
            <Text style={[styles.stockLabel, { color: colors.mutedForeground }]}>
              Min: {medicine.minOrderQty} units
            </Text>
          )}

          {/* ── Add / Qty control ── */}
          {qty > 0 ? (
            <View style={[styles.qtyRow, { borderColor: colors.primary + '55', backgroundColor: colors.primary + '08' }]}>
              <Pressable
                style={[styles.qtyBtn, { backgroundColor: colors.primary + '18' }]}
                onPress={handleDec}
                hitSlop={6}
              >
                <Ionicons name="remove" size={16} color={colors.primary} />
              </Pressable>
              <Text style={[styles.qtyNum, { color: colors.foreground }]}>{qty}</Text>
              <Pressable
                style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
                onPress={handleInc}
                hitSlop={6}
              >
                <Ionicons name="add" size={16} color="#FFF" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[
                styles.addBtn,
                {
                  backgroundColor: isOutOfStock
                    ? colors.muted
                    : colors.primary,
                },
              ]}
              onPress={handleAdd}
              disabled={isOutOfStock}
            >
              {!isOutOfStock && (
                <Ionicons name="add" size={16} color="#FFF" />
              )}
              <Text
                style={[
                  styles.addBtnText,
                  { color: isOutOfStock ? colors.mutedForeground : '#FFF' },
                ]}
              >
                {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const CARD_WIDTH = 176;

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    flex: 1,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  // Image area
  imageArea: {
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  rxBadge: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    backgroundColor: '#EA4335',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rxText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  oosOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oosText: {
    color: '#FFF',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    textAlign: 'center',
  },

  // Info area
  info: {
    padding: 12,
    gap: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 18,
    marginBottom: 1,
  },
  brand: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
  },
  packSize: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 6,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
  },
  mrp: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  stockLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    marginBottom: 2,
  },

  // Add button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 38,
    borderRadius: 10,
    marginTop: 6,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },

  // Qty stepper
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 10,
    height: 38,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    minWidth: 32,
    textAlign: 'center',
  },
});
