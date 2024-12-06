import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { Auth } from '../auth';

export interface Settings {
  adminEmail: string;
  storeName: string;
  currency: string;
  phoneNumber: string;
  address: string;
  deliveryZones: DeliveryZone[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  minAmount: number;
  deliveryFee: number;
  active: boolean;
}

class SettingsService {
  private readonly SETTINGS_DOC = 'settings';
  private readonly SETTINGS_COLLECTION = 'admin';
  private auth = Auth.getInstance();

  async retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw lastError;
  }

  async loadSettings(): Promise<Settings> {
    try {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser || !this.auth.isAdmin(currentUser)) {
        throw new Error('Unauthorized: Only admin can access settings');
      }

      const settingsRef = doc(db, this.SETTINGS_COLLECTION, this.SETTINGS_DOC);
      const docSnap = await this.retryOperation(() => getDoc(settingsRef));

      if (!docSnap.exists()) {
        // Initialize default settings if none exist
        const defaultSettings: Settings = {
          adminEmail: import.meta.env.VITE_ADMIN_EMAIL || '',
          storeName: 'My Store',
          currency: '₹',
          phoneNumber: '',
          address: '',
          deliveryZones: []
        };
        await this.saveSettings(defaultSettings);
        return defaultSettings;
      }

      return docSnap.data() as Settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      throw new Error('Failed to load settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async saveSettings(settings: Settings): Promise<void> {
    try {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser || !this.auth.isAdmin(currentUser)) {
        throw new Error('Unauthorized: Only admin can modify settings');
      }

      const settingsRef = doc(db, this.SETTINGS_COLLECTION, this.SETTINGS_DOC);
      await this.retryOperation(() => setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date(),
        updatedBy: currentUser.email
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async updateDeliveryZones(zones: DeliveryZone[]): Promise<void> {
    try {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser || !this.auth.isAdmin(currentUser)) {
        throw new Error('Unauthorized: Only admin can modify delivery zones');
      }

      const settings = await this.loadSettings();
      settings.deliveryZones = zones;
      await this.saveSettings(settings);
    } catch (error) {
      console.error('Error updating delivery zones:', error);
      throw new Error('Failed to update delivery zones: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}

export const settingsService = new SettingsService(); 