import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from '@firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDfFYRoVCZwNgadP2w58YvVPmtg4ND5umw",
  authDomain: "ecompwa-c0b6e.firebaseapp.com",
  projectId: "ecompwa-c0b6e",
  storageBucket: "ecompwa-c0b6e.appspot.com",
  messagingSenderId: "1012444902177",
  appId: "1:1012444902177:web:c5c0d7c6c2e8c8c5c0d7c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 