import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem } from '@/context/CartContext';

export type OrderStatus = 'Pending' | 'Accepted' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export type OrderItem = {
  medicineId: string;
  medicineName: string;
  brand: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  address: string;
  paymentMethod: string;
};

type OrdersContextType = {
  orders: Order[];
  placeOrder: (
    cartItems: CartItem[],
    address: string,
    paymentMethod: string,
  ) => Promise<string>;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
};

const OrdersContext = createContext<OrdersContextType | null>(null);
const ORDERS_KEY = '@pharma_orders';

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-20260628-001',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { medicineId: 'm001', medicineName: 'Paracetamol 500mg', brand: 'Calpol', qty: 10, price: 38 },
      { medicineId: 'm003', medicineName: 'Metformin 500mg', brand: 'Glycomet', qty: 20, price: 32 },
      { medicineId: 'm006', medicineName: 'Omeprazole 20mg', brand: 'Omez', qty: 10, price: 44 },
    ],
    subtotal: 1500, gst: 180, delivery: 0, total: 1680,
    status: 'Dispatched', address: '12, Medicines Lane, Dharavi, Mumbai - 400017',
    paymentMethod: 'Credit Account',
  },
  {
    id: 'ORD-20260620-002',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { medicineId: 'm018', medicineName: 'Vitamin C 500mg', brand: 'Limcee', qty: 20, price: 26 },
      { medicineId: 'm019', medicineName: 'Calcium + Vitamin D3', brand: 'Shelcal-500', qty: 10, price: 82 },
    ],
    subtotal: 1340, gst: 67, delivery: 0, total: 1407,
    status: 'Delivered', address: '12, Medicines Lane, Dharavi, Mumbai - 400017',
    paymentMethod: 'UPI',
  },
];

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(ORDERS_KEY).then((s) => {
      if (s) {
        const parsed = JSON.parse(s);
        setOrders(parsed.length > 0 ? parsed : SEED_ORDERS);
      } else {
        setOrders(SEED_ORDERS);
        AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS)).catch(() => {});
      }
    }).catch(() => setOrders(SEED_ORDERS));
  }, []);

  const placeOrder = useCallback(
    async (cartItems: CartItem[], address: string, paymentMethod: string): Promise<string> => {
      const subtotal = cartItems.reduce((s, i) => s + i.medicine.wholesalePrice * i.qty, 0);
      const gstRate = 0.12;
      const gst = Math.round(subtotal * gstRate);
      const delivery = subtotal >= 2000 ? 0 : 60;
      const total = subtotal + gst + delivery;
      const id = `ORD-${Date.now()}`;

      const order: Order = {
        id,
        date: new Date().toISOString(),
        items: cartItems.map((i) => ({
          medicineId: i.medicine.id,
          medicineName: i.medicine.name,
          brand: i.medicine.brand,
          qty: i.qty,
          price: i.medicine.wholesalePrice,
        })),
        subtotal, gst, delivery, total,
        status: 'Pending',
        address,
        paymentMethod,
      };

      setOrders((prev) => {
        const updated = [order, ...prev];
        AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });

      // Simulate order progression
      setTimeout(() => {
        setOrders((prev) => {
          const updated = prev.map((o) => o.id === id ? { ...o, status: 'Accepted' as OrderStatus } : o);
          AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }, 8000);

      return id;
    },
    [],
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  );

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === id && ['Pending', 'Accepted'].includes(o.status)
          ? { ...o, status: 'Cancelled' as OrderStatus }
          : o,
      );
      AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, getOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
