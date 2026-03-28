import { FormEvent, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, Package, Pencil, Plus, Save, Search, Trash2, XCircle } from 'lucide-react';
import { Product } from '@/app/types';

interface AdminPageProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onCreateProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  backendMode: 'local' | 'firebase';
  storeId: string;
  isAdminAuthenticated: boolean;
  authLoading: boolean;
  isMutatingProducts: boolean;
  integrationError: string | null;
  onAdminLogin: (email: string, password: string) => Promise<void>;
  onAdminLogout: () => Promise<void>;
}

interface ProductFormState {
  name: string;
  category: 'core' | 'seasonal';
  description: string;
  aroma: string;
  flavor: string;
  body: string;
  finish: string;
  price: string;
  image: string;
  beanType: string;
}

const initialFormState: ProductFormState = {
  name: '',
  category: 'core',
  description: '',
  aroma: '',
  flavor: '',
  body: '',
  finish: '',
  price: '26',
  image: '',
  beanType: 'Whole Bean'
};

function createProductId(name: string, existingIds: Set<string>) {
  const baseId = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const fallbackId = baseId || `product-${Date.now()}`;

  if (!existingIds.has(fallbackId)) {
    return fallbackId;
  }

  let index = 2;
  let candidate = `${fallbackId}-${index}`;
  while (existingIds.has(candidate)) {
    index += 1;
    candidate = `${fallbackId}-${index}`;
  }

  return candidate;
}

export function AdminPage({
  products,
  onNavigate,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  backendMode,
  storeId,
  isAdminAuthenticated,
  authLoading,
  isMutatingProducts,
  integrationError,
  onAdminLogin,
  onAdminLogout
}: AdminPageProps) {
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'core' | 'seasonal'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState<Product | null>(null);

  const usingFirebase = backendMode === 'firebase';
  const canManageProducts = !usingFirebase || isAdminAuthenticated;

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesFilter = filter === 'all' || product.category === filter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.beanType.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [products, searchTerm, filter]);

  const productStats = useMemo(() => {
    const total = products.length;
    const core = products.filter((product) => product.category === 'core').length;
    const seasonal = products.filter((product) => product.category === 'seasonal').length;
    const averagePrice =
      total === 0 ? 0 : products.reduce((sum, product) => sum + product.price, 0) / total;
    return { total, core, seasonal, averagePrice };
  }, [products]);

  const clearForm = () => {
    setFormState(initialFormState);
    setEditingProductId(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setFormState({
      name: product.name,
      category: product.category,
      description: product.description,
      aroma: product.tastingNotes.aroma,
      flavor: product.tastingNotes.flavor,
      body: product.tastingNotes.body,
      finish: product.tastingNotes.finish,
      price: String(product.price),
      image: product.image,
      beanType: product.beanType
    });
    setMessage(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!canManageProducts) {
      setMessage({ type: 'error', text: 'Sign in as an admin to manage products.' });
      return;
    }

    const productToDelete = products.find((product) => product.id === productId);
    if (!productToDelete) {
      return;
    }

    setPendingDeleteProduct(productToDelete);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteProduct) {
      return;
    }

    try {
      await onDeleteProduct(pendingDeleteProduct.id);
      if (editingProductId === pendingDeleteProduct.id) {
        clearForm();
      }
      setMessage({ type: 'success', text: 'Product deleted successfully.' });
      setPendingDeleteProduct(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to delete product.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!canManageProducts) {
      setMessage({ type: 'error', text: 'Sign in as an admin to manage products.' });
      return;
    }

    const priceValue = Number(formState.price);
    if (!formState.name.trim()) {
      setMessage({ type: 'error', text: 'Product name is required.' });
      return;
    }
    if (!formState.description.trim()) {
      setMessage({ type: 'error', text: 'Description is required.' });
      return;
    }
    if (!formState.image.trim()) {
      setMessage({ type: 'error', text: 'Image URL is required.' });
      return;
    }
    if (!formState.beanType.trim()) {
      setMessage({ type: 'error', text: 'Bean type is required.' });
      return;
    }
    if (!formState.aroma.trim() || !formState.flavor.trim() || !formState.body.trim() || !formState.finish.trim()) {
      setMessage({ type: 'error', text: 'All tasting note fields are required.' });
      return;
    }
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setMessage({ type: 'error', text: 'Price must be a valid value greater than 0.' });
      return;
    }

    if (editingProductId) {
      try {
        await onUpdateProduct({
          id: editingProductId,
          name: formState.name.trim(),
          category: formState.category,
          description: formState.description.trim(),
          tastingNotes: {
            aroma: formState.aroma.trim(),
            flavor: formState.flavor.trim(),
            body: formState.body.trim(),
            finish: formState.finish.trim()
          },
          price: Number(priceValue.toFixed(2)),
          image: formState.image.trim(),
          beanType: formState.beanType.trim()
        });
        setMessage({ type: 'success', text: 'Product updated successfully.' });
        clearForm();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to update product.';
        setMessage({ type: 'error', text: errorMessage });
      }
      return;
    }

    const productId = createProductId(
      formState.name,
      new Set(products.map((product) => product.id))
    );

    try {
      await onCreateProduct({
        id: productId,
        name: formState.name.trim(),
        category: formState.category,
        description: formState.description.trim(),
        tastingNotes: {
          aroma: formState.aroma.trim(),
          flavor: formState.flavor.trim(),
          body: formState.body.trim(),
          finish: formState.finish.trim()
        },
        price: Number(priceValue.toFixed(2)),
        image: formState.image.trim(),
        beanType: formState.beanType.trim()
      });

      setMessage({ type: 'success', text: 'Product added successfully.' });
      clearForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to add product.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleAdminSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setMessage({ type: 'error', text: 'Email and password are required.' });
      return;
    }

    setAuthSubmitting(true);
    try {
      await onAdminLogin(adminEmail.trim(), adminPassword);
      setAdminPassword('');
      setMessage({ type: 'success', text: 'Signed in successfully.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to sign in.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleAdminSignOut = async () => {
    setMessage(null);
    setAuthSubmitting(true);
    try {
      await onAdminLogout();
      setMessage({ type: 'success', text: 'Signed out successfully.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to sign out.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setAuthSubmitting(false);
    }
  };

  if (usingFirebase && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Admin Sign In</h1>
                <p className="text-slate-300 mt-2">
                  Sign in with your admin account to access your store management tools.
                </p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg transition-colors font-medium w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Storefront
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Firebase Multi-Tenant</p>
            <p className="text-sm text-slate-500 mt-1">Store ID: {storeId}</p>

            {(integrationError || message) && (
              <div
                className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                  integrationError || message?.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {integrationError || message?.text}
              </div>
            )}

            <form onSubmit={handleAdminSignIn} className="grid gap-3 mt-5">
              <input
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                placeholder="Admin email"
                type="email"
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Password"
                type="password"
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={authSubmitting || authLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                {authSubmitting || authLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
              <p className="text-slate-300 mt-2">
                Manage products and keep your storefront up to date.
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg transition-colors font-medium w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Storefront
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-300 text-sm">Total Products</p>
              <p className="text-2xl font-bold mt-1">{productStats.total}</p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-300 text-sm">Core Roasts</p>
              <p className="text-2xl font-bold mt-1">{productStats.core}</p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-300 text-sm">Seasonal Blends</p>
              <p className="text-2xl font-bold mt-1">{productStats.seasonal}</p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-300 text-sm">Average Price</p>
              <p className="text-2xl font-bold mt-1">${productStats.averagePrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {usingFirebase && (
          <div className="mb-6 bg-white rounded-2xl shadow-md border border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-500">Backend Mode</p>
                <p className="font-semibold text-slate-900">Firebase Multi-Tenant</p>
                <p className="text-sm text-slate-500 mt-1">Store ID: {storeId}</p>
              </div>
              <button
                onClick={handleAdminSignOut}
                disabled={authSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                {authSubmitting ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}

        {integrationError && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
            {integrationError}
          </div>
        )}

        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProductId ? 'Update Product' : 'Add New Product'}
                </h2>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={isMutatingProducts}
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Product Name</label>
                <input
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  disabled={isMutatingProducts || !canManageProducts}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Example: Glacier Dawn Blend"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={formState.category}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        category: event.target.value as 'core' | 'seasonal'
                      }))
                    }
                    disabled={isMutatingProducts || !canManageProducts}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="core">Core Roast</option>
                    <option value="seasonal">Seasonal Blend</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Price ($)</label>
                  <input
                    value={formState.price}
                    onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={isMutatingProducts || !canManageProducts}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Bean Type</label>
                <input
                  value={formState.beanType}
                  onChange={(event) => setFormState((prev) => ({ ...prev, beanType: event.target.value }))}
                  disabled={isMutatingProducts || !canManageProducts}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Whole Bean"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Image URL</label>
                <input
                  value={formState.image}
                  onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
                  disabled={isMutatingProducts || !canManageProducts}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://..."
                />
              </div>

              {formState.image.trim() && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={formState.image} alt={formState.name || 'Product preview'} className="w-full h-40 object-cover" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  disabled={isMutatingProducts || !canManageProducts}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Aroma</label>
                  <input
                    value={formState.aroma}
                    onChange={(event) => setFormState((prev) => ({ ...prev, aroma: event.target.value }))}
                    disabled={isMutatingProducts || !canManageProducts}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Flavor</label>
                  <input
                    value={formState.flavor}
                    onChange={(event) => setFormState((prev) => ({ ...prev, flavor: event.target.value }))}
                    disabled={isMutatingProducts || !canManageProducts}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Body</label>
                  <input
                    value={formState.body}
                    onChange={(event) => setFormState((prev) => ({ ...prev, body: event.target.value }))}
                    disabled={isMutatingProducts || !canManageProducts}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Finish</label>
                  <input
                    value={formState.finish}
                    onChange={(event) => setFormState((prev) => ({ ...prev, finish: event.target.value }))}
                    disabled={isMutatingProducts || !canManageProducts}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isMutatingProducts || !canManageProducts}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                {editingProductId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isMutatingProducts
                  ? 'Saving...'
                  : editingProductId
                    ? 'Update Product'
                    : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200">
              <div className="p-5 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Product Catalog</h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search products..."
                        className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <select
                      value={filter}
                      onChange={(event) =>
                        setFilter(event.target.value as 'all' | 'core' | 'seasonal')
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All</option>
                      <option value="core">Core</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full sm:w-24 h-24 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            product.category === 'core'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {product.category === 'core' ? 'Core' : 'Seasonal'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span>${product.price.toFixed(2)}</span>
                        <span>{product.beanType}</span>
                        <span className="truncate">{product.id}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 sm:w-28">
                      <button
                        onClick={() => handleEditProduct(product)}
                        disabled={isMutatingProducts || !canManageProducts}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isMutatingProducts || !canManageProducts}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  <Package className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <p className="font-medium">No matching products found.</p>
                  <p className="text-sm mt-1">Try changing your search or filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {pendingDeleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setPendingDeleteProduct(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Delete Product</h3>
                  <p className="text-sm text-rose-100">This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete <span className="font-semibold text-slate-900">{pendingDeleteProduct.name}</span>?
              </p>
            </div>
            <div className="px-6 pb-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteProduct(null)}
                disabled={isMutatingProducts}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isMutatingProducts}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                {isMutatingProducts ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
