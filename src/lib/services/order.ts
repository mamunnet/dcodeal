import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Auth } from '../auth';
import type { UserAddress } from './user';
import type { CartItem } from '../types/cart';

export interface Order {
  id?: string;
  user_id: string;
  items: CartItem[];
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
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

class OrderService {
  private static instance: OrderService;
  private readonly collection = 'orders';
  private auth: Auth;

  private constructor() {
    this.auth = Auth.getInstance();
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const user = this.auth.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const orderRef = await addDoc(collection(db, this.collection), {
        ...orderData,
        user_id: user.uid,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });

      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, this.collection, orderId);
      await updateDoc(orderRef, {
        ...updates,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async createRazorpayOrder(amount: number): Promise<{ id: string; currency: string; amount: number }> {
    try {
      // This should be replaced with your actual API endpoint
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      // This should be replaced with your actual API endpoint
      const response = await fetch('/api/verify-razorpay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          orderId,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const { verified } = await response.json();
      return verified;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}

export const orderService = OrderService.getInstance(); 