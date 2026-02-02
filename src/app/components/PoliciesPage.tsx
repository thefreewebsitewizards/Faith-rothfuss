import { Package, RefreshCw, Clock, Shield, Mail, DollarSign } from 'lucide-react';

export function PoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Store Policies</h1>
          <p className="text-xl text-slate-300">
            Our commitment to quality, transparency, and customer satisfaction
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Ordering & Payment */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Ordering & Payment</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• All orders must be paid in full at the time of purchase.</li>
              <li>• We accept major credit and debit cards through our secure checkout system.</li>
              <li>• Orders are processed once payment is confirmed.</li>
            </ul>
          </div>

          {/* Roasting & Fulfillment */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Roasting & Fulfillment</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• Coffee is roasted in small batches to ensure freshness.</li>
              <li>• Orders are typically roasted and shipped within 2–5 business days.</li>
              <li>• During peak seasons or extreme weather conditions, processing times may vary.</li>
            </ul>
          </div>

          {/* Shipping */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Shipping</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• We ship within the United States.</li>
              <li>• Shipping costs are calculated based on your zip code at checkout.</li>
              <li>• Priority shipping options are available for faster delivery.</li>
              <li>• Shipping times may be affected by weather, holidays, or remote delivery locations, especially in Alaska.</li>
              <li>• Once an order has shipped, tracking information will be provided when available.</li>
            </ul>
          </div>

          {/* Returns & Refunds */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Returns & Refunds</h2>
              </div>
            </div>
            <div className="ml-16 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-900 font-medium">NO RETURNS ON OPENED PRODUCTS</p>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li>• Due to the perishable nature of coffee, we do not accept returns on opened products.</li>
                <li>• If your order arrives damaged or incorrect, contact us within 7 days of delivery.</li>
                <li>• Approved refunds or replacements will be issued at our discretion.</li>
              </ul>
            </div>
          </div>

          {/* Cancellations */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Cancellations</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• Orders may be canceled within 12 hours of purchase, provided roasting has not yet begun.</li>
              <li>• Once an order enters production, cancellations are no longer possible.</li>
            </ul>
          </div>

          {/* Quality Guarantee */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Quality Guarantee</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• We stand behind the quality of our coffee.</li>
              <li>• If you are unsatisfied with your purchase, reach out and we will work to make it right.</li>
            </ul>
          </div>

          {/* Privacy & Security */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Privacy & Security</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• Customer information is used solely to process orders and provide customer service.</li>
              <li>• We do not sell or share personal information with third parties.</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Contact</h2>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 ml-16">
              <li>• Questions or concerns can be directed through our Contact page or by email.</li>
              <li>• We aim to respond to all inquiries within 1–2 business days.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Copper River Coffee Company reserves the right to update these policies at any time.</p>
          <p className="mt-2">Last updated: February 1, 2026</p>
        </div>
      </div>
    </div>
  );
}
