import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from './api';

type User = { id: number; name: string; email: string; role: 'citizen' | 'admin' };
type AuthContextValue = { user: User | null; token: string | null; login: (email: string, password: string) => Promise<any>; logout: () => void; };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const value = useMemo(() => ({
    user, token,
    async login(email: string, password: string) {
      const result = await api.login(email, password);
      if (result.success) { setUser(result.user); setToken(result.token); }
      return result;
    },
    logout() { setUser(null); setToken(null); },
  }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
