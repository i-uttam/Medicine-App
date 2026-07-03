import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/context/CartContext';

export type OrderStatus = 'Pending' | 'Accepted' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export type OrderItem = {
  id: number;
  medicineId: number;
  medicineName: string;
  brand: string;
  qty: number;
  price: number;
};

export type Order = {
  id: number;
  displayId: string;
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
  isLoading: boolean;
  error: string | null;
  placeOrder: (cartItems: CartItem[], address: string, payment: string) => Promise<number>;
  cancelOrder: (orderId: number) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  refresh: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | null>(null);

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

function formatOrderId(id: number): string {
  return `ORD-${String(id).padStart(6, '0')}`;
}

function mapApiOrder(raw: any): Order {
  return {
    id: raw.id,
    displayId: formatOrderId(raw.id),
    date: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    items: (raw.items ?? []).map((item: any) => ({
      id: item.id,
      medicineId: item.medicineId ?? item.medicine_id,
      medicineName: item.medicine?.name ?? '',
      brand: item.medicine?.brand ?? '',
      qty: item.qty,
      price: parseFloat(item.price) || 0,
    })),
    subtotal: parseFloat(raw.subtotal) || 0,
    gst: parseFloat(raw.gstAmount ?? raw.gst_amount) || 0,
    delivery: parseFloat(raw.deliveryCharge ?? raw.delivery_charge) || 0,
    total: parseFloat(raw.total) || 0,
    status: raw.status as OrderStatus,
    address: raw.deliveryAddress ?? raw.delivery_address ?? '',
    paymentMethod: raw.notes ?? '',
  };
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { userId, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedForUserRef = useRef<number | null | undefined>(undefined);

  async function fetchOrders(uid: number) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders/user/${uid}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error ${res.status}`);
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data.map(mapApiOrder) : []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated || userId == null) {
      setOrders([]);
      loadedForUserRef.current = undefined;
      return;
    }
    if (loadedForUserRef.current === userId) return;
    loadedForUserRef.current = userId;
    fetchOrders(userId);
  }, [isAuthenticated, userId]);

  const refresh = useCallback(async () => {
    if (userId == null) return;
    await fetchOrders(userId);
  }, [userId]);

  const placeOrder = useCallback(async (
    cartItems: CartItem[],
    address: string,
    payment: string,
  ): Promise<number> => {
    if (userId == null) throw new Error('Not authenticated');

    const medicinesRes = await fetch(`${API_BASE}/medicines?limit=200`);
    if (!medicinesRes.ok) throw new Error('Failed to load medicine catalog');
    const medicinesData = await medicinesRes.json();
    const medicineList: any[] = medicinesData.data ?? medicinesData ?? [];

    const nameMap = new Map<string, number>();
    for (const m of medicineList) {
      nameMap.set(`${m.name}|${m.brand}`, m.id);
    }

    const apiItems = cartItems
      .map((ci) => ({
        medicineId: nameMap.get(`${ci.medicine.name}|${ci.medicine.brand}`) ?? 0,
        qty: ci.qty,
      }))
      .filter((i) => i.medicineId > 0);

    if (apiItems.length === 0) {
      throw new Error('Could not match medicines to the database. Please run the seed script.');
    }

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        items: apiItems,
        deliveryAddress: address,
        notes: payment,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `Failed to place order (${res.status})`);
    }

    const rawOrder = await res.json();
    const newOrder = mapApiOrder(rawOrder);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder.id;
  }, [userId]);

  const cancelOrder = useCallback(async (orderId: number) => {
    if (userId == null) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled', userId }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Failed to cancel order');
    }

    const rawOrder = await res.json();
    const updated = mapApiOrder(rawOrder);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  }, [userId]);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id.toString() === id),
    [orders],
  );

  return (
    <OrdersContext.Provider value={{ orders, isLoading, error, placeOrder, cancelOrder, getOrder, refresh }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
