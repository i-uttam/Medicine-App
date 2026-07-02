import React, { useEffect, useRef, useState } from 'react';
import {
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

const OTP_LENGTH = 4;

export default function OtpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { phone, email } = useLocalSearchParams<{ phone?: string; email?: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
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
      setError('Please enter the complete OTP');
      return;
    }
    // Mock: any 4-digit OTP works
    setLoading(true);
    try {
      await login(phone ?? '', email ?? '');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch {
      setError('Verification failed. Please try again.');
      shake();
    } finally {
      setLoading(false);
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
          We sent a 4-digit OTP to{'\n'}
          <Text style={[styles.target, { color: colors.foreground }]}>
            {phone ? `+91 ${phone}` : email}
          </Text>
        </Text>
        <Text style={[styles.mockNote, { color: colors.accent }]}>
          (Demo: enter any 4 digits)
        </Text>

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
          caretHidden
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
          <Text style={styles.verifyText}>{loading ? 'Verifying…' : 'Verify OTP'}</Text>
        </Pressable>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={[styles.resendLabel, { color: colors.mutedForeground }]}>
            Didn't receive?{' '}
          </Text>
          {resendTimer > 0 ? (
            <Text style={[styles.resendTimer, { color: colors.mutedForeground }]}>
              Resend in {resendTimer}s
            </Text>
          ) : (
            <Pressable onPress={() => { setResendTimer(30); setOtp(''); setError(''); }}>
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
  mockNote: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  boxRow: { flexDirection: 'row', gap: 14, marginVertical: 8 },
  otpBox: {
    width: 64, height: 64, borderWidth: 2, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  otpChar: { fontSize: 26, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  hiddenInput: { position: 'absolute', opacity: 0, height: 0, width: 0 },
  error: { fontSize: 13, fontFamily: 'Inter_500Medium' },
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
});
