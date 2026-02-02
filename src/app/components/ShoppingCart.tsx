import { CartItem } from '@/app/types';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function ShoppingCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: ShoppingCartProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">Your cart is empty</p>
              <p className="text-slate-400 text-sm mt-2">Add some delicious coffee to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-50 rounded-lg p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-slate-200">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">{item.product.beanType}</p>
                    <p className="font-bold text-slate-900">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-slate-500" />
                    </button>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 hover:bg-slate-50 rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-50 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">Subtotal:</span>
              <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Shipping calculated at checkout
            </p>
            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
