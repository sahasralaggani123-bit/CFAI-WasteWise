// WasteWise AI — HomeScreen.tsx
// Main dashboard shown after login.

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { api } from '../services/api';
import { COLORS } from '../utils/constants';

interface BinSummary {
  id: number; bin_name: string; waste_type: string;
  fill_percent: number; status: string; capacity: number;
}

interface Analytics { total_classified: number; recycling_rate: number; }

export default function HomeScreen({ navigation }: any) {
  const { user, token } = useAuth();
  const [bins,      setBins]      = useState<BinSummary[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const BIN_COLOR: Record<string, string> = {
    Organic: '#22c55e', Plastic: '#3b82f6',
    Paper:   '#eab308', Metal:   '#6b7280', Glass: '#d1d5db',
  };

  const statusColor = (s: string) =>
    s === 'Full' ? '#ef4444' : s === 'Warning' ? '#f59e0b' : '#22c55e';

  const loadData = async () => {
    if (!token) return;
    const [binsRes, statsRes] = await Promise.all([
      api.getAllBins(token),
      api.getAnalytics(token),
    ]);
    if (binsRes.success)  setBins(binsRes.bins);
    if (statsRes.success) setAnalytics(statsRes.statistics);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.green} />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.role}>Hyderabad Smart City</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{analytics?.total_classified ?? 0}</Text>
          <Text style={styles.statLabel}>Total Classified</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.green }]}>
            {analytics?.recycling_rate ?? 0}%
          </Text>
          <Text style={styles.statLabel}>Recycling Rate</Text>
        </View>
      </View>

      {/* Quick Upload Button */}
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => navigation.navigate('Classify')}
      >
        <Ionicons name="camera-outline" size={22} color="#fff" />
        <Text style={styles.uploadBtnText}>Classify Waste Now</Text>
      </TouchableOpacity>

      {/* Bin Status */}
      <Text style={styles.sectionTitle}>Smart Bin Status</Text>
      {bins.map(bin => (
        <View key={bin.id} style={styles.binRow}>
          <View style={[styles.binDot, { backgroundColor: BIN_COLOR[bin.waste_type] }]} />
          <Text style={styles.binName}>{bin.bin_name}</Text>
          <View style={styles.progressTrack}>
            <View style={[
              styles.progressFill,
              { width: `${bin.fill_percent}%`, backgroundColor: statusColor(bin.status) },
            ]} />
          </View>
          <Text style={[styles.binPct, { color: statusColor(bin.status) }]}>
            {bin.fill_percent}%
          </Text>
        </View>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#f9fafb' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:        { backgroundColor: COLORS.green, padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting:      { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  userName:      { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 2 },
  role:          { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  avatar:        { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText:    { color: '#fff', fontSize: 18, fontWeight: '600' },
  statsGrid:     { flexDirection: 'row', gap: 10, padding: 16, marginTop: -8 },
  statCard:      { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statValue:     { fontSize: 24, fontWeight: '700', color: '#111' },
  statLabel:     { fontSize: 12, color: '#6b7280', marginTop: 2 },
  uploadBtn:     { margin: 16, backgroundColor: COLORS.green, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  uploadBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle:  { fontSize: 15, fontWeight: '600', color: '#111', paddingHorizontal: 16, marginBottom: 8 },
  binRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6' },
  binDot:        { width: 12, height: 12, borderRadius: 6 },
  binName:       { width: 120, fontSize: 13, color: '#374151' },
  progressTrack: { flex: 1, height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 3 },
  binPct:        { width: 38, fontSize: 12, textAlign: 'right', fontWeight: '600' },
});