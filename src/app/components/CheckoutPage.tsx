import { useState } from 'react';
import { CartItem } from '@/app/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { CreditCard, Package, CheckCircle } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

export function CheckoutPage({ cartItems, onOrderComplete }: CheckoutPageProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isPriority: false
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Simple shipping calculation based on zip code
  const calculateShipping = () => {
    if (!shippingInfo.zipCode) return 0;
    
    // Alaska zip codes (99500-99999) have higher shipping
    const zipNum = parseInt(shippingInfo.zipCode);
    const isAlaska = zipNum >= 99500 && zipNum <= 99999;
    
    const baseShipping = isAlaska ? 15 : 8;
    const priorityExtra = shippingInfo.isPriority ? 10 : 0;
    
    return baseShipping + priorityExtra;
  };

  const shipping = calculateShipping();
  const total = subtotal + shipping;

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('complete');
    // In production, this would integrate with Stripe
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-slate-600">Add some items to checkout</p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-slate-600 mb-6">
            Thank you for your order. We'll start roasting your coffee and ship it within 2-5 business days.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 mb-2">Order Summary</p>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            <p className="text-sm text-slate-500 mt-2">
              Confirmation email sent to {shippingInfo.email}
            </p>
          </div>
          <button
            onClick={onOrderComplete}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === 'info' ? 'text-amber-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'info' ? 'bg-amber-600 text-white' : 'bg-slate-200'
                }`}>
                  1
                </div>
                <span className="font-medium hidden sm:inline">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-amber-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' ? 'bg-amber-600 text-white' : 'bg-slate-200'
                }`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">Payment</span>
              </div>
            </div>

            {/* Shipping Information */}
            {step === 'info' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmitInfo} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Zip Code *</label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{5}"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-medium mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-amber-600 transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          checked={!shippingInfo.isPriority}
                          onChange={() => setShippingInfo({ ...shippingInfo, isPriority: false })}
                          className="w-4 h-4 text-amber-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-slate-500">2-5 business days</div>
                        </div>
                        <div className="font-medium">
                          ${shippingInfo.zipCode ? (parseInt(shippingInfo.zipCode) >= 99500 ? '15.00' : '8.00') : '--'}
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-amber-600 transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingInfo.isPriority}
                          onChange={() => setShippingInfo({ ...shippingInfo, isPriority: true })}
                          className="w-4 h-4 text-amber-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Priority Shipping</div>
                          <div className="text-sm text-slate-500">1-3 business days</div>
                        </div>
                        <div className="font-medium">
                          ${shippingInfo.zipCode ? (parseInt(shippingInfo.zipCode) >= 99500 ? '25.00' : '18.00') : '--'}
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Payment Information */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Information
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-900">
                    <strong>Note:</strong> This is a demo checkout. In production, payment would be processed securely through Stripe.
                  </p>
                </div>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Name on Card *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('info')}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                      Complete Order
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping:</span>
                  <span className="font-medium">
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Enter zip code'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
