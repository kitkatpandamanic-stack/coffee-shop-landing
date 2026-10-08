import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, CartItem, OrderForm, Toast, Review } from './types';
import { products, categories, roastLevels, sortOptions, promoCodes, faqData, FREE_SHIPPING_THRESHOLD } from './data/products';
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2, Coffee, Star, ArrowLeft,
  Check, MapPin, Flame, Tag, Menu, Heart, Droplets, Timer, Sparkles,
  Percent, Calculator, Mountain, Leaf, ChevronDown, Moon, Sun, Eye,
  Repeat, Gift, Award, ChevronUp, ArrowRight, Send, Scale,
} from 'lucide-react';

type View = 'shop' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'wishlist';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';

function loadStorage<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

export default function App() {
  const [view, setView] = useState<View>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage('bb-cart2', []));
  const [wishlist, setWishlist] = useState<number[]>(() => loadStorage('bb-wishlist2', []));
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => loadStorage('bb-recent2', []));
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => loadStorage('bb-points2', 0));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showBrewCalc, setShowBrewCalc] = useState(false);
  const [showQuickView, setShowQuickView] = useState<Product | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(() => loadStorage('bb-dark', false));
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [orderForm, setOrderForm] = useState<OrderForm>({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  // Persist
  useEffect(() => { localStorage.setItem('bb-cart2', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bb-wishlist2', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('bb-recent2', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('bb-points2', JSON.stringify(loyaltyPoints)); }, [loyaltyPoints]);
  useEffect(() => { localStorage.setItem('bb-dark', JSON.stringify(darkMode)); }, [darkMode]);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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

  const cartTotal = useMemo(() => cart.reduce((s, i) => {
    const price = i.isSubscription && i.product.subscriptionPrice ? i.product.subscriptionPrice : i.product.price;
    return s + price * i.quantity;
  }, 0), [cart]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const discountedTotal = useMemo(() => cartTotal * (1 - promoDiscount / 100), [cartTotal, promoDiscount]);
  const shippingProgress = Math.min(cartTotal / FREE_SHIPPING_THRESHOLD, 1);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);

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
      addToast('Added to wishlist!', 'info');
      return [...prev, id];
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
    setRecentlyViewed(prev => {
      const filtered = prev.filter(x => x !== id);
      return [id, ...filtered].slice(0, 6);
    });
  };

  const updateQuantity = (idx: number, delta: number) => {
    setCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const removeFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
    addToast('Item removed', 'info');
  };

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (promoCodes[code]) { setPromoDiscount(promoCodes[code]); setPromoError(''); addToast(`${promoCodes[code]}% discount applied!`); }
    else { setPromoError('Invalid code'); setPromoDiscount(0); }
  };

  const handleCheckout = () => {
    const earned = Math.floor(discountedTotal);
    setLoyaltyPoints(prev => prev + earned);
    setOrderPlaced(true);
    setCart([]);
    setPromoCode('');
    setPromoDiscount(0);
    setView('confirmation');
    addToast(`You earned ${earned} loyalty points!`, 'loyalty');
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    trackView(product.id);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => { setView('shop'); setSelectedProduct(null); };

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.roast === selectedProduct.roast)).slice(0, 3);
  }, [selectedProduct]);

  const wishlistProducts = useMemo(() => products.filter(p => wishlist.includes(p.id)), [wishlist]);
  const recentlyViewedProducts = useMemo(() => products.filter(p => recentlyViewed.includes(p.id)), [recentlyViewed]);
  const compareProducts = useMemo(() => products.filter(p => compareIds.includes(p.id)), [compareIds]);

  const dm = darkMode;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${dm ? 'bg-[#1a1410] text-[#e8ddd0]' : 'bg-[#faf7f2] text-[#3d2c1e]'}`}>
      {/* Toasts */}
      <div className="fixed top-20 right-4 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 100, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.9 }}
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
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${dm ? 'bg-[#2a2018]' : 'bg-white'}`}
              onClick={e => e.stopPropagation()}>
              <div className="grid md:grid-cols-2">
                <img src={showQuickView.image} alt={showQuickView.name} className="w-full aspect-square object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${dm ? 'bg-[#3d2c1e] text-[#e8ddd0]' : 'bg-[#f5efe7] text-[#5a4030]'}`}>{showQuickView.category}</span>
                    <button onClick={() => setShowQuickView(null)} className="p-1 rounded-lg hover:bg-black/10 cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{showQuickView.name}</h3>
                  <div className="flex items-center gap-2 mb-3 text-xs opacity-70">
                    <MapPin className="w-3 h-3" />{showQuickView.origin} • {showQuickView.weight}
                  </div>
                  <p className="text-sm opacity-80 mb-4 leading-relaxed">{showQuickView.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {showQuickView.notes.map(n => <span key={n} className={`px-2 py-0.5 rounded text-[10px] font-medium ${dm ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{n}</span>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${showQuickView.price.toFixed(2)}</span>
                    <button onClick={() => { addToCart(showQuickView); setShowQuickView(null); }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white rounded-full text-sm font-medium hover:bg-[#6b4226] cursor-pointer">
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
              className={`rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${dm ? 'bg-[#2a2018]' : 'bg-white'}`}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Scale className="w-5 h-5 text-[#c97b3a]" /> Compare Coffees</h3>
                  <button onClick={() => setShowCompare(false)} className="p-1 rounded-lg hover:bg-black/10 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-3 opacity-60"></th>
                        {compareProducts.map(p => (
                          <th key={p.id} className="p-3 text-center">
                            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover mx-auto mb-2" />
                            <p className="font-medium text-xs">{p.name}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Price', fn: (p: Product) => `$${p.price.toFixed(2)}` },
                        { label: 'Origin', fn: (p: Product) => p.origin },
                        { label: 'Roast', fn: (p: Product) => p.roast },
                        { label: 'Category', fn: (p: Product) => p.category },
                        { label: 'Rating', fn: (p: Product) => `⭐ ${p.rating}` },
                        { label: 'Process', fn: (p: Product) => p.process },
                        { label: 'Altitude', fn: (p: Product) => p.altitude },
                        { label: 'Best For', fn: (p: Product) => p.brewMethod },
                        { label: 'Notes', fn: (p: Product) => p.notes.join(', ') },
                      ].map(row => (
                        <tr key={row.label} className={`border-t ${dm ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
                          <td className="p-3 font-medium opacity-70">{row.label}</td>
                          {compareProducts.map(p => <td key={p.id} className="p-3 text-center text-xs">{row.fn(p)}</td>)}
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

      {/* Brew Calculator Modal */}
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
      <header className={`sticky top-0 z-50 backdrop-blur-sm border-b shadow-sm transition-colors duration-300 ${dm ? 'bg-[#1a1410]/95 border-[#3d2c1e]' : 'bg-[#faf7f2]/95 border-[#e8ddd0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button onClick={goBack} className="flex items-center gap-2 group cursor-pointer">
              <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-[#8b5e3c]" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight leading-none">Bean & Brew</h1>
                <p className="text-[10px] sm:text-xs text-[#8b5e3c] tracking-widest uppercase">Specialty Coffee</p>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-3">
              <button onClick={goBack} className="text-sm font-medium opacity-80 hover:opacity-100 transition cursor-pointer">Shop</button>
              <button onClick={() => setView('wishlist')} className="relative flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition cursor-pointer">
                <Heart className="w-4 h-4" /><span>Wishlist</span>
                {wishlist.length > 0 && <span className="w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
              </button>
              {compareIds.length > 0 && (
                <button onClick={() => setShowCompare(true)} className="flex items-center gap-1.5 text-sm font-medium text-[#c97b3a] cursor-pointer">
                  <Scale className="w-4 h-4" /><span>Compare ({compareIds.length})</span>
                </button>
              )}
              <button onClick={() => setShowBrewCalc(true)} className="flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition cursor-pointer">
                <Calculator className="w-4 h-4" /><span>Brew Guide</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <Award className="w-4 h-4" /><span>{loyaltyPoints} pts</span>
              </div>
              <button onClick={() => setDarkMode(!dm)} className="p-2 rounded-full hover:bg-black/10 transition cursor-pointer">
                {dm ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setView('cart')} className="relative flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white rounded-full hover:bg-[#6b4226] transition cursor-pointer">
                <ShoppingCart className="w-4 h-4" /><span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c97b3a] text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </button>
            </nav>

            <div className="flex items-center gap-1.5 lg:hidden">
              <button onClick={() => setDarkMode(!dm)} className="p-2 cursor-pointer">{dm ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}</button>
              {compareIds.length > 0 && (
                <button onClick={() => setShowCompare(true)} className="relative p-2 cursor-pointer">
                  <Scale className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center">{compareIds.length}</span>
                </button>
              )}
              <button onClick={() => setView('wishlist')} className="relative p-2 cursor-pointer">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
              </button>
              <button onClick={() => setView('cart')} className="relative p-2 cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 cursor-pointer"><Menu className="w-5 h-5" /></button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="lg:hidden pb-4 border-t border-[#e8ddd0]/30 pt-3">
              <button onClick={() => { goBack(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 cursor-pointer">Shop</button>
              <button onClick={() => { setView('wishlist'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 cursor-pointer">Wishlist ({wishlist.length})</button>
              <button onClick={() => { setShowBrewCalc(true); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 cursor-pointer">Brew Guide</button>
              <div className="px-3 py-2 text-xs font-medium text-amber-600 flex items-center gap-1.5"><Award className="w-4 h-4" />{loyaltyPoints} loyalty points</div>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {view === 'shop' && (
            <motion.div key="shop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Hero */}
              <section className="text-center mb-10 sm:mb-14">
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                  Exceptional Coffee,<br /><span className="text-[#8b5e3c]">Curated for You</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="opacity-70 text-base sm:text-lg max-w-2xl mx-auto">
                  Discover our hand-selected collection of specialty coffees from the world's finest growing regions.
                </motion.p>
              </section>

              {/* Search & Filters */}
              <div className="mb-8 space-y-4">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b5e3c]" />
                  <input type="text" placeholder="Search by name, origin, or flavor..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 focus:border-[#c97b3a] transition-all ${dm ? 'bg-[#2a2018] border-[#3d2c1e] placeholder:text-[#7a6352]' : 'bg-white border-[#e8ddd0] placeholder:text-[#b8a898]'}`} />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-[#8b5e3c]" /><span className="text-xs font-medium opacity-60 uppercase tracking-wide">Category:</span></div>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selectedCategory === cat ? 'bg-[#8b5e3c] text-white shadow-md' : dm ? 'bg-[#2a2018] border border-[#3d2c1e] hover:border-[#c97b3a]' : 'bg-white border border-[#e8ddd0] hover:border-[#c97b3a]'}`}>{cat}</button>
                  ))}
                  <div className={`w-px h-5 hidden sm:block mx-1 ${dm ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`} />
                  <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#8b5e3c]" /><span className="text-xs font-medium opacity-60 uppercase tracking-wide">Roast:</span></div>
                  {roastLevels.map(r => (
                    <button key={r} onClick={() => setSelectedRoast(r)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selectedRoast === r ? 'bg-[#8b5e3c] text-white shadow-md' : dm ? 'bg-[#2a2018] border border-[#3d2c1e] hover:border-[#c97b3a]' : 'bg-white border border-[#e8ddd0] hover:border-[#c97b3a]'}`}>{r}</button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs font-medium opacity-60 uppercase tracking-wide">Sort:</span>
                  <div className="relative">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                      className={`appearance-none px-4 py-1.5 pr-8 border rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 cursor-pointer ${dm ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
                      {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b5e3c] pointer-events-none" />
                  </div>
                  <span className="text-xs opacity-50">{filteredProducts.length} coffees</span>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Coffee className="w-12 h-12 opacity-30 mx-auto mb-4" />
                  <p className="opacity-70 text-lg">No coffees found.</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRoast('All'); }} className="mt-4 text-[#8b5e3c] underline text-sm cursor-pointer">Clear filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((product, i) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <ProductCard product={product} isWishlisted={wishlist.includes(product.id)} isComparing={compareIds.includes(product.id)}
                        onView={() => openProduct(product)} onAdd={() => addToCart(product)} onToggleWishlist={() => toggleWishlist(product.id)}
                        onQuickView={() => setShowQuickView(product)} onToggleCompare={() => toggleCompare(product.id)} dark={dm} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Recently Viewed */}
              {recentlyViewedProducts.length > 1 && view === 'shop' && (
                <section className="mt-16">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Timer className="w-5 h-5 text-[#8b5e3c]" /> Recently Viewed</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recentlyViewedProducts.slice(0, 4).map(p => (
                      <button key={p.id} onClick={() => openProduct(p)} className={`flex items-center gap-3 p-3 rounded-xl border transition hover:shadow-md cursor-pointer text-left ${dm ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <p className="text-xs opacity-60">${p.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ Section */}
              <section className="mt-16 max-w-3xl mx-auto">
                <h3 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
                <FAQSection items={faqData} dark={dm} />
              </section>

              {/* Newsletter */}
              <section className="mt-16 text-center">
                <div className={`rounded-2xl p-8 sm:p-10 ${dm ? 'bg-[#2a2018]' : 'bg-[#f5efe7]'}`}>
                  <Send className="w-8 h-8 text-[#8b5e3c] mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Join Our Coffee Club</h3>
                  <p className="text-sm opacity-70 mb-5 max-w-md mx-auto">Get brewing tips, new arrivals, and exclusive offers delivered to your inbox.</p>
                  {newsletterDone ? (
                    <p className="text-green-600 font-medium flex items-center justify-center gap-2"><Check className="w-4 h-4" /> You're in! Check your inbox.</p>
                  ) : (
                    <div className="flex gap-2 max-w-sm mx-auto">
                      <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="your@email.com"
                        className={`flex-1 px-4 py-2.5 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${dm ? 'bg-[#1a1410] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`} />
                      <button onClick={() => { if (newsletterEmail.includes('@')) { setNewsletterDone(true); addToast('Subscribed successfully!'); } }}
                        className="px-5 py-2.5 bg-[#8b5e3c] text-white rounded-full text-sm font-medium hover:bg-[#6b4226] cursor-pointer">Subscribe</button>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'product' && selectedProduct && (
            <motion.div key="product" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProductDetail product={selectedProduct} isWishlisted={wishlist.includes(selectedProduct.id)} isComparing={compareIds.includes(selectedProduct.id)}
                onBack={goBack} onAdd={addToCart} onToggleWishlist={() => toggleWishlist(selectedProduct.id)} onToggleCompare={() => toggleCompare(selectedProduct.id)} dark={dm} />
              {/* Reviews */}
              <ReviewsSection product={selectedProduct} dark={dm} onAddReview={(review) => {
                selectedProduct.reviews = [review, ...selectedProduct.reviews];
                setSelectedProduct({ ...selectedProduct });
                addToast('Review submitted! +10 points', 'loyalty');
                setLoyaltyPoints(prev => prev + 10);
              }} />
              {/* Related */}
              {relatedProducts.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6">You Might Also Like</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {relatedProducts.map(p => (
                      <ProductCard key={p.id} product={p} isWishlisted={wishlist.includes(p.id)} isComparing={compareIds.includes(p.id)}
                        onView={() => openProduct(p)} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)}
                        onQuickView={() => setShowQuickView(p)} onToggleCompare={() => toggleCompare(p.id)} dark={dm} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3"><Heart className="w-7 h-7 text-[#c97b3a]" /> Your Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 opacity-20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                  <p className="opacity-70 mb-6">Save your favorite coffees for later.</p>
                  <button onClick={goBack} className="px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] cursor-pointer">Browse Coffee</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {wishlistProducts.map(p => (
                    <ProductCard key={p.id} product={p} isWishlisted={true} isComparing={compareIds.includes(p.id)}
                      onView={() => openProduct(p)} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)}
                      onQuickView={() => setShowQuickView(p)} onToggleCompare={() => toggleCompare(p.id)} dark={dm} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CartView cart={cart} total={cartTotal} discountedTotal={discountedTotal} promoDiscount={promoDiscount}
                shippingProgress={shippingProgress} remaining={remainingForFreeShipping}
                onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={() => setView('checkout')} onContinueShopping={goBack} dark={dm} />
            </motion.div>
          )}

          {view === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CheckoutView cart={cart} total={discountedTotal} rawTotal={cartTotal} promoDiscount={promoDiscount}
                promoCode={promoCode} setPromoCode={setPromoCode} promoError={promoError} applyPromo={applyPromo}
                form={orderForm} setForm={setOrderForm} onSubmit={handleCheckout} onBack={() => setView('cart')} dark={dm} loyaltyPoints={loyaltyPoints} />
            </motion.div>
          )}

          {view === 'confirmation' && orderPlaced && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <ConfirmationView onContinue={goBack} dark={dm} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className={`border-t mt-16 py-8 transition-colors ${dm ? 'border-[#3d2c1e] bg-[#1a1410]' : 'border-[#e8ddd0] bg-[#f5efe7]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coffee className="w-5 h-5 text-[#8b5e3c]" /><span className="font-bold">Bean & Brew</span>
          </div>
          <p className="text-xs opacity-60">© 2026 Bean & Brew Specialty Coffee. Crafted with passion.</p>
          <p className="text-[10px] opacity-40 mt-2">Promo codes: COFFEE10 • BREW20 • FIRST15</p>
        </div>
      </footer>
    </div>
  );
}

// ===== Product Card =====
function ProductCard({ product, isWishlisted, isComparing, onView, onAdd, onToggleWishlist, onQuickView, onToggleCompare, dark }: {
  product: Product; isWishlisted: boolean; isComparing: boolean; onView: () => void; onAdd: () => void; onToggleWishlist: () => void; onQuickView: () => void; onToggleCompare: () => void; dark: boolean;
}) {
  return (
    <div className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${dark ? 'bg-[#2a2018] border-[#3d2c1e] hover:shadow-[#3d2c1e]/30' : 'bg-white border-[#e8ddd0] hover:shadow-[#d4c4b0]/30'}`}>
      <div className="relative overflow-hidden aspect-square">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium ${dark ? 'bg-black/60 text-[#e8ddd0]' : 'bg-white/90 text-[#5a4030]'}`}>{product.category}</span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={e => { e.stopPropagation(); onToggleWishlist(); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-[#7a6352] hover:text-red-500'}`}>
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button onClick={e => { e.stopPropagation(); onQuickView(); }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#7a6352] hover:text-[#8b5e3c] transition cursor-pointer">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={e => { e.stopPropagation(); onToggleCompare(); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${isComparing ? 'bg-[#c97b3a] text-white' : 'bg-white/90 text-[#7a6352] hover:text-[#8b5e3c]'}`}>
            <Scale className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-[#8b5e3c]/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">{product.roast} Roast</span>
        </div>
        {product.subscriptionPrice && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-green-600/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-white flex items-center gap-1">
              <Repeat className="w-3 h-3" /> Save 15%
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
          <div className="flex items-center gap-1 text-[#c97b3a] shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-60 mb-3">
          <MapPin className="w-3 h-3" /><span>{product.origin}</span><span className="mx-1">•</span><span>{product.weight}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.notes.slice(0, 3).map(n => <span key={n} className={`px-2 py-0.5 rounded text-[10px] font-medium ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>{n}</span>)}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            {product.subscriptionPrice && <p className="text-[10px] text-green-600 font-medium">Subscribe: ${product.subscriptionPrice.toFixed(2)}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={onView} className={`px-3 py-2 text-xs font-medium border rounded-lg transition cursor-pointer ${dark ? 'border-[#3d2c1e] hover:bg-[#3d2c1e]' : 'border-[#e8ddd0] hover:bg-[#f5efe7]'}`}>Details</button>
            <button onClick={onAdd} className="px-3 py-2 text-xs font-medium text-white bg-[#8b5e3c] rounded-lg hover:bg-[#6b4226] transition cursor-pointer">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Product Detail =====
function ProductDetail({ product, isWishlisted, isComparing, onBack, onAdd, onToggleWishlist, onToggleCompare, dark }: {
  product: Product; isWishlisted: boolean; isComparing: boolean; onBack: () => void; onAdd: (p: Product, sub?: boolean) => void; onToggleWishlist: () => void; onToggleCompare: () => void; dark: boolean;
}) {
  const [isSubscription, setIsSubscription] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] hover:text-[#6b4226] mb-6 text-sm font-medium cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>
      <div className={`rounded-2xl overflow-hidden border shadow-lg ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="grid md:grid-cols-2">
          <div className="aspect-square relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button onClick={onToggleWishlist} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-[#7a6352] hover:text-red-500'}`}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button onClick={onToggleCompare} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer ${isComparing ? 'bg-[#c97b3a] text-white' : 'bg-white/90 text-[#7a6352] hover:text-[#8b5e3c]'}`}>
                <Scale className="w-5 h-5" />
              </button>
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
            <p className="text-sm opacity-80 leading-relaxed mb-5">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { icon: Mountain, label: 'Altitude', value: product.altitude },
                { icon: Leaf, label: 'Process', value: product.process },
                { icon: Droplets, label: 'Best For', value: product.brewMethod },
                { icon: Flame, label: 'Roast', value: product.roast },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className={`flex items-center gap-2 p-2.5 rounded-lg ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
                  <Icon className="w-4 h-4 text-[#8b5e3c]" />
                  <div><p className="text-[10px] opacity-50 uppercase">{label}</p><p className="text-xs font-medium">{value}</p></div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-semibold opacity-50 uppercase tracking-wide mb-2">Flavor Notes</h4>
              <div className="flex flex-wrap gap-2">
                {product.notes.map(n => <span key={n} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${dark ? 'bg-[#3d2c1e] border-[#3d2c1e]' : 'bg-[#f5efe7] border-[#e8ddd0]'}`}>{n}</span>)}
              </div>
            </div>

            {/* Subscription Toggle */}
            {product.subscriptionPrice && (
              <div className={`rounded-xl p-4 mb-5 border ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'bg-[#faf7f2] border-[#e8ddd0]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Subscribe & Save 15%</span>
                  </div>
                  <button onClick={() => setIsSubscription(!isSubscription)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${isSubscription ? 'bg-green-600' : dark ? 'bg-[#3d2c1e]' : 'bg-[#d4c4b0]'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isSubscription ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {isSubscription && <p className="text-xs text-green-600 mt-2">Delivered every 2 weeks • Cancel anytime</p>}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-[#e8ddd0]/30">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold">${isSubscription && product.subscriptionPrice ? product.subscriptionPrice.toFixed(2) : product.price.toFixed(2)}</span>
                  {isSubscription && <span className="text-sm opacity-50 line-through ml-2">${product.price.toFixed(2)}</span>}
                </div>
                <button onClick={() => onAdd(product, isSubscription)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg shadow-[#8b5e3c]/20 cursor-pointer">
                  <ShoppingCart className="w-4 h-4" />
                  {isSubscription ? 'Subscribe' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Reviews Section =====
function ReviewsSection({ product, dark, onAddReview }: { product: Product; dark: boolean; onAddReview: (r: Review) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, text: '' });

  const handleSubmit = () => {
    if (!newReview.author.trim() || !newReview.text.trim()) return;
    onAddReview({ id: Date.now(), author: newReview.author, rating: newReview.rating, date: new Date().toISOString().split('T')[0], text: newReview.text, verified: false });
    setNewReview({ author: '', rating: 5, text: '' });
    setShowForm(false);
  };

  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2"><Star className="w-5 h-5 text-[#c97b3a]" /> Reviews ({product.reviews.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-sm font-medium text-[#8b5e3c] hover:text-[#6b4226] cursor-pointer">
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl border p-5 mb-6 overflow-hidden ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <div className="space-y-3">
              <input type="text" value={newReview.author} onChange={e => setNewReview({ ...newReview, author: e.target.value })} placeholder="Your name"
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} />
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60">Rating:</span>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })} className="cursor-pointer">
                    <Star className={`w-5 h-5 ${s <= newReview.rating ? 'text-[#c97b3a] fill-current' : 'opacity-30'}`} />
                  </button>
                ))}
              </div>
              <textarea value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} placeholder="Share your experience..." rows={3}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 resize-none ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} />
              <button onClick={handleSubmit} className="px-5 py-2 bg-[#8b5e3c] text-white rounded-lg text-sm font-medium hover:bg-[#6b4226] cursor-pointer">Submit Review (+10 pts)</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {product.reviews.map(review => (
          <div key={review.id} className={`rounded-xl border p-4 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8b5e3c]/20 flex items-center justify-center text-xs font-bold text-[#8b5e3c]">{review.author[0]}</div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5">{review.author}
                    {review.verified && <span className="text-[10px] text-green-600 flex items-center gap-0.5"><Check className="w-3 h-3" /> Verified</span>}
                  </p>
                  <p className="text-[10px] opacity-50">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#c97b3a] fill-current' : 'opacity-20'}`} />)}
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== Cart View =====
function CartView({ cart, total, discountedTotal, promoDiscount, shippingProgress, remaining, onUpdateQuantity, onRemove, onCheckout, onContinueShopping, dark }: {
  cart: CartItem[]; total: number; discountedTotal: number; promoDiscount: number; shippingProgress: number; remaining: number;
  onUpdateQuantity: (i: number, d: number) => void; onRemove: (i: number) => void; onCheckout: () => void; onContinueShopping: () => void; dark: boolean;
}) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <ShoppingCart className="w-16 h-16 opacity-20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="opacity-70 mb-6">Explore our specialty coffee collection.</p>
        <button onClick={onContinueShopping} className="px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] cursor-pointer">Browse Coffee</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h2>

      {/* Free Shipping Progress */}
      {remaining > 0 && (
        <div className={`rounded-xl p-4 mb-6 border ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-[#8b5e3c]" /> Add ${remaining.toFixed(2)} more for free shipping!</span>
            <span className="text-xs opacity-50">{Math.round(shippingProgress * 100)}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-[#3d2c1e]' : 'bg-[#e8ddd0]'}`}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${shippingProgress * 100}%` }} className="h-full bg-gradient-to-r from-[#8b5e3c] to-[#c97b3a] rounded-full" />
          </div>
        </div>
      )}
      {remaining <= 0 && (
        <div className="rounded-xl p-3 mb-6 bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> You've unlocked free shipping!
        </div>
      )}

      <div className="space-y-4 mb-8">
        {cart.map((item, idx) => (
          <motion.div key={`${item.product.id}-${item.isSubscription}`} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{item.product.name}</h3>
              <p className="text-xs opacity-60">{item.product.origin} • {item.product.weight}</p>
              {item.isSubscription && <span className="text-[10px] text-green-600 font-medium flex items-center gap-1"><Repeat className="w-3 h-3" /> Subscription</span>}
              <p className="text-sm font-bold text-[#8b5e3c] mt-1">${(item.isSubscription && item.product.subscriptionPrice ? item.product.subscriptionPrice : item.product.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onUpdateQuantity(idx, -1)} className={`w-8 h-8 flex items-center justify-center rounded-full border transition cursor-pointer ${dark ? 'border-[#3d2c1e] hover:bg-[#3d2c1e]' : 'border-[#e8ddd0] hover:bg-[#f5efe7]'}`}><Minus className="w-3 h-3" /></button>
              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(idx, 1)} className={`w-8 h-8 flex items-center justify-center rounded-full border transition cursor-pointer ${dark ? 'border-[#3d2c1e] hover:bg-[#3d2c1e]' : 'border-[#e8ddd0] hover:bg-[#f5efe7]'}`}><Plus className="w-3 h-3" /></button>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-sm sm:text-base">${((item.isSubscription && item.product.subscriptionPrice ? item.product.subscriptionPrice : item.product.price) * item.quantity).toFixed(2)}</p>
              <button onClick={() => onRemove(idx)} className="text-[#c97b3a] hover:text-red-500 mt-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`rounded-xl border p-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm opacity-70"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          {promoDiscount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount ({promoDiscount}%)</span><span>-${(total - discountedTotal).toFixed(2)}</span></div>}
          <div className="flex justify-between text-sm opacity-70"><span>Shipping</span><span className="text-green-600 font-medium">{remaining <= 0 ? 'Free' : '$4.99'}</span></div>
          <div className={`border-t pt-3 flex justify-between ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
            <span className="font-bold">Total</span><span className="font-bold text-xl">${(discountedTotal + (remaining > 0 ? 4.99 : 0)).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onContinueShopping} className={`flex-1 px-6 py-3 border rounded-full font-medium transition cursor-pointer ${dark ? 'border-[#3d2c1e] hover:bg-[#3d2c1e]' : 'border-[#e8ddd0] hover:bg-[#f5efe7]'}`}>Continue Shopping</button>
          <button onClick={onCheckout} className="flex-1 px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg shadow-[#8b5e3c]/20 cursor-pointer">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

// ===== Checkout =====
function CheckoutView({ cart, total, rawTotal, promoDiscount, promoCode, setPromoCode, promoError, applyPromo, form, setForm, onSubmit, onBack, dark, loyaltyPoints }: {
  cart: CartItem[]; total: number; rawTotal: number; promoDiscount: number; promoCode: string; setPromoCode: (v: string) => void; promoError: string; applyPromo: () => void;
  form: OrderForm; setForm: (f: OrderForm) => void; onSubmit: () => void; onBack: () => void; dark: boolean; loyaltyPoints: number;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});
  const validate = () => {
    const e: Partial<Record<keyof OrderForm, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8b5e3c] mb-6 text-sm font-medium cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back to Cart</button>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h2>

      {/* Loyalty Points */}
      {loyaltyPoints >= 100 && (
        <div className={`rounded-xl p-4 mb-6 border flex items-center gap-3 ${dark ? 'bg-amber-900/20 border-amber-800/30' : 'bg-amber-50 border-amber-200'}`}>
          <Award className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-700">You have {loyaltyPoints} loyalty points!</p>
            <p className="text-xs opacity-70">Earn more points with this order.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6">
        <form onSubmit={e => { e.preventDefault(); if (validate()) onSubmit(); }} className="md:col-span-3 space-y-4">
          <div className={`rounded-xl border p-6 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <h3 className="font-semibold mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium opacity-60 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.name ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="John Doe" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.email ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="john@example.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: undefined }); }}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.phone ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="+1 (555) 123-4567" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium opacity-60 mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => { setForm({ ...form, address: e.target.value }); if (errors.address) setErrors({ ...errors, address: undefined }); }}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.address ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="123 Coffee Street" />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">City</label>
                  <input type="text" value={form.city} onChange={e => { setForm({ ...form, city: e.target.value }); if (errors.city) setErrors({ ...errors, city: undefined }); }}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.city ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="Portland" />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">ZIP Code</label>
                  <input type="text" value={form.zip} onChange={e => { setForm({ ...form, zip: e.target.value }); if (errors.zip) setErrors({ ...errors, zip: undefined }); }}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${errors.zip ? 'border-red-400' : dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} placeholder="97201" />
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full px-6 py-3.5 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg cursor-pointer">Place Order — ${total.toFixed(2)}</button>
        </form>

        <div className="md:col-span-2">
          <div className={`rounded-xl border p-5 sticky top-24 ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
            <h3 className="font-semibold mb-4 text-sm">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.isSubscription}`} className="flex items-center gap-3">
                  <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{item.product.name}</p><p className="text-[10px] opacity-50">×{item.quantity}{item.isSubscription ? ' • Sub' : ''}</p></div>
                  <p className="text-xs font-medium">${((item.isSubscription && item.product.subscriptionPrice ? item.product.subscriptionPrice : item.product.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className={`border-t pt-4 mb-4 ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b5e3c]" />
                  <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Promo code"
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${dark ? 'bg-[#1a1410] border-[#3d2c1e]' : 'border-[#e8ddd0]'}`} />
                </div>
                <button type="button" onClick={applyPromo} className={`px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${dark ? 'bg-[#3d2c1e] hover:bg-[#4a3828]' : 'bg-[#f5efe7] hover:bg-[#e8ddd0]'}`}>Apply</button>
              </div>
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

// ===== Confirmation =====
function ConfirmationView({ onContinue, dark }: { onContinue: () => void; dark: boolean }) {
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3">Order Confirmed!</h2>
      <p className="opacity-70 mb-2">Your specialty coffee is being prepared with care.</p>
      <p className="text-sm opacity-70 mb-8">Freshly roasted and shipped within 24 hours.</p>
      <div className={`rounded-xl border p-5 mb-8 text-left ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
        <div className="flex items-center gap-3 text-sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-[#3d2c1e]' : 'bg-[#f5efe7]'}`}>
            <Coffee className="w-4 h-4 text-[#8b5e3c]" />
          </div>
          <div>
            <p className="font-medium">Order #BB-{Math.floor(Math.random() * 90000 + 10000)}</p>
            <p className="text-xs opacity-60">Estimated delivery: 3-5 business days</p>
          </div>
        </div>
      </div>
      <button onClick={onContinue} className="px-8 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] shadow-lg cursor-pointer">Continue Shopping</button>
    </div>
  );
}

// ===== Brew Calculator =====
function BrewCalculator({ onClose, dark }: { onClose: () => void; dark: boolean }) {
  const [method, setMethod] = useState('pourover');
  const [cups, setCups] = useState(2);
  const methods: Record<string, { ratio: number; time: string; temp: string; grind: string; icon: string }> = {
    pourover: { ratio: 16, time: '3:00–4:00', temp: '93–96°C', grind: 'Medium-Fine', icon: '🫗' },
    frenchpress: { ratio: 15, time: '4:00', temp: '96°C', grind: 'Coarse', icon: '🍵' },
    espresso: { ratio: 2, time: '0:25–0:30', temp: '93°C', grind: 'Fine', icon: '☕' },
    aeropress: { ratio: 14, time: '1:30–2:00', temp: '85–90°C', grind: 'Medium-Fine', icon: '🧪' },
    coldbrew: { ratio: 8, time: '12–24 hrs', temp: 'Room temp', grind: 'Extra Coarse', icon: '🧊' },
  };
  const c = methods[method];
  const coffeeG = Math.round((cups * 250) / c.ratio);
  const waterMl = cups * 250;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#c97b3a]" /> Brew Calculator</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 cursor-pointer"><X className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {Object.entries(methods).map(([key, val]) => (
          <button key={key} onClick={() => setMethod(key)}
            className={`p-3 rounded-xl text-center transition cursor-pointer ${method === key ? 'bg-[#8b5e3c] text-white shadow-md' : dark ? 'bg-[#1a1410] hover:bg-[#3d2c1e]' : 'bg-[#f5efe7] hover:bg-[#e8ddd0]'}`}>
            <span className="text-xl block mb-1">{val.icon}</span>
            <span className="text-[10px] font-medium capitalize">{key === 'pourover' ? 'Pour Over' : key === 'frenchpress' ? 'French Press' : key === 'coldbrew' ? 'Cold Brew' : key}</span>
          </button>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-xs font-medium opacity-60 mb-2 uppercase tracking-wide">Cups</label>
        <div className="flex items-center gap-3">
          <button onClick={() => setCups(Math.max(1, cups - 1))} className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><Minus className="w-4 h-4" /></button>
          <span className="text-2xl font-bold w-10 text-center">{cups}</span>
          <button onClick={() => setCups(Math.min(10, cups + 1))} className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer ${dark ? 'border-[#3d2c1e]' : 'border-[#e8ddd0]'}`}><Plus className="w-4 h-4" /></button>
        </div>
      </div>
      <div className={`rounded-xl p-5 space-y-4 ${dark ? 'bg-[#1a1410]' : 'bg-[#faf7f2]'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div className={`text-center p-3 rounded-lg ${dark ? 'bg-[#2a2018]' : 'bg-white'}`}>
            <Coffee className="w-5 h-5 text-[#8b5e3c] mx-auto mb-1" />
            <p className="text-2xl font-bold">{coffeeG}g</p><p className="text-[10px] opacity-50 uppercase">Coffee</p>
          </div>
          <div className={`text-center p-3 rounded-lg ${dark ? 'bg-[#2a2018]' : 'bg-white'}`}>
            <Droplets className="w-5 h-5 text-[#8b5e3c] mx-auto mb-1" />
            <p className="text-2xl font-bold">{waterMl}ml</p><p className="text-[10px] opacity-50 uppercase">Water</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center"><Timer className="w-4 h-4 text-[#8b5e3c] mx-auto mb-1" /><p className="text-xs font-medium">{c.time}</p><p className="text-[10px] opacity-50">Time</p></div>
          <div className="text-center"><Flame className="w-4 h-4 text-[#8b5e3c] mx-auto mb-1" /><p className="text-xs font-medium">{c.temp}</p><p className="text-[10px] opacity-50">Temp</p></div>
          <div className="text-center"><Sparkles className="w-4 h-4 text-[#8b5e3c] mx-auto mb-1" /><p className="text-xs font-medium">{c.grind}</p><p className="text-[10px] opacity-50">Grind</p></div>
        </div>
        <p className="text-xs opacity-50 text-center pt-2 border-t border-[#e8ddd0]/30">Ratio: 1:{c.ratio}</p>
      </div>
    </div>
  );
}

// ===== FAQ Section =====
function FAQSection({ items, dark }: { items: { question: string; answer: string }[]; dark: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className={`rounded-xl border overflow-hidden transition-all ${dark ? 'bg-[#2a2018] border-[#3d2c1e]' : 'bg-white border-[#e8ddd0]'}`}>
          <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 text-left cursor-pointer">
            <span className="text-sm font-medium pr-4">{item.question}</span>
            <motion.div animate={{ rotate: openIdx === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-[#8b5e3c] shrink-0" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIdx === idx && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <p className="px-4 pb-4 text-sm opacity-70 leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
