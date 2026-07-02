import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicineCard from '@/components/MedicineCard';
import FeaturedProductCard from '@/components/FeaturedProductCard';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, MEDICINES } from '@/data/medicines';
import { useColors } from '@/hooks/useColors';

const FEATURED = MEDICINES.slice(0, 6);
const TOP_CATEGORIES = CATEGORIES.slice(0, 8);
const RECENTLY_VIEWED = MEDICINES.slice(6, 9);

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { totalItems } = useCart();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting} numberOfLines={1}>{greeting} 👋</Text>
            <Text style={styles.businessName} numberOfLines={1}>{profile.businessName}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable
              style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.avatarText}>
                {profile.businessName.slice(0, 2).toUpperCase()}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Search bar */}
        <Pressable style={styles.searchBar} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={18} color="#64748B" />
          <Text style={styles.searchPlaceholder}>Search medicines, brands…</Text>
          <Ionicons name="barcode-outline" size={20} color="#64748B" />
        </Pressable>
      </View>

      {/* Offer banner */}
      <View style={[styles.banner, { backgroundColor: '#1a6e3f' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Flash Sale — Up to 35% off</Text>
          <Text style={styles.bannerSub}>On bulk orders above ₹5,000</Text>
        </View>
        <Pressable
          style={styles.bannerBtn}
          onPress={() => router.push('/search')}
        >
          <Text style={[styles.bannerBtnText, { color: colors.primary }]}>Shop Now</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
          <Pressable onPress={() => router.push('/(tabs)/categories')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.catGrid}>
          {TOP_CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={styles.catChip}
              onPress={() => { Haptics.selectionAsync(); router.push(`/products/${c.id}`); }}
            >
              <View style={[styles.catIcon, { backgroundColor: c.color + '18' }]}>
                <MaterialCommunityIcons name={c.icon as any} size={22} color={c.color} />
              </View>
              <Text style={[styles.catLabel, { color: colors.foreground }]} numberOfLines={1}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Products</Text>
          <Pressable onPress={() => router.push('/search')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </Pressable>
        </View>
      </View>

      {/* Horizontal carousel — bleeds edge-to-edge */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        decelerationRate="fast"
        snapToInterval={186}
        snapToAlignment="start"
      >
        {FEATURED.map((m) => (
          <FeaturedProductCard key={m.id} medicine={m} />
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20 }}>

        {/* Recently viewed / Top sellers */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Sellers</Text>
        </View>
        {RECENTLY_VIEWED.map((m) => (
          <MedicineCard key={m.id} medicine={m} compact />
        ))}

        {/* Quick reorder */}
        <View style={[styles.reorderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="clock-fast" size={28} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.reorderTitle, { color: colors.foreground }]}>Quick Reorder</Text>
            <Text style={[styles.reorderSub, { color: colors.mutedForeground }]}>Re-buy your last order instantly</Text>
          </View>
          <Pressable
            style={[styles.reorderBtn, { borderColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Text style={[styles.reorderBtnText, { color: colors.primary }]}>View Orders</Text>
          </Pressable>
        </View>
      </View>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <Pressable
          style={[styles.floatingCart, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Ionicons name="cart" size={22} color="#FFF" />
          <Text style={styles.floatingCartText}>{totalItems} items in cart</Text>
          <Ionicons name="chevron-forward" size={18} color="#FFF" />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 },
  headerLeft: { flex: 1, minWidth: 0 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  businessName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 0 },
  iconBtn: { position: 'relative' },
  notifDot: { position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FBBC05', borderWidth: 1.5, borderColor: '#0F9D58' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  searchPlaceholder: { flex: 1, fontSize: 14, color: '#94A3B8', fontFamily: 'Inter_400Regular' },
  banner: { marginHorizontal: 20, marginTop: 16, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  bannerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  bannerBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  bannerBtnText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catChip: { width: '22%', alignItems: 'center', gap: 6 },
  catIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: 11, fontWeight: '500', fontFamily: 'Inter_500Medium', textAlign: 'center' },
  carousel: { paddingLeft: 20, paddingRight: 12, gap: 10, paddingBottom: 4 },
  reorderCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 16, gap: 14, marginTop: 8, marginBottom: 8 },
  reorderTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  reorderSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  reorderBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  reorderBtnText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  floatingCart: { marginHorizontal: 20, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, shadowColor: '#0F9D58', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  floatingCartText: { flex: 1, color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
