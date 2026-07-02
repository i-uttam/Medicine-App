import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Medicine } from '@/data/medicines';

export type CartItem = {
  medicine: Medicine;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (medicine: Medicine, qty?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQty: (medicineId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  getItemQty: (medicineId: string) => number;
};

const CartContext = createContext<CartContextType | null>(null);
const CART_KEY = '@pharma_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then((s) => {
      if (s) setItems(JSON.parse(s));
    }).catch(() => {});
  }, []);

  function persist(updated: CartItem[]) {
    setItems(updated);
    AsyncStorage.setItem(CART_KEY, JSON.stringify(updated)).catch(() => {});
  }

  const addItem = useCallback((medicine: Medicine, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.medicine.id === medicine.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.medicine.id === medicine.id ? { ...i, qty: i.qty + qty } : i,
        );
      } else {
        updated = [...prev, { medicine, qty }];
      }
      AsyncStorage.setItem(CART_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const removeItem = useCallback((medicineId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.medicine.id !== medicineId);
      AsyncStorage.setItem(CART_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const updateQty = useCallback((medicineId: string, qty: number) => {
    setItems((prev) => {
      const updated =
        qty <= 0
          ? prev.filter((i) => i.medicine.id !== medicineId)
          : prev.map((i) =>
              i.medicine.id === medicineId ? { ...i, qty } : i,
            );
      AsyncStorage.setItem(CART_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  const getItemQty = useCallback(
    (medicineId: string) =>
      items.find((i) => i.medicine.id === medicineId)?.qty ?? 0,
    [items],
  );

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.medicine.wholesalePrice * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, getItemQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
