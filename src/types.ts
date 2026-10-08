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
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  type: 'success' | 'info' | 'error';
}

export interface BrewCalc {
  method: string;
  cups: number;
  ratio: number;
}
