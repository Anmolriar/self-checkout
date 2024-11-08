'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, ShoppingBag, Plus, Minus, Trash, AlertCircle, Check, Sun, Moon } from 'lucide-react';
import ProductRecommendations from '../ui/productrecommendation';
import { useTheme } from 'next-themes';
import ProgressNotification from '../ui/notification';

// Product database
const PRODUCTS = {
  '123456': { id: '123456', name: 'iPhone 15 Pro Max', price: 1299.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Smartphones' },
  '234567': { id: '234567', name: 'iPhone 15 Pro', price: 999.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Smartphones' },
  '345678': { id: '345678', name: 'iPhone 15', price: 799.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Smartphones' },
  '456789': { id: '456789', name: 'Organic Eggs 12pk', price: 5.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Dairy' },
  '567890': { id: '567890', name: 'Tomatoes', price: 2.49, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Produce' },
  '678901': { id: '678901', name: 'Red Apples', price: 3.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Produce' },
  '0123456': { id: '0123456', name: 'Organic Bananas', price: 2.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Produce' },
  '0234567': { id: '0234567', name: 'Whole Wheat Bread', price: 3.49, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Bakery' },
  '0345678': { id: '0345678', name: 'Fresh Milk 1L', price: 4.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Dairy' },
  '0456789': { id: '0456789', name: 'Organic Eggs 12pk', price: 5.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Dairy' },
  '0567890': { id: '0567890', name: 'Tomatoes', price: 2.49, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Produce' },
  '0678901': { id: '0678901', name: 'Red Apples', price: 3.99, image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037', category: 'Produce' },
};

// Ads for the slider

const ADS = [
  {
    image: 'https://icelltech.ca/cdn/shop/files/Free_Plan_Promotion_resolution.png?v=1728484928',
    title: 'Weekly Specials',
    description: 'Save up to 30% on fresh produce',
  },
  {
    image: 'https://icelltech.ca/cdn/shop/files/gift-cards_aece9630-6434-4083-8972-4e012c1435c6_2800x1000_crop_center.jpg?v=1729722915',
    title: 'Members Only Deal',
    description: 'Join our loyalty program today',
  },
  {
    image: 'https://icelltech.ca/cdn/shop/files/Untitled-9.png?v=1705509729',
    title: 'Fresh Arrivals',
    description: 'Check out our new organic selection',
  }
];

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const ModernCheckout: React.FC = () => {
  // State management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentAd, setCurrentAd] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scannerBuffer, setScannerBuffer] = useState('');
  const [lastScanTime, setLastScanTime] = useState(0);
  const { theme, setTheme } = useTheme();
  const cartRef = useRef<HTMLDivElement>(null);
  const [notificationMessages, setNotificationMessages] = useState<string[]>([]);

  // Handle scanner input
 const handleScannerInput = useCallback((barcode: string) => {
  const product = PRODUCTS[barcode];
  if (product) {
    setNotificationMessages(prev => [...prev, `Added: ${product.name}`]);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setError(null);
    setTimeout(() => {
      if (cartRef.current) {
        cartRef.current.scrollTop = cartRef.current.scrollHeight;
      }
    }, 100);
  } else {
    setError(`Product not found: ${barcode}`);
  }
}, []);

  // Scanner event listener
  useEffect(() => {
    const SCANNER_TIMEOUT = 50; // ms between scans

    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = Date.now();
      
      if (currentTime - lastScanTime > SCANNER_TIMEOUT) {
        setScannerBuffer('');
      }

      if (event.key === 'Enter' && scannerBuffer) {
        handleScannerInput(scannerBuffer);
        setScannerBuffer('');
      } else if (/^\d+$/.test(event.key)) {
        setScannerBuffer(prev => prev + event.key);
      }

      setLastScanTime(currentTime);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleScannerInput, lastScanTime, scannerBuffer]);

  // Auto rotate ads
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cart management functions
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Handle manual product search
  const handleSearch = (query: string) => {
    const product = Object.values(PRODUCTS).find(
      p => p.id === query || p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (product) {
      handleScannerInput(product.id);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    alert('Proceeding to payment...');
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
<div className="h-full w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 flex flex-col max-w-screen-2xl">
      {/* Header - Improved Responsive Spacing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          {/* <h1 className="text-2xl lg:text-3xl font-bold">Self-Checkout</h1>
          <p className="text-sm lg:text-base text-muted-foreground">Scan items or search manually</p> */}
          <img src='https://icelltech.ca/cdn/shop/files/logo_gradient_transparent.png?v=1706306227'  className="w-40 object-cover"/>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowSearch(true)}
            className="flex-1 sm:flex-none"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Search Item</span>
            <span className="sm:hidden">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content - Improved Responsive Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
        {/* Left Section - Ads and Recommendations */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {/* Ad Slider - Responsive Height */}
          <div className="relative rounded-lg overflow-hidden" style={{ height: 'clamp(200px, 30vh, 300px)' }}>
            {ADS.map((ad, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  currentAd === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative h-full">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 " />
                  {/* <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">{ad.title}</h3>
                    <p className="text-sm sm:text-base text-white/90">{ad.description}</p>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations - Scrollable Container */}
          <div className="flex-1 overflow-auto min-h-0">
            <div className="h-full">
              <ProductRecommendations onAddToCart={handleScannerInput} />
            </div>
          </div>
        </div>

        {/* Right Section - Cart and Summary */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Cart - Scrollable */}
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex-none px-4 py-3 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <h2 className="text-lg font-semibold">Your Cart</h2>
                </div>
                <Badge variant="secondary">
                  ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent 
              ref={cartRef} 
              className="flex-1 p-4 overflow-auto min-h-0"
            >
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground p-4">
                  <div>
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Start scanning items to add them to your cart</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary - Fixed Height */}
          <Card className="flex-none">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  disabled={cart.length === 0}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
        {/* Last Scanned Indicator */}
        <ProgressNotification 
  messages={notificationMessages}
  duration={2000}
/>
        {/* Search Dialog */}
        <Dialog open={showSearch} onOpenChange={setShowSearch}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Products</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
              />
              <div className="mt-4 max-h-[300px] overflow-y-auto">
                {Object.values(PRODUCTS)
                  .filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.id.includes(searchQuery)
                  )
                  .map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 hover:bg-accent/10 rounded-lg cursor-pointer"
                      onClick={() => handleSearch(product.id)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleScannerInput(product.id); }}>Add to Cart</Button>
                    </div>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default ModernCheckout;
