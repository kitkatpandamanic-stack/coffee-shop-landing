import { Product, BlogPost, Order, UserProfile, FAQItem } from '../types';

export const products: Product[] = [
  {
    id: 1, name: 'Ethiopian Yirgacheffe', origin: 'Yirgacheffe, Ethiopia', country: 'Ethiopia',
    category: 'Single Origin', price: 18.99, subscriptionPrice: 16.14, weight: '250g', roast: 'Light',
    description: 'A bright and complex coffee from the birthplace of coffee. Grown at high altitudes in the Yirgacheffe region, this lot features delicate floral aromatics and a tea-like body.',
    notes: ['Jasmine', 'Bergamot', 'Peach', 'Honey'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    rating: 4.9, brewMethod: 'Pour Over', altitude: '1,900–2,200m', process: 'Washed',
    mapPosition: { x: 58, y: 58 },
    story: 'In the misty highlands of Yirgacheffe, the Gebre family has cultivated coffee for three generations. Their small farm, nestled at 2,000 meters, benefits from rich volcanic soil and a unique microclimate that produces beans of extraordinary complexity.',
    reviews: [
      { id: 1, author: 'Sarah M.', rating: 5, date: '2026-01-15', text: 'Absolutely stunning coffee. The jasmine notes are incredible.', verified: true },
      { id: 2, author: 'David K.', rating: 5, date: '2026-01-08', text: 'Light and floral, exactly what I was looking for.', verified: true },
      { id: 3, author: 'Alex R.', rating: 4, date: '2025-12-20', text: 'Beautiful coffee, definitely for those who prefer lighter roasts.', verified: false },
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
    story: 'The Rodríguez cooperative in Huila brings together 47 smallholder farmers who share a commitment to sustainable farming. Each cherry is hand-picked at peak ripeness and processed using mountain spring water.',
    reviews: [
      { id: 4, author: 'Mike T.', rating: 5, date: '2026-01-12', text: 'My daily driver. Perfectly balanced, never disappoints.', verified: true },
      { id: 5, author: 'Lisa P.', rating: 4, date: '2026-01-05', text: 'Great everyday coffee. Smooth and easy to drink.', verified: true },
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
    story: 'Our master roaster Marco spent two years perfecting this blend, testing over 200 combinations before achieving the perfect balance between Brazilian sweetness and Indonesian depth.',
    reviews: [
      { id: 6, author: 'James W.', rating: 5, date: '2026-01-18', text: 'Makes incredible espresso at home. Thick crema, bold flavor.', verified: true },
      { id: 7, author: 'Nina S.', rating: 4, date: '2026-01-10', text: 'Very bold and intense. Perfect for milk-based drinks.', verified: true },
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
    story: 'The Othaya farmers cooperative in Nyeri has won the Cup of Excellence three times. Their meticulous sorting process ensures only the ripest cherries make it to your cup.',
    reviews: [
      { id: 9, author: 'Emma C.', rating: 5, date: '2026-01-20', text: 'Wine-like complexity is no exaggeration. Incredible experience.', verified: true },
      { id: 10, author: 'Ryan H.', rating: 5, date: '2026-01-14', text: 'The blackcurrant note is unbelievable. Worth every penny.', verified: true },
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
    story: 'Inspired by morning rituals around the world, this blend marries the volcanic intensity of Antigua with the bright elegance of Sidamo for a cup that evolves with every sip.',
    reviews: [
      { id: 11, author: 'Kate L.', rating: 5, date: '2026-01-16', text: 'The name says it all — velvet smooth.', verified: true },
      { id: 12, author: 'Chris D.', rating: 4, date: '2026-01-09', text: 'Great blend. The cocoa and plum notes work beautifully.', verified: true },
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
    story: 'In the lush highlands of North Sumatra, the Gajah family has perfected the ancient Giling Basah method passed down through five generations, creating a coffee as mysterious as the island itself.',
    reviews: [
      { id: 13, author: 'Paul G.', rating: 5, date: '2026-01-17', text: 'Earthy and bold — exactly what a Sumatra should be.', verified: true },
      { id: 14, author: 'Maria V.', rating: 4, date: '2026-01-06', text: 'Unique flavor profile. If you like earthy coffees, this is top tier.', verified: false },
    ],
  },
];

export const categories = ['All', 'Single Origin', 'Blend'];
export const roastLevels = ['All', 'Light', 'Light-Medium', 'Medium', 'Dark'];
export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
];
export const promoCodes: Record<string, number> = { 'COFFEE10': 10, 'BREW20': 20, 'FIRST15': 15 };
export const FREE_SHIPPING_THRESHOLD = 35;

export const blogPosts: BlogPost[] = [
  {
    id: 1, title: 'The Art of Pour Over: A Complete Guide',
    excerpt: 'Master the pour over technique and unlock complex flavors hidden in your favorite beans.',
    content: 'Pour over brewing is both an art and a science. The key variables are water temperature (93-96°C), grind size (medium-fine), and pour technique. Start with a 30-second bloom using twice the weight of coffee in water. This releases CO2 and prepares the grounds for even extraction. Then pour in slow, concentric circles, maintaining a consistent flow rate. Total brew time should be 3:00-4:00 for a standard V60. The result is a clean, bright cup that showcases the unique characteristics of single origin beans.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
    author: 'Marco Rossi', date: '2026-01-20', category: 'Brewing', readTime: '5 min',
    tags: ['Pour Over', 'Guide', 'Technique'],
  },
  {
    id: 2, title: 'Understanding Coffee Processing Methods',
    excerpt: 'From washed to natural to honey — how processing transforms the flavor in your cup.',
    content: 'The way coffee cherries are processed after harvest dramatically impacts flavor. Washed (wet) processing removes the fruit before drying, producing clean, bright cups with high acidity. Natural processing dries the whole cherry, creating fruity, wine-like flavors with heavy body. Honey processing leaves some mucilage on the bean, balancing brightness with sweetness. Each method reflects the traditions and resources of its region — Ethiopian naturals taste different from Brazilian naturals because of terroir and technique combined.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop',
    author: 'Dr. Amara Osei', date: '2026-01-15', category: 'Education', readTime: '7 min',
    tags: ['Processing', 'Education', 'Science'],
  },
  {
    id: 3, title: '5 Morning Rituals from Around the World',
    excerpt: 'How different cultures start their day with coffee — and what we can learn from each.',
    content: 'In Ethiopia, coffee ceremony is a three-round ritual that can last hours, emphasizing community. In Italy, espresso is consumed standing at the bar in quick, social bursts. In Turkey, coffee is brewed in a cezve with cardamom, creating a thick, aromatic drink. In Scandinavia, light roasts are preferred, highlighting the bean\'s natural sweetness. In Vietnam, strong drip coffee meets sweet condensed milk over ice. Each ritual reflects cultural values — from Italian efficiency to Ethiopian hospitality.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
    author: 'Yuki Tanaka', date: '2026-01-10', category: 'Culture', readTime: '6 min',
    tags: ['Culture', 'Rituals', 'World'],
  },
  {
    id: 4, title: 'Espresso Extraction: Dialing In the Perfect Shot',
    excerpt: 'Troubleshoot your espresso with these pro tips for consistent, delicious shots.',
    content: 'The perfect espresso shot requires balance between dose, yield, and time. Start with 18g of coffee yielding 36g of espresso in 25-30 seconds. If the shot runs too fast (sour), grind finer. If too slow (bitter), grind coarser. Water temperature should be 93°C. Fresh beans (7-21 days post-roast) degas more, requiring a slightly coarser grind. Always distribute grounds evenly and tamp with consistent pressure. Taste, adjust, repeat — dialing in is a daily ritual.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=400&fit=crop',
    author: 'Marco Rossi', date: '2026-01-05', category: 'Brewing', readTime: '8 min',
    tags: ['Espresso', 'Technique', 'Pro Tips'],
  },
  {
    id: 5, title: 'The Journey of a Coffee Bean',
    excerpt: 'From cherry to cup — follow the incredible 6,000-mile journey of specialty coffee.',
    content: 'A coffee bean\'s journey begins on a mountainside farm at 1,800 meters. After 3-4 years of growth, cherries are hand-picked at peak ripeness. They\'re processed within hours — washed, dried, or honey-processed depending on tradition. After resting as parchment, they\'re milled, graded, and exported. At our roastery, small batches are roasted to highlight each origin\'s character. Finally, they\'re packaged in valve-sealed bags and shipped to you within 48 hours of roasting.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
    author: 'Dr. Amara Osei', date: '2025-12-28', category: 'Education', readTime: '6 min',
    tags: ['Journey', 'Education', 'Story'],
  },
];

export const sampleOrders: Order[] = [
  {
    id: 'BB-84729', date: '2026-01-18',
    items: [{ name: 'Ethiopian Yirgacheffe', quantity: 1, price: 18.99, image: products[0].image }, { name: 'Colombian Supremo', quantity: 2, price: 16.49, image: products[1].image }],
    total: 51.97, status: 'delivered',
    trackingSteps: [
      { label: 'Order Placed', date: 'Jan 18, 10:23 AM', done: true, icon: '📦' },
      { label: 'Roasting', date: 'Jan 18, 2:00 PM', done: true, icon: '🔥' },
      { label: 'Shipped', date: 'Jan 19, 9:15 AM', done: true, icon: '🚚' },
      { label: 'Delivered', date: 'Jan 21, 3:42 PM', done: true, icon: '✅' },
    ],
  },
  {
    id: 'BB-91034', date: '2026-01-22',
    items: [{ name: 'Kenyan AA Nyeri', quantity: 1, price: 21.99, image: products[3].image }],
    total: 21.99, status: 'shipped',
    trackingSteps: [
      { label: 'Order Placed', date: 'Jan 22, 8:45 AM', done: true, icon: '📦' },
      { label: 'Roasting', date: 'Jan 22, 1:30 PM', done: true, icon: '🔥' },
      { label: 'Shipped', date: 'Jan 23, 10:00 AM', done: true, icon: '🚚' },
      { label: 'Delivered', date: 'Estimated Jan 26', done: false, icon: '✅' },
    ],
  },
  {
    id: 'BB-91205', date: '2026-01-24',
    items: [{ name: 'Midnight Espresso Blend', quantity: 1, price: 14.99, image: products[2].image }, { name: 'Sumatra Mandheling', quantity: 1, price: 17.49, image: products[5].image }],
    total: 32.48, status: 'roasting',
    trackingSteps: [
      { label: 'Order Placed', date: 'Jan 24, 11:30 AM', done: true, icon: '📦' },
      { label: 'Roasting', date: 'Today, 2:00 PM', done: true, icon: '🔥' },
      { label: 'Shipped', date: 'Estimated Jan 25', done: false, icon: '🚚' },
      { label: 'Delivered', date: 'Estimated Jan 28', done: false, icon: '✅' },
    ],
  },
];

export const defaultProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  memberSince: 'March 2025',
  tier: 'Gold',
  favoriteOrigins: ['Ethiopia', 'Colombia', 'Kenya'],
  favoriteRoasts: ['Light', 'Medium'],
  savedAddresses: [
    { label: 'Home', address: '742 Coffee Lane', city: 'Portland, OR 97201', isDefault: true },
    { label: 'Office', address: '15 Bean Street, Suite 4', city: 'Seattle, WA 98101', isDefault: false },
  ],
};

export const roastingTimeline = [
  { stage: 'Harvesting', icon: '🌱', duration: 'Oct – Dec', description: 'Ripe cherries are hand-picked at peak maturity, often requiring multiple passes through the same farm.' },
  { stage: 'Processing', icon: '💧', duration: '1–3 days', description: 'Cherries are washed, natural-dried, or honey-processed depending on regional tradition and desired flavor.' },
  { stage: 'Milling & Grading', icon: '⚙️', duration: '1–2 weeks', description: 'Parchment is removed, beans are sorted by size and density, and defective beans are eliminated.' },
  { stage: 'Export & Shipping', icon: '🚢', duration: '2–6 weeks', description: 'Green beans travel in climate-controlled containers from origin to our roastery.' },
  { stage: 'Cupping & Selection', icon: '☕', duration: '1 day', description: 'Our Q-graders cup each lot, scoring flavor, acidity, body, and balance on a 100-point scale.' },
  { stage: 'Roasting', icon: '🔥', duration: '12–15 minutes', description: 'Small batches are roasted to highlight each origin\'s unique character — development is key.' },
  { stage: 'Resting', icon: '⏳', duration: '24–48 hours', description: 'Freshly roasted coffee needs to degas CO2 for optimal flavor extraction.' },
  { stage: 'Packaging', icon: '📦', duration: 'Minutes', description: 'Sealed in valve bags that let CO2 escape while keeping oxygen out, preserving freshness.' },
  { stage: 'Your Cup', icon: '🏠', duration: 'Now', description: 'Brewed with care in your kitchen — the final step in a 6,000-mile journey.' },
];

export const faqData: FAQItem[] = [
  { question: 'What makes your coffee "specialty"?', answer: 'Specialty coffee is graded 80+ on a 100-point scale by certified Q-graders. We source only the top 3% of the world\'s coffee, working directly with farmers who prioritize quality over quantity.' },
  { question: 'How fresh is your coffee?', answer: 'We roast to order — every bag is roasted within 48 hours of shipping. You\'ll find the roast date printed on every package. We recommend consuming within 4 weeks for peak flavor.' },
  { question: 'How does the subscription work?', answer: 'Choose any coffee and select "Subscribe & Save" for 15% off every order. Your coffee ships automatically every 1, 2, or 4 weeks. You can pause, skip, or cancel anytime.' },
  { question: 'Do you offer free shipping?', answer: 'Yes! All orders over $35 ship free within the continental US. Orders under $35 have a flat shipping rate of $4.99.' },
  { question: 'How do loyalty points work?', answer: 'Earn 1 point for every $1 spent. Reach 100 points for a $5 reward, 250 points for $15, or 500 points for $35 off your next order.' },
];
