export interface StoreSettings {
  store: {
    name: string;
    description: string;
    currency: string;
    contact_email: string;
  };
  shipping: {
    default_rate: number;
    free_shipping_threshold: number;
    enable_international: boolean;
  };
  payment: {
    gateway: 'stripe' | 'paypal' | 'razorpay';
    test_mode: boolean;
  };
  notifications: {
    order_confirmation: boolean;
    shipping_updates: boolean;
    marketing_emails: boolean;
  };
} 