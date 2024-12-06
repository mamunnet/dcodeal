import type { Timestamp } from '@firebase/firestore-types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;  // Optional MRP (Maximum Retail Price)
  sku?: string;  // Optional Stock Keeping Unit
  stock: number;
  images?: string[];
  category_id: string;
  sub_category_id?: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent_id?: string;
  status: 'active' | 'inactive';
  order?: number;
  created_at: Date;
  updated_at: Date;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category_id: string;
  status: 'active' | 'inactive';
  order?: number;
  created_at: Date;
  updated_at: Date;
}