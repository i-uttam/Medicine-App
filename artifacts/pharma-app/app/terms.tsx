import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using MediWholesale, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all users including pharmacists, chemists, and registered wholesale buyers.',
  },
  {
    title: '2. Eligibility & Registration',
    body: 'You must hold a valid Drug License issued under the Drugs and Cosmetics Act, 1940 to purchase Schedule H and H1 medicines. You agree to provide accurate business information including your GST number, drug license number, and registered address. MediWholesale reserves the right to verify and reject registrations.',
  },
  {
    title: '3. Product Listings & Pricing',
    body: 'All prices displayed are wholesale prices exclusive of applicable taxes unless stated otherwise. GST is levied as per current government regulations. Prices are subject to change without prior notice. We make every effort to ensure accurate stock availability but cannot guarantee real-time accuracy.',
  },
  {
    title: '4. Orders & Payment',
    body: 'Orders are confirmed only upon receipt of payment or approved credit. Minimum order quantities (MOQ) apply per product. We accept UPI, NEFT/RTGS, credit account (subject to approval), and demand drafts. Invoices including GST breakdown are generated automatically for every completed order.',
  },
  {
    title: '5. Delivery',
    body: 'Delivery timelines are estimates and may vary due to supply chain or logistical constraints. Free delivery is offered on orders above ₹2,000. Cold-chain products are shipped in temperature-controlled packaging at an additional charge. Title and risk pass to you upon delivery.',
  },
  {
    title: '6. Returns & Refunds',
    body: 'Returns are accepted within 7 days of delivery for damaged, expired, or incorrectly supplied goods. Schedule H/H1 items may only be returned with documentation. Refunds are processed within 5–7 working days to the original payment method. See our Returns Policy for full details.',
  },
  {
    title: '7. Prohibited Uses',
    body: 'You may not use this platform to purchase controlled substances without valid prescriptions or to resell to unlicensed entities. Any fraudulent activity, including misrepresentation of drug license details, will result in immediate account termination and may be reported to the relevant authorities.',
  },
  {
    title: '8. Intellectual Property',
    body: 'All content on this platform including trademarks, product images, and software is the property of MediWholesale or its licensors. Unauthorized reproduction, distribution, or commercial use is strictly prohibited.',
  },
  {
    title: '9. Limitation of Liability',
    body: 'MediWholesale is not liable for any indirect, incidental, or consequential damages arising from the use of this platform or products purchased. Our total liability is limited to the amount paid for the specific order in dispute.',
  },
  {
    title: '10. Governing Law',
    body: 'These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.',
  },
];

export default function TermsScreen() {
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
          <Text style={[styles.title, { color: colors.foreground }]}>Terms of Service</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Last updated: 1 July 2026</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomPad + 40, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.introCard, { backgroundColor: colors.successLight ?? '#E6F4ED', borderColor: colors.primary + '33' }]}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
          <Text style={[styles.introText, { color: colors.primary }]}>
            MediWholesale is a B2B pharmaceutical wholesale platform. These terms govern your use of our services as a licensed pharmacy or healthcare institution.
          </Text>
        </View>

        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{s.title}</Text>
            <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>{s.body}</Text>
          </View>
        ))}

        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.foreground }]}>Questions about these terms?</Text>
          <Text style={[styles.contactBody, { color: colors.mutedForeground }]}>
            Contact our legal team at legal@mediwholesale.in or call 1800-XXX-XXXX (toll-free, Mon–Sat 9am–6pm).
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
  section: { gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionBody: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  contactCard: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 6 },
  contactTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  contactBody: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
});
