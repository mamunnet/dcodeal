import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../../types/product';

interface CartItemProps extends Product {
  quantity: number;
}

export function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      // Implement Razorpay checkout logic here
      console.log('Proceeding to checkout...');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-semibold">Shopping Cart</h1>
            </div>
            <span className="text-sm text-gray-500">{totalItems} items</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-4">
          <AnimatePresence>
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item: CartItemProps) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-4 bg-white rounded-lg p-4 border border-gray-100"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-300">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">₹{item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => item.id && removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-4">
                        <button
                          onClick={() => item.id && handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-4 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => item.id && handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">Your cart is empty</div>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Checkout Section */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-semibold text-gray-900">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 