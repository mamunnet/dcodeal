import type { Timestamp } from '@firebase/firestore-types';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  stock: number;
  status: 'active' | 'inactive';
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Category {
  id?: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  created_at: Timestamp;
  updated_at: Timestamp;
} 