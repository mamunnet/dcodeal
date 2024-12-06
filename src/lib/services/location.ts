import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { DeliveryZone } from '../../types/settings';

export class LocationService {
  private static instance: LocationService;
  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Get all active delivery zones
  async getActiveDeliveryZones(): Promise<DeliveryZone[]> {
    try {
      console.log('Fetching active delivery zones...');
      const settingsRef = doc(db, 'settings', 'store');
      const settingsDoc = await getDoc(settingsRef);
      
      if (!settingsDoc.exists()) {
        console.log('No settings document found');
        return [];
      }

      const settings = settingsDoc.data();
      const zones = settings?.shipping?.delivery_zones || [];
      console.log('Found delivery zones:', zones);
      
      // Filter only active zones
      return zones.filter((zone: DeliveryZone) => zone.active);
    } catch (error) {
      console.error('Error getting delivery zones:', error);
      throw new Error('Failed to fetch delivery zones');
    }
  }

  // Validate pincode for delivery
  async validatePincode(pincode: string): Promise<{
    available: boolean;
    zones: DeliveryZone[];
    message: string;
  }> {
    try {
      console.log('Validating pincode:', pincode);
      const activeZones = await this.getActiveDeliveryZones();
      console.log('Active zones:', activeZones);

      // Find zones that service this pincode
      const availableZones = activeZones.filter(zone => 
        zone.postal_codes.includes(pincode)
      );

      console.log('Available zones for pincode:', availableZones);

      if (availableZones.length === 0) {
        return {
          available: false,
          zones: [],
          message: 'Sorry, delivery is not available for this pincode yet.',
        };
      }

      return {
        available: true,
        zones: availableZones,
        message: `Delivery is available in your area with ${availableZones.length} service zone(s).`,
      };
    } catch (error) {
      console.error('Error validating pincode:', error);
      throw error;
    }
  }

  // Calculate delivery fee for a specific zone and order amount
  calculateDeliveryFee(zone: DeliveryZone, orderAmount: number): number {
    if (orderAmount >= zone.minimum_order) {
      return zone.base_delivery_fee;
    }
    // Add extra fee for orders below minimum
    const extraFee = Math.ceil((zone.minimum_order - orderAmount) * 0.1); // 10% of the difference
    return zone.base_delivery_fee + extraFee;
  }

  // Validate if pincode format is correct (6 digits for Indian pincodes)
  validatePincodeFormat(pincode: string): boolean {
    return /^\d{6}$/.test(pincode);
  }
} 