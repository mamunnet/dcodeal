/// <reference types="vite/client" />

declare module 'firebase/app' {
  import { FirebaseApp } from '@firebase/app-types';
  export function initializeApp(options: any): FirebaseApp;
}

declare module 'firebase/auth' {
  import { Auth, User } from '@firebase/auth-types';
  export function getAuth(app?: any): Auth;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<any>;
  export function signOut(auth: Auth): Promise<void>;
  export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void): () => void;
  export type { User };
}

declare module 'firebase/firestore' {
  import { Firestore } from '@firebase/firestore-types';
  
  export function getFirestore(app?: any): Firestore;
  export function collection(firestore: Firestore, path: string): any;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): any;
  export function getDocs(query: any): Promise<any>;
  export function getDoc(reference: any): Promise<any>;
  export function addDoc(reference: any, data: any): Promise<any>;
  export function setDoc(reference: any, data: any): Promise<void>;
  export function updateDoc(reference: any, data: any): Promise<void>;
  export function deleteDoc(reference: any): Promise<void>;
  export function query(query: any, ...queryConstraints: any[]): any;
  export function where(fieldPath: string, opStr: string, value: any): any;
  export function orderBy(fieldPath: string, directionStr?: 'desc' | 'asc'): any;
  
  export class Timestamp {
    seconds: number;
    nanoseconds: number;
    toDate(): Date;
    static now(): Timestamp;
    static fromDate(date: Date): Timestamp;
  }

  export interface DocumentData {
    [field: string]: any;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    id: string;
    data(): T;
    exists(): boolean;
  }

  export interface DocumentSnapshot<T = DocumentData> extends QueryDocumentSnapshot<T> {
    metadata: {
      hasPendingWrites: boolean;
      fromCache: boolean;
    };
  }
}

declare module 'firebase/storage' {
  import { FirebaseStorage } from '@firebase/storage-types';
  export function getStorage(app?: any): FirebaseStorage;
  export function ref(storage: FirebaseStorage, path?: string): any;
  export function uploadBytes(reference: any, data: any, metadata?: any): Promise<any>;
  export function getDownloadURL(reference: any): Promise<string>;
  export function deleteObject(reference: any): Promise<void>;
} 