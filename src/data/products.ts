import { Product, FAQItem } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    origin: 'Ethiopia',
    category: 'Single Origin',
    price: 18.99,
    subscriptionPrice: 16.14,
    weight: '250g',
    roast: 'Light',
    description: 'A bright and complex coffee from the birthplace of coffee. Grown at high altitudes in the Yirgacheffe region, this lot features delicate floral aromatics and a tea-like body that showcases the terroir of Ethiopian heirloom varieties.',
    notes: ['Jasmine', 'Bergamot', 'Peach', 'Honey'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    rating: 4.9,
    brewMethod: 'Pour Over',
    altitude: '1,900–2,200m',
    process: 'Washed',
    reviews: [
      { id: 1, author: 'Sarah M.', rating: 5, date: '2026-01-15', text: 'Absolutely stunning coffee. The jasmine notes are incredible — best pour over I\'ve had at home.', verified: true },
      { id: 2, author: 'David K.', rating: 5, date: '2026-01-08', text: 'Light and floral, exactly what I was looking for. Tastes like a fine tea.', verified: true },
      { id: 3, author: 'Alex R.', rating: 4, date: '2025-12-20', text: 'Beautiful coffee but definitely for those who prefer lighter roasts. Delicate and complex.', verified: false },
    ],
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    origin: 'Colombia',
    category: 'Single Origin',
    price: 16.49,
    subscriptionPrice: 14.02,
    weight: '250g',
    roast: 'Medium',
    description: 'Sourced from small farms in the Huila region, this Supremo grade coffee offers a perfectly balanced cup. The volcanic soil and ideal climate produce beans with rich caramel sweetness and a smooth, clean finish.',
    notes: ['Caramel', 'Red Apple', 'Milk Chocolate', 'Walnut'],
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop',
    rating: 4.7,
    brewMethod: 'Drip / Pour Over',
    altitude: '1,500–1,800m',
    process: 'Washed',
    reviews: [
      { id: 4, author: 'Mike T.', rating: 5, date: '2026-01-12', text: 'My daily driver. Perfectly balanced, never disappoints. The caramel sweetness is addictive.', verified: true },
      { id: 5, author: 'Lisa P.', rating: 4, date: '2026-01-05', text: 'Great everyday coffee. Smooth and easy to drink. Good value for the quality.', verified: true },
    ],
  },
  {
    id: 3,
    name: 'Midnight Espresso Blend',
    origin: 'Brazil & Indonesia',
    category: 'Blend',
    price: 14.99,
    subscriptionPrice: 12.74,
    weight: '250g',
    roast: 'Dark',
    description: 'Our signature dark roast blend combines the chocolate richness of Brazilian Santos with the earthy depth of Sumatran Mandheling. Perfect for espresso, this blend delivers a bold, full-bodied cup with low acidity.',
    notes: ['Dark Chocolate', 'Tobacco', 'Molasses', 'Cedar'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop',
    rating: 4.6,
    brewMethod: 'Espresso',
    altitude: '800–1,200m',
    process: 'Natural / Wet-Hulled',
    reviews: [
      { id: 6, author: 'James W.', rating: 5, date: '2026-01-18', text: 'Makes incredible espresso at home. Thick crema, bold flavor. Better than my local cafe!', verified: true },
      { id: 7, author: 'Nina S.', rating: 4, date: '2026-01-10', text: 'Very bold and intense. Perfect for milk-based drinks. The chocolate notes shine through.', verified: true },
      { id: 8, author: 'Tom B.', rating: 5, date: '2025-12-28', text: 'Switched from a major brand and never looked back. This is real coffee.', verified: false },
    ],
  },
  {
    id: 4,
    name: 'Kenyan AA Nyeri',
    origin: 'Kenya',
    category: 'Single Origin',
    price: 21.99,
    subscriptionPrice: 18.69,
    weight: '250g',
    roast: 'Light-Medium',
    description: 'From the renowned Nyeri county, this AA grade coffee is hand-picked and fully washed. The result is an intensely vibrant cup with sparkling acidity, juicy fruit flavors, and a wine-like complexity that evolves as it cools.',
    notes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Brown Sugar'],
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop',
    rating: 4.8,
    brewMethod: 'Pour Over / AeroPress',
    altitude: '1,700–2,000m',
    process: 'Washed',
    reviews: [
      { id: 9, author: 'Emma C.', rating: 5, date: '2026-01-20', text: 'Wine-like complexity is no exaggeration. This coffee changes as it cools — incredible experience.', verified: true },
      { id: 10, author: 'Ryan H.', rating: 5, date: '2026-01-14', text: 'The blackcurrant note is unbelievable. Best Kenyan coffee I\'ve tried. Worth every penny.', verified: true },
    ],
  },
  {
    id: 5,
    name: 'Velvet Morning Blend',
    origin: 'Guatemala & Ethiopia',
    category: 'Blend',
    price: 15.99,
    subscriptionPrice: 13.59,
    weight: '250g',
    roast: 'Medium',
    description: 'A harmonious blend of Guatemalan Antigua and Ethiopian Sidamo beans. This medium roast creates a velvety smooth cup with layers of complexity — perfect for those who appreciate balance and depth in their morning ritual.',
    notes: ['Cocoa', 'Plum', 'Vanilla', 'Almond'],
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop',
    rating: 4.5,
    brewMethod: 'Drip / French Press',
    altitude: '1,400–1,800m',
    process: 'Washed / Natural',
    reviews: [
      { id: 11, author: 'Kate L.', rating: 5, date: '2026-01-16', text: 'The name says it all — velvet smooth. My morning ritual wouldn\'t be the same without it.', verified: true },
      { id: 12, author: 'Chris D.', rating: 4, date: '2026-01-09', text: 'Great blend. The cocoa and plum notes work beautifully together. Very versatile.', verified: true },
    ],
  },
  {
    id: 6,
    name: 'Sumatra Mandheling',
    origin: 'Indonesia',
    category: 'Single Origin',
    price: 17.49,
    subscriptionPrice: 14.87,
    weight: '250g',
    roast: 'Dark',
    description: 'Wet-hulled in the traditional Giling Basah method, this Sumatran coffee develops its characteristic earthy, full-bodied profile. Low acidity with a syrupy mouthfeel makes it ideal for those who prefer a bold, intense cup.',
    notes: ['Earth', 'Dark Cocoa', 'Spice', 'Herbs'],
    image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop',
    rating: 4.4,
    brewMethod: 'French Press / Espresso',
    altitude: '1,100–1,600m',
    process: 'Wet-Hulled (Giling Basah)',
    reviews: [
      { id: 13, author: 'Paul G.', rating: 5, date: '2026-01-17', text: 'Earthy and bold — exactly what a Sumatra should be. French press is the way to go.', verified: true },
      { id: 14, author: 'Maria V.', rating: 4, date: '2026-01-06', text: 'Unique flavor profile. Not for everyone, but if you like earthy coffees, this is top tier.', verified: false },
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

export const promoCodes: Record<string, number> = {
  'COFFEE10': 10,
  'BREW20': 20,
  'FIRST15': 15,
};

export const faqData: FAQItem[] = [
  {
    question: 'What makes your coffee "specialty"?',
    answer: 'Specialty coffee is graded 80+ on a 100-point scale by certified Q-graders. We source only the top 3% of the world\'s coffee, working directly with farmers who prioritize quality over quantity. Every batch is cupped and scored before we offer it to you.',
  },
  {
    question: 'How fresh is your coffee?',
    answer: 'We roast to order — every bag is roasted within 48 hours of shipping. You\'ll find the roast date printed on every package. We recommend consuming within 4 weeks of the roast date for peak flavor.',
  },
  {
    question: 'How does the subscription work?',
    answer: 'Choose any coffee and select "Subscribe & Save" for 15% off every order. Your coffee ships automatically every 1, 2, or 4 weeks. You can pause, skip, or cancel anytime — no commitments.',
  },
  {
    question: 'What grind size do I need?',
    answer: 'We ship whole beans by default for maximum freshness. Use our Brew Calculator (☕ icon in the header) to find the perfect grind size for your brewing method. We can also pre-grind upon request.',
  },
  {
    question: 'Do you offer free shipping?',
    answer: 'Yes! All orders over $35 ship free within the continental US. Orders under $35 have a flat shipping rate of $4.99. International shipping is available at checkout.',
  },
  {
    question: 'How do loyalty points work?',
    answer: 'Earn 1 point for every $1 spent. Reach 100 points for a $5 reward, 250 points for $15, or 500 points for $35 off your next order. Points never expire as long as you make at least one purchase per year.',
  },
];

export const FREE_SHIPPING_THRESHOLD = 35;
