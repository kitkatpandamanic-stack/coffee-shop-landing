import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, CartItem, OrderForm, Toast, Review, Order, BlogPost, ChatMessage } from './types';
import { products, categories, roastLevels, sortOptions, promoCodes, faqData, FREE_SHIPPING_THRESHOLD, blogPosts, sampleOrders, defaultProfile, roastingTimeline, quizQuestions, quizResults, achievements, bundles, chatResponses } from './data/products';
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2, Coffee, Star, ArrowLeft, Check, MapPin, Flame, Tag, Menu, Heart, Droplets, Timer, Sparkles,
  Percent, Calculator, Mountain, Leaf, ChevronDown, Moon, Sun, Eye, Repeat, Gift, Award, Send, Scale, User, Package, Map, BookOpen,
  Info, Clock, TrendingUp, Globe, Users, Zap, ChevronRight, BookMarked, Compass, Truck, Home as HomeIcon, ArrowRight,
} from 'lucide-react';

type View = 'shop' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'wishlist' | 'profile' | 'blog' | 'blog-post' | 'origin-map' | 'about' | 'roasting-timeline' | 'order-tracking' | 'quiz' | 'bundles';

function loadStorage<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

export default function App() {
  const [view, setView] = useState<View>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage('bb-cart3', []));
  const [wishlist, setWishlist] = useState<number[]>(() => loadStorage('bb-wishlist3', []));
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => loadStorage('bb-recent3', []));
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => loadStorage('bb-points3', 187));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showBrewCalc, setShowBrewCalc] = useState(false);
  const [showQuickView, setShowQuickView] = useState<Product | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(() => loadStorage('bb-dark3', false));
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [orderForm, setOrderForm] = useState<OrderForm>({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'orders' | 'addresses' | 'preferences' | 'achievements' | 'referral'>('orders');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ id: 1, sender: 'bot', text: 'Hi! 👋 I\'m your coffee assistant. How can I help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  useEffect(() => { localStorage.setItem('bb-cart3', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bb-wishlist3', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('bb-recent3', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('bb-points3', JSON.stringify(loyaltyPoints)); }, [loyaltyPoints]);
  useEffect(() => { localStorage.setItem('bb-dark3', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const ms = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.origin.toLowerCase().includes(searchQuery.toLowerCase()) || p.notes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
      const mc = selectedCategory === 'All' || p.category === selectedCategory;
      const mr = selectedRoast === 'All' || p.roast === selectedRoast;
      return ms && mc && mr;
    });
    switch (sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'name': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [searchQuery, selectedCategory, selectedRoast, sortBy]);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + (i.isSubscription && i.product.subscriptionPrice ? i.product.subscriptionPrice : i.product.price) * i.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const discountedTotal = useMemo(() => cartTotal * (1 - promoDiscount / 100), [cartTotal, promoDiscount]);
  const shippingProgress = Math.min(cartTotal / FREE_SHIPPING_THRESHOLD, 1);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);

  const addToCart = (product: Product, isSubscription = false) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.isSubscription === isSubscription);
      if (existing) return prev.map(i => i.product.id === product.id && i.isSubscription === isSubscription ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1, isSubscription }];
    });
    addToast(`${product.name} added to cart!`);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      if (prev.includes(id)) { addToast('Removed from wishlist', 'info'); return prev.filter(x => x !== id); }
      addToast('Added to wishlist!', 'info'); return [...prev, id];
    });
  };

  const toggleCompare = (id: number) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) { addToast('Max 3 products to compare', 'error'); return prev; }
      return [...prev, id];
    });
  };

  const trackView = (id: number) => {
    setRecentlyViewed(prev => { const f = prev.filter(x => x !== id); return [id, ...f].slice(0, 6); });
  };

  const updateQuantity = (idx: number, delta: number) => {
    setCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const removeFromCart = (idx: number) => { setCart(prev => prev.filter((_, i) => i !== idx)); addToast('Item removed', 'info'); };

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (promoCodes[code]) { setPromoDiscount(promoCodes[code]); setPromoError(''); addToast(`${promoCodes[code]}% discount applied!`); }
    else { setPromoError('Invalid code'); setPromoDiscount(0); }
  };

  const handleCheckout = () => {
    const earned = Math.floor(discountedTotal);
    setLoyaltyPoints(prev => prev + earned);
    setOrderPlaced(true); setCart([]); setPromoCode(''); setPromoDiscount(0); setView('confirmation');
    addToast(`You earned ${earned} loyalty points!`, 'loyalty');
  };

  const openProduct = (product: Product) => { setSelectedProduct(product); trackView(product.id); setView('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goBack = () => { setView('shop'); setSelectedProduct(null); };

  const relatedProducts = useMemo(() => selectedProduct ? products.filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.roast === selectedProduct.roast)).slice(0, 3) : [], [selectedProduct]);
  const wishlistProducts = useMemo(() => products.filter(p => wishlist.includes(p.id)), [wishlist]);
  const recentlyViewedProducts = useMemo(() => products.filter(p => recentlyViewed.includes(p.id)), [recentlyViewed]);
  const compareProducts = useMemo(() => products.filter(p => compareIds.includes(p.id)), [compareIds]);
  const personalizedProducts = useMemo(() => {
    // Based on recently viewed origins and roasts
    const viewedOrigins = recentlyViewedProducts.map(p => p.country);
    const viewedRoasts = recentlyViewedProducts.map(p => p.roast);
    return products.filter(p => !recentlyViewed.includes(p.id) && (viewedOrigins.includes(p.country) || viewedRoasts.includes(p.roast))).slice(0, 3);
  }, [recentlyViewedProducts, recentlyViewed]);

  const dm = darkMode;
  const countries = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach(p => { if (!map[p.country]) map[p.country] = []; map[p.country].push(p); });
    return map;
  }, []);

  const navItems = [
    { label: 'Shop', action: goBack, icon: HomeIcon },
    { label: 'Bundles', action: () => setView('bundles'), icon: Package },
    { label: 'Quiz', action: () => { setQuizStep(0); setQuizAnswers([]); setView('quiz'); }, icon: Sparkles },
    { label: 'Origins', action: () => setView('origin-map'), icon: Globe },
    { label: 'Blog', action: () => setView('blog'), icon: BookOpen },
    { label: 'About', action: () => setView('about'), icon: Info },
    { label: 'Profile', action: () => setView('profile'), icon: User },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${dm ? 'bg-[#1a1410] text-[#e8ddd0]' : 'bg-[#faf7f2] text-[#3d2c1e]'}`}>
      {/* Toasts */}
      <div className="fixed top-20 right-4 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium backdrop-blur-sm ${
                toast.type === 'success' ? 'bg-green-50/95 text-green-800 border border-green-200' :
                toast.type === 'error' ? 'bg-red-50/95 text-red-800 border border-red-200' :
                toast.type === 'loyalty' ? 'bg-amber-50/95 text-amber-800 border border-amber-200' :
                dm ? 'bg-[#2a2018]/95 text-[#e8ddd0] border border-[#3d2c1e]' : 'bg-[#f5efe7]/95 text-[#5a4030] border border-[#e8ddd0]'
              }`}>
              {toast.type === 'success' && <Check className="w-4 h-4 text-green-600" />}
              {toast.type === 'info' && <Heart className="w-4 h-4 text-[#c97b3a]" />}
              {toast.type === 'loyalty' && <Award className="w-4 h-4 text-amber-600" />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowQuickView(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className={`rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${dm ? 'bg-[#2a2018]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className="grid md:grid-cols-2">
                <img src={showQuickView.image} alt="" className="w-full aspect-square object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${dm ? 'bg-[#3d2c1e] text-[#e8ddd0]' : 'bg-[#f5efe7] text-[#5a4030]'}`}>{showQuickView.category}</span>
                    <button onClick={() => setShowQuickView(null)} className="p-1 cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{showQuickView.name}</h3>
                  <p className="text-xs opacity-60 mb-3">{showQuickView.origin} • {showQuickView.weight}</p>
                  <p className="text-sm opacity-80 mb-4 leading-relaxed">{showQuickView.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {showQuickView.notes.map(n => <span key={n} className={`px-2 py-0.5 rounded text-[10px] font-medium ${dm ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{n}</span>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${showQuickView.price.toFixed(2)}</span>
                    <button onClick={() => { addToCart(showQuickView); setShowQuickView(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white rounded-full text-sm font-medium cursor-pointer">
                      <ShoppingCart className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && compareProducts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCompare(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className={`rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${dm ? 'bg-[#2a2018]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Scale className="w-5 h-5 text-[#c97b3a]" /> Compare Coffees</h3>
                  <button onClick={() => setShowCompare(false)} className="p-1 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr><th className="text-left p-3 opacity-60"></th>
                        {compareProducts.map(p => <th key={p.id} className="p-3 text-center"><img src={p.image} alt="" className="w-16 h-16 rounded-lg object-cover mx-auto mb-2" /><p className="font-medium text-xs">{p.name}</p></th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[{ l: 'Price', f: (p: Product) => `$${p.price.toFixed(2)}` }, { l: 'Origin', f: (p: Product) => p.origin }, { l: 'Roast', f: (p: Product) => p.roast },
                        { l: 'Rating', f: (p: Product) => `⭐ ${p.rating}` }, { l: 'Process', f: (p: Product) => p.process }, { l: 'Altitude', f: (p: Product) => p.altitude },
                        { l: 'Best For', f: (p: Product) => p.brewMethod }, { l: 'Notes', f: (p: Product) => p.notes.join(', ') }].map(row => (
                        <tr key={row.l} className={`border-t ${dm ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
                          <td className="p-3 font-medium opacity-70">{row.l}</td>
                          {compareProducts.map(p => <td key={p.id} className="p-3 text-center text-xs">{row.f(p)}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brew Calculator */}
      <AnimatePresence>
        {showBrewCalc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowBrewCalc(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl ${dm ? 'bg-[#2a2018]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <BrewCalculator onClose={() => setShowBrewCalc(false)} dark={dm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-sm border-b shadow-sm transition-colors ${dm ? 'bg-[#1a1410]/95 border-[#3d2c1e]' : 'bg-[#faf7f2]/95 border-[#e8ddd0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button onClick={goBack} className="flex items-center gap-2 group cursor-pointer">
              <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-[#8b5e3c]" />
              <div><h1 className="text-lg sm:text-xl font-bold tracking-tight leading-none">Bean & Brew</h1><p className="text-[10px] sm:text-xs text-[#8b5e3c] tracking-widest uppercase">Specialty Coffee</p></div>
            </button>

            <nav className="hidden xl:flex items-center gap-3">
              {navItems.map(item => (
                <button key={item.label} onClick={item.action} className="flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition cursor-pointer">
                  <item.icon className="w-4 h-4" /><span>{item.label}</span>
                </button>
              ))}
              <button onClick={() => setView('wishlist')} className="relative flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition cursor-pointer">
                <Heart className="w-4 h-4" /><span>Wishlist</span>
                {wishlist.length > 0 && <span className="w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
              </button>
              {compareIds.length > 0 && <button onClick={() => setShowCompare(true)} className="flex items-center gap-1.5 text-sm font-medium text-[#c97b3a] cursor-pointer"><Scale className="w-4 h-4" /><span>Compare ({compareIds.length})</span></button>}
              <button onClick={() => setShowBrewCalc(true)} className="flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition cursor-pointer"><Calculator className="w-4 h-4" /><span>Brew Guide</span></button>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600"><Award className="w-4 h-4" /><span>{loyaltyPoints} pts</span></div>
              <button onClick={() => setDarkMode(!dm)} className="p-2 rounded-full hover:bg-black/10 transition cursor-pointer">{dm ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}</button>
              <button onClick={() => setView('cart')} className="relative flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white rounded-full hover:bg-[#6b4226] transition cursor-pointer">
                <ShoppingCart className="w-4 h-4" /><span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c97b3a] text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </button>
            </nav>

            <div className="flex items-center gap-1.5 xl:hidden">
              <button onClick={() => setDarkMode(!dm)} className="p-2 cursor-pointer">{dm ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}</button>
              <button onClick={() => setView('wishlist')} className="relative p-2 cursor-pointer"><Heart className="w-5 h-5" />{wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}</button>
              <button onClick={() => setView('cart')} className="relative p-2 cursor-pointer"><ShoppingCart className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}</button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 cursor-pointer"><Menu className="w-5 h-5" /></button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="xl:hidden pb-4 border-t border-[#e8ddd0]/30 pt-3">
              {navItems.map(item => (
                <button key={item.label} onClick={() => { item.action(); setMobileMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 cursor-pointer">
                  <item.icon className="w-4 h-4 text-[#8b5e3c]" />{item.label}
                </button>
              ))}
              <button onClick={() => { setView('wishlist'); setMobileMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 cursor-pointer"><Heart className="w-4 h-4 text-[#8b5e3c]" />Wishlist ({wishlist.length})</button>
              <button onClick={() => { setShowBrewCalc(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 cursor-pointer"><Calculator className="w-4 h-4 text-[#8b5e3c]" />Brew Guide</button>
              <div className="px-3 py-2 text-xs font-medium text-amber-600 flex items-center gap-1.5"><Award className="w-4 h-4" />{loyaltyPoints} loyalty points</div>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {view === 'shop' && <ShopView key="shop" dm={dm} filteredProducts={filteredProducts} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedRoast={selectedRoast} setSelectedRoast={setSelectedRoast} sortBy={sortBy} setSortBy={setSortBy} wishlist={wishlist} compareIds={compareIds} recentlyViewedProducts={recentlyViewedProducts} personalizedProducts={personalizedProducts} openProduct={openProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} toggleCompare={toggleCompare} setShowQuickView={setShowQuickView} />}

          {view === 'product' && selectedProduct && (
            <motion.div key="product" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProductDetail product={selectedProduct} isWishlisted={wishlist.includes(selectedProduct.id)} isComparing={compareIds.includes(selectedProduct.id)} onBack={goBack} onAdd={addToCart} onToggleWishlist={() => toggleWishlist(selectedProduct.id)} onToggleCompare={() => toggleCompare(selectedProduct.id)} dark={dm} />
              <ReviewsSection product={selectedProduct} dark={dm} onAddReview={(review: Review) => { selectedProduct.reviews = [review, ...selectedProduct.reviews]; setSelectedProduct({ ...selectedProduct }); addToast('Review submitted! +10 points', 'loyalty'); setLoyaltyPoints(prev => prev + 10); }} />
              {relatedProducts.length > 0 && <div className="mt-12"><h3 className="text-xl font-bold mb-6">You Might Also Like</h3><div className="grid grid-cols-1 sm:grid-cols-3 gap-6">{relatedProducts.map(p => <ProductCard key={p.id} product={p} isWishlisted={wishlist.includes(p.id)} isComparing={compareIds.includes(p.id)} onView={() => openProduct(p)} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} onQuickView={() => setShowQuickView(p)} onToggleCompare={() => toggleCompare(p.id)} dark={dm} />)}</div></div>}
            </motion.div>
          )}

          {view === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3"><Heart className="w-7 h-7 text-[#c97b3a]" /> Your Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16"><Heart className="w-16 h-16 opacity-20 mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3><p className="opacity-70 mb-6">Save your favorite coffees for later.</p><button onClick={goBack} className="px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium cursor-pointer">Browse Coffee</button></div>
              ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">{wishlistProducts.map(p => <ProductCard key={p.id} product={p} isWishlisted={true} isComparing={compareIds.includes(p.id)} onView={() => openProduct(p)} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} onQuickView={() => setShowQuickView(p)} onToggleCompare={() => toggleCompare(p.id)} dark={dm} />)}</div>}
            </motion.div>
          )}

          {view === 'cart' && <CartView key="cart" cart={cart} total={cartTotal} discountedTotal={discountedTotal} promoDiscount={promoDiscount} shippingProgress={shippingProgress} remaining={remaining} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={() => setView('checkout')} onContinueShopping={goBack} dark={dm} />}

          {view === 'checkout' && <CheckoutView key="checkout" cart={cart} total={discountedTotal} rawTotal={cartTotal} promoDiscount={promoDiscount} promoCode={promoCode} setPromoCode={setPromoCode} promoError={promoError} applyPromo={applyPromo} form={orderForm} setForm={setOrderForm} onSubmit={handleCheckout} onBack={() => setView('cart')} dark={dm} loyaltyPoints={loyaltyPoints} />}

          {view === 'confirmation' && orderPlaced && <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}><ConfirmationView onContinue={goBack} /></motion.div>}

          {/* PROFILE */}
          {view === 'profile' && <ProfileView key="profile" dark={dm} tab={profileTab} setTab={setProfileTab} orders={sampleOrders} onSelectOrder={(o: Order) => { setSelectedOrder(o); setView('order-tracking'); }} loyaltyPoints={loyaltyPoints} addToast={addToast} />}

          {/* ORDER TRACKING */}
          {view === 'order-tracking' && selectedOrder && <OrderTrackingView key="tracking" order={selectedOrder} dark={dm} onBack={() => setView('profile')} />}

          {/* BLOG */}
          {view === 'blog' && <BlogListView key="blog" dark={dm} onSelectPost={(p: BlogPost) => { setSelectedBlogPost(p); setView('blog-post'); }} />}

          {/* BLOG POST */}
          {view === 'blog-post' && selectedBlogPost && <BlogPostView key="blogpost" post={selectedBlogPost} dark={dm} onBack={() => setView('blog')} />}

          {/* ORIGIN MAP */}
          {view === 'origin-map' && <OriginMapView key="map" dark={dm} countries={countries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} openProduct={openProduct} />}

          {/* ABOUT */}
          {view === 'about' && <AboutView key="about" dark={dm} onExplore={() => setView('origin-map')} onReadBlog={() => setView('blog')} />}

          {/* ROASTING TIMELINE */}
          {view === 'roasting-timeline' && <RoastingTimelineView key="timeline" dark={dm} onBack={() => setView('about')} />}

          {/* QUIZ */}
          {view === 'quiz' && <QuizView key="quiz" dark={dm} step={quizStep} setStep={setQuizStep} answers={quizAnswers} setAnswers={setQuizAnswers} onBack={goBack} onAddToCart={addToCart} />}

          {/* BUNDLES */}
          {view === 'bundles' && <BundlesView key="bundles" dark={dm} onAddToCart={addToCart} onViewProduct={openProduct} />}
        </AnimatePresence>
      </main>

      {/* Chat Widget */}
      <ChatWidget show={showChat} setShow={setShowChat} messages={chatMessages} setMessages={setChatMessages} dark={dm} />

      <footer className={`border-t mt-16 py-8 transition-colors ${dm ? 'border-[#3d2c1e] bg-[#1a1410]' : 'border-[#e8ddd0] bg-[#f5efe7]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div><h4 className="font-bold mb-3 text-sm">Shop</h4><ul className="space-y-2 text-xs opacity-70"><li><button onClick={goBack} className="hover:opacity-100 cursor-pointer">All Coffee</button></li><li><button onClick={() => { setSelectedCategory('Single Origin'); goBack(); }} className="hover:opacity-100 cursor-pointer">Single Origin</button></li><li><button onClick={() => { setSelectedCategory('Blend'); goBack(); }} className="hover:opacity-100 cursor-pointer">Blends</button></li></ul></div>
            <div><h4 className="font-bold mb-3 text-sm">Discover</h4><ul className="space-y-2 text-xs opacity-70"><li><button onClick={() => setView('origin-map')} className="hover:opacity-100 cursor-pointer">Origins Map</button></li><li><button onClick={() => setView('blog')} className="hover:opacity-100 cursor-pointer">Blog</button></li><li><button onClick={() => setView('about')} className="hover:opacity-100 cursor-pointer">About Us</button></li></ul></div>
            <div><h4 className="font-bold mb-3 text-sm">Account</h4><ul className="space-y-2 text-xs opacity-70"><li><button onClick={() => setView('profile')} className="hover:opacity-100 cursor-pointer">My Profile</button></li><li><button onClick={() => setView('wishlist')} className="hover:opacity-100 cursor-pointer">Wishlist</button></li><li><button onClick={() => setView('cart')} className="hover:opacity-100 cursor-pointer">Cart</button></li></ul></div>
            <div><h4 className="font-bold mb-3 text-sm">Support</h4><ul className="space-y-2 text-xs opacity-70"><li>FAQ</li><li>Shipping Info</li><li>Contact Us</li></ul></div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2"><Coffee className="w-5 h-5 text-[#8b5e3c]" /><span className="font-bold">Bean & Brew</span></div>
            <p className="text-xs opacity-60">© 2026 Bean & Brew Specialty Coffee. Crafted with passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===== SHOP VIEW =====
function ShopView(props: any) {
  const { dm, filteredProducts, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedRoast, setSelectedRoast, sortBy, setSortBy, wishlist, compareIds, recentlyViewedProducts, personalizedProducts, openProduct, addToCart, toggleWishlist, toggleCompare, setShowQuickView } = props;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <section className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Exceptional Coffee,<br /><span className="text-[#8b5e3c]">Curated for You</span></h2>
        <p className="opacity-70 text-base sm:text-lg max-w-2xl mx-auto">Discover our hand-selected collection of specialty coffees from the world's finest growing regions.</p>
      </section>
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b5e3c]" />
          <input type="text" placeholder="Search by name, origin, or flavor..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${dm ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-[#8b5e3c]" /><span className="text-xs font-medium opacity-60 uppercase">Category:</span></div>
          {categories.map((cat: string) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${selectedCategory === cat ? 'bg-[#8b5e3c] text-white shadow-md' : dm ? 'bg-[#2a2018] border border-[#3d2c1e]' : 'bg-white border border-[#e8ddd0]'}`}>{cat}</button>)}
          <div className={`w-px h-5 hidden sm:block mx-1 ${dm ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`} />
          <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#8b5e3c]" /><span className="text-xs font-medium opacity-60 uppercase">Roast:</span></div>
          {roastLevels.map((r: string) => <button key={r} onClick={() => setSelectedRoast(r)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${selectedRoast === r ? 'bg-[#8b5e3c] text-white shadow-md' : dm ? 'bg-[#2a2018] border border-[#3d2c1e]' : 'bg-white border border-[#e8ddd0]'}`}>{r}</button>)}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs font-medium opacity-60 uppercase">Sort:</span>
          <div className="relative">
            <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)} className={`appearance-none px-4 py-1.5 pr-8 border rounded-full text-xs font-medium cursor-pointer ${dm ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
              {sortOptions.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b5e3c] pointer-events-none" />
          </div>
          <span className="text-xs opacity-50">{filteredProducts.length} coffees</span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16"><Coffee className="w-12 h-12 opacity-30 mx-auto mb-4" /><p className="opacity-70 text-lg">No coffees found.</p><button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRoast('All'); }} className="mt-4 text-[#8b5e3c] underline text-sm cursor-pointer">Clear filters</button></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product: any, i: number) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ProductCard product={product} isWishlisted={wishlist.includes(product.id)} isComparing={compareIds.includes(product.id)} onView={() => openProduct(product)} onAdd={() => addToCart(product)} onToggleWishlist={() => toggleWishlist(product.id)} onQuickView={() => setShowQuickView(product)} onToggleCompare={() => toggleCompare(product.id)} dark={dm} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Personalized Recommendations */}
      {personalizedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#c97b3a]" />
            <h3 className="text-xl font-bold">Recommended for You</h3>
            <span className="text-xs opacity-50 ml-2">Based on your browsing</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {personalizedProducts.map((p: Product) => <ProductCard key={p.id} product={p} isWishlisted={wishlist.includes(p.id)} isComparing={compareIds.includes(p.id)} onView={() => openProduct(p)} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} onQuickView={() => setShowQuickView(p)} onToggleCompare={() => toggleCompare(p.id)} dark={dm} />)}
          </div>
        </section>
      )}

      {recentlyViewedProducts.length > 1 && (
        <section className="mt-16">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Timer className="w-5 h-5 text-[#8b5e3c]" /> Recently Viewed</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewedProducts.slice(0, 4).map((p: Product) => (
              <button key={p.id} onClick={() => openProduct(p)} className={`flex items-center gap-3 p-3 rounded-xl border transition hover:shadow-md cursor-pointer text-left ${dm ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
                <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="min-w-0"><p className="text-xs font-medium truncate">{p.name}</p><p className="text-xs opacity-60">${p.price.toFixed(2)}</p></div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
        <FAQSection items={faqData} dark={dm} />
      </section>
    </motion.div>
  );
}

// ===== PRODUCT CARD =====
function ProductCard({ product, isWishlisted, isComparing, onView, onAdd, onToggleWishlist, onQuickView, onToggleCompare, dark }: any) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number } | null>(null);
  useEffect(() => {
    if (!product.isLimited || !product.limitedUntil) return;
    const update = () => {
      const diff = new Date(product.limitedUntil).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
      setTimeLeft({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000) });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [product]);

  return (
    <div className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
      <div className="relative overflow-hidden aspect-square">
        <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium ${dark ? 'bg-black/60 text-[#e8ddd0]' : 'bg-white/90 text-[#5a4030]'}`}>{product.category}</span>
          {product.isLimited && timeLeft && (
            <span className="px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-white flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m left
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={e => { e.stopPropagation(); onToggleWishlist(); }} className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-[#7a6352] hover:text-red-500'}`}><Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} /></button>
          <button onClick={e => { e.stopPropagation(); onQuickView(); }} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#7a6352] hover:text-[#8b5e3c] cursor-pointer"><Eye className="w-4 h-4" /></button>
          <button onClick={e => { e.stopPropagation(); onToggleCompare(); }} className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${isComparing ? 'bg-[#c97b3a] text-white' : 'bg-white/90 text-[#7a6352] hover:text-[#8b5e3c]'}`}><Scale className="w-4 h-4" /></button>
        </div>
        <div className="absolute bottom-3 left-3"><span className="px-3 py-1 bg-[#8b5e3c]/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">{product.roast} Roast</span></div>
        {product.subscriptionPrice && <div className="absolute bottom-3 right-3"><span className="px-2 py-1 bg-green-600/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-white flex items-center gap-1"><Repeat className="w-3 h-3" /> Save 15%</span></div>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2"><h3 className="font-bold text-lg leading-tight">{product.name}</h3><div className="flex items-center gap-1 text-[#c97b3a] shrink-0 ml-2"><Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-medium">{product.rating}</span></div></div>
        <div className="flex items-center gap-1 text-xs opacity-60 mb-3"><MapPin className="w-3 h-3" /><span>{product.origin}</span><span className="mx-1">•</span><span>{product.weight}</span></div>
        <div className="flex flex-wrap gap-1.5 mb-4">{product.notes.slice(0, 3).map((n: string) => <span key={n} className={`px-2 py-0.5 rounded text-[10px] font-medium ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{n}</span>)}</div>
        <div className="flex items-center justify-between">
          <div><span className="text-xl font-bold">${product.price.toFixed(2)}</span>{product.subscriptionPrice && <p className="text-[10px] text-green-600 font-medium">Subscribe: ${product.subscriptionPrice.toFixed(2)}</p>}</div>
          <div className="flex gap-2">
            <button onClick={onView} className={`px-3 py-2 text-xs font-medium border rounded-lg transition cursor-pointer ${dark ? 'border-[#3d2c1e] hover:bg-[#3d2c1e]' : 'border-[#e8ddd0] hover:bg-[#f5efe7]'}`}>Details</button>
            <button onClick={onAdd} className="px-3 py-2 text-xs font-medium text-white bg-[#8b5e3c] rounded-lg hover:bg-[#6b4226] cursor-pointer">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== PRODUCT DETAIL =====
function ProductDetail({ product, isWishlisted, isComparing, onBack, onAdd, onToggleWishlist, onToggleCompare, dark }: any) {
  const [isSubscription, setIsSubscription] = useState(false);
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to Shop</button>
      <div className={`rounded-2xl overflow-hidden border shadow-lg ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="grid md:grid-cols-2">
          <div className="aspect-square relative">
            <img src={product.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button onClick={onToggleWishlist} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-[#7a6352]'}`}><Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} /></button>
              <button onClick={onToggleCompare} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer ${isComparing ? 'bg-[#c97b3a] text-white' : 'bg-white/90 text-[#7a6352]'}`}><Scale className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{product.category}</span>
              <span className="px-3 py-1 bg-[#8b5e3c]/10 rounded-full text-xs font-medium text-[#8b5e3c]">{product.roast} Roast</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-[#c97b3a]"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-medium">{product.rating}</span></div>
              <div className="flex items-center gap-1 text-xs opacity-60"><MapPin className="w-3 h-3" />{product.origin}</div>
              <span className="text-xs opacity-60">{product.weight}</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-4">{product.description}</p>
            {product.story && (
              <div className={`rounded-lg p-3 mb-4 text-xs italic opacity-70 border-l-2 border-[#8b5e3c] ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
                <p className="flex items-start gap-2"><Compass className="w-3.5 h-3.5 text-[#8b5e3c] shrink-0 mt-0.5" />{product.story}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[{ icon: Mountain, label: 'Altitude', value: product.altitude }, { icon: Leaf, label: 'Process', value: product.process }, { icon: Droplets, label: 'Best For', value: product.brewMethod }, { icon: Flame, label: 'Roast', value: product.roast }].map(({ icon: Icon, label, value }) => (
                <div key={label} className={`flex items-center gap-2 p-2.5 rounded-lg ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}><Icon className="w-4 h-4 text-[#8b5e3c]" /><div><p className="text-[10px] opacity-50 uppercase">{label}</p><p className="text-xs font-medium">{value}</p></div></div>
              ))}
            </div>
            <div className="mb-5"><h4 className="text-xs font-semibold opacity-50 uppercase tracking-wide mb-2">Flavor Notes</h4><div className="flex flex-wrap gap-2">{product.notes.map((n: string) => <span key={n} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${dark ? 'bg-[#3d2c1e] border-[#3d2c1e]' : 'bg-[#f5efe7] border-[#e8ddd0]'}`}>{n}</span>)}</div></div>
            {product.subscriptionPrice && (
              <div className={`rounded-xl p-4 mb-5 border ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'bg-[#faf7f2] border-[#e8ddd0]'}`}>
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Repeat className="w-4 h-4 text-green-600" /><span className="text-sm font-medium">Subscribe & Save 15%</span></div>
                  <button onClick={() => setIsSubscription(!isSubscription)} className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${isSubscription ? 'bg-green-600' : dark ? 'bg-[#3d2c1e]' : 'bg-[#d4c4b0]'}`}><div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isSubscription ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
                </div>
                {isSubscription && <p className="text-xs text-green-600 mt-2">Delivered every 2 weeks • Cancel anytime</p>}
              </div>
            )}
            <div className="mt-auto pt-4 border-t border-[#e8ddd0]/30">
              <div className="flex items-center justify-between">
                <div><span className="text-3xl font-bold">${isSubscription && product.subscriptionPrice ? product.subscriptionPrice.toFixed(2) : product.price.toFixed(2)}</span>{isSubscription && <span className="text-sm opacity-50 line-through ml-2">${product.price.toFixed(2)}</span>}</div>
                <button onClick={() => onAdd(product, isSubscription)} className="flex items-center gap-2 px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg cursor-pointer"><ShoppingCart className="w-4 h-4" />{isSubscription ? 'Subscribe' : 'Add to Cart'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== REVIEWS =====
function ReviewsSection({ product, dark, onAddReview }: any) {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, text: '' });
  const handleSubmit = () => { if (!newReview.author.trim() || !newReview.text.trim()) return; onAddReview({ id: Date.now(), author: newReview.author, rating: newReview.rating, date: new Date().toISOString().split('T')[0], text: newReview.text, verified: false }); setNewReview({ author: '', rating: 5, text: '' }); setShowForm(false); };
  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><Star className="w-5 h-5 text-[#c97b3a]" /> Reviews ({product.reviews.length})</h3><button onClick={() => setShowForm(!showForm)} className="text-sm font-medium text-[#8b5e3c] cursor-pointer">{showForm ? 'Cancel' : 'Write a Review'}</button></div>
      <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`rounded-xl border p-5 mb-6 overflow-hidden ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="space-y-3">
          <input type="text" value={newReview.author} onChange={e => setNewReview({ ...newReview, author: e.target.value })} placeholder="Your name" className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} />
          <div className="flex items-center gap-2"><span className="text-xs opacity-60">Rating:</span>{[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })} className="cursor-pointer"><Star className={`w-5 h-5 ${s <= newReview.rating ? 'text-[#c97b3a] fill-current' : 'opacity-30'}`} /></button>)}</div>
          <textarea value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} placeholder="Share your experience..." rows={3} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 resize-none ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} />
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#8b5e3c] text-white rounded-lg text-sm font-medium cursor-pointer">Submit Review (+10 pts)</button>
        </div>
      </motion.div>}</AnimatePresence>
      <div className="space-y-4">{product.reviews.map((review: Review) => (
        <div key={review.id} className={`rounded-xl border p-4 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[#8b5e3c]/20 flex items-center justify-center text-xs font-bold text-[#8b5e3c]">{review.author[0]}</div><div><p className="text-sm font-medium flex items-center gap-1.5">{review.author}{review.verified && <span className="text-[10px] text-green-600 flex items-center gap-0.5"><Check className="w-3 h-3" /> Verified</span>}</p><p className="text-[10px] opacity-50">{review.date}</p></div></div>
            <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#c97b3a] fill-current' : 'opacity-20'}`} />)}</div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">{review.text}</p>
        </div>
      ))}</div>
    </section>
  );
}

// ===== CART =====
function CartView({ cart, total, discountedTotal, promoDiscount, shippingProgress, remaining, onUpdateQuantity, onRemove, onCheckout, onContinueShopping, dark }: any) {
  if (cart.length === 0) return <div className="text-center py-16 max-w-md mx-auto"><ShoppingCart className="w-16 h-16 opacity-20 mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Your cart is empty</h2><p className="opacity-70 mb-6">Explore our specialty coffee collection.</p><button onClick={onContinueShopping} className="px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium cursor-pointer">Browse Coffee</button></div>;
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h2>
      {remaining > 0 && <div className={`rounded-xl p-4 mb-6 border ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}><div className="flex items-center justify-between mb-2"><span className="text-xs font-medium flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-[#8b5e3c]" /> Add ${remaining.toFixed(2)} more for free shipping!</span><span className="text-xs opacity-50">{Math.round(shippingProgress * 100)}%</span></div><div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`}><motion.div initial={{ width: 0 }} animate={{ width: `${shippingProgress * 100}%` }} className="h-full bg-gradient-to-r from-[#8b5e3c] to-[#c97b3a] rounded-full" /></div></div>}
      {remaining <= 0 && <div className="rounded-xl p-3 mb-6 bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-2"><Check className="w-4 h-4" /> You've unlocked free shipping!</div>}
      <div className="space-y-4 mb-8">{cart.map((item: CartItem, idx: number) => (
        <motion.div key={`${item.product.id}-${item.isSubscription}`} layout className={`flex items-center gap-4 p-4 rounded-xl border ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <img src={item.product.image} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0" />
          <div className="flex-1 min-w-0"><h3 className="font-semibold text-sm sm:text-base truncate">{item.product.name}</h3><p className="text-xs opacity-60">{item.product.origin} • {item.product.weight}</p>{item.isSubscription && <span className="text-[10px] text-green-600 font-medium flex items-center gap-1"><Repeat className="w-3 h-3" /> Subscription</span>}<p className="text-sm font-bold text-[#8b5e3c] mt-1">${(item.isSubscription && item.product.subscriptionPrice ? item.product.subscriptionPrice : item.product.price).toFixed(2)}</p></div>
          <div className="flex items-center gap-2"><button onClick={() => onUpdateQuantity(idx, -1)} className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><Minus className="w-3 h-3" /></button><span className="w-8 text-center font-medium text-sm">{item.quantity}</span><button onClick={() => onUpdateQuantity(idx, 1)} className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><Plus className="w-3 h-3" /></button></div>
          <div className="text-right shrink-0"><p className="font-bold text-sm sm:text-base">${((item.isSubscription && item.product.subscriptionPrice ? item.product.subscriptionPrice : item.product.price) * item.quantity).toFixed(2)}</p><button onClick={() => onRemove(idx)} className="text-[#c97b3a] hover:text-red-500 mt-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button></div>
        </motion.div>
      ))}</div>
      <div className={`rounded-xl border p-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm opacity-70"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          {promoDiscount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount ({promoDiscount}%)</span><span>-${(total - discountedTotal).toFixed(2)}</span></div>}
          <div className="flex justify-between text-sm opacity-70"><span>Shipping</span><span className="text-green-600 font-medium">{remaining <= 0 ? 'Free' : '$4.99'}</span></div>
          <div className={`border-t pt-3 flex justify-between ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><span className="font-bold">Total</span><span className="font-bold text-xl">${(discountedTotal + (remaining > 0 ? 4.99 : 0)).toFixed(2)}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3"><button onClick={onContinueShopping} className={`flex-1 px-6 py-3 border rounded-full font-medium cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>Continue Shopping</button><button onClick={onCheckout} className="flex-1 px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg cursor-pointer">Proceed to Checkout</button></div>
      </div>
    </div>
  );
}

// ===== CHECKOUT =====
function CheckoutView({ cart, total, rawTotal, promoDiscount, promoCode, setPromoCode, promoError, applyPromo, form, setForm, onSubmit, onBack, dark, loyaltyPoints }: any) {
  const [errors, setErrors] = useState<any>({});
  const validate = () => { const e: any = {}; if (!form.name.trim()) e.name = 'Required'; if (!form.email.includes('@')) e.email = 'Valid email required'; if (!form.phone.trim()) e.phone = 'Required'; if (!form.address.trim()) e.address = 'Required'; if (!form.city.trim()) e.city = 'Required'; if (!form.zip.trim()) e.zip = 'Required'; setErrors(e); return Object.keys(e).length === 0; };
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to Cart</button>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h2>
      {loyaltyPoints >= 100 && <div className={`rounded-xl p-4 mb-6 border flex items-center gap-3 ${dark ? 'bg-amber-900/20 border-amber-800/30' : 'bg-amber-50 border-amber-200'}`}><Award className="w-5 h-5 text-amber-600" /><div><p className="text-sm font-medium text-amber-700">You have {loyaltyPoints} loyalty points!</p><p className="text-xs opacity-70">Earn more with this order.</p></div></div>}
      <div className="grid md:grid-cols-5 gap-6">
        <form onSubmit={e => { e.preventDefault(); if (validate()) onSubmit(); }} className="md:col-span-3 space-y-4">
          <div className={`rounded-xl border p-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <h3 className="font-semibold mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium opacity-60 mb-1">Full Name</label><input type="text" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }} className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.name ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="John Doe" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium opacity-60 mb-1">Email</label><input type="email" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: undefined }); }} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.email ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="john@example.com" />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
                <div><label className="block text-xs font-medium opacity-60 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: undefined }); }} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.phone ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="+1 (555) 123-4567" />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
              </div>
              <div><label className="block text-xs font-medium opacity-60 mb-1">Address</label><input type="text" value={form.address} onChange={e => { setForm({ ...form, address: e.target.value }); if (errors.address) setErrors({ ...errors, address: undefined }); }} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.address ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="123 Coffee Street" />{errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium opacity-60 mb-1">City</label><input type="text" value={form.city} onChange={e => { setForm({ ...form, city: e.target.value }); if (errors.city) setErrors({ ...errors, city: undefined }); }} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.city ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="Portland" />{errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}</div>
                <div><label className="block text-xs font-medium opacity-60 mb-1">ZIP Code</label><input type="text" value={form.zip} onChange={e => { setForm({ ...form, zip: e.target.value }); if (errors.zip) setErrors({ ...errors, zip: undefined }); }} className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.zip ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="97201" />{errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}</div>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full px-6 py-3.5 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg cursor-pointer">Place Order — ${total.toFixed(2)}</button>
        </form>
        <div className="md:col-span-2">
          <div className={`rounded-xl border p-5 sticky top-24 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <h3 className="font-semibold mb-4 text-sm">Order Summary</h3>
            <div className="space-y-3 mb-4">{cart.map((item: CartItem) => <div key={`${item.product.id}-${item.isSubscription}`} className="flex items-center gap-3"><img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" /><div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{item.product.name}</p><p className="text-[10px] opacity-50">×{item.quantity}{item.isSubscription ? ' • Sub' : ''}</p></div><p className="text-xs font-medium">${((item.isSubscription && item.product.subscriptionPrice ? item.product.subscriptionPrice : item.product.price) * item.quantity).toFixed(2)}</p></div>)}</div>
            <div className={`border-t pt-4 mb-4 ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
              <div className="flex gap-2"><div className="relative flex-1"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b5e3c]" /><input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Promo code" className={`w-full pl-9 pr-3 py-2 border rounded-lg text-xs ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} /></div><button type="button" onClick={applyPromo} className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>Apply</button></div>
              {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
              {promoDiscount > 0 && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> {promoDiscount}% off!</p>}
            </div>
            <div className={`border-t pt-3 space-y-2 ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
              <div className="flex justify-between text-xs opacity-70"><span>Subtotal</span><span>${rawTotal.toFixed(2)}</span></div>
              {promoDiscount > 0 && <div className="flex justify-between text-xs text-green-600"><span>Discount</span><span>-${(rawTotal - total).toFixed(2)}</span></div>}
              <div className="flex justify-between text-xs opacity-70"><span>Shipping</span><span className="text-green-600">Free</span></div>
              <div className={`flex justify-between font-bold pt-2 border-t ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
              <p className="text-[10px] text-amber-600 text-center pt-1">+{Math.floor(total)} loyalty points earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CONFIRMATION =====
function ConfirmationView({ onContinue }: any) {
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-600" /></motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3">Order Confirmed!</h2>
      <p className="opacity-70 mb-2">Your specialty coffee is being prepared with care.</p>
      <p className="text-sm opacity-70 mb-8">Freshly roasted and shipped within 24 hours.</p>
      <div className={`rounded-xl border p-5 mb-8 text-left`}><div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-full bg-[#f5efe7] flex items-center justify-center"><Coffee className="w-4 h-4 text-[#8b5e3c]" /></div><div><p className="font-medium">Order #BB-{Math.floor(Math.random() * 90000 + 10000)}</p><p className="text-xs opacity-60">Estimated delivery: 3-5 business days</p></div></div></div>
      <button onClick={onContinue} className="px-8 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg cursor-pointer">Continue Shopping</button>
    </div>
  );
}

// ===== PROFILE VIEW =====
function ProfileView({ dark, tab, setTab, orders, onSelectOrder, loyaltyPoints, addToast }: any) {
  const tierColors = { Bronze: 'text-amber-700', Silver: 'text-gray-500', Gold: 'text-yellow-600', Platinum: 'text-purple-600' };
  const tierProgress = Math.min((loyaltyPoints % 250) / 250 * 100, 100);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className={`rounded-2xl border p-6 mb-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5e3c] to-[#c97b3a] flex items-center justify-center text-white text-2xl font-bold">{defaultProfile.name[0]}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{defaultProfile.name}</h2>
            <p className="text-sm opacity-60">{defaultProfile.email} • Member since {defaultProfile.memberSince}</p>
            <div className="flex items-center gap-2 mt-2">
              <Award className={`w-4 h-4 ${tierColors[defaultProfile.tier as keyof typeof tierColors]}`} />
              <span className={`text-sm font-medium ${tierColors[defaultProfile.tier as keyof typeof tierColors]}`}>{defaultProfile.tier} Member</span>
              <span className="text-xs opacity-50">• {loyaltyPoints} points</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600">{loyaltyPoints}</p>
            <p className="text-xs opacity-60">points</p>
          </div>
        </div>
        {/* Tier Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-60 mb-1"><span>Progress to next tier</span><span>{loyaltyPoints}/500 pts</span></div>
          <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`}><motion.div initial={{ width: 0 }} animate={{ width: `${tierProgress}%` }} className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" /></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[{ id: 'orders', label: 'Orders', icon: Package }, { id: 'addresses', label: 'Addresses', icon: MapPin }, { id: 'preferences', label: 'Preferences', icon: Heart }, { id: 'achievements', label: 'Achievements', icon: Award }, { id: 'referral', label: 'Refer & Earn', icon: Users }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition ${tab === t.id ? 'bg-[#8b5e3c] text-white' : dark ? 'bg-[#2a2018] border border-[#3d2c1e]' : 'bg-white border border-[#e8ddd0]'}`}><t.icon className="w-4 h-4" />{t.label}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className={`rounded-xl border p-4 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
              <div className="flex items-center justify-between mb-3">
                <div><p className="font-semibold text-sm">Order #{order.id}</p><p className="text-xs opacity-60">{order.date}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : order.status === 'roasting' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                  <button onClick={() => onSelectOrder(order)} className="flex items-center gap-1 text-xs text-[#8b5e3c] font-medium cursor-pointer">Track <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {order.items.slice(0, 3).map((item, i) => <img key={i} src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />)}
                <div className="flex-1" />
                <p className="font-bold text-sm">${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'addresses' && (
        <div className="space-y-3">
          {defaultProfile.savedAddresses.map((addr, i) => (
            <div key={i} className={`rounded-xl border p-4 flex items-center gap-4 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${addr.isDefault ? 'bg-[#8b5e3c] text-white' : dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}><HomeIcon className="w-5 h-5" /></div>
              <div className="flex-1"><p className="font-medium text-sm flex items-center gap-2">{addr.label}{addr.isDefault && <span className="text-[10px] bg-[#8b5e3c] text-white px-2 py-0.5 rounded-full">Default</span>}</p><p className="text-xs opacity-60">{addr.address}, {addr.city}</p></div>
            </div>
          ))}
          <button className={`w-full rounded-xl border p-4 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer ${dark ? 'border-[#3d2c1e] hover:bg-[#3d2c1e]' : 'border-[#e8ddd0] hover:bg-[#f5efe7]'}`}><Plus className="w-4 h-4" /> Add New Address</button>
        </div>
      )}

      {tab === 'preferences' && (
        <div className={`rounded-xl border p-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <h3 className="font-semibold mb-4">Your Coffee Preferences</h3>
          <div className="space-y-4">
            <div><p className="text-xs font-medium opacity-60 uppercase mb-2">Favorite Origins</p><div className="flex flex-wrap gap-2">{defaultProfile.favoriteOrigins.map(o => <span key={o} className={`px-3 py-1.5 rounded-full text-xs font-medium ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{o}</span>)}</div></div>
            <div><p className="text-xs font-medium opacity-60 uppercase mb-2">Preferred Roasts</p><div className="flex flex-wrap gap-2">{defaultProfile.favoriteRoasts.map(r => <span key={r} className={`px-3 py-1.5 rounded-full text-xs font-medium ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{r}</span>)}</div></div>
            <div className={`rounded-lg p-4 ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
              <p className="text-xs opacity-60 mb-2">We use your preferences to recommend coffees you'll love.</p>
              <p className="text-xs text-[#8b5e3c] font-medium">✦ 3 new coffees match your taste profile</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'achievements' && (
        <div className="space-y-4">
          <div className={`rounded-xl border p-4 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <p className="text-sm opacity-70 mb-2">Unlocked <span className="font-bold text-[#8b5e3c]">{achievements.filter(a => a.unlocked).length}</span> of {achievements.length} achievements</p>
            <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`}><div className="h-full bg-gradient-to-r from-[#8b5e3c] to-[#c97b3a] rounded-full" style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map(ach => (
              <div key={ach.id} className={`rounded-xl border p-4 ${ach.unlocked ? '' : 'opacity-60'} ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${ach.unlocked ? 'bg-[#8b5e3c]/10' : dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{ach.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm flex items-center gap-2">{ach.title}{ach.unlocked && <Check className="w-3.5 h-3.5 text-green-600" />}</p>
                    <p className="text-xs opacity-60 mb-2">{ach.description}</p>
                    <div className={`h-1.5 rounded-full overflow-hidden ${dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`}><div className={`h-full rounded-full ${ach.unlocked ? 'bg-green-500' : 'bg-[#c97b3a]'}`} style={{ width: `${(ach.progress / ach.total) * 100}%` }} /></div>
                    <p className="text-[10px] opacity-50 mt-1">{ach.progress}/{ach.total}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'referral' && (
        <div className="space-y-4">
          <div className={`rounded-xl border p-6 text-center ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5e3c] to-[#c97b3a] flex items-center justify-center text-white text-2xl mx-auto mb-4">🎁</div>
            <h3 className="text-xl font-bold mb-2">Refer a Friend, Get $5</h3>
            <p className="text-sm opacity-70 mb-6 max-w-md mx-auto">Share your unique code with friends. When they make their first order, you both get $5 off!</p>
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-dashed ${dark ? 'border-[#3d2c1e] bg-[#1a1410]' : 'border-[#e8ddd0] bg-[#faf7f2]'}`}>
              <span className="font-mono font-bold text-lg text-[#8b5e3c]">ALEX2026</span>
              <button onClick={() => { navigator.clipboard?.writeText('ALEX2026'); addToast('Code copied!', 'success'); }} className="px-3 py-1 bg-[#8b5e3c] text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-[#6b4226]">Copy</button>
            </div>
          </div>
          <div className={`rounded-xl border p-5 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <h4 className="font-semibold mb-3">Your Referral Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold text-[#8b5e3c]">1</p><p className="text-xs opacity-60">Friends Referred</p></div>
              <div><p className="text-2xl font-bold text-green-600">$5</p><p className="text-xs opacity-60">Earned</p></div>
              <div><p className="text-2xl font-bold text-[#c97b3a]">2</p><p className="text-xs opacity-60">More for $10</p></div>
            </div>
          </div>
          <div className={`rounded-xl border p-5 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <h4 className="font-semibold mb-3">How It Works</h4>
            <div className="space-y-3">
              {[{ step: '1', text: 'Share your code with friends' }, { step: '2', text: 'They use it on their first order' }, { step: '3', text: 'You both get $5 off your next order' }].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#8b5e3c] text-white text-xs font-bold flex items-center justify-center">{s.step}</div>
                  <p className="text-sm">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ===== ORDER TRACKING =====
function OrderTrackingView({ order, dark, onBack }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to Profile</button>
      <div className={`rounded-2xl border p-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold">Order #{order.id}</h2><p className="text-sm opacity-60">Placed on {order.date}</p></div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Items</h3>
          <div className="space-y-2">{order.items.map((item: any, i: number) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
              <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1"><p className="text-sm font-medium">{item.name}</p><p className="text-xs opacity-60">Qty: {item.quantity}</p></div>
              <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}</div>
        </div>

        {/* Tracking Timeline */}
        <div>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-[#8b5e3c]" /> Tracking</h3>
          <div className="relative">
            {order.trackingSteps.map((step: any, i: number) => (
              <div key={i} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${step.done ? 'bg-[#8b5e3c] text-white' : dark ? 'bg-[#3d2c1e] opacity-50' : 'bg-[#e8ddd0] opacity-50'}`}>{step.icon}</div>
                  {i < order.trackingSteps.length - 1 && <div className={`w-0.5 h-full min-h-[24px] mt-1 ${step.done ? 'bg-[#8b5e3c]' : dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`} />}
                </div>
                <div className="flex-1 pt-2"><p className={`text-sm font-medium ${step.done ? '' : 'opacity-50'}`}>{step.label}</p><p className="text-xs opacity-60">{step.date}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className={`border-t pt-4 mt-4 flex justify-between items-center ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
          <span className="font-bold">Total</span><span className="font-bold text-xl">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ===== BLOG LIST =====
function BlogListView({ dark, onSelectPost }: any) {
  const [filter, setFilter] = useState('All');
  const blogCategories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];
  const filtered = filter === 'All' ? blogPosts : blogPosts.filter(p => p.category === filter);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">The Coffee Journal</h2>
        <p className="opacity-70 max-w-xl mx-auto">Stories, guides, and insights from the world of specialty coffee.</p>
      </div>
      <div className="flex justify-center gap-2 mb-8">{blogCategories.map(cat => <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${filter === cat ? 'bg-[#8b5e3c] text-white' : dark ? 'bg-[#2a2018] border border-[#3d2c1e]' : 'bg-white border border-[#e8ddd0]'}`}>{cat}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((post, i) => (
          <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => onSelectPost(post)} className={`rounded-2xl border overflow-hidden cursor-pointer group transition-all hover:shadow-xl hover:-translate-y-1 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <div className="aspect-video overflow-hidden"><img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-medium text-[#8b5e3c] uppercase tracking-wide">{post.category}</span><span className="text-[10px] opacity-40">•</span><span className="text-[10px] opacity-60">{post.readTime} read</span></div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#8b5e3c] transition-colors">{post.title}</h3>
              <p className="text-sm opacity-70 leading-relaxed mb-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-50">{post.author} • {post.date}</p>
                <span className="text-xs text-[#8b5e3c] font-medium flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

// ===== BLOG POST =====
function BlogPostView({ post, dark, onBack }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to Blog</button>
      <article className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <img src={post.image} alt="" className="w-full aspect-video object-cover" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#8b5e3c]/10 rounded-full text-xs font-medium text-[#8b5e3c]">{post.category}</span>
            <span className="text-xs opacity-60 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{post.title}</h1>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#e8ddd0]/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5e3c] to-[#c97b3a] flex items-center justify-center text-white font-bold text-sm">{post.author[0]}</div>
            <div><p className="text-sm font-medium">{post.author}</p><p className="text-xs opacity-60">{post.date}</p></div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed opacity-85 mb-6">{post.excerpt}</p>
            <p className="text-sm leading-relaxed opacity-80">{post.content}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#e8ddd0]/30">
            {post.tags.map((tag: string) => <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>#{tag}</span>)}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

// ===== ORIGIN MAP =====
function OriginMapView({ dark, countries, selectedCountry, setSelectedCountry, openProduct }: any) {
  const countryData = Object.entries(countries);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 flex items-center justify-center gap-3"><Globe className="w-8 h-8 text-[#8b5e3c]" /> Coffee Origins</h2>
        <p className="opacity-70 max-w-xl mx-auto">Explore the world's finest coffee-growing regions. Click on a country to discover its unique coffees.</p>
      </div>

      {/* Interactive Map */}
      <div className={`rounded-2xl border p-6 mb-8 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="relative aspect-[2/1] bg-gradient-to-b from-[#e8f4f8] to-[#d4e8d0] rounded-xl overflow-hidden" style={{ background: dark ? '#1a2820' : undefined }}>
          {/* Simplified world map with clickable regions */}
          <svg viewBox="0 0 100 50" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Continents simplified */}
            <path d="M15,15 Q20,12 28,14 Q32,16 30,22 Q28,28 22,30 Q18,28 15,22 Z" fill={dark ? '#2a4030' : '#c8dcc0'} opacity="0.6" /> {/* N America */}
            <path d="M25,30 Q30,28 33,32 Q35,40 30,45 Q27,42 25,36 Z" fill={dark ? '#2a4030' : '#c8dcc0'} opacity="0.6" /> {/* S America */}
            <path d="M42,12 Q50,10 58,12 Q62,15 60,20 Q55,22 48,20 Q44,18 42,15 Z" fill={dark ? '#2a4030' : '#c8dcc0'} opacity="0.6" /> {/* Europe */}
            <path d="M45,22 Q55,20 62,24 Q65,30 60,38 Q52,40 48,35 Q44,28 45,22 Z" fill={dark ? '#2a4030' : '#c8dcc0'} opacity="0.6" /> {/* Africa */}
            <path d="M62,15 Q75,12 85,18 Q88,25 82,30 Q75,28 68,24 Q64,20 62,15 Z" fill={dark ? '#2a4030' : '#c8dcc0'} opacity="0.6" /> {/* Asia */}
            <path d="M72,35 Q80,33 85,38 Q83,42 78,43 Q74,40 72,35 Z" fill={dark ? '#2a4030' : '#c8dcc0'} opacity="0.6" /> {/* Oceania */}
          </svg>

          {/* Country markers */}
          {products.map(p => p.mapPosition && (
            <button key={p.id} onClick={() => setSelectedCountry(p.country)}
              className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-125 ${
                selectedCountry === p.country ? 'bg-[#8b5e3c] scale-125 ring-4 ring-[#8b5e3c]/30' : 'bg-[#c97b3a] hover:bg-[#8b5e3c]'
              }`}
              style={{ left: `${p.mapPosition.x}%`, top: `${p.mapPosition.y}%` }}
              title={p.country}>
              <Coffee className="w-3 h-3 text-white" />
            </button>
          ))}
        </div>

        {/* Country selector pills */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {countryData.map(([country]) => (
            <button key={country} onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${selectedCountry === country ? 'bg-[#8b5e3c] text-white' : dark ? 'bg-[#3d2c1e] hover:bg-[#4a3828]' : 'bg-[#f5efe7] hover:bg-[#e8ddd0]'}`}>
              {country} ({countries[country]?.length})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Country Coffees */}
      <AnimatePresence>
        {selectedCountry && countries[selectedCountry] && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#8b5e3c]" /> Coffees from {selectedCountry}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries[selectedCountry]?.map((p: Product) => (
                <div key={p.id} className={`rounded-xl border p-5 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
                  <img src={p.image} alt="" className="w-full aspect-square rounded-lg object-cover mb-4" />
                  <h4 className="font-bold mb-1">{p.name}</h4>
                  <p className="text-xs opacity-60 mb-2">{p.origin}</p>
                  {p.story && <p className="text-xs opacity-70 italic mb-3 line-clamp-2">{p.story}</p>}
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${p.price.toFixed(2)}</span>
                    <button onClick={() => openProduct(p)} className="px-3 py-1.5 bg-[#8b5e3c] text-white rounded-full text-xs font-medium cursor-pointer">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== ABOUT VIEW =====
function AboutView({ dark, onExplore, onReadBlog }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Hero */}
      <section className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Story</h2>
        <p className="opacity-70 max-w-2xl mx-auto text-lg">From a small roastery in Portland to coffee lovers worldwide — driven by passion, guided by quality.</p>
      </section>

      {/* Mission */}
      <section className={`rounded-2xl border p-8 sm:p-12 mb-8 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="opacity-80 leading-relaxed mb-4">We believe that exceptional coffee has the power to connect people, cultures, and communities. Every bean we source tells a story — of the farmer who cultivated it, the land that nurtured it, and the tradition that shaped it.</p>
            <p className="opacity-80 leading-relaxed">Our commitment goes beyond the cup. We work directly with farming communities, ensuring fair compensation and sustainable practices that protect both people and planet.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ icon: Globe, label: '6 Origins', sub: 'Countries sourced' }, { icon: Users, label: '47+', sub: 'Farm partners' }, { icon: Award, label: '80+', sub: 'Cup score minimum' }, { icon: Zap, label: '48hrs', sub: 'Roast to ship' }].map(({ icon: Icon, label, sub }) => (
              <div key={label} className={`text-center p-4 rounded-xl ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
                <Icon className="w-6 h-6 text-[#8b5e3c] mx-auto mb-2" />
                <p className="font-bold text-lg">{label}</p>
                <p className="text-xs opacity-60">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-center mb-8">What We Stand For</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Leaf, title: 'Sustainability', desc: 'Direct trade relationships, organic practices, and carbon-neutral shipping.' },
            { icon: Award, title: 'Quality First', desc: 'Every lot is cupped and scored by certified Q-graders before we offer it.' },
            { icon: Heart, title: 'Community', desc: '5% of profits support education and infrastructure in coffee-growing regions.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`rounded-xl border p-6 text-center ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
              <div className="w-12 h-12 rounded-full bg-[#8b5e3c]/10 flex items-center justify-center mx-auto mb-4"><Icon className="w-6 h-6 text-[#8b5e3c]" /></div>
              <h4 className="font-bold mb-2">{title}</h4>
              <p className="text-sm opacity-70">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={`rounded-2xl border p-8 mb-8 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <h3 className="text-2xl font-bold text-center mb-8">Meet the Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: 'Marco Rossi', role: 'Head Roaster', initial: 'M', color: 'from-[#8b5e3c] to-[#6b4226]' },
            { name: 'Dr. Amara Osei', role: 'Quality Director', initial: 'A', color: 'from-[#c97b3a] to-[#8b5e3c]' },
            { name: 'Yuki Tanaka', role: 'Sourcing Lead', initial: 'Y', color: 'from-[#6b4226] to-[#3d2c1e]' },
          ].map(member => (
            <div key={member.name} className="text-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3`}>{member.initial}</div>
              <p className="font-bold">{member.name}</p>
              <p className="text-xs opacity-60">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey CTA */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={onExplore} className={`rounded-xl border p-6 text-left hover:shadow-lg transition cursor-pointer group ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <Globe className="w-8 h-8 text-[#8b5e3c] mb-3" />
          <h4 className="font-bold mb-1 group-hover:text-[#8b5e3c] transition-colors">Explore Origins</h4>
          <p className="text-sm opacity-70">Discover where our beans come from on the interactive map.</p>
        </button>
        <button onClick={onReadBlog} className={`rounded-xl border p-6 text-left hover:shadow-lg transition cursor-pointer group ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <BookOpen className="w-8 h-8 text-[#8b5e3c] mb-3" />
          <h4 className="font-bold mb-1 group-hover:text-[#8b5e3c] transition-colors">Read the Journal</h4>
          <p className="text-sm opacity-70">Stories, guides, and insights from the world of coffee.</p>
        </button>
      </section>
    </motion.div>
  );
}

// ===== ROASTING TIMELINE =====
function RoastingTimelineView({ dark, onBack }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to About</button>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">The Journey of a Bean</h2>
        <p className="opacity-70 max-w-xl mx-auto">From cherry to cup — follow the incredible 6,000-mile journey of specialty coffee.</p>
      </div>
      <div className="relative">
        {roastingTimeline.map((step, i) => (
          <motion.div key={step.stage} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 sm:gap-6 mb-8 last:mb-0">
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl ${dark ? 'bg-[#2a2018] border border-[#3d2c1e]' : 'bg-white border border-[#e8ddd0]'} shadow-md`}>{step.icon}</div>
              {i < roastingTimeline.length - 1 && <div className={`w-0.5 flex-1 min-h-[32px] mt-2 ${dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`} />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{step.stage}</h3>
                <span className="text-xs opacity-50 bg-[#f5efe7] px-2 py-0.5 rounded-full">{step.duration}</span>
              </div>
              <p className="text-sm opacity-75 leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ===== BREW CALCULATOR =====
function BrewCalculator({ onClose, dark }: any) {
  const [method, setMethod] = useState('pourover');
  const [cups, setCups] = useState(2);
  const methods: Record<string, any> = {
    pourover: { ratio: 16, time: '3:00–4:00', temp: '93–96°C', grind: 'Medium-Fine', icon: '🫗' },
    frenchpress: { ratio: 15, time: '4:00', temp: '96°C', grind: 'Coarse', icon: '🍵' },
    espresso: { ratio: 2, time: '0:25–0:30', temp: '93°C', grind: 'Fine', icon: '☕' },
    aeropress: { ratio: 14, time: '1:30–2:00', temp: '85–90°C', grind: 'Medium-Fine', icon: '🧪' },
    coldbrew: { ratio: 8, time: '12–24 hrs', temp: 'Room temp', grind: 'Extra Coarse', icon: '🧊' },
  };
  const c = methods[method]; const coffeeG = Math.round((cups * 250) / c.ratio); const waterMl = cups * 250;
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#c97b3a]" /> Brew Calculator</h3><button onClick={onClose} className="p-1 cursor-pointer"><X className="w-5 h-5" /></button></div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">{Object.entries(methods).map(([key, val]: any) => <button key={key} onClick={() => setMethod(key)} className={`p-3 rounded-xl text-center transition cursor-pointer ${method === key ? 'bg-[#8b5e3c] text-white shadow-md' : dark ? 'bg-[#1a1410] hover:bg-[#3d2c1e]' : 'bg-[#f5efe7] hover:bg-[#e8ddd0]'}`}><span className="text-xl block mb-1">{val.icon}</span><span className="text-[10px] font-medium capitalize">{key === 'pourover' ? 'Pour Over' : key === 'frenchpress' ? 'French Press' : key === 'coldbrew' ? 'Cold Brew' : key}</span></button>)}</div>
      <div className="mb-6"><label className="block text-xs font-medium opacity-60 mb-2 uppercase tracking-wide">Cups</label><div className="flex items-center gap-3"><button onClick={() => setCups(Math.max(1, cups - 1))} className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><Minus className="w-4 h-4" /></button><span className="text-2xl font-bold w-10 text-center">{cups}</span><button onClick={() => setCups(Math.min(10, cups + 1))} className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><Plus className="w-4 h-4" /></button></div></div>
      <div className={`rounded-xl p-5 space-y-4 ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
        <div className="grid grid-cols-2 gap-4"><div className={`text-center p-3 rounded-lg ${dark ? 'bg-[#2a2018]' : 'bg-white'}`}><Coffee className="w-5 h-5 text-[#8b5e3c] mx-auto mb-1" /><p className="text-2xl font-bold">{coffeeG}g</p><p className="text-[10px] opacity-50 uppercase">Coffee</p></div><div className={`text-center p-3 rounded-lg ${dark ? 'bg-[#2a2018]' : 'bg-white'}`}><Droplets className="w-5 h-5 text-[#8b5e3c] mx-auto mb-1" /><p className="text-2xl font-bold">{waterMl}ml</p><p className="text-[10px] opacity-50 uppercase">Water</p></div></div>
        <div className="grid grid-cols-3 gap-3"><div className="text-center"><Timer className="w-4 h-4 text-[#8b5e3c] mx-auto mb-1" /><p className="text-xs font-medium">{c.time}</p><p className="text-[10px] opacity-50">Time</p></div><div className="text-center"><Flame className="w-4 h-4 text-[#8b5e3c] mx-auto mb-1" /><p className="text-xs font-medium">{c.temp}</p><p className="text-[10px] opacity-50">Temp</p></div><div className="text-center"><Sparkles className="w-4 h-4 text-[#8b5e3c] mx-auto mb-1" /><p className="text-xs font-medium">{c.grind}</p><p className="text-[10px] opacity-50">Grind</p></div></div>
        <p className="text-xs opacity-50 text-center pt-2 border-t border-[#e8ddd0]/30">Ratio: 1:{c.ratio}</p>
      </div>
    </div>
  );
}

// ===== QUIZ VIEW =====
function QuizView({ dark, step, setStep, answers, setAnswers, onBack, onAddToCart }: any) {
  const currentQ = quizQuestions[step];
  const isComplete = step >= quizQuestions.length;
  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < quizQuestions.length - 1) setStep(step + 1);
  };
  const getResult = () => {
    const key = `${answers[0]}-${answers[1]}-${answers[2]}`;
    return quizResults[key] || quizResults['default'];
  };
  const result = isComplete ? getResult() : null;
  const resultProduct = result ? products.find(p => p.id === result.productId) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to Shop</button>
      <div className={`rounded-2xl border p-6 sm:p-10 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        {!isComplete ? (
          <>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-1 mb-4">
                {quizQuestions.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-[#8b5e3c] w-8' : dark ? 'bg-[#3d2c1e] w-4' : 'bg-[#e8ddd0] w-4'}`} />)}
              </div>
              <p className="text-xs opacity-60 mb-2">Question {step + 1} of {quizQuestions.length}</p>
              <h2 className="text-2xl sm:text-3xl font-bold">{currentQ.question}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt: any) => (
                <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(opt.value)}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${dark ? 'bg-[#1a1410] border-[#3d2c1e] hover:border-[#8b5e3c]' : 'bg-[#faf7f2] border-[#e8ddd0] hover:border-[#8b5e3c] hover:shadow-md'}`}>
                  <span className="text-2xl mb-2 block">{opt.emoji}</span>
                  <span className="font-medium">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </>
        ) : result && resultProduct ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="text-6xl mb-4">{result.emoji}</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Your Perfect Match!</h2>
            <p className="text-lg text-[#8b5e3c] font-medium mb-4">{result.title}</p>
            <p className="opacity-70 mb-6 max-w-md mx-auto">{result.description}</p>
            <div className={`rounded-xl border p-4 mb-6 text-left ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'bg-[#faf7f2] border-[#e8ddd0]'}`}>
              <div className="flex items-center gap-4">
                <img src={resultProduct.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{resultProduct.name}</p>
                  <p className="text-xs opacity-60">{resultProduct.origin}</p>
                  <div className="flex flex-wrap gap-1 mt-2">{resultProduct.notes.slice(0, 3).map((n: string) => <span key={n} className="px-2 py-0.5 bg-[#8b5e3c]/10 rounded text-[10px] font-medium text-[#8b5e3c]">{n}</span>)}</div>
                </div>
                <p className="text-xl font-bold">${resultProduct.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => { onAddToCart(resultProduct); onBack(); }} className="px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] cursor-pointer">Add to Cart & Shop</button>
              <button onClick={() => { setStep(0); setAnswers([]); }} className={`px-6 py-3 border rounded-full font-medium cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>Retake Quiz</button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

// ===== BUNDLES VIEW =====
function BundlesView({ dark, onAddToCart, onViewProduct }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">Coffee Bundles</h2>
        <p className="opacity-70 max-w-xl mx-auto">Curated sets to explore our collection at a special price. Save more, discover more.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundles.map((bundle) => {
          const bundleProducts = bundle.products.map(id => products.find(p => p.id === id)!);
          const savings = bundle.originalPrice - bundle.price;
          return (
            <motion.div key={bundle.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border overflow-hidden group hover:shadow-xl transition-all ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
              <div className="relative aspect-video overflow-hidden">
                <img src={bundle.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {bundle.badge && <span className="absolute top-3 left-3 px-3 py-1 bg-[#8b5e3c] text-white text-xs font-medium rounded-full">{bundle.badge}</span>}
                <span className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">Save ${savings.toFixed(2)}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">{bundle.name}</h3>
                <p className="text-sm opacity-70 mb-4">{bundle.description}</p>
                <div className="space-y-2 mb-4">
                  {bundleProducts.map(p => (
                    <button key={p.id} onClick={() => onViewProduct(p)} className="flex items-center gap-2 w-full text-left hover:opacity-80 cursor-pointer">
                      <img src={p.image} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className="text-xs font-medium flex-1">{p.name}</span>
                      <span className="text-xs opacity-50">${p.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#e8ddd0]/30">
                  <div><span className="text-xl font-bold">${bundle.price.toFixed(2)}</span><span className="text-sm opacity-50 line-through ml-2">${bundle.originalPrice.toFixed(2)}</span></div>
                  <button onClick={() => { bundleProducts.forEach(p => onAddToCart(p)); }} className="px-4 py-2 bg-[#8b5e3c] text-white rounded-full text-sm font-medium hover:bg-[#6b4226] cursor-pointer">Add All</button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ===== CHAT WIDGET =====
function ChatWidget({ show, setShow, messages, setMessages, dark }: any) {
  const [input, setInput] = useState('');
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, userMsg]);
    setInput('');
    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = chatResponses['default'];
      if (lower.includes('ship')) response = chatResponses['shipping'];
      else if (lower.includes('subscri')) response = chatResponses['subscription'];
      else if (lower.includes('grind') || lower.includes('brew')) response = chatResponses['grind'];
      else if (lower.includes('return') || lower.includes('refund')) response = chatResponses['return'];
      else if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('which')) response = chatResponses['recommend'];
      else if (lower.includes('fresh')) response = chatResponses['freshness'];
      else if (lower.includes('hello') || lower.includes('hi')) response = chatResponses['hello'];
      else if (lower.includes('help')) response = chatResponses['help'];
      const botMsg: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: response, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prev: ChatMessage[]) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      <button onClick={() => setShow(!show)} className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer ${show ? 'bg-red-500 hover:bg-red-600' : 'bg-[#8b5e3c] hover:bg-[#6b4226]'}`}>
        {show ? <X className="w-6 h-6 text-white" /> : <span className="text-2xl">💬</span>}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-40 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <div className="bg-[#8b5e3c] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">☕</div>
              <div><p className="font-medium">Coffee Assistant</p><p className="text-xs opacity-80 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" /> Online</p></div>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((msg: ChatMessage) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-[#8b5e3c] text-white rounded-br-sm' : dark ? 'bg-[#3d2c1e] rounded-bl-sm' : 'bg-[#f5efe7] rounded-bl-sm'}`}>
                    <p>{msg.text}</p>
                    <p className="text-[10px] opacity-60 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 border-t ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
              <div className="flex gap-2 mb-2 overflow-x-auto">
                {['Shipping', 'Subscription', 'Recommend'].map(q => (
                  <button key={q} onClick={() => { setInput(q); }} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer ${dark ? 'bg-[#3d2c1e] hover:bg-[#4a3828]' : 'bg-[#f5efe7] hover:bg-[#e8ddd0]'}`}>{q}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} />
                <button onClick={handleSend} className="w-9 h-9 bg-[#8b5e3c] text-white rounded-full flex items-center justify-center hover:bg-[#6b4226] cursor-pointer"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== FAQ =====
function FAQSection({ items, dark }: any) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-3">{items.map((item: any, idx: number) => (
      <div key={idx} className={`rounded-xl border overflow-hidden ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left cursor-pointer"><span className="text-sm font-medium pr-4">{item.question}</span><motion.div animate={{ rotate: openIdx === idx ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-[#8b5e3c] shrink-0" /></motion.div></button>
        <AnimatePresence>{openIdx === idx && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-4 pb-4 text-sm opacity-70 leading-relaxed">{item.answer}</p></motion.div>}</AnimatePresence>
      </div>
    ))}</div>
  );
}
