import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Tab = 'phone' | 'email';

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
    >
      <Animated.View style={[styles.primaryBtn, style]}>
        <Text style={styles.primaryBtnText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function SocialButton({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={onPress}
    >
      <Animated.View style={[styles.socialBtn, style]}>
        {icon}
        <Text style={styles.socialBtnText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function handleContinue() {
    if (activeTab === 'phone') {
      if (!/^\d{10}$/.test(phone.trim())) {
        setError('Enter a valid 10-digit mobile number');
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Enter a valid email address');
        return;
      }
    }
    setError('');
    router.push({ pathname: '/otp', params: activeTab === 'phone' ? { phone } : { email } });
  }

  function handleGoogleLogin() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/otp', params: { email: 'demo@mediwholesale.in' } });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../assets/images/splash-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoPill}>
            <Ionicons name="medical" size={18} color="#FFFFFF" />
            <Text style={styles.logoPillText}>MediWholesale</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sign in to access wholesale pricing{'\n'}for pharmacies &amp; distributors
          </Text>
        </View>

        {/* Tab selector */}
        <View style={[styles.tabRow, { borderColor: colors.border }]}>
          {(['phone', 'email'] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabBtn, activeTab === tab && { backgroundColor: colors.primary }]}
              onPress={() => { setActiveTab(tab); setError(''); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.tabBtnText, activeTab === tab ? { color: '#FFFFFF' } : { color: colors.mutedForeground }]}>
                {tab === 'phone' ? 'Mobile Number' : 'Email'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Input */}
        {activeTab === 'phone' ? (
          <View style={[styles.inputRow, { borderColor: error ? colors.destructive : colors.border, backgroundColor: colors.card }]}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={[styles.code, { color: colors.foreground }]}>+91</Text>
              <Ionicons name="chevron-down" size={14} color={colors.mutedForeground} />
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Enter mobile number"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={(t) => { setPhone(t); setError(''); }}
            />
          </View>
        ) : (
          <View style={[styles.inputRow, { borderColor: error ? colors.destructive : colors.border, backgroundColor: colors.card }]}>
            <Ionicons name="mail-outline" size={20} color={colors.mutedForeground} style={{ marginLeft: 16 }} />
            <TextInput
              style={[styles.input, { color: colors.foreground, flex: 1 }]}
              placeholder="Enter email address"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
            />
          </View>
        )}

        {!!error && <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>}

        <PrimaryButton
          label={activeTab === 'phone' ? 'Send OTP' : 'Continue'}
          onPress={handleContinue}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.mutedForeground }]}>or continue with</Text>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        </View>

        <SocialButton
          icon={<MaterialCommunityIcons name="google" size={20} color="#EA4335" />}
          label="Continue with Google"
          onPress={handleGoogleLogin}
        />

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.mutedForeground }]}>New business? </Text>
          <Pressable onPress={() => Haptics.selectionAsync()}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>Register your business</Text>
          </Pressable>
        </View>

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By continuing, you agree to our{' '}
          <Text style={{ color: colors.accent }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.accent }}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, gap: 16 },
  illustrationWrap: { alignItems: 'center', marginBottom: 4 },
  illustration: { width: 200, height: 160 },
  header: { gap: 8, marginBottom: 4 },
  logoPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0F9D58', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  logoPillText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  title: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter_700Bold', marginTop: 4 },
  subtitle: { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  tabRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 4, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  tabBtnText: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, height: 56, overflow: 'hidden' },
  countryCode: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14 },
  flag: { fontSize: 18 },
  code: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  inputDivider: { width: 1, height: 28, backgroundColor: '#E2E8F0', marginRight: 4 },
  input: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  errorText: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: -8 },
  primaryBtn: { backgroundColor: '#0F9D58', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', shadowColor: '#0F9D58', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  line: { flex: 1, height: 1 },
  orText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, height: 54, backgroundColor: '#FFFFFF' },
  socialBtnText: { fontSize: 15, fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter_500Medium' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  registerText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  registerLink: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  terms: { fontSize: 12, textAlign: 'center', lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
