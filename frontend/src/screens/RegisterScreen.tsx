// WasteWise AI — RegisterScreen.tsx
// New user registration form.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { COLORS } from '../utils/constants';

export default function RegisterScreen({ navigation }: any) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await api.register(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Registered!', 'Account created. Please log in.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Registration Failed', result.message ?? 'Please try again.');
    }
  };

  const Field = ({ label, icon, value, onChangeText, secure, keyboard }: any) => {
    const [show, setShow] = useState(false);
    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrap}>
          <Ionicons name={icon} size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 15, color: COLORS.text }}
            placeholder={label}
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={secure && !show}
            keyboardType={keyboard ?? 'default'}
            autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
            value={value}
            onChangeText={onChangeText}
          />
          {secure && (
            <TouchableOpacity onPress={() => setShow(s => !s)} style={{ padding: 4 }}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join WasteWise — make your city cleaner</Text>

        <Field label="Full Name"       icon="person-outline"     value={name}     onChangeText={setName} />
        <Field label="Email Address"   icon="mail-outline"       value={email}    onChangeText={setEmail}    keyboard="email-address" />
        <Field label="Password"        icon="lock-closed-outline" value={password} onChangeText={setPassword} secure />
        <Field label="Confirm Password" icon="shield-checkmark-outline" value={confirm} onChangeText={setConfirm} secure />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Create Account</Text>
          }
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginText, { color: COLORS.green, fontWeight: '600' }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn:   { marginBottom: 20 },
  title:     { fontSize: 26, fontWeight: '700', color: COLORS.text },
  subtitle:  { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: 12 },
  label:     { fontSize: 13, color: COLORS.textMuted, marginTop: 14, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 12, height: 48,
    backgroundColor: COLORS.background,
  },
  btn:       {
    backgroundColor: COLORS.green, borderRadius: 12,
    height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 28,
  },
  btnText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { fontSize: 14, color: COLORS.textMuted },
});