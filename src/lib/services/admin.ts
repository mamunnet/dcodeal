import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Order } from '../../types/order';
import type { Product } from '../../types/product';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get orders from the last 30 days
      const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      // Get orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('created_at', '>=', thirtyDaysAgo),
        orderBy('created_at', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      // Get products
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Calculate stats
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Get recent orders
      const recentOrdersQuery = query(
        collection(db, 'orders'),
        orderBy('created_at', 'desc'),
        limit(5)
      );
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const recentOrders = recentOrdersSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      return {
        totalOrders,
        totalProducts,
        totalRevenue,
        recentOrders
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService(); 