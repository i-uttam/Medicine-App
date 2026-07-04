import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

type Mode = 'signin' | 'register';

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

function PrimaryButton({ label, onPress, loading }: { label: string; onPress: () => void; loading?: boolean }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={() => { if (!loading) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); } }}
      disabled={loading}
    >
      <Animated.View style={[styles.primaryBtn, style, loading && { opacity: 0.7 }]}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
}

function InputRow({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  hasError,
  rightEl,
  returnKeyType,
  onSubmitEditing,
  inputRef,
}: any) {
  const colors = useColors();
  return (
    <View style={[styles.inputRow, { borderColor: hasError ? colors.destructive : colors.border, backgroundColor: colors.card }]}>
      <Ionicons name={icon} size={20} color={colors.mutedForeground} style={{ marginLeft: 16 }} />
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
      {rightEl}
    </View>
  );
}

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function clearError() { setError(''); }

  async function handleSubmit() {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/auth/login-password' : '/auth/register';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await login(data.user?.id ?? 0, data.user?.phone ?? '', data.user?.email ?? email.trim().toLowerCase());
      router.replace('/(tabs)');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpLogin() {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address to receive OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to send OTP. Please try again.');
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: '/otp',
        params: {
          email: email.trim().toLowerCase(),
          ...(data.devOtp ? { devOtp: data.devOtp } : {}),
        },
      });
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
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
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../assets/images/splash-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <View style={styles.logoPill}>
            <Ionicons name="medical" size={18} color="#FFFFFF" />
            <Text style={styles.logoPillText}>MediWholesale</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {mode === 'signin'
              ? 'Sign in to access wholesale pricing\nfor pharmacies & distributors'
              : 'Register to start ordering wholesale\nmedicines at the best prices'}
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={[styles.modeRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          {(['signin', 'register'] as Mode[]).map((m) => (
            <Pressable
              key={m}
              style={[styles.modeBtn, mode === m && { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }]}
              onPress={() => { setMode(m); clearError(); }}
            >
              <Text style={[styles.modeBtnText, { color: mode === m ? colors.foreground : colors.mutedForeground }]}>
                {m === 'signin' ? 'Sign In' : 'Register'}
              </Text>
            </Pressable>
          ))}
        </View>

        <InputRow
          icon="mail-outline"
          placeholder="Email address"
          value={email}
          onChangeText={(t: string) => { setEmail(t); clearError(); }}
          keyboardType="email-address"
          hasError={!!error}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <InputRow
          inputRef={passwordRef}
          icon="lock-closed-outline"
          placeholder="Password (min 6 characters)"
          value={password}
          onChangeText={(t: string) => { setPassword(t); clearError(); }}
          secureTextEntry={!showPwd}
          hasError={!!error}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          rightEl={
            <Pressable onPress={() => setShowPwd(!showPwd)} style={{ paddingHorizontal: 14 }}>
              <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.mutedForeground} />
            </Pressable>
          }
        />

        {!!error && <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>}

        <PrimaryButton
          label={mode === 'signin' ? 'Sign In' : 'Create Account'}
          onPress={handleSubmit}
          loading={loading}
        />

        {/* OTP divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Pressable
          style={[styles.otpBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={handleOtpLogin}
          disabled={loading}
        >
          <Ionicons name="mail-open-outline" size={18} color={colors.primary} />
          <Text style={[styles.otpBtnText, { color: colors.foreground }]}>Sign in with Email OTP</Text>
        </Pressable>

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
  scroll: { paddingHorizontal: 24, gap: 14 },
  illustrationWrap: { alignItems: 'center', marginBottom: 4 },
  illustration: { width: 180, height: 144 },
  header: { gap: 8, marginBottom: 4 },
  logoPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0F9D58', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  logoPillText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  title: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter_700Bold', marginTop: 4 },
  subtitle: { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  modeRow: { flexDirection: 'row', borderRadius: 12, padding: 4, gap: 4, borderWidth: 1 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  modeBtnText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, height: 56, overflow: 'hidden' },
  input: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  errorText: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: -4 },
  primaryBtn: { backgroundColor: '#0F9D58', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', shadowColor: '#0F9D58', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  otpBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderRadius: 14, height: 50 },
  otpBtnText: { fontSize: 15, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  terms: { fontSize: 12, textAlign: 'center', lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
