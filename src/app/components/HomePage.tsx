import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Coffee, Mountain, Heart } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/90 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1581605673389-0dd8ebdf2fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGFza2ElMjBtb3VudGFpbnMlMjB3aW50ZXIlMjBzbm93fGVufDF8fHx8MTc2OTk4NjE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Alaska Mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Born in the Heart of Alaska
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 max-w-2xl mx-auto">
            Small-batch coffees crafted for long winters, hard work, and the quiet reward of a well-earned cup.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg transition-colors text-lg font-medium"
          >
            Shop Our Coffee
          </button>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Small Batch Roasted</h3>
              <p className="text-slate-600">
                Roasted in small batches to ensure maximum freshness and quality in every bag.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Alaska Heritage</h3>
              <p className="text-slate-600">
                Inspired by the rugged beauty and resilience of the Copper River Valley.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-slate-600">
                We stand behind every cup. If you're not satisfied, we'll make it right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-amber-600 mx-auto" />
          </div>
          <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
            <p>
              Born in the heart of Alaska, Copper River Coffee Company is rooted in the rugged beauty, 
              resilience, and independence of the Copper River Valley. We craft small‑batch coffees 
              inspired by the land and the people who call it home—long winters, hard work, and the 
              quiet reward of a well‑earned cup.
            </p>
            <p>
              Every blend is thoughtfully developed to reflect the spirit of the North, from bold dark 
              roasts built for cold mornings to smooth, comforting blends meant for slow starts and 
              fireside evenings. We focus on quality, consistency, and character, roasting coffee 
              that's dependable, honest, and full of warmth.
            </p>
            <p>
              Copper River Coffee Company isn't just about coffee—it's about connection. To the land. 
              To tradition. To the simple moments that matter. One cup at a time.
            </p>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('products')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Explore Our Coffees
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/80 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1660602067563-377fc91053fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjByaXZlciUyMGFsYXNrYSUyMHdpbGRlcm5lc3N8ZW58MXx8fHwxNzY5OTg2MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Alaska Wilderness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Alaska in Every Cup?
          </h2>
          <p className="text-xl mb-8 text-slate-200">
            All our coffees are $26 per 1lb bag. Roasted fresh and shipped within 2-5 business days.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-lg transition-colors text-lg font-medium"
          >
            Start Shopping
          </button>
        </div>
      </section>
    </div>
  );
}
