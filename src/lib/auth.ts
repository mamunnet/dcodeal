import { auth } from './firebase';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User
} from 'firebase/auth';

export class Auth {
  private static instance: Auth;
  private currentUser: User | null = null;
  private readonly ADMIN_EMAIL = 'mariawebtech.contact@gmail.com';

  private constructor() {
    firebaseOnAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, callback);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify if it's the admin email
      if (email !== this.ADMIN_EMAIL) {
        console.error('User is not authorized as admin');
        await this.logout();
        throw new Error('Unauthorized access');
      }

      console.log('Login successful for user:', user.email);
      return true;
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Handle Firebase Auth errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        switch (errorCode) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
            throw new Error('Invalid email or password');
          case 'auth/user-not-found':
            throw new Error('No account found with this email');
          case 'auth/invalid-email':
            throw new Error('Invalid email format');
          case 'auth/user-disabled':
            throw new Error('This account has been disabled');
          case 'auth/too-many-requests':
            throw new Error('Too many failed attempts. Please try again later');
          default:
            console.error('Unhandled Firebase error:', errorCode);
            throw new Error('Login failed. Please try again.');
        }
      }
      
      throw new Error('Login failed. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(user: User | null): boolean {
    return !!user && user.email === this.ADMIN_EMAIL;
  }
} 