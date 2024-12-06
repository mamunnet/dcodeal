import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ProductList } from './components/products/ProductList';
import { ProductDetail } from './components/products/ProductDetail';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { AccountPage } from './components/account/AccountPage';
import { CartPage } from './components/cart/CartPage';
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import Categories from './admin/pages/Categories';
import Orders from './admin/pages/Orders';
import Customers from './admin/pages/Customers';
import Settings from './admin/pages/Settings';
import AdminLogin from './admin/pages/Login';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import { AuthProvider, ProtectedRoute } from './admin/context/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LocationProvider } from './contexts/LocationContext';

// Separate component for customer routes
const CustomerRoutes = () => (
  <CartProvider>
    <LocationProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="category/:categoryId" element={<ProductList />} />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="signup" element={<UserSignup />} />

        {/* Protected Routes */}
        <Route 
          path="checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <AccountPage onBack={() => window.history.back()} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LocationProvider>
  </CartProvider>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/ecomadmin" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Customer Routes */}
          <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
