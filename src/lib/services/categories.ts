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
  Timestamp,
  FieldValue
} from '@firebase/firestore';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
  parent_id?: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

const CATEGORIES_COLLECTION = 'categories';

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, CATEGORIES_COLLECTION);
      const q = query(categoriesRef);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        image: doc.data().image,
        status: doc.data().status,
        parent_id: doc.data().parent_id,
        created_at: doc.data().created_at || Timestamp.now(),
        updated_at: doc.data().updated_at || Timestamp.now()
      })) as Category[];
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  async getActiveCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, CATEGORIES_COLLECTION);
      const q = query(
        categoriesRef,
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      const categories = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        image: doc.data().image,
        status: doc.data().status,
        parent_id: doc.data().parent_id,
        created_at: doc.data().created_at || Timestamp.now(),
        updated_at: doc.data().updated_at || Timestamp.now()
      })) as Category[];

      return categories.filter(category => !category.parent_id);
    } catch (error) {
      console.error('Error getting active categories:', error);
      throw error;
    }
  }

  async getSubCategories(parentId: string): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, CATEGORIES_COLLECTION);
      const q = query(
        categoriesRef,
        where('parent_id', '==', parentId),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        image: doc.data().image,
        status: doc.data().status,
        parent_id: doc.data().parent_id,
        created_at: doc.data().created_at || Timestamp.now(),
        updated_at: doc.data().updated_at || Timestamp.now()
      })) as Category[];
    } catch (error) {
      console.error('Error getting sub-categories:', error);
      throw error;
    }
  }

  async getCategory(id: string): Promise<Category> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Category not found');
      }
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        description: data.description,
        image: data.image,
        status: data.status,
        parent_id: data.parent_id,
        created_at: data.created_at || Timestamp.now(),
        updated_at: data.updated_at || Timestamp.now()
      } as Category;
    } catch (error) {
      console.error('Error getting category:', error);
      throw error;
    }
  }

  async createCategory(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...data,
        parent_id: data.parent_id || null,
        created_at: now,
        updated_at: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        parent_id: data.parent_id || null,
        updated_at: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      // First, check if there are any sub-categories
      const subCategories = await this.getSubCategories(id);
      if (subCategories.length > 0) {
        throw new Error('Cannot delete category with sub-categories. Delete sub-categories first.');
      }

      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService(); 