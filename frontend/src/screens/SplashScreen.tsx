// WasteWise AI — SplashScreen.tsx
// Animated intro screen shown at app launch.

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
} from 'react-native';
import { COLORS } from '../utils/constants';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo in
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    // Navigate to Login after 2.5 s
    const timer = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>♻️</Text>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>WasteWise AI</Text>
        <Text style={styles.tagline}>Smart Waste Management</Text>

        {/* Loading dots */}
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
          ))}
        </View>
      </Animated.View>

      <Text style={styles.footer}>AI-Powered Smart City Solution</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.green,
    alignItems: 'center', justifyContent: 'center',
  },
  content:   { alignItems: 'center' },
  logoBox:   {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  logoEmoji: { fontSize: 44 },
  appName:   { color: '#fff', fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  tagline:   { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 6 },
  dots:      { flexDirection: 'row', gap: 8, marginTop: 48 },
  dot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: '#fff' },
  footer:    {
    position: 'absolute', bottom: 40,
    color: 'rgba(255,255,255,0.45)', fontSize: 12,
  },
});