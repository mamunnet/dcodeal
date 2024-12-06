import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import type { Product } from '../../types/product';

const PRODUCTS_COLLECTION = 'products';

class ProductService {
  async getProducts(lastDoc?: QueryDocumentSnapshot<DocumentData>) {
    try {
      let q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('created_at', 'desc')
      );

      if (lastDoc) {
        q = query(q, where('created_at', '<', lastDoc.data().created_at));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  async getProduct(id: string) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Product not found');
      }
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string) {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category_id', '==', categoryId),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }

  async getFeaturedProducts() {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('featured', '==', true),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw error;
    }
  }

  async searchProducts(searchTerm: string) {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('status', '==', 'active'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const searchTermLower = searchTerm.toLowerCase();
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.description.toLowerCase().includes(searchTermLower)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  async createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
  ) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export const productService = new ProductService(); 