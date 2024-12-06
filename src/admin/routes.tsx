import { Navigate, RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

// Lazy load other pages
const Categories = lazy(() => import('./pages/Categories'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/products" element={<Products />} />
    <Route
      path="/categories"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <Categories />
        </Suspense>
      }
    />
    <Route
      path="/orders"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <Orders />
        </Suspense>
      }
    />
    <Route
      path="/customers"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <Customers />
        </Suspense>
      }
    />
    <Route
      path="/settings"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <Settings />
        </Suspense>
      }
    />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminLayout>
        <AdminRoutes />
      </AdminLayout>
    ),
  },
]; 