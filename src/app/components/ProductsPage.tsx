import { useState } from 'react';
import { Product } from '@/app/types';
import { ProductCard } from '@/app/components/ProductCard';
import { ProductDetailModal } from '@/app/components/ProductDetailModal';
import { products } from '@/app/data/products';

interface ProductsPageProps {
  onAddToCart: (product: Product) => void;
}

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'seasonal'>('all');

  const filteredProducts = products.filter(
    (product) => filter === 'all' || product.category === filter
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Coffee</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Every blend is thoughtfully crafted to reflect the spirit of Alaska. All coffees are $26 per 1lb bag.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Coffees
          </button>
          <button
            onClick={() => setFilter('core')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'core'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Core Roasts
          </button>
          <button
            onClick={() => setFilter('seasonal')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'seasonal'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Seasonal Blends
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}
