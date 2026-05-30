// WasteWise AI — ClassifyScreen.tsx
// Upload or capture a waste image → AI classification → disposal recommendation.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { api } from '../services/api';
import { COLORS, WASTE_META } from '../utils/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Prediction {
  category:             string;
  confidence:           number;
  recommended_bin:      string;
  recycling_tip:        string;
  environmental_impact: string;
  all_probabilities:    Record<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function ClassifyScreen() {
  const { token } = useAuth();

  const [imageUri,   setImageUri]   = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  // ── Pick from gallery ──
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is needed to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:    0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setPrediction(null);
    }
  };

  // ── Capture with camera ──
  const captureWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is needed.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setPrediction(null);
    }
  };

  // ── Run AI classification ──
  const classify = async () => {
    if (!imageUri || !token) return;
    setLoading(true);
    try {
      const result = await api.uploadImage(token, imageUri);
      if (result.success) {
        setPrediction(result.prediction);
      } else {
        Alert.alert('Classification Failed', result.message ?? 'Please try again.');
      }
    } catch {
      Alert.alert('Network Error', 'Could not reach the server.');
    }
    setLoading(false);
  };

  const reset = () => { setImageUri(null); setPrediction(null); };

  const meta = prediction ? WASTE_META[prediction.category] : null;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="scan-outline" size={22} color="#fff" />
        <Text style={styles.headerTitle}>AI Waste Classifier</Text>
      </View>

      <View style={styles.body}>

        {/* ── Image Preview / Upload Zone ── */}
        {!imageUri ? (
          <View style={styles.uploadZone}>
            <Ionicons name="cloud-upload-outline" size={52} color={COLORS.green} />
            <Text style={styles.uploadTitle}>Upload or Capture Waste Image</Text>
            <Text style={styles.uploadSub}>Our AI will identify the waste type instantly</Text>

            <View style={styles.uploadBtns}>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={20} color={COLORS.green} />
                <Text style={styles.uploadBtnText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnFill]} onPress={captureWithCamera}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
                <Text style={[styles.uploadBtnText, { color: '#fff' }]}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Preview */}
            <View style={styles.previewBox}>
              <Image source={{ uri: imageUri }} style={styles.previewImg} resizeMode="cover" />
              <TouchableOpacity style={styles.previewClose} onPress={reset}>
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Classify Button */}
            {!prediction && (
              <TouchableOpacity
                style={[styles.classifyBtn, loading && { opacity: 0.7 }]}
                onPress={classify}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="#fff" />
                    <Text style={styles.classifyBtnText}>  Analysing image…</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="flash-outline" size={20} color="#fff" />
                    <Text style={styles.classifyBtnText}>  Classify with AI</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        )}

        {/* ── AI Result ── */}
        {prediction && meta && (
          <>
            {/* Category Card */}
            <View style={[styles.resultCard, { borderColor: meta.color }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <View style={[styles.resultIcon, { backgroundColor: meta.bg }]}>
                  <Text style={{ fontSize: 28 }}>{meta.emoji}</Text>
                </View>
                <View>
                  <View style={[styles.badge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.badgeText, { color: meta.color }]}>
                      {prediction.category} Waste
                    </Text>
                  </View>
                  <Text style={styles.resultSub}>AI Classification Result</Text>
                </View>
              </View>

              {/* Confidence Bar */}
              <Text style={styles.confLabel}>
                Confidence Score: <Text style={{ color: meta.color, fontWeight: '700' }}>
                  {prediction.confidence}%
                </Text>
              </Text>
              <View style={styles.confTrack}>
                <View style={[styles.confFill, { width: `${prediction.confidence}%`, backgroundColor: meta.color }]} />
              </View>

              {/* All Probabilities */}
              <Text style={[styles.confLabel, { marginTop: 12 }]}>All Categories</Text>
              {Object.entries(prediction.all_probabilities)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, prob]) => (
                  <View key={cat} style={styles.probRow}>
                    <Text style={styles.probLabel}>{cat}</Text>
                    <View style={styles.probTrack}>
                      <View style={[
                        styles.probFill,
                        { width: `${prob}%`, backgroundColor: WASTE_META[cat]?.color ?? '#ccc' },
                      ]} />
                    </View>
                    <Text style={styles.probPct}>{prob}%</Text>
                  </View>
                ))
              }
            </View>

            {/* Disposal Recommendation */}
            <View style={styles.disposalCard}>
              <Text style={styles.disposalTitle}>🗑️ Disposal Recommendation</Text>
              <View style={[styles.disposalBin, { backgroundColor: meta.bg }]}>
                <Text style={{ fontSize: 28 }}>{meta.emoji}</Text>
                <View>
                  <Text style={[styles.disposalBinName, { color: meta.color }]}>{meta.bin}</Text>
                  <Text style={styles.disposalBinSub}>{prediction.category} Waste Collection</Text>
                </View>
              </View>
            </View>

            {/* Recycling Tip */}
            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Recycling Tip</Text>
              <Text style={styles.tipText}>{prediction.recycling_tip}</Text>
            </View>

            {/* Environmental Impact */}
            <View style={[styles.tipBox, { backgroundColor: COLORS.greenBg, borderColor: COLORS.greenLight }]}>
              <Text style={[styles.tipTitle, { color: COLORS.green }]}>🌱 Environmental Impact</Text>
              <Text style={[styles.tipText, { color: COLORS.green }]}>{prediction.environmental_impact}</Text>
            </View>

            {/* New Classification */}
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.green} />
              <Text style={styles.resetBtnText}>Classify Another Item</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: COLORS.background },
  header:         { backgroundColor: COLORS.green, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, paddingTop: 50 },
  headerTitle:    { color: '#fff', fontSize: 18, fontWeight: '600' },
  body:           { padding: 16 },

  // Upload Zone
  uploadZone:     { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 16, padding: 40, alignItems: 'center', backgroundColor: '#fff', gap: 8 },
  uploadTitle:    { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: 8, textAlign: 'center' },
  uploadSub:      { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  uploadBtns:     { flexDirection: 'row', gap: 12, marginTop: 20 },
  uploadBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.green },
  uploadBtnFill:  { backgroundColor: COLORS.green, borderColor: COLORS.green },
  uploadBtnText:  { fontSize: 14, fontWeight: '600', color: COLORS.green },

  // Preview
  previewBox:     { borderRadius: 16, overflow: 'hidden', height: 220, marginBottom: 14, position: 'relative' },
  previewImg:     { width: '100%', height: '100%' },
  previewClose:   { position: 'absolute', top: 10, right: 10 },
  classifyBtn:    { backgroundColor: COLORS.green, borderRadius: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  classifyBtnText:{ color: '#fff', fontSize: 16, fontWeight: '600' },

  // Result
  resultCard:     { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1.5, marginBottom: 12 },
  resultIcon:     { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badge:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText:      { fontSize: 13, fontWeight: '600' },
  resultSub:      { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  confLabel:      { fontSize: 13, color: COLORS.textMuted, marginBottom: 6 },
  confTrack:      { height: 10, backgroundColor: COLORS.grayBg, borderRadius: 5, overflow: 'hidden', marginBottom: 4 },
  confFill:       { height: '100%', borderRadius: 5 },
  probRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  probLabel:      { width: 58, fontSize: 12, color: COLORS.textMuted },
  probTrack:      { flex: 1, height: 6, backgroundColor: COLORS.grayBg, borderRadius: 3, overflow: 'hidden' },
  probFill:       { height: '100%', borderRadius: 3 },
  probPct:        { width: 36, fontSize: 12, color: COLORS.textMuted, textAlign: 'right' },

  // Disposal
  disposalCard:   { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  disposalTitle:  { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  disposalBin:    { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 12 },
  disposalBinName:{ fontSize: 16, fontWeight: '700' },
  disposalBinSub: { fontSize: 12, color: COLORS.textMuted },

  // Tips
  tipBox:         { backgroundColor: COLORS.blueBg, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.blueLight },
  tipTitle:       { fontSize: 13, fontWeight: '700', color: COLORS.blue, marginBottom: 6 },
  tipText:        { fontSize: 13, color: COLORS.blue, lineHeight: 20 },

  // Reset
  resetBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.green, marginTop: 4, marginBottom: 20 },
  resetBtnText:   { fontSize: 15, fontWeight: '600', color: COLORS.green },
});