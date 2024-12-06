import { 
  doc, 
  getDoc as firebaseGetDoc, 
  setDoc as firebaseSetDoc,
  DocumentSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { StoreSettings } from '../../types/settings';

class SettingsService {
  private collection = 'settings';
  private document = 'store';

  async getSettings(): Promise<StoreSettings> {
    try {
      const docRef = doc(db, this.collection, this.document);
      const docSnap = await firebaseGetDoc(docRef) as DocumentSnapshot<DocumentData>;
      
      if (docSnap.exists()) {
        return docSnap.data() as StoreSettings;
      }
      
      // Return default settings if no settings exist
      return {
        store: {
          name: 'My Store',
          description: '',
          currency: 'INR',
          contact_email: '',
        },
        shipping: {
          default_rate: 0,
          free_shipping_threshold: 0,
          enable_international: false,
        },
        payment: {
          gateway: 'razorpay',
          test_mode: true,
        },
        notifications: {
          order_confirmation: true,
          shipping_updates: true,
          marketing_emails: false,
        },
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  async updateSettings(settings: StoreSettings): Promise<void> {
    try {
      const docRef = doc(db, this.collection, this.document);
      await firebaseSetDoc(docRef, settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService(); 