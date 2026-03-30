import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
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
import { AdminPage } from '@/app/components/AdminPage';
import { products as initialProducts } from '@/app/data/products';
import {
  isFirebaseBackendConfigured,
  getFirebaseConfigurationErrorMessage,
  firebaseStoreId,
  onAdminAuthStateChange,
  getUserStoreIdFromClaims,
  getUserRoleFromClaims,
  bootstrapAdminClaims,
  subscribeToTenantProducts,
  createTenantProduct,
  updateTenantProduct,
  deleteTenantProduct,
  adminSignIn,
  adminSignOut
} from '@/app/firebase/client';

type Page = 'home' | 'products' | 'about' | 'checkout' | 'policies' | 'contact' | 'admin';

const pageToRoute: Record<Page, string> = {
  home: '/',
  products: '/products',
  about: '/about',
  checkout: '/checkout',
  policies: '/policies',
  contact: '/contact',
  admin: '/admin'
};

function isPage(value: string): value is Page {
  return value in pageToRoute;
}

function getPageFromHash(): Page {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const hashPath = window.location.hash.replace(/^#/, '').toLowerCase() || '/';

  const routeEntry = Object.entries(pageToRoute).find(([, route]) => route === hashPath);
  if (routeEntry) {
    return routeEntry[0] as Page;
  }

  if (hashPath === '/home') {
    return 'home';
  }

  return 'home';
}

export default function App() {
  const isProductionBuild = import.meta.env.PROD;
  const shouldUseLocalFallback = !isProductionBuild && !isFirebaseBackendConfigured;
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const [products, setProducts] = useState<Product[]>(
    shouldUseLocalFallback ? initialProducts : []
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseBackendConfigured || !shouldUseLocalFallback);
  const [isMutatingProducts, setIsMutatingProducts] = useState(false);
  const [integrationError, setIntegrationError] = useState<string | null>(
    !isFirebaseBackendConfigured && isProductionBuild
      ? `${getFirebaseConfigurationErrorMessage()}. Add these env vars in Vercel Project Settings → Environment Variables, then redeploy.`
      : null
  );
  const [activeStoreId, setActiveStoreId] = useState(firebaseStoreId);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(shouldUseLocalFallback);

  const backendMode = shouldUseLocalFallback ? 'local' : 'firebase';

  const navigateTo = (page: string) => {
    const targetPage: Page = isPage(page) ? page : 'home';
    const targetRoute = pageToRoute[targetPage];

    setCurrentPage(targetPage);

    if (typeof window !== 'undefined' && window.location.hash !== `#${targetRoute}`) {
      window.location.hash = targetRoute;
    }
  };

  useEffect(() => {
    const syncPageFromHash = () => {
      setCurrentPage(getPageFromHash());
    };

    if (window.location.hash.length === 0) {
      window.location.hash = pageToRoute.home;
    }

    window.addEventListener('hashchange', syncPageFromHash);
    return () => {
      window.removeEventListener('hashchange', syncPageFromHash);
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseBackendConfigured && isProductionBuild) {
      setAuthLoading(false);
      return;
    }
    if (!isFirebaseBackendConfigured) {
      return;
    }

    let isMounted = true;

    const unsubscribe = onAdminAuthStateChange((user) => {
      void (async () => {
        if (!isMounted) {
          return;
        }

        setAdminUser(user);

        if (!user) {
          setActiveStoreId(firebaseStoreId);
          setIsAdminAuthorized(false);
          setAuthLoading(false);
          return;
        }

        const claimedStoreId = await getUserStoreIdFromClaims(user, true);
        const claimedRole = await getUserRoleFromClaims(user, false);
        if (!isMounted) {
          return;
        }

        if (claimedStoreId && claimedRole === 'admin') {
          setActiveStoreId(claimedStoreId);
          if (firebaseStoreId && firebaseStoreId !== claimedStoreId) {
            setIsAdminAuthorized(false);
            setIntegrationError(
              `This account belongs to store "${claimedStoreId}" but this app is configured for "${firebaseStoreId}".`
            );
          } else {
            setIsAdminAuthorized(true);
            setIntegrationError(null);
          }
        } else {
          setActiveStoreId(firebaseStoreId);
          setIsAdminAuthorized(false);
          setIntegrationError(
            'Your account is missing required admin claims (storeId + role=admin).'
          );
        }

        setAuthLoading(false);
      })();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseBackendConfigured) {
      return;
    }

    const targetStoreId = activeStoreId || firebaseStoreId;
    if (!targetStoreId) {
      return;
    }

    const unsubscribe = subscribeToTenantProducts(
      targetStoreId,
      (nextProducts) => {
        setProducts(nextProducts);
        setIntegrationError((currentError) => {
          if (currentError?.startsWith('Signed-in admin belongs to')) {
            return currentError;
          }
          return null;
        });
      },
      (error) => {
        setIntegrationError(error.message || 'Unable to load products from Firebase.');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeStoreId]);

  useEffect(() => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          const latestProduct = products.find((product) => product.id === item.product.id);
          return latestProduct ? { ...item, product: latestProduct } : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, [products]);

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
    navigateTo('checkout');
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    navigateTo('home');
  };

  const handleCreateProduct = async (product: Product) => {
    if (!isFirebaseBackendConfigured && isProductionBuild) {
      const errorMessage = `${getFirebaseConfigurationErrorMessage()}. Add Vercel env vars and redeploy.`;
      setIntegrationError(errorMessage);
      throw new Error(errorMessage);
    }
    if (backendMode === 'local') {
      setProducts((prevProducts) => [product, ...prevProducts]);
      return;
    }

    setIsMutatingProducts(true);
    setIntegrationError(null);
    try {
      await createTenantProduct(activeStoreId || firebaseStoreId, product);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create product.';
      setIntegrationError(message);
      throw error;
    } finally {
      setIsMutatingProducts(false);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    if (!isFirebaseBackendConfigured && isProductionBuild) {
      const errorMessage = `${getFirebaseConfigurationErrorMessage()}. Add Vercel env vars and redeploy.`;
      setIntegrationError(errorMessage);
      throw new Error(errorMessage);
    }
    if (backendMode === 'local') {
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
      return;
    }

    setIsMutatingProducts(true);
    setIntegrationError(null);
    try {
      await updateTenantProduct(activeStoreId || firebaseStoreId, updatedProduct.id, updatedProduct);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update product.';
      setIntegrationError(message);
      throw error;
    } finally {
      setIsMutatingProducts(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!isFirebaseBackendConfigured && isProductionBuild) {
      const errorMessage = `${getFirebaseConfigurationErrorMessage()}. Add Vercel env vars and redeploy.`;
      setIntegrationError(errorMessage);
      throw new Error(errorMessage);
    }
    if (backendMode === 'local') {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      return;
    }

    setIsMutatingProducts(true);
    setIntegrationError(null);
    try {
      await deleteTenantProduct(activeStoreId || firebaseStoreId, productId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete product.';
      setIntegrationError(message);
      throw error;
    } finally {
      setIsMutatingProducts(false);
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    setIntegrationError(null);
    try {
      if (!isFirebaseBackendConfigured) {
        throw new Error(
          `${getFirebaseConfigurationErrorMessage()}. Add these variables in Vercel and redeploy.`
        );
      }
      const credentials = await adminSignIn(email, password);

      if (backendMode === 'firebase' && firebaseStoreId) {
        try {
          await bootstrapAdminClaims(firebaseStoreId);
        } catch (error) {
          const message = error instanceof Error ? error.message.toLowerCase() : '';
          if (message.includes('not allowed to bootstrap admin claims')) {
            throw new Error(
              `This email is not authorized as adminEmail for store "${firebaseStoreId}".`
            );
          }
          throw error;
        }

        const claimedStoreId = await getUserStoreIdFromClaims(credentials.user, true);
        const claimedRole = await getUserRoleFromClaims(credentials.user, false);

        if (!claimedStoreId || claimedRole !== 'admin') {
          throw new Error(
            `Claims bootstrap did not apply correctly. Expected storeId="${firebaseStoreId}" and role="admin".`
          );
        }

        if (claimedStoreId !== firebaseStoreId) {
          throw new Error(
            `This account is claimed for "${claimedStoreId}" but this app is configured for "${firebaseStoreId}".`
          );
        }

        setActiveStoreId(claimedStoreId);
        setIsAdminAuthorized(true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      setIsAdminAuthorized(false);
      setIntegrationError(message);
      throw error;
    }
  };

  const handleAdminLogout = async () => {
    setIntegrationError(null);
    try {
      await adminSignOut();
      setIsAdminAuthorized(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out.';
      setIntegrationError(message);
      throw error;
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'products' && (
          <ProductsPage products={products} onAddToCart={handleAddToCart} />
        )}
        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}
        {currentPage === 'checkout' && (
          <CheckoutPage cartItems={cartItems} onOrderComplete={handleOrderComplete} />
        )}
        {currentPage === 'policies' && <PoliciesPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && (
          <AdminPage
            products={products}
            onNavigate={navigateTo}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            backendMode={backendMode}
            storeId={activeStoreId || firebaseStoreId}
            isAdminAuthenticated={isAdminAuthorized}
            authLoading={authLoading}
            isMutatingProducts={isMutatingProducts}
            integrationError={integrationError}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

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
