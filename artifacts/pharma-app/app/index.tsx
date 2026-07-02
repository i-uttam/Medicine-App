import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0.3, { duration: 400, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, style]} />;
}

async function getDestination(): Promise<'/login' | '/(tabs)'> {
  try {
    const auth = await AsyncStorage.getItem('@pharma_auth');
    return auth === 'true' ? '/(tabs)' : '/login';
  } catch {
    return '/login';
  }
}

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(16);
  const dotsOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  function navigateAway(dest: '/login' | '/(tabs)') {
    router.replace(dest);
  }

  useEffect(() => {
    ringScale.value = withTiming(1.1, { duration: 600, easing: Easing.out(Easing.back(1.2)) });
    ringOpacity.value = withTiming(0.15, { duration: 600 });
    logoScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 120 }));
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(500, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
    taglineOpacity.value = withDelay(750, withTiming(1, { duration: 500 }));
    taglineY.value = withDelay(750, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
    dotsOpacity.value = withDelay(1100, withTiming(1, { duration: 300 }));

    const timer = setTimeout(async () => {
      const dest = await getDestination();
      screenOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) runOnJS(navigateAway)(dest);
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));
  const dotsStyle = useAnimatedStyle(() => ({ opacity: dotsOpacity.value }));

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <Animated.View style={[styles.container, screenStyle, { paddingTop: topPad, paddingBottom: bottomPad + 24 }]}>
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />

      <View style={styles.center}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <MaterialIcons name="local-pharmacy" size={52} color="#0F9D58" />
        </Animated.View>
        <Animated.Text style={[styles.appName, titleStyle]}>MediWholesale</Animated.Text>
        <Animated.Text style={[styles.tagline, taglineStyle]}>Your Trusted Wholesale Pharmacy</Animated.Text>
      </View>

      <Animated.View style={[styles.dotsRow, dotsStyle]}>
        <LoadingDot delay={0} />
        <LoadingDot delay={180} />
        <LoadingDot delay={360} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F9D58', alignItems: 'center', justifyContent: 'center' },
  bgCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)' },
  bgCircle1: { width: width * 1.4, height: width * 1.4, top: -width * 0.5, left: -width * 0.2 },
  bgCircle2: { width: width * 1.1, height: width * 1.1, bottom: -width * 0.4, right: -width * 0.3 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  logoContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  appName: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.82)', letterSpacing: 0.3, fontFamily: 'Inter_400Regular' },
  dotsRow: { flexDirection: 'row', gap: 8, paddingBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
});
