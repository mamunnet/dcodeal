import { auth } from './firebase';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from '@firebase/auth';

export class Auth {
  private static instance: Auth;
  private currentUser: User | null = null;
  private readonly ADMIN_EMAIL = 'mariawebtech.contact@gmail.com';
  private recaptchaVerifier: RecaptchaVerifier | null = null;

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

  async loginWithPhone(phoneNumber: string): Promise<{ verificationId: string }> {
    try {
      if (!this.recaptchaVerifier) {
        this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier
      );
      return { verificationId: confirmationResult.verificationId };
    } catch (error) {
      console.error('Phone verification error:', error);
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }
      throw error;
    }
  }

  async verifyOTP(verificationId: string, otp: string): Promise<boolean> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('Please request OTP first');
      }
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (email !== this.ADMIN_EMAIL) {
        console.error('User is not authorized as admin');
        await this.logout();
        throw new Error('Unauthorized access');
      }

      console.log('Login successful for user:', user.email);
      return true;
    } catch (error: unknown) {
      console.error('Login error:', error);
      
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
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isCustomer(user: User | null): boolean {
    return !!user && user.phoneNumber !== null;
  }

  isAdmin(user: User | null): boolean {
    return !!user && user.email === this.ADMIN_EMAIL;
  }
} 