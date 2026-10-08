import { useState, useMemo } from 'react';
import { Product, CartItem, OrderForm } from './types';
import { products, categories, roastLevels } from './data/products';
import {
  Search,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Coffee,
  Star,
  Filter,
  ArrowLeft,
  Check,
  MapPin,
  Flame,
  Tag,
  Menu,
  ChevronDown,
} from 'lucide-react';

type View = 'shop' | 'product' | 'cart' | 'checkout' | 'confirmation';

export default function App() {
  const [view, setView] = useState<View>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesRoast =
        selectedRoast === 'All' || product.roast === selectedRoast;
      return matchesSearch && matchesCategory && matchesRoast;
    });
  }, [searchQuery, selectedCategory, selectedRoast]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setOrderPlaced(true);
    setCart([]);
    setView('confirmation');
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
  };

  const goBack = () => {
    setView('shop');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#3d2c1e] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur-sm border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-[#8b5e3c] group-hover:text-[#6b4226] transition-colors" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#3d2c1e] tracking-tight leading-none">
                  Bean & Brew
                </h1>
                <p className="text-[10px] sm:text-xs text-[#8b5e3c] tracking-widest uppercase">
                  Specialty Coffee
                </p>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={goBack}
                className="text-sm font-medium text-[#5a4030] hover:text-[#8b5e3c] transition-colors cursor-pointer"
              >
                Shop
              </button>
              <button
                onClick={() => setView('cart')}
                className="relative flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white rounded-full hover:bg-[#6b4226] transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c97b3a] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setView('cart')}
                className="relative p-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-[#3d2c1e]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c97b3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 cursor-pointer"
              >
                <Menu className="w-5 h-5 text-[#3d2c1e]" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-[#e8ddd0] pt-3">
              <button
                onClick={() => {
                  goBack();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-[#5a4030] hover:bg-[#f0e8dc] rounded-lg cursor-pointer"
              >
                Shop
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Shop View */}
        {view === 'shop' && (
          <div>
            {/* Hero */}
            <section className="text-center mb-10 sm:mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3d2c1e] mb-3 sm:mb-4">
                Exceptional Coffee,
                <br />
                <span className="text-[#8b5e3c]">Curated for You</span>
              </h2>
              <p className="text-[#7a6352] text-base sm:text-lg max-w-2xl mx-auto">
                Discover our hand-selected collection of specialty coffees from
                the world's finest growing regions.
              </p>
            </section>

            {/* Search & Filters */}
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b5e3c]" />
                <input
                  type="text"
                  placeholder="Search by name, origin, or flavor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#e8ddd0] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 focus:border-[#c97b3a] transition-all placeholder:text-[#b8a898]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#8b5e3c]" />
                  <span className="text-xs font-medium text-[#7a6352] uppercase tracking-wide">
                    Category:
                  </span>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#8b5e3c] text-white shadow-md'
                        : 'bg-white text-[#5a4030] border border-[#e8ddd0] hover:border-[#c97b3a] hover:text-[#8b5e3c]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                <div className="w-px h-5 bg-[#e8ddd0] hidden sm:block mx-2" />

                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#8b5e3c]" />
                  <span className="text-xs font-medium text-[#7a6352] uppercase tracking-wide">
                    Roast:
                  </span>
                </div>
                {roastLevels.map((roast) => (
                  <button
                    key={roast}
                    onClick={() => setSelectedRoast(roast)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedRoast === roast
                        ? 'bg-[#8b5e3c] text-white shadow-md'
                        : 'bg-white text-[#5a4030] border border-[#e8ddd0] hover:border-[#c97b3a] hover:text-[#8b5e3c]'
                    }`}
                  >
                    {roast}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Coffee className="w-12 h-12 text-[#d4c4b0] mx-auto mb-4" />
                <p className="text-[#7a6352] text-lg">
                  No coffees found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedRoast('All');
                  }}
                  className="mt-4 text-[#8b5e3c] underline text-sm cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={() => openProduct(product)}
                    onAdd={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Detail View */}
        {view === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={goBack}
            onAdd={() => {
              addToCart(selectedProduct);
              setView('cart');
            }}
          />
        )}

        {/* Cart View */}
        {view === 'cart' && (
          <CartView
            cart={cart}
            total={cartTotal}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckout={() => setView('checkout')}
            onContinueShopping={goBack}
          />
        )}

        {/* Checkout View */}
        {view === 'checkout' && (
          <CheckoutView
            cart={cart}
            total={cartTotal}
            form={orderForm}
            setForm={setOrderForm}
            onSubmit={handleCheckout}
            onBack={() => setView('cart')}
          />
        )}

        {/* Confirmation View */}
        {view === 'confirmation' && orderPlaced && (
          <ConfirmationView onContinue={goBack} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8ddd0] mt-16 py-8 bg-[#f5efe7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coffee className="w-5 h-5 text-[#8b5e3c]" />
            <span className="font-bold text-[#3d2c1e]">Bean & Brew</span>
          </div>
          <p className="text-xs text-[#7a6352]">
            © 2026 Bean & Brew Specialty Coffee. Crafted with passion.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onView,
  onAdd,
}: {
  product: Product;
  onView: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#e8ddd0] hover:shadow-xl hover:shadow-[#d4c4b0]/30 transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#5a4030]">
            {product.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-[#8b5e3c]/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
            {product.roast} Roast
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-[#3d2c1e] text-lg leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-[#c97b3a] shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#7a6352] mb-3">
          <MapPin className="w-3 h-3" />
          <span>{product.origin}</span>
          <span className="mx-1">•</span>
          <span>{product.weight}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.notes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="px-2 py-0.5 bg-[#f5efe7] rounded text-[10px] font-medium text-[#7a6352]"
            >
              {note}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#3d2c1e]">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onView}
              className="px-3 py-2 text-xs font-medium text-[#8b5e3c] border border-[#e8ddd0] rounded-lg hover:bg-[#f5efe7] transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={onAdd}
              className="px-3 py-2 text-xs font-medium text-white bg-[#8b5e3c] rounded-lg hover:bg-[#6b4226] transition-colors cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Detail Component
function ProductDetail({
  product,
  onBack,
  onAdd,
}: {
  product: Product;
  onBack: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8b5e3c] hover:text-[#6b4226] mb-6 text-sm font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </button>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd0] shadow-lg">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#f5efe7] rounded-full text-xs font-medium text-[#5a4030]">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-[#8b5e3c]/10 rounded-full text-xs font-medium text-[#8b5e3c]">
                {product.roast} Roast
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#3d2c1e] mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-[#c97b3a]">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#7a6352]">
                <MapPin className="w-3 h-3" />
                {product.origin}
              </div>
              <span className="text-xs text-[#7a6352]">{product.weight}</span>
            </div>

            <p className="text-[#5a4030] text-sm leading-relaxed mb-5">
              {product.description}
            </p>

            <div className="mb-5">
              <h4 className="text-xs font-semibold text-[#7a6352] uppercase tracking-wide mb-2">
                Flavor Notes
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1.5 bg-[#f5efe7] rounded-full text-xs font-medium text-[#5a4030] border border-[#e8ddd0]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[#e8ddd0]">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#3d2c1e]">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={onAdd}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] transition-colors shadow-lg shadow-[#8b5e3c]/20 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart View Component
function CartView({
  cart,
  total,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onContinueShopping,
}: {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <ShoppingCart className="w-16 h-16 text-[#d4c4b0] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#3d2c1e] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#7a6352] mb-6">
          Explore our specialty coffee collection and find your perfect cup.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] transition-colors cursor-pointer"
        >
          Browse Coffee
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#3d2c1e] mb-6">
        Your Cart
      </h2>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#e8ddd0]"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#3d2c1e] text-sm sm:text-base truncate">
                {item.product.name}
              </h3>
              <p className="text-xs text-[#7a6352]">
                {item.product.origin} • {item.product.weight}
              </p>
              <p className="text-sm font-bold text-[#8b5e3c] mt-1">
                ${item.product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.product.id, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e8ddd0] hover:bg-[#f5efe7] transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-medium text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.product.id, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e8ddd0] hover:bg-[#f5efe7] transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-[#3d2c1e] text-sm sm:text-base">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => onRemove(item.product.id)}
                className="text-[#c97b3a] hover:text-red-500 mt-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-xl border border-[#e8ddd0] p-6">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm text-[#7a6352]">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#7a6352]">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="border-t border-[#e8ddd0] pt-3 flex justify-between">
            <span className="font-bold text-[#3d2c1e]">Total</span>
            <span className="font-bold text-xl text-[#3d2c1e]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContinueShopping}
            className="flex-1 px-6 py-3 border border-[#e8ddd0] text-[#5a4030] rounded-full font-medium hover:bg-[#f5efe7] transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
          <button
            onClick={onCheckout}
            className="flex-1 px-6 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] transition-colors shadow-lg shadow-[#8b5e3c]/20 cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

// Checkout View Component
function CheckoutView({
  cart,
  total,
  form,
  setForm,
  onSubmit,
  onBack,
}: {
  cart: CartItem[];
  total: number;
  form: OrderForm;
  setForm: (form: OrderForm) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !form.email.includes('@'))
      newErrors.email = 'Valid email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const updateField = (field: keyof OrderForm, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8b5e3c] hover:text-[#6b4226] mb-6 text-sm font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#3d2c1e] mb-6">
        Checkout
      </h2>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-[#e8ddd0] p-6">
            <h3 className="font-semibold text-[#3d2c1e] mb-4">
              Shipping Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#7a6352] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${
                    errors.name ? 'border-red-400' : 'border-[#e8ddd0]'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#7a6352] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${
                      errors.email ? 'border-red-400' : 'border-[#e8ddd0]'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7a6352] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${
                      errors.phone ? 'border-red-400' : 'border-[#e8ddd0]'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a6352] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${
                    errors.address ? 'border-red-400' : 'border-[#e8ddd0]'
                  }`}
                  placeholder="123 Coffee Street"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#7a6352] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${
                      errors.city ? 'border-red-400' : 'border-[#e8ddd0]'
                    }`}
                    placeholder="Portland"
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7a6352] mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => updateField('zip', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c97b3a]/40 ${
                      errors.zip ? 'border-red-400' : 'border-[#e8ddd0]'
                    }`}
                    placeholder="97201"
                  />
                  {errors.zip && (
                    <p className="text-xs text-red-500 mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3.5 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] transition-colors shadow-lg shadow-[#8b5e3c]/20 cursor-pointer text-sm sm:text-base"
          >
            Place Order — ${total.toFixed(2)}
          </button>
        </form>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-[#e8ddd0] p-5 sticky top-24">
            <h3 className="font-semibold text-[#3d2c1e] mb-4 text-sm">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#3d2c1e] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-[#7a6352]">
                      ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#3d2c1e]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#e8ddd0] pt-3 space-y-2">
              <div className="flex justify-between text-xs text-[#7a6352]">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#7a6352]">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-[#3d2c1e] pt-2 border-t border-[#e8ddd0]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Confirmation View Component
function ConfirmationView({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#3d2c1e] mb-3">
        Order Confirmed!
      </h2>
      <p className="text-[#7a6352] mb-2">
        Thank you for your order. Your specialty coffee is being prepared with
        care.
      </p>
      <p className="text-sm text-[#7a6352] mb-8">
        A confirmation email has been sent. Your coffee will be freshly roasted
        and shipped within 24 hours.
      </p>
      <div className="bg-white rounded-xl border border-[#e8ddd0] p-5 mb-8 text-left">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-[#f5efe7] rounded-full flex items-center justify-center">
            <Coffee className="w-4 h-4 text-[#8b5e3c]" />
          </div>
          <div>
            <p className="font-medium text-[#3d2c1e]">Order #BB-{Math.floor(Math.random() * 90000 + 10000)}</p>
            <p className="text-xs text-[#7a6352]">Estimated delivery: 3-5 business days</p>
          </div>
        </div>
      </div>
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-[#8b5e3c] text-white rounded-full font-medium hover:bg-[#6b4226] transition-colors shadow-lg shadow-[#8b5e3c]/20 cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  );
}
