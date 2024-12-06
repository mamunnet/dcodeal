import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { StoreSettings } from '../../types/settings';

export class SettingsService {
  private static instance: SettingsService;
  private static MAX_RETRIES = 3;
  private static RETRY_DELAY = 1000; // 1 second
  private static SETTINGS_DOC = 'store';
  private static SETTINGS_COLLECTION = 'settings';

  private constructor() {}

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = SettingsService.MAX_RETRIES
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('Operation failed:', error);
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts remaining`);
        await this.delay(SettingsService.RETRY_DELAY);
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }

  async getSettings(): Promise<StoreSettings> {
    return this.retryOperation(async () => {
      try {
        console.log('Fetching settings...');
        const settingsRef = doc(db, SettingsService.SETTINGS_COLLECTION, SettingsService.SETTINGS_DOC);
        const settingsDoc = await getDoc(settingsRef);

        if (!settingsDoc.exists()) {
          console.log('No settings found, creating default settings...');
          // Return default settings if none exist
          const defaultSettings: StoreSettings = {
            store: {
              name: '',
              description: '',
              currency: 'INR',
              contact_email: '',
            },
            shipping: {
              default_rate: 0,
              free_shipping_threshold: 0,
              enable_international: false,
              delivery_zones: [], // Initialize empty delivery zones array
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

          // Try to create default settings, but don't fail if we can't
          try {
            await this.updateSettings(defaultSettings);
            console.log('Default settings created successfully');
          } catch (error) {
            console.warn('Could not create default settings:', error);
          }

          return defaultSettings;
        }

        console.log('Settings fetched successfully');
        return settingsDoc.data() as StoreSettings;
      } catch (error) {
        console.error('Error getting settings:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to load settings: ${error.message}`);
        }
        throw new Error('Failed to load settings. Please try again later.');
      }
    });
  }

  async updateSettings(settings: StoreSettings): Promise<void> {
    return this.retryOperation(async () => {
      try {
        console.log('Updating settings...');
        const settingsRef = doc(db, SettingsService.SETTINGS_COLLECTION, SettingsService.SETTINGS_DOC);
        
        // Ensure delivery_zones is an array
        if (!Array.isArray(settings.shipping.delivery_zones)) {
          settings.shipping.delivery_zones = [];
        }

        await setDoc(settingsRef, {
          ...settings,
          updated_at: new Date().toISOString(),
        });
        
        console.log('Settings updated successfully');
      } catch (error) {
        console.error('Error updating settings:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to update settings: ${error.message}`);
        }
        throw new Error('Failed to update settings. Please try again later.');
      }
    });
  }
} 