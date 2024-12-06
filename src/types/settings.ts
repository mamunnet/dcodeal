export interface DeliveryZone {
  id: string;
  name: string;
  pincode: string;
  postal_codes: string[];
  base_delivery_fee: number;
  minimum_order: number;
  estimated_time: string;
  is_active: boolean;
  active?: boolean;
}

export interface StoreSettings {
  store: {
    name: string;
    description: string;
    contact_email: string;
    currency: string;
  };
  shipping: {
    default_rate: number;
    free_shipping_threshold: number;
    enable_international: boolean;
    delivery_zones: DeliveryZone[];
  };
  payment: {
    gateway: string;
    test_mode: boolean;
  };
  notifications: {
    order_confirmation: boolean;
    shipping_updates: boolean;
    marketing_emails: boolean;
  };
} 