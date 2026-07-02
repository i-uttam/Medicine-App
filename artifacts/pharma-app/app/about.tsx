import React from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const STATS = [
  { value: '50,000+', label: 'Medicines Listed' },
  { value: '12,000+', label: 'Pharmacies Served' },
  { value: '99.2%', label: 'Order Accuracy' },
  { value: '4.8★', label: 'App Rating' },
];

const FEATURES = [
  { icon: 'shield-checkmark-outline', title: 'Verified Suppliers', body: 'Every supplier is licensed and audited. All medicines carry batch traceability.' },
  { icon: 'flash-outline', title: 'Fast Wholesale Pricing', body: 'Real-time wholesale rates with volume discounts applied automatically at cart.' },
  { icon: 'document-text-outline', title: 'GST-Ready Invoices', body: 'Auto-generated, GSTIN-compliant invoices for every order, ready for ITC claims.' },
  { icon: 'car-outline', title: 'Same-Day Dispatch', body: 'Orders placed before 2 PM are dispatched the same day from our regional hubs.' },
];

const LINKS = [
  { icon: 'globe-outline', label: 'Website', url: 'https://mediwholesale.in' },
  { icon: 'mail-outline', label: 'Contact Us', url: 'mailto:support@mediwholesale.in' },
  { icon: 'logo-linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
];

export default function AboutScreen() {
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
        <Text style={[styles.title, { color: colors.foreground }]}>About</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={styles.logoWrap}>
            <MaterialCommunityIcons name="medical-bag" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>MediWholesale</Text>
          <Text style={styles.appTagline}>India's Trusted B2B Pharma Platform</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, gap: 24, paddingTop: 24 }}>
          {/* About text */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Who We Are</Text>
            <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>
              MediWholesale is India's fastest-growing B2B pharmaceutical wholesale marketplace. We connect licensed pharmacies and healthcare institutions directly with verified manufacturers and distributors — eliminating middlemen and delivering better margins.{'\n\n'}
              Founded in 2023 and headquartered in Mumbai, our mission is to modernize pharmaceutical supply chains with transparency, speed, and compliance at the core.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Why MediWholesale</Text>
            <View style={{ gap: 12 }}>
              {FEATURES.map((f) => (
                <View key={f.title} style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
                    <Ionicons name={f.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.featureTitle, { color: colors.foreground }]}>{f.title}</Text>
                    <Text style={[styles.featureBody, { color: colors.mutedForeground }]}>{f.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Links */}
          <View style={[styles.linksCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Get In Touch</Text>
            {LINKS.map((link, i) => (
              <Pressable
                key={link.label}
                style={[styles.linkRow, { borderTopColor: colors.border, borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth }]}
                onPress={() => Linking.openURL(link.url).catch(() => {})}
              >
                <Ionicons name={link.icon as any} size={18} color={colors.primary} />
                <Text style={[styles.linkText, { color: colors.foreground }]}>{link.label}</Text>
                <Ionicons name="open-outline" size={14} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>

          <Text style={[styles.copyright, { color: colors.mutedForeground }]}>
            © 2026 MediWholesale Technologies Pvt Ltd{'\n'}CIN: U74999MH2023PTC123456
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
  hero: { padding: 32, alignItems: 'center', gap: 8 },
  logoWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  appName: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  appTagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  versionPill: { marginTop: 4, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  versionText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_500Medium' },
  statsRow: { flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 16 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  statDivider: { width: 1, marginVertical: 4 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionBody: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  featureCard: { flexDirection: 'row', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'flex-start' },
  featureIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 3 },
  featureBody: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },
  linksCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 0 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  linkText: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  copyright: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
});
