import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: ShoppingCart, label: 'Cart', path: '/cart' },
  { icon: ShoppingBag, label: 'Orders', path: '/orders' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-white border-t border-gray-200">
        <nav className="flex justify-around items-center h-16">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                <Icon
                  size={24}
                  className={isActive ? 'text-blue-600' : 'text-gray-500'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
                {label === 'Cart' && totalItems > 0 && (
                  <span className="absolute -top-1 right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 