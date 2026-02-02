import { Product } from '@/app/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Plus, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <div className="relative h-64 bg-slate-100 overflow-hidden group cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.category === 'seasonal' && (
          <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Seasonal
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-1">{product.beanType}</p>
        <p className="text-slate-600 mb-4 line-clamp-3">{product.description}</p>

        {/* Tasting Notes Preview */}
        <div className="mb-4 text-sm text-slate-700">
          <p className="italic">"{product.tastingNotes.flavor}"</p>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-sm text-slate-500 ml-1">/ 1lb</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        </div>

        <button
          onClick={() => onViewDetails(product)}
          className="w-full mt-3 text-amber-700 hover:text-amber-800 text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
