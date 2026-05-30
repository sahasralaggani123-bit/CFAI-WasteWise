// WasteWise AI — LoginScreen.tsx
// Email/password login with JWT token retrieval.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { COLORS } from '../utils/constants';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message ?? 'Invalid credentials.');
    }
    // On success AuthContext updates and RootNavigator switches to Main tabs automatically.
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>♻️</Text>
          </View>
          <Text style={styles.appName}>WasteWise AI</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPwd}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPwd(p => !p)} style={{ padding: 4 }}>
              <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Login</Text>
            }
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerText, { color: COLORS.green, fontWeight: '600' }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo hint */}
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>
              <Text style={{ fontWeight: '600' }}>Demo — </Text>
              Citizen: user@wastewise.ai{'\n'}
              Admin:   admin@wastewise.ai{'\n'}
              Password: password123
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:   { flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 80 },
  logoWrap:    { alignItems: 'center', marginBottom: 36 },
  logoBox:     {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  logoEmoji:   { fontSize: 38 },
  appName:     { fontSize: 24, fontWeight: '700', color: COLORS.text },
  subtitle:    { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  form:        { gap: 4 },
  label:       { fontSize: 13, color: COLORS.textMuted, marginBottom: 6, marginTop: 14 },
  inputWrap:   {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 12, height: 48,
    backgroundColor: COLORS.background,
  },
  inputIcon:   { marginRight: 8 },
  input:       { flex: 1, fontSize: 15, color: COLORS.text },
  btn:         {
    backgroundColor: COLORS.green, borderRadius: 12,
    height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 24,
  },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  registerText:{ fontSize: 14, color: COLORS.textMuted },
  demoBox:     {
    marginTop: 24, padding: 14, backgroundColor: COLORS.blueBg,
    borderRadius: 10,
  },
  demoText:    { fontSize: 12, color: COLORS.blue, lineHeight: 18 },
});