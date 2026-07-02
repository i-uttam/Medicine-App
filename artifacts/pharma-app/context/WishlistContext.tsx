import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WishlistContextType = {
  ids: string[];
  toggle: (medicineId: string) => void;
  isWishlisted: (medicineId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const WISHLIST_KEY = '@pharma_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(WISHLIST_KEY).then((s) => {
      if (s) setIds(JSON.parse(s));
    }).catch(() => {});
  }, []);

  const toggle = useCallback((medicineId: string) => {
    setIds((prev) => {
      const updated = prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [...prev, medicineId];
      AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

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
