export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  image?: string; // For backward compatibility
} 