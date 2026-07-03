import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

const OTP_LENGTH = 6;
const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

export default function OtpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { phone, email, devOtp: devOtpParam } = useLocalSearchParams<{ phone?: string; email?: string; devOtp?: string }>();
  const [otp, setOtp] = useState(devOtpParam ?? '');
  const [devBanner, setDevBanner] = useState(!!devOtpParam);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    if (!devOtpParam) setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  function shake() {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  }

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  async function handleVerify() {
    if (otp.length < OTP_LENGTH) {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Verification failed. Please try again.');
        shake();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      await login(data.user?.id ?? 0, data.user?.phone ?? phone ?? '', data.user?.email ?? email ?? '');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch {
      setError('Network error. Please check your connection.');
      shake();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendLoading) return;
    setResendLoading(true);
    setError('');
    setOtp('');
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to resend OTP.');
        return;
      }
      if (data.devOtp) {
        setOtp(data.devOtp);
        setDevBanner(true);
      }
      setResendTimer(30);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad }]}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.foreground} />
      </Pressable>

      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: colors.successLight ?? '#E6F4ED' }]}>
          <Ionicons name="shield-checkmark" size={44} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>OTP Verification</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          We sent a 6-digit OTP to{'\n'}
          <Text style={[styles.target, { color: colors.foreground }]}>
            {phone ? `+91 ${phone}` : email}
          </Text>
        </Text>

        {devBanner && (
          <View style={styles.devBanner}>
            <Ionicons name="code-working-outline" size={15} color="#92400e" />
            <Text style={styles.devBannerText}>
              Dev mode — OTP auto-filled: <Text style={{ fontWeight: '700' }}>{otp}</Text>
            </Text>
            <Pressable onPress={() => setDevBanner(false)}>
              <Ionicons name="close" size={15} color="#92400e" />
            </Pressable>
          </View>
        )}

        {/* OTP Boxes */}
        <Animated.View style={[styles.boxRow, shakeStyle]}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const char = otp[i];
            const isFocused = otp.length === i;
            return (
              <Pressable
                key={i}
                style={[
                  styles.otpBox,
                  {
                    borderColor: char
                      ? colors.primary
                      : isFocused
                      ? colors.accent
                      : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                onPress={() => inputRef.current?.focus()}
              >
                <Text style={[styles.otpChar, { color: colors.foreground }]}>
                  {char ?? (isFocused ? '|' : '')}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Hidden input */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          value={otp}
          onChangeText={(t) => {
            setError('');
            setOtp(t.replace(/\D/g, ''));
          }}
          autoFocus
        />

        {error ? (
          <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
        ) : null}

        {/* Verify button */}
        <Pressable
          style={[
            styles.verifyBtn,
            { backgroundColor: loading ? colors.muted : colors.primary },
          ]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyText}>Verify OTP</Text>
          )}
        </Pressable>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={[styles.resendLabel, { color: colors.mutedForeground }]}>
            Didn't receive?{' '}
          </Text>
          {resendLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : resendTimer > 0 ? (
            <Text style={[styles.resendTimer, { color: colors.mutedForeground }]}>
              Resend in {resendTimer}s
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text style={[styles.resendLink, { color: colors.primary }]}>Resend OTP</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: 16, alignSelf: 'flex-start' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 28, gap: 16 },
  iconWrap: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', fontFamily: 'Inter_700Bold', textAlign: 'center' },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
  target: { fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  boxRow: { flexDirection: 'row', gap: 10, marginVertical: 8 },
  otpBox: {
    width: 48, height: 56, borderWidth: 2, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  otpChar: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1, left: -9999 },
  error: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  verifyBtn: {
    width: '100%', height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: '#0F9D58', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  verifyText: { color: '#FFF', fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', letterSpacing: 0.3 },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  resendTimer: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  resendLink: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  devBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#fcd34d',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    width: '100%',
  },
  devBannerText: { flex: 1, fontSize: 12, color: '#92400e', fontFamily: 'Inter_400Regular' },
});
