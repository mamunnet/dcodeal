import type { Timestamp } from '@firebase/firestore-types';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string;
  created_at: Timestamp;
  updated_at: Timestamp;
} 