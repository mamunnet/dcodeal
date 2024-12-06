import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from '../../lib/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPhone: (phoneNumber: string) => Promise<{ verificationId: string }>;
  verifyOTP: (verificationId: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isLoading: true,
  loginWithPhone: async () => ({ verificationId: '' }),
  verifyOTP: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = Auth.getInstance();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAdmin(auth.isAdmin(currentUser));
      setIsAuthenticated(!!currentUser && (auth.isCustomer(currentUser) || auth.isAdmin(currentUser)));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      return await auth.loginWithPhone(phoneNumber);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (verificationId: string, otp: string) => {
    try {
      setIsLoading(true);
      const isValid = await auth.verifyOTP(verificationId, otp);
      if (isValid) {
        const returnUrl = (location.state as any)?.from || '/';
        navigate(returnUrl);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await auth.logout();
      if (location.pathname.startsWith('/admin')) {
        navigate('/ecomadmin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin, 
        isAuthenticated, 
        isLoading,
        loginWithPhone,
        verifyOTP,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (requireAdmin) {
        // For admin routes
        if (!isAuthenticated || !isAdmin) {
          navigate('/ecomadmin', { 
            state: { from: location.pathname } 
          });
        }
      } else {
        // For customer routes
        if (!isAuthenticated || isAdmin) {
          navigate('/login', { 
            state: { from: location.pathname } 
          });
        }
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, location, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (requireAdmin) {
    return isAuthenticated && isAdmin ? <>{children}</> : null;
  }

  return isAuthenticated && !isAdmin ? <>{children}</> : null;
}; 