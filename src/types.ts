export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  weight: string;
  roast: string;
  description: string;
  notes: string[];
  image: string;
  rating: number;
  brewMethod: string;
  altitude: string;
  process: string;
  reviews: Review[];
  subscriptionPrice?: number;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription: boolean;
}

export interface OrderForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error' | 'loyalty';
}

export interface FAQItem {
  question: string;
  answer: string;
}
