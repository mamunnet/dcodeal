import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-sm">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Shopping Cart</h1>
          </div>
          {items.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="p-4 border-b">
                  <div className="flex gap-4">
                    <img
                      src={item.images?.[0] || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 