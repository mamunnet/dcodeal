import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Auth } from './auth';

interface Order {
  id: string;
  totalAmount: number;
  createdAt: any;
  status: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  recentOrders: Order[];
  totalRevenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const auth = Auth.getInstance();
    const currentUser = auth.getCurrentUser();

    if (!currentUser || !auth.isAdmin(currentUser)) {
      throw new Error('Unauthorized access to admin dashboard');
    }

    // Get total products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const totalProducts = productsSnapshot.size;

    // Get orders
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const orders = ordersSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    } as Order));

    // Calculate total revenue and get recent orders
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0);
    const recentOrders = orders.slice(0, 5); // Get last 5 orders

    return {
      totalProducts,
      totalOrders: orders.length,
      recentOrders,
      totalRevenue
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 