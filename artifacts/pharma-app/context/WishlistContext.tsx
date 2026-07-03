import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

type WishlistContextType = {
  ids: string[];
  toggle: (medicineId: string) => void;
  isWishlisted: (medicineId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

function wishlistKey(userId: number | null): string {
  return userId != null ? `@pharma_wishlist_${userId}` : '@pharma_wishlist_guest';
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    if (loadedUserId === userId) return;
    setLoadedUserId(userId);
    setIds([]);
    AsyncStorage.getItem(wishlistKey(userId)).then((s) => {
      if (s) setIds(JSON.parse(s));
    }).catch(() => {});
  }, [userId]);

  const toggle = useCallback((medicineId: string) => {
    setIds((prev) => {
      const updated = prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [...prev, medicineId];
      AsyncStorage.setItem(wishlistKey(userId), JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, [userId]);

  const isWishlisted = useCallback(
    (medicineId: string) => ids.includes(medicineId),
    [ids],
  );

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
