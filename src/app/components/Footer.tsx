import { Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="Copper River Coffee" className="w-auto h-20 object-contain" />
            </div>
            <p className="text-sm text-slate-400">
              Small-batch coffees crafted in the heart of Alaska's Copper River Valley.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  All Coffee
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Core Roasts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Seasonal Blends
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Store Policies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>info@copperrivercoffee.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Copper River Valley, Alaska</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>&copy; 2026 Copper River Coffee Company. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('policies')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('policies')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
