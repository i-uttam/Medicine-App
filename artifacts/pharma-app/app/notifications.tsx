import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type NotifType = 'order' | 'offer' | 'restock' | 'system';

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const NOTIF_KEY = '@pharma_notifications';

const SEED_NOTIFS: Notification[] = [
  { id: 'n1', type: 'order', title: 'Order Dispatched', body: 'Your order ORD-20260628-001 has been dispatched. Expected delivery in 1–2 days.', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'n2', type: 'offer', title: 'Flash Sale — 40% Extra Off', body: 'Antibiotics category is on sale today until midnight. Add to cart now before stock runs out!', time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'n3', type: 'restock', title: 'Restock Alert: Insulin Glargine', body: 'Insulin Glargine 100IU is back in stock. Min order: 5 vials.', time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), read: false },
  { id: 'n4', type: 'order', title: 'Order Delivered', body: 'Order ORD-20260620-002 has been delivered successfully. Rate your experience!', time: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'n5', type: 'system', title: 'GST Invoice Ready', body: 'Your GST invoice for order ORD-20260620-002 is ready to download from My Orders.', time: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'n6', type: 'offer', title: 'Weekend Offer: Free Delivery', body: 'Free delivery on all orders above ₹1,000 this weekend only. Use code FREEDEL.', time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'n7', type: 'restock', title: 'Restock Alert: Atorvastatin 10mg', body: 'Atorvastatin 10mg (Lipitor) is available again. Only 800 strips in stock — order soon.', time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'n8', type: 'system', title: 'Account Verified', body: 'Your drug license has been verified. You can now place orders without limits.', time: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), read: true },
];

const TYPE_CONFIG: Record<NotifType, { icon: string; iconColor: string; bg: string }> = {
  order:   { icon: 'receipt-outline',        iconColor: '#4285F4', bg: '#E8F0FE' },
  offer:   { icon: 'pricetag-outline',        iconColor: '#F57F17', bg: '#FFF8E1' },
  restock: { icon: 'cube-outline',            iconColor: '#0F9D58', bg: '#E6F4ED' },
  system:  { icon: 'information-circle-outline', iconColor: '#9C27B0', bg: '#F3E5F5' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type FilterKey = 'all' | 'order' | 'offer' | 'restock';

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then((s) => {
      setNotifs(s ? JSON.parse(s) : SEED_NOTIFS);
      if (!s) AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(SEED_NOTIFS)).catch(() => {});
    }).catch(() => setNotifs(SEED_NOTIFS));
  }, []);

  function save(updated: Notification[]) {
    setNotifs(updated);
    AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(updated)).catch(() => {});
  }

  function markAllRead() {
    save(notifs.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    save(notifs.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function deleteNotif(id: string) {
    save(notifs.filter((n) => n.id !== id));
  }

  const unreadCount = notifs.filter((n) => !n.read).length;
  const filtered = filter === 'all' ? notifs : notifs.filter((n) => n.type === filter);

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'order', label: 'Orders' },
    { key: 'offer', label: 'Offers' },
    { key: 'restock', label: 'Restock' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Pressable
            style={[styles.backBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.destructive }]}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
          {unreadCount > 0 && (
            <Pressable onPress={markAllRead}>
              <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              style={[styles.filterChip, { borderColor: filter === f.key ? colors.primary : colors.border }, filter === f.key && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, { color: filter === f.key ? '#FFF' : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingVertical: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={60} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No notifications here</Text>
          </View>
        ) : (
          filtered.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type];
            return (
              <Pressable
                key={notif.id}
                style={[
                  styles.notifCard,
                  { backgroundColor: notif.read ? colors.background : colors.card, borderBottomColor: colors.border },
                ]}
                onPress={() => markRead(notif.id)}
              >
                {!notif.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon as any} size={20} color={cfg.iconColor} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={styles.notifTitleRow}>
                    <Text style={[styles.notifTitle, { color: colors.foreground, fontWeight: notif.read ? '500' : '700' }]}>
                      {notif.title}
                    </Text>
                    <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{timeAgo(notif.time)}</Text>
                  </View>
                  <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {notif.body}
                  </Text>
                </View>
                <Pressable style={styles.deleteBtn} onPress={() => deleteNotif(notif.id)}>
                  <Ionicons name="close" size={16} color={colors.mutedForeground} />
                </Pressable>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  unreadBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, minWidth: 22, alignItems: 'center' },
  unreadBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  markAllText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  filterRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12, position: 'relative' },
  unreadDot: { position: 'absolute', left: 6, top: 20, width: 6, height: 6, borderRadius: 3 },
  notifIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  notifTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  notifTitle: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold', lineHeight: 20 },
  notifTime: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  notifBody: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },
  deleteBtn: { padding: 4, marginTop: 2 },
  emptyWrap: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
