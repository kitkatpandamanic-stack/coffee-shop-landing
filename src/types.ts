export interface Product {
  id: number; name: string; origin: string; country: string; category: string; price: number;
  weight: string; roast: string; description: string; notes: string[]; image: string; rating: number;
  brewMethod: string; altitude: string; process: string; reviews: Review[]; subscriptionPrice?: number;
  mapPosition?: { x: number; y: number }; story?: string; isLimited?: boolean; limitedUntil?: string;
}
export interface Review { id: number; author: string; rating: number; date: string; text: string; verified: boolean; }
export interface CartItem { product: Product; quantity: number; isSubscription: boolean; }
export interface OrderForm { name: string; email: string; phone: string; address: string; city: string; zip: string; }
export interface Toast { id: number; message: string; type: 'success' | 'info' | 'error' | 'loyalty'; }
export interface FAQItem { question: string; answer: string; }
export interface Order { id: string; date: string; items: { name: string; quantity: number; price: number; image: string }[]; total: number; status: 'preparing' | 'roasting' | 'shipped' | 'delivered'; trackingSteps: { label: string; date: string; done: boolean; icon: string }[]; }
export interface BlogPost { id: number; title: string; excerpt: string; content: string; image: string; author: string; date: string; category: string; readTime: string; tags: string[]; }
export interface UserProfile { name: string; email: string; memberSince: string; tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; favoriteOrigins: string[]; favoriteRoasts: string[]; savedAddresses: { label: string; address: string; city: string; isDefault: boolean }[]; }

export interface QuizQuestion { id: number; question: string; options: { label: string; value: string; emoji: string }[]; }
export interface QuizResult { title: string; description: string; productId: number; emoji: string; }

export interface Achievement { id: string; title: string; description: string; icon: string; unlocked: boolean; progress: number; total: number; }

export interface Bundle { id: number; name: string; description: string; products: number[]; price: number; originalPrice: number; image: string; badge?: string; }

export interface ChatMessage { id: number; sender: 'user' | 'bot'; text: string; timestamp: string; }
