import { Product } from '@/app/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { X, Plus, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            {product.category === 'seasonal' && (
              <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Seasonal
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="rounded-lg overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-sm text-slate-500 mb-2">{product.beanType}</p>
              <div className="text-3xl font-bold mb-6">
                <span className="text-slate-900">${product.price.toFixed(2)}</span>
                <span className="text-lg text-slate-500 ml-2">/ 1lb bag</span>
              </div>

              <p className="text-slate-700 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Tasting Notes</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-900">Aroma:</span>
                    <span className="text-slate-700 ml-2">{product.tastingNotes.aroma}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Flavor:</span>
                    <span className="text-slate-700 ml-2">{product.tastingNotes.flavor}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Body:</span>
                    <span className="text-slate-700 ml-2">{product.tastingNotes.body}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Finish:</span>
                    <span className="text-slate-700 ml-2">{product.tastingNotes.finish}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
