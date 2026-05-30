import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/constants';

export default function SplashScreen({ navigation }: any) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  useEffect(() => { Animated.parallel([Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }), Animated.spring(scale, { toValue: 1, useNativeDriver: true })]).start(); const t = setTimeout(() => navigation.replace('Login'), 1700); return () => clearTimeout(t); }, []);
  return <View style={styles.container}><StatusBar barStyle="light-content" /><Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ scale }] }}><View style={styles.logo}><Text style={styles.logoText}>♻️</Text></View><Text style={styles.name}>WasteWise AI</Text><Text style={styles.tag}>Smart Waste Management</Text><View style={styles.dots}><View style={styles.dotActive}/><View style={styles.dot}/><View style={styles.dot}/></View></Animated.View><Text style={styles.footer}>AI-Powered Smart City Solution</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.darkGreen, justifyContent: 'center', alignItems: 'center' }, logo: { width: 66, height: 66, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.16)', marginBottom: 26 }, logoText: { fontSize: 36 }, name: { color: '#fff', fontSize: 22, fontWeight: '900' }, tag: { color: COLORS.textMuted, marginTop: 8, fontWeight: '700' }, dots: { flexDirection: 'row', gap: 7, marginTop: 42 }, dot: { width: 7, height: 7, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.35)' }, dotActive: { width: 7, height: 7, borderRadius: 5, backgroundColor: '#fff' }, footer: { position: 'absolute', bottom: 196, color: 'rgba(255,255,255,.4)', fontSize: 12, fontWeight: '700' } });
