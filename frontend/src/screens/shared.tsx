import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

export function ScreenHeader({ title, subtitle, back, navigation }: { title: string; subtitle?: string; back?: boolean; navigation?: any }) {
  return <View style={styles.hero}>{back && <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.back}><Ionicons name="arrow-back" color="#fff" size={22} /></TouchableOpacity>}<Text style={styles.subtitle}>{subtitle}</Text><Text style={styles.title}>{title}</Text></View>;
}
export function StatusPill({ status }: { status: string }) {
  const bg = status === 'Full' || status === 'High' ? COLORS.paleRed : status === 'Warning' || status === 'Medium' ? COLORS.paleYellow : COLORS.paleGreen;
  const color = status === 'Full' || status === 'High' ? '#b91c1c' : status === 'Warning' || status === 'Medium' ? '#a16207' : '#15803d';
  return <Text style={[styles.pill, { backgroundColor: bg, color }]}>{status}</Text>;
}
export function Progress({ percent, color }: { percent: number; color: string }) { return <View style={styles.track}><View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} /></View>; }
export const styles = StyleSheet.create({
  hero: { minHeight: 160, backgroundColor: COLORS.darkGreen, justifyContent: 'flex-end', padding: 18 },
  back: { position: 'absolute', left: 16, bottom: 20, zIndex: 2 },
  subtitle: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  title: { color: COLORS.white, fontSize: 20, fontWeight: '800', marginTop: 3, marginLeft: 0 },
  pill: { overflow: 'hidden', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  track: { height: 7, flex: 1, borderRadius: 6, overflow: 'hidden', backgroundColor: '#1f211e' },
  fill: { height: '100%', borderRadius: 6 },
});
