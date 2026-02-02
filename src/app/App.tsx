import { useState } from 'react';
import { Product, CartItem } from '@/app/types';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { HomePage } from '@/app/components/HomePage';
import { ProductsPage } from '@/app/components/ProductsPage';
import { AboutPage } from '@/app/components/AboutPage';
import { CheckoutPage } from '@/app/components/CheckoutPage';
import { PoliciesPage } from '@/app/components/PoliciesPage';
import { ContactPage } from '@/app/components/ContactPage';
import { ShoppingCart } from '@/app/components/ShoppingCart';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setCurrentPage('home');
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === 'products' && <ProductsPage onAddToCart={handleAddToCart} />}
        {currentPage === 'about' && <AboutPage onNavigate={setCurrentPage} />}
        {currentPage === 'checkout' && (
          <CheckoutPage cartItems={cartItems} onOrderComplete={handleOrderComplete} />
        )}
        {currentPage === 'policies' && <PoliciesPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer onNavigate={setCurrentPage} />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
