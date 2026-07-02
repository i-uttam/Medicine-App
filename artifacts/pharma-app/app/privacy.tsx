import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const SECTIONS = [
  {
    title: 'What We Collect',
    items: [
      'Business details: name, drug license number, GST number, registered address',
      'Contact info: phone number and email address',
      'Order history and transaction data',
      'Device info: IP address, browser type, and operating system',
      'Usage data: pages visited, search queries, and app interactions',
    ],
  },
  {
    title: 'How We Use Your Data',
    items: [
      'To process and deliver your orders',
      'To verify your drug license and business credentials',
      'To generate GST-compliant invoices',
      'To send order updates, offers, and restock alerts (opt-out available)',
      'To improve our platform through analytics',
      'To comply with legal obligations under the Drugs and Cosmetics Act',
    ],
  },
  {
    title: 'Data Sharing',
    items: [
      'Logistics partners: for delivery and tracking',
      'Payment gateways: for secure transaction processing',
      'Government agencies: when required by law or regulatory bodies',
      'We do not sell or rent your personal data to third parties',
    ],
  },
  {
    title: 'Data Retention',
    items: [
      'Order and invoice records: 8 years (as mandated by GST law)',
      'Drug license records: duration of account + 3 years',
      'Account data: until account deletion + 30 days grace period',
    ],
  },
  {
    title: 'Your Rights',
    items: [
      'Access: Request a copy of your personal data',
      'Correction: Update or correct inaccurate information',
      'Deletion: Request deletion of your account and data (subject to legal retention)',
      'Opt-out: Unsubscribe from marketing communications at any time',
    ],
  },
  {
    title: 'Security',
    items: [
      'All data is encrypted in transit (TLS 1.3) and at rest (AES-256)',
      'Access to business data is role-restricted and audit-logged',
      'We conduct periodic security audits and penetration testing',
    ],
  },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Privacy Policy</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Last updated: 1 July 2026</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomPad + 40, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.introCard, { backgroundColor: '#E8F0FE', borderColor: '#4285F433' }]}>
          <Ionicons name="lock-closed-outline" size={22} color="#4285F4" />
          <Text style={[styles.introText, { color: '#1A56A0' }]}>
            We take your privacy seriously. This policy explains what data we collect, how we use it, and your rights as a user of MediWholesale.
          </Text>
        </View>

        {SECTIONS.map((s) => (
          <View key={s.title} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{s.title}</Text>
            <View style={styles.itemList}>
              {s.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.itemText, { color: colors.mutedForeground }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.foreground }]}>Data Protection Officer</Text>
          <Text style={[styles.contactBody, { color: colors.mutedForeground }]}>
            For privacy requests, contact: privacy@mediwholesale.in{'\n'}
            Response time: within 72 hours
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  introCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1 },
  introText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  sectionCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  itemList: { gap: 10 },
  itemRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  itemText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 21 },
  contactCard: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 6 },
  contactTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  contactBody: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 21 },
});
