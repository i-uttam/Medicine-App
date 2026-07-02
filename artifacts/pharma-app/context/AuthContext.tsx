import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  phone: string;
  email: string;
  businessName: string;
  ownerName: string;
  gstNumber: string;
  drugLicense: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const DEFAULT_PROFILE: UserProfile = {
  phone: '',
  email: '',
  businessName: 'City Pharma Distributors',
  ownerName: 'Rahul Sharma',
  gstNumber: '27AADCC1234M1Z5',
  drugLicense: 'MH-MUM-123456',
  address: '12, Medicines Lane, Dharavi',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400017',
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile;
  login: (phone: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = '@pharma_auth';
const PROFILE_KEY = '@pharma_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    async function restore() {
      try {
        const [authStr, profileStr] = await Promise.all([
          AsyncStorage.getItem(AUTH_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
        ]);
        if (authStr === 'true') setIsAuthenticated(true);
        if (profileStr) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(profileStr) });
      } catch {}
      setIsLoading(false);
    }
    restore();
  }, []);

  async function login(phone: string, email: string) {
    const updatedProfile = { ...profile, phone, email };
    setProfile(updatedProfile);
    setIsAuthenticated(true);
    await Promise.all([
      AsyncStorage.setItem(AUTH_KEY, 'true'),
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile)),
    ]);
  }

  async function logout() {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  async function updateProfile(data: Partial<UserProfile>) {
    const updated = { ...profile, ...data };
    setProfile(updated);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
