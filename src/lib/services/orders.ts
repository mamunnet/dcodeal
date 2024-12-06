import { 
  collection, 
  query, 
  where as firebaseWhere, 
  getDocs, 
  doc, 
  updateDoc, 
  orderBy, 
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Order } from '../../types/order';

class OrderService {
  private collection = 'orders';

  async getOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, this.collection);
      const q = query(ordersRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const ordersRef = collection(db, this.collection);
      const q = query(
        ordersRef,
        firebaseWhere('status', '==', status),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, this.collection, orderId);
      await updateDoc(orderRef, {
        ...updates,
        updated_at: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService(); 