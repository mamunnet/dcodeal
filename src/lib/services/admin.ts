import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getDashboardStats(): Promise<AdminStats> {
    try {
      // Get total products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;

      // Get total orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const totalOrders = ordersSnapshot.size;

      // Calculate total revenue from orders
      let totalRevenue = 0;
      ordersSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const orderData = doc.data();
        totalRevenue += orderData.total || 0;
      });

      // Get total customers
      const customersSnapshot = await getDocs(collection(db, 'users'));
      const totalCustomers = customersSnapshot.size;

      return {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0
      };
    }
  }

  async getRecentOrders(limit: number = 5): Promise<DocumentData[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.slice(0, limit).map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recent orders:', error);
      return [];
    }
  }

  async getRecentCustomers(limit: number = 5): Promise<DocumentData[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.slice(0, limit).map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recent customers:', error);
      return [];
    }
  }

  async getTopProducts(limit: number = 5): Promise<DocumentData[]> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('sales', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.slice(0, limit).map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting top products:', error);
      return [];
    }
  }
}

export const adminService = AdminService.getInstance(); 