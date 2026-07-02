import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { Medicine } from '@/data/medicines';

type Props = {
  medicine: Medicine;
  compact?: boolean;
};

export default function MedicineCard({ medicine, compact = false }: Props) {
  const colors = useColors();
  const { addItem, getItemQty, updateQty } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const scale = useSharedValue(1);
  const qty = getItemQty(medicine.id);
  const wishlisted = isWishlisted(medicine.id);
  const isLowStock = medicine.stock > 0 && medicine.stock < 50;
  const isOutOfStock = medicine.stock === 0;

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handleAddToCart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.92, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    addItem(medicine, medicine.minOrderQty);
  }

  if (compact) {
    return (
      <Pressable
        style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/product/${medicine.id}`)}
      >
        <View style={[styles.compactIcon, { backgroundColor: medicine.iconColor + '18' }]}>
          <MaterialCommunityIcons name={medicine.iconName as any} size={28} color={medicine.iconColor} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>{medicine.name}</Text>
          <Text style={[styles.compactBrand, { color: colors.mutedForeground }]}>{medicine.brand}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.compactPrice, { color: colors.primary }]}>₹{medicine.wholesalePrice}</Text>
            <Text style={[styles.mrp, { color: colors.mutedForeground }]}>₹{medicine.mrp}</Text>
            <View style={[styles.discBadge, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
              <Text style={[styles.discText, { color: colors.primary }]}>{medicine.discount}% off</Text>
            </View>
          </View>
        </View>
        {qty > 0 ? (
          <View style={styles.qtyControl}>
            <Pressable
              style={[styles.qtyBtn, { backgroundColor: colors.muted }]}
              onPress={() => { Haptics.selectionAsync(); updateQty(medicine.id, qty - medicine.minOrderQty); }}
            >
              <Ionicons name="remove" size={14} color={colors.foreground} />
            </Pressable>
            <Text style={[styles.qtyNum, { color: colors.foreground }]}>{qty}</Text>
            <Pressable
              style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
              onPress={() => { Haptics.selectionAsync(); updateQty(medicine.id, qty + medicine.minOrderQty); }}
            >
              <Ionicons name="add" size={14} color="#FFF" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.addBtnSmall, { backgroundColor: isOutOfStock ? colors.muted : colors.primary }]}
            onPress={!isOutOfStock ? handleAddToCart : undefined}
            disabled={isOutOfStock}
          >
            <Ionicons name="add" size={16} color={isOutOfStock ? colors.mutedForeground : '#FFF'} />
          </Pressable>
        )}
      </Pressable>
    );
  }

  return (
    <Animated.View style={animStyle}>
      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/product/${medicine.id}`)}
      >
        {/* Wishlist */}
        <Pressable
          style={styles.wishlistBtn}
          onPress={(e) => { e.stopPropagation(); toggle(medicine.id); Haptics.selectionAsync(); }}
          hitSlop={8}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={wishlisted ? colors.destructive : colors.mutedForeground}
          />
        </Pressable>

        {/* Image area */}
        <View style={[styles.imgBox, { backgroundColor: medicine.iconColor + '14' }]}>
          <MaterialCommunityIcons name={medicine.iconName as any} size={44} color={medicine.iconColor} />
          {isOutOfStock && (
            <View style={[styles.outOfStockOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>{medicine.name}</Text>
          <Text style={[styles.brand, { color: colors.mutedForeground }]} numberOfLines={1}>
            {medicine.genericName} · {medicine.brand}
          </Text>
          <Text style={[styles.packSize, { color: colors.mutedForeground }]} numberOfLines={1}>{medicine.packSize}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>₹{medicine.wholesalePrice}</Text>
            <Text style={[styles.mrp, { color: colors.mutedForeground }]}>₹{medicine.mrp}</Text>
            <View style={[styles.discBadge, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
              <Text style={[styles.discText, { color: colors.primary }]}>{medicine.discount}% off</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View>
              {isLowStock ? (
                <View style={[styles.stockBadge, { backgroundColor: '#FFF8E1' }]}>
                  <Text style={[styles.stockText, { color: '#F57F17' }]}>Low Stock</Text>
                </View>
              ) : isOutOfStock ? (
                <View style={[styles.stockBadge, { backgroundColor: '#FEECEB' }]}>
                  <Text style={[styles.stockText, { color: colors.destructive }]}>Out of Stock</Text>
                </View>
              ) : (
                <View style={[styles.stockBadge, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
                  <Text style={[styles.stockText, { color: colors.primary }]}>In Stock</Text>
                </View>
              )}
              {medicine.minOrderQty > 1 && (
                <Text style={[styles.moq, { color: colors.mutedForeground }]}>Min: {medicine.minOrderQty}</Text>
              )}
            </View>

            {qty > 0 ? (
              <View style={styles.qtyControl}>
                <Pressable
                  style={[styles.qtyBtn, { backgroundColor: colors.muted }]}
                  onPress={() => { Haptics.selectionAsync(); updateQty(medicine.id, qty - medicine.minOrderQty); }}
                >
                  <Ionicons name="remove" size={14} color={colors.foreground} />
                </Pressable>
                <Text style={[styles.qtyNum, { color: colors.foreground }]}>{qty}</Text>
                <Pressable
                  style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
                  onPress={() => { Haptics.selectionAsync(); updateQty(medicine.id, qty + medicine.minOrderQty); }}
                >
                  <Ionicons name="add" size={14} color="#FFF" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.addBtn, { backgroundColor: isOutOfStock ? colors.muted : colors.primary }]}
                onPress={!isOutOfStock ? handleAddToCart : undefined}
                disabled={isOutOfStock}
              >
                <Ionicons name="add" size={18} color={isOutOfStock ? colors.mutedForeground : '#FFF'} />
                <Text style={[styles.addBtnText, { color: isOutOfStock ? colors.mutedForeground : '#FFF' }]}>
                  {isOutOfStock ? 'Unavailable' : 'Add'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  imgBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  brand: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  packSize: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  mrp: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  discBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  discText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  stockBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  moq: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginTop: 3,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  // Compact card
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    marginBottom: 10,
  },
  compactIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  compactBrand: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  compactPrice: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    minWidth: 22,
    textAlign: 'center',
  },
  addBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
