import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';
import { Auth } from '../auth';

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

class UserService {
  private static instance: UserService;
  private readonly collection = 'users';
  private auth: Auth;

  private constructor() {
    this.auth = Auth.getInstance();
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = this.auth.getCurrentUser();
      if (!user) return null;

      const userDoc = await getDoc(doc(db, this.collection, user.uid));
      if (!userDoc.exists()) {
        // Create profile if it doesn't exist
        const newProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          addresses: [],
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        };
        await setDoc(doc(db, this.collection, user.uid), newProfile);
        return newProfile;
      }

      return { id: userDoc.id, ...userDoc.data() } as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const user = this.auth.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const userRef = doc(db, this.collection, user.uid);
      await updateDoc(userRef, {
        ...updates,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async addAddress(address: Omit<UserAddress, 'id'>): Promise<void> {
    try {
      const user = this.auth.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const userRef = doc(db, this.collection, user.uid);
      const newAddress: UserAddress = {
        ...address,
        id: crypto.randomUUID(),
      };

      // If this is the first address or marked as default, update other addresses
      if (address.isDefault) {
        const profile = await this.getCurrentUserProfile();
        if (profile) {
          const updatedAddresses = profile.addresses.map(addr => ({
            ...addr,
            isDefault: false,
          }));
          await updateDoc(userRef, {
            addresses: [...updatedAddresses, newAddress],
            updated_at: Timestamp.now(),
          });
          return;
        }
      }

      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress),
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  async updateAddress(addressId: string, updates: Partial<UserAddress>): Promise<void> {
    try {
      const user = this.auth.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const profile = await this.getCurrentUserProfile();
      if (!profile) throw new Error('Profile not found');

      const userRef = doc(db, this.collection, user.uid);
      const updatedAddresses = profile.addresses.map(addr => {
        if (addr.id === addressId) {
          return { ...addr, ...updates };
        }
        // If the current address is being set as default, remove default from others
        if (updates.isDefault && updates.isDefault === true) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });

      await updateDoc(userRef, {
        addresses: updatedAddresses,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  async deleteAddress(addressId: string): Promise<void> {
    try {
      const user = this.auth.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const profile = await this.getCurrentUserProfile();
      if (!profile) throw new Error('Profile not found');

      const addressToDelete = profile.addresses.find(addr => addr.id === addressId);
      if (!addressToDelete) throw new Error('Address not found');

      const userRef = doc(db, this.collection, user.uid);
      await updateDoc(userRef, {
        addresses: arrayRemove(addressToDelete),
        updated_at: Timestamp.now(),
      });

      // If the deleted address was default, set the first remaining address as default
      if (addressToDelete.isDefault && profile.addresses.length > 1) {
        const remainingAddresses = profile.addresses.filter(addr => addr.id !== addressId);
        if (remainingAddresses.length > 0) {
          await this.updateAddress(remainingAddresses[0].id, { isDefault: true });
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  async setDefaultAddress(addressId: string): Promise<void> {
    return this.updateAddress(addressId, { isDefault: true });
  }
}

export const userService = UserService.getInstance(); 