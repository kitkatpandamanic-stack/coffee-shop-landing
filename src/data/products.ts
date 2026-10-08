import { Product, BlogPost, Order, UserProfile, FAQItem, QuizQuestion, QuizResult, Achievement, Bundle } from '../types';

export const products: Product[] = [
  {
    id: 1, name: 'Ethiopian Yirgacheffe', origin: 'Yirgacheffe, Ethiopia', country: 'Ethiopia',
    category: 'Single Origin', price: 18.99, subscriptionPrice: 16.14, weight: '250g', roast: 'Light',
    description: 'A bright and complex coffee from the birthplace of coffee. Grown at high altitudes in the Yirgacheffe region, this lot features delicate floral aromatics and a tea-like body.',
    notes: ['Jasmine', 'Bergamot', 'Peach', 'Honey'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    rating: 4.9, brewMethod: 'Pour Over', altitude: '1,900–2,200m', process: 'Washed',
    mapPosition: { x: 58, y: 58 },
    story: 'In the misty highlands of Yirgacheffe, the Gebre family has cultivated coffee for three generations.',
    reviews: [
      { id: 1, author: 'Sarah M.', rating: 5, date: '2026-01-15', text: 'Absolutely stunning coffee. The jasmine notes are incredible.', verified: true },
      { id: 2, author: 'David K.', rating: 5, date: '2026-01-08', text: 'Light and floral, exactly what I was looking for.', verified: true },
    ],
  },
  {
    id: 2, name: 'Colombian Supremo', origin: 'Huila, Colombia', country: 'Colombia',
    category: 'Single Origin', price: 16.49, subscriptionPrice: 14.02, weight: '250g', roast: 'Medium',
    description: 'Sourced from small farms in the Huila region, this Supremo grade coffee offers a perfectly balanced cup with rich caramel sweetness.',
    notes: ['Caramel', 'Red Apple', 'Milk Chocolate', 'Walnut'],
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop',
    rating: 4.7, brewMethod: 'Drip / Pour Over', altitude: '1,500–1,800m', process: 'Washed',
    mapPosition: { x: 28, y: 52 },
    story: 'The Rodríguez cooperative in Huila brings together 47 smallholder farmers who share a commitment to sustainable farming.',
    reviews: [
      { id: 4, author: 'Mike T.', rating: 5, date: '2026-01-12', text: 'My daily driver. Perfectly balanced, never disappoints.', verified: true },
    ],
  },
  {
    id: 3, name: 'Midnight Espresso Blend', origin: 'Brazil & Indonesia', country: 'Brazil',
    category: 'Blend', price: 14.99, subscriptionPrice: 12.74, weight: '250g', roast: 'Dark',
    description: 'Our signature dark roast blend combines the chocolate richness of Brazilian Santos with the earthy depth of Sumatran Mandheling.',
    notes: ['Dark Chocolate', 'Tobacco', 'Molasses', 'Cedar'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop',
    rating: 4.6, brewMethod: 'Espresso', altitude: '800–1,200m', process: 'Natural / Wet-Hulled',
    mapPosition: { x: 33, y: 60 },
    story: 'Our master roaster Marco spent two years perfecting this blend.',
    reviews: [
      { id: 6, author: 'James W.', rating: 5, date: '2026-01-18', text: 'Makes incredible espresso at home. Thick crema, bold flavor.', verified: true },
    ],
  },
  {
    id: 4, name: 'Kenyan AA Nyeri', origin: 'Nyeri, Kenya', country: 'Kenya',
    category: 'Single Origin', price: 21.99, subscriptionPrice: 18.69, weight: '250g', roast: 'Light-Medium',
    description: 'From the renowned Nyeri county, this AA grade coffee is hand-picked and fully washed with wine-like complexity.',
    notes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Brown Sugar'],
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop',
    rating: 4.8, brewMethod: 'Pour Over / AeroPress', altitude: '1,700–2,000m', process: 'Washed',
    mapPosition: { x: 58, y: 55 },
    story: 'The Othaya farmers cooperative in Nyeri has won the Cup of Excellence three times.',
    isLimited: true, limitedUntil: '2026-02-15T23:59:59',
    reviews: [
      { id: 9, author: 'Emma C.', rating: 5, date: '2026-01-20', text: 'Wine-like complexity is no exaggeration. Incredible experience.', verified: true },
    ],
  },
  {
    id: 5, name: 'Velvet Morning Blend', origin: 'Guatemala & Ethiopia', country: 'Guatemala',
    category: 'Blend', price: 15.99, subscriptionPrice: 13.59, weight: '250g', roast: 'Medium',
    description: 'A harmonious blend of Guatemalan Antigua and Ethiopian Sidamo beans creating a velvety smooth cup.',
    notes: ['Cocoa', 'Plum', 'Vanilla', 'Almond'],
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop',
    rating: 4.5, brewMethod: 'Drip / French Press', altitude: '1,400–1,800m', process: 'Washed / Natural',
    mapPosition: { x: 24, y: 50 },
    story: 'Inspired by morning rituals around the world, this blend marries volcanic intensity with bright elegance.',
    reviews: [
      { id: 11, author: 'Kate L.', rating: 5, date: '2026-01-16', text: 'The name says it all — velvet smooth.', verified: true },
    ],
  },
  {
    id: 6, name: 'Sumatra Mandheling', origin: 'Sumatra, Indonesia', country: 'Indonesia',
    category: 'Single Origin', price: 17.49, subscriptionPrice: 14.87, weight: '250g', roast: 'Dark',
    description: 'Wet-hulled in the traditional Giling Basah method, developing its characteristic earthy, full-bodied profile.',
    notes: ['Earth', 'Dark Cocoa', 'Spice', 'Herbs'],
    image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop',
    rating: 4.4, brewMethod: 'French Press / Espresso', altitude: '1,100–1,600m', process: 'Wet-Hulled (Giling Basah)',
    mapPosition: { x: 76, y: 58 },
    story: 'In the lush highlands of North Sumatra, the Gajah family has perfected the ancient Giling Basah method.',
    reviews: [
      { id: 13, author: 'Paul G.', rating: 5, date: '2026-01-17', text: 'Earthy and bold — exactly what a Sumatra should be.', verified: true },
    ],
  },
];

export const categories = ['All', 'Single Origin', 'Blend'];
export const roastLevels = ['All', 'Light', 'Light-Medium', 'Medium', 'Dark'];
export const sortOptions = [
  { value: 'featured', label: 'Featured' }, { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' }, { value: 'rating', label: 'Top Rated' }, { value: 'name', label: 'Name A–Z' },
];
export const promoCodes: Record<string, number> = { 'COFFEE10': 10, 'BREW20': 20, 'FIRST15': 15 };
export const FREE_SHIPPING_THRESHOLD = 35;

export const blogPosts: BlogPost[] = [
  { id: 1, title: 'The Art of Pour Over: A Complete Guide', excerpt: 'Master the pour over technique and unlock complex flavors.', content: 'Pour over brewing is both an art and a science. The key variables are water temperature (93-96°C), grind size (medium-fine), and pour technique. Start with a 30-second bloom using twice the weight of coffee in water.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop', author: 'Marco Rossi', date: '2026-01-20', category: 'Brewing', readTime: '5 min', tags: ['Pour Over', 'Guide', 'Technique'] },
  { id: 2, title: 'Understanding Coffee Processing Methods', excerpt: 'From washed to natural to honey — how processing transforms flavor.', content: 'The way coffee cherries are processed after harvest dramatically impacts flavor. Washed processing produces clean, bright cups. Natural processing creates fruity, wine-like flavors.', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop', author: 'Dr. Amara Osei', date: '2026-01-15', category: 'Education', readTime: '7 min', tags: ['Processing', 'Education'] },
  { id: 3, title: '5 Morning Rituals from Around the World', excerpt: 'How different cultures start their day with coffee.', content: 'In Ethiopia, coffee ceremony is a three-round ritual. In Italy, espresso is consumed standing at the bar. In Turkey, coffee is brewed in a cezve with cardamom.', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop', author: 'Yuki Tanaka', date: '2026-01-10', category: 'Culture', readTime: '6 min', tags: ['Culture', 'Rituals'] },
  { id: 4, title: 'Espresso Extraction: Dialing In the Perfect Shot', excerpt: 'Troubleshoot your espresso with these pro tips.', content: 'The perfect espresso shot requires balance between dose, yield, and time. Start with 18g of coffee yielding 36g of espresso in 25-30 seconds.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff0fe?w=600&h=400&fit=crop', author: 'Marco Rossi', date: '2026-01-05', category: 'Brewing', readTime: '8 min', tags: ['Espresso', 'Technique'] },
];

export const sampleOrders: Order[] = [
  { id: 'BB-84729', date: '2026-01-18', items: [{ name: 'Ethiopian Yirgacheffe', quantity: 1, price: 18.99, image: products[0].image }], total: 18.99, status: 'delivered', trackingSteps: [{ label: 'Order Placed', date: 'Jan 18, 10:23 AM', done: true, icon: '📦' }, { label: 'Roasting', date: 'Jan 18, 2:00 PM', done: true, icon: '🔥' }, { label: 'Shipped', date: 'Jan 19, 9:15 AM', done: true, icon: '🚚' }, { label: 'Delivered', date: 'Jan 21, 3:42 PM', done: true, icon: '✅' }] },
  { id: 'BB-91034', date: '2026-01-22', items: [{ name: 'Kenyan AA Nyeri', quantity: 1, price: 21.99, image: products[3].image }], total: 21.99, status: 'shipped', trackingSteps: [{ label: 'Order Placed', date: 'Jan 22, 8:45 AM', done: true, icon: '📦' }, { label: 'Roasting', date: 'Jan 22, 1:30 PM', done: true, icon: '🔥' }, { label: 'Shipped', date: 'Jan 23, 10:00 AM', done: true, icon: '🚚' }, { label: 'Delivered', date: 'Estimated Jan 26', done: false, icon: '✅' }] },
];

export const defaultProfile: UserProfile = {
  name: 'Alex Johnson', email: 'alex.johnson@email.com', memberSince: 'March 2025', tier: 'Gold',
  favoriteOrigins: ['Ethiopia', 'Colombia', 'Kenya'], favoriteRoasts: ['Light', 'Medium'],
  savedAddresses: [{ label: 'Home', address: '742 Coffee Lane', city: 'Portland, OR 97201', isDefault: true }],
};

export const roastingTimeline = [
  { stage: 'Harvesting', icon: '🌱', duration: 'Oct – Dec', description: 'Ripe cherries are hand-picked at peak maturity.' },
  { stage: 'Processing', icon: '💧', duration: '1–3 days', description: 'Cherries are washed, natural-dried, or honey-processed.' },
  { stage: 'Milling & Grading', icon: '⚙️', duration: '1–2 weeks', description: 'Parchment is removed, beans are sorted by size and density.' },
  { stage: 'Export & Shipping', icon: '🚢', duration: '2–6 weeks', description: 'Green beans travel in climate-controlled containers.' },
  { stage: 'Cupping & Selection', icon: '☕', duration: '1 day', description: 'Our Q-graders cup each lot, scoring on a 100-point scale.' },
  { stage: 'Roasting', icon: '🔥', duration: '12–15 minutes', description: 'Small batches are roasted to highlight each origin\'s character.' },
  { stage: 'Resting', icon: '⏳', duration: '24–48 hours', description: 'Freshly roasted coffee needs to degas CO2.' },
  { stage: 'Your Cup', icon: '🏠', duration: 'Now', description: 'Brewed with care in your kitchen.' },
];

export const faqData: FAQItem[] = [
  { question: 'What makes your coffee "specialty"?', answer: 'Specialty coffee is graded 80+ on a 100-point scale. We source only the top 3% of the world\'s coffee.' },
  { question: 'How fresh is your coffee?', answer: 'We roast to order — every bag is roasted within 48 hours of shipping.' },
  { question: 'How does the subscription work?', answer: 'Choose any coffee and select "Subscribe & Save" for 15% off every order.' },
  { question: 'Do you offer free shipping?', answer: 'Yes! All orders over $35 ship free within the continental US.' },
  { question: 'How do loyalty points work?', answer: 'Earn 1 point for every $1 spent. Reach 100 points for a $5 reward.' },
];

// ===== QUIZ =====
export const quizQuestions: QuizQuestion[] = [
  { id: 1, question: 'How do you like your coffee?', options: [
    { label: 'Light & fruity', value: 'light', emoji: '🌸' }, { label: 'Balanced & smooth', value: 'medium', emoji: '☕' },
    { label: 'Bold & intense', value: 'dark', emoji: '🔥' }, { label: 'I don\'t know yet!', value: 'explore', emoji: '🧭' },
  ]},
  { id: 2, question: 'What brewing method do you use?', options: [
    { label: 'Pour Over / Drip', value: 'pourover', emoji: '🫗' }, { label: 'Espresso machine', value: 'espresso', emoji: '☕' },
    { label: 'French Press', value: 'frenchpress', emoji: '🍵' }, { label: 'I\'m flexible', value: 'any', emoji: '✨' },
  ]},
  { id: 3, question: 'Which flavors excite you?', options: [
    { label: 'Floral & tea-like', value: 'floral', emoji: '🌺' }, { label: 'Chocolate & nuts', value: 'chocolate', emoji: '🍫' },
    { label: 'Fruity & wine-like', value: 'fruity', emoji: '🍇' }, { label: 'Earthy & spicy', value: 'earthy', emoji: '🌿' },
  ]},
  { id: 4, question: 'When do you drink coffee?', options: [
    { label: 'Morning ritual', value: 'morning', emoji: '🌅' }, { label: 'Afternoon pick-me-up', value: 'afternoon', emoji: '☀️' },
    { label: 'All day long', value: 'allday', emoji: '⏰' }, { label: 'Special occasions', value: 'special', emoji: '🎉' },
  ]},
  { id: 5, question: 'What matters most to you?', options: [
    { label: 'Single origin story', value: 'origin', emoji: '🌍' }, { label: 'Perfect balance', value: 'balance', emoji: '⚖️' },
    { label: 'Unique experience', value: 'unique', emoji: '💎' }, { label: 'Best value', value: 'value', emoji: '💰' },
  ]},
];

export const quizResults: Record<string, QuizResult> = {
  'light-pourover-floral': { title: 'Ethiopian Yirgacheffe', description: 'A floral, tea-like coffee that will transport you to the highlands of Ethiopia. Perfect for your pour over ritual.', productId: 1, emoji: '🌸' },
  'medium-pourover-chocolate': { title: 'Colombian Supremo', description: 'A balanced, caramel-sweet coffee that\'s perfect for daily enjoyment. Your new morning companion.', productId: 2, emoji: '☕' },
  'dark-espresso-chocolate': { title: 'Midnight Espresso Blend', description: 'A bold, chocolatey blend designed for espresso. Rich crema and deep flavors await.', productId: 3, emoji: '🔥' },
  'light-any-fruity': { title: 'Kenyan AA Nyeri', description: 'A wine-like, complex coffee with sparkling acidity. An adventure in every cup.', productId: 4, emoji: '🍇' },
  'medium-any-balance': { title: 'Velvet Morning Blend', description: 'A velvety, harmonious blend that evolves with every sip. Perfect for any time of day.', productId: 5, emoji: '✨' },
  'dark-frenchpress-earthy': { title: 'Sumatra Mandheling', description: 'An earthy, full-bodied coffee with a syrupy mouthfeel. Bold and unforgettable.', productId: 6, emoji: '🌿' },
  'default': { title: 'Colombian Supremo', description: 'A perfectly balanced coffee that\'s loved by everyone. A great starting point for your coffee journey!', productId: 2, emoji: '☕' },
};

// ===== ACHIEVEMENTS =====
export const achievements: Achievement[] = [
  { id: 'first-order', title: 'First Brew', description: 'Place your first order', icon: '🎉', unlocked: true, progress: 1, total: 1 },
  { id: 'explorer', title: 'Coffee Explorer', description: 'Try coffees from 3 different origins', icon: '🌍', unlocked: true, progress: 3, total: 3 },
  { id: 'reviewer', title: 'Voice of Coffee', description: 'Write 5 reviews', icon: '✍️', unlocked: false, progress: 2, total: 5 },
  { id: 'subscriber', title: 'Coffee Club', description: 'Start a subscription', icon: '🔄', unlocked: false, progress: 0, total: 1 },
  { id: 'referral', title: 'Coffee Ambassador', description: 'Refer 3 friends', icon: '🤝', unlocked: false, progress: 1, total: 3 },
  { id: 'connoisseur', title: 'Coffee Connoisseur', description: 'Try all 6 of our coffees', icon: '👑', unlocked: false, progress: 3, total: 6 },
  { id: 'loyal', title: 'Loyalty Master', description: 'Earn 500 loyalty points', icon: '💎', unlocked: false, progress: 187, total: 500 },
  { id: 'quiz', title: 'Coffee Matchmaker', description: 'Complete the coffee quiz', icon: '🎯', unlocked: true, progress: 1, total: 1 },
];

// ===== BUNDLES =====
export const bundles: Bundle[] = [
  { id: 1, name: 'Discovery Set', description: 'Try three of our most popular single origins. Perfect for finding your favorite.', products: [1, 2, 4], price: 49.99, originalPrice: 57.47, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop', badge: 'Bestseller' },
  { id: 2, name: 'Espresso Lover', description: 'Two bold coffees perfect for espresso. Rich, intense, unforgettable.', products: [3, 6], price: 29.99, originalPrice: 32.48, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600&h=400&fit=crop', badge: 'Popular' },
  { id: 3, name: 'World Tour', description: 'Journey through four continents with our most diverse selection.', products: [1, 2, 4, 6], price: 69.99, originalPrice: 74.96, image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=400&fit=crop', badge: 'Limited' },
];

// ===== CHAT =====
export const chatResponses: Record<string, string> = {
  'default': 'Thanks for reaching out! I\'m here to help with anything coffee-related. What can I assist you with today?',
  'shipping': 'We offer free shipping on orders over $35! Standard delivery takes 3-5 business days. All orders are roasted to order and ship within 48 hours.',
  'subscription': 'Our subscription saves you 15% on every order! You can choose delivery frequency (1, 2, or 4 weeks) and pause or cancel anytime. No commitments!',
  'grind': 'We ship whole beans by default for maximum freshness. Use our Brew Calculator (☕ icon) to find the perfect grind size for your method. We can also pre-grind upon request.',
  'return': 'We want you to love your coffee! If you\'re not satisfied, contact us within 14 days for a full refund or replacement. No questions asked.',
  'recommend': 'I\'d love to help you find your perfect coffee! Try our Coffee Quiz (🎯 in the header) — it takes 30 seconds and matches you with your ideal brew based on your preferences.',
  'freshness': 'Every bag is roasted within 48 hours of shipping! You\'ll find the roast date on each package. For peak flavor, we recommend consuming within 4 weeks of roasting.',
  'hello': 'Hello! 👋 Welcome to Bean & Brew. How can I help you today?',
  'help': 'I can help with: shipping info, subscriptions, grind recommendations, returns, coffee suggestions, and more. Just ask!',
};
