import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  orderBy, 
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Customer } from '../../types/customer';

class CustomerService {
  private collection = 'customers';

  async getCustomers(): Promise<Customer[]> {
    try {
      const customersRef = collection(db, this.collection);
      const q = query(customersRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<void> {
    try {
      const customerRef = doc(db, this.collection, customerId);
      await updateDoc(customerRef, {
        ...updates,
        updated_at: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService(); 