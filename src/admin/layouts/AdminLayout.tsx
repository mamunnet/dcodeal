import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  LayoutGrid, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: LayoutGrid },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          className="fixed top-4 left-4 p-2 rounded-md bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 bg-white border-r border-gray-200
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center p-2 rounded-lg hover:bg-gray-100
                      ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-900'}
                    `}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                className="w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                onClick={logout}
              >
                <LogOut className="w-6 h-6" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 p-4">
        <div className="p-4 bg-white rounded-lg shadow-md min-h-[calc(100vh-2rem)]">
          {children}
        </div>
      </div>
    </div>
  );
} 