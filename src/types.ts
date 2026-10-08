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
