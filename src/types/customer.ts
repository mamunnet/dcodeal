import type { Timestamp } from '@firebase/firestore-types';

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
} 