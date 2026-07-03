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
  businessName: '',
  ownerName: '',
  gstNumber: '',
  drugLicense: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: number | null;
  profile: UserProfile;
  login: (userId: number, phone: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = '@pharma_auth';
const PROFILE_KEY = '@pharma_profile';
const USER_ID_KEY = '@pharma_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    async function restore() {
      try {
        const [authStr, profileStr, userIdStr] = await Promise.all([
          AsyncStorage.getItem(AUTH_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
          AsyncStorage.getItem(USER_ID_KEY),
        ]);
        if (authStr === 'true') setIsAuthenticated(true);
        if (profileStr) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(profileStr) });
        if (userIdStr) setUserId(parseInt(userIdStr, 10));
      } catch {}
      setIsLoading(false);
    }
    restore();
  }, []);

  async function login(newUserId: number, phone: string, email: string) {
    const updatedProfile = { ...profile, phone, email };
    setProfile(updatedProfile);
    setIsAuthenticated(true);
    setUserId(newUserId);
    await Promise.all([
      AsyncStorage.setItem(AUTH_KEY, 'true'),
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile)),
      AsyncStorage.setItem(USER_ID_KEY, newUserId.toString()),
    ]);
  }

  async function logout() {
    setIsAuthenticated(false);
    setUserId(null);
    setProfile(DEFAULT_PROFILE);
    await Promise.all([
      AsyncStorage.removeItem(AUTH_KEY),
      AsyncStorage.removeItem(USER_ID_KEY),
      AsyncStorage.removeItem(PROFILE_KEY),
    ]);
  }

  async function updateProfile(data: Partial<UserProfile>) {
    const updated = { ...profile, ...data };
    setProfile(updated);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userId, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
