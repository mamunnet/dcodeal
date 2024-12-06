import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, CreditCard, Truck, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Auth } from '../../lib/auth';
import { orderService } from '../../lib/services/order';
import type { UserAddress } from '../../lib/services/user';

interface CheckoutStep {
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = Auth.getInstance();

  const steps: CheckoutStep[] = [
    {
      title: 'Delivery Address',
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
    },
    {
      title: 'Delivery Options',
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
    },
    {
      title: 'Payment',
      isCompleted: currentStep > 3,
      isActive: currentStep === 3,
    },
  ];

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const profile = await userService.getCurrentUserProfile();
      if (profile) {
        setAddresses(profile.addresses);
        const defaultAddress = profile.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('Failed to load addresses. Please try again.');
    }
  };

  const handleAddressSelect = async (address: UserAddress) => {
    try {
      setSelectedAddress(address);
      // Calculate delivery charge based on pincode
      const locationService = LocationService.getInstance();
      const { available, zones } = await locationService.validatePincode(address.pincode);
      
      if (!available) {
        setError('Delivery is not available for this address');
        return;
      }

      const zone = zones[0];
      setDeliveryCharge(zone.base_delivery_fee);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error selecting address:', error);
      setError('Failed to validate delivery location. Please try again.');
    }
  };

  const handleDeliveryConfirm = () => {
    setCurrentStep(3);
  };

  const initializeRazorpay = (orderId: string, amount: number) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Your Store Name',
      description: 'Order Payment',
      order_id: orderId,
      handler: async (response: any) => {
        try {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          
          // Verify payment
          const isVerified = await orderService.verifyRazorpayPayment(
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
          );

          if (isVerified) {
            await processOrder(razorpay_order_id, razorpay_payment_id);
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setError('Payment verification failed. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: selectedAddress?.name,
        contact: selectedAddress?.phone,
      },
      theme: {
        color: '#2563EB',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const processOrder = async (razorpayOrderId?: string, razorpayPaymentId?: string) => {
    try {
      if (!selectedAddress) throw new Error('No delivery address selected');

      const orderData = {
        items: items,
        total: totalAmount,
        user_id: auth.getCurrentUser()?.uid || '',
        status: 'pending' as const,
        shipping_address: selectedAddress,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId
      };

      const orderId = await orderService.createOrder(orderData);
      clearCart();
      navigate('/orders', { state: { orderId, success: true } });
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (paymentMethod === 'online') {
        const { id: orderId } = await orderService.createRazorpayOrder(
          getTotalWithDelivery() * 100 // Convert to paise
        );
        initializeRazorpay(orderId, getTotalWithDelivery());
      } else {
        await processOrder();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const getTotalWithDelivery = () => {
    return totalAmount + deliveryCharge;
  };

  // Check if user is authenticated
  useEffect(() => {
    const auth = Auth.getInstance();
    const user = auth.getCurrentUser();
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center p-4">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">Checkout</h1>
          </div>

          {/* Steps */}
          <div className="px-4 pb-4">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.isCompleted
                        ? 'bg-green-600 text-white'
                        : step.isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div
                    className={`ml-2 text-sm ${
                      step.isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-2 flex-1 h-0.5 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Select Delivery Address</h2>
                  <button
                    onClick={() => navigate('/profile/addresses')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Add New
                  </button>
                </div>

                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      selectedAddress?.id === address.id
                        ? 'border-blue-600'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              address.type === 'home'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {address.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.street}, {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-medium">Delivery Options</h2>

                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Truck className="text-blue-600 h-6 w-6" />
                    <div>
                      <h3 className="font-medium">Standard Delivery</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Estimated delivery: 2-3 business days
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        ₹{deliveryCharge}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeliveryConfirm}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-medium">Payment Method</h2>

                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      paymentMethod === 'online' ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-blue-600 h-6 w-6" />
                      <div>
                        <h3 className="font-medium">Online Payment</h3>
                        <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="text-green-600 h-6 w-6" />
                      <div>
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items Total</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span>₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total Amount</span>
                      <span>₹{getTotalWithDelivery().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${getTotalWithDelivery().toFixed(2)}`}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 