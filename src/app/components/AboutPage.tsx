import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Coffee, Mountain, Heart, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/90 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1581605673389-0dd8ebdf2fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGFza2ElMjBtb3VudGFpbnMlMjB3aW50ZXIlMjBzbm93fGVufDF8fHx8MTc2OTk4NjE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Alaska Mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">Our Story</h1>
            <p className="text-xl text-slate-200">
              Rooted in Alaska's rugged beauty and resilient spirit
            </p>
          </div>
        </div>
      </div>

      {/* Main Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
          <p className="text-xl leading-relaxed">
            Born in the heart of Alaska, Copper River Coffee Company is rooted in the rugged beauty, 
            resilience, and independence of the Copper River Valley. We craft small‑batch coffees 
            inspired by the land and the people who call it home—long winters, hard work, and the 
            quiet reward of a well‑earned cup.
          </p>
          <p className="leading-relaxed">
            Every blend is thoughtfully developed to reflect the spirit of the North, from bold dark 
            roasts built for cold mornings to smooth, comforting blends meant for slow starts and 
            fireside evenings. We focus on quality, consistency, and character, roasting coffee 
            that's dependable, honest, and full of warmth.
          </p>
          <p className="leading-relaxed">
            Copper River Coffee Company isn't just about coffee—it's about connection. To the land. 
            To tradition. To the simple moments that matter. One cup at a time.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Drives Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2">Quality First</h3>
              <p className="text-sm text-slate-600">
                Small-batch roasting ensures every bag meets our high standards for freshness and flavor.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2">Alaska Spirit</h3>
              <p className="text-sm text-slate-600">
                Every blend reflects the strength, independence, and beauty of the Last Frontier.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2">Crafted with Care</h3>
              <p className="text-sm text-slate-600">
                We take pride in every step, from selecting beans to roasting to packaging.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2">Community Focused</h3>
              <p className="text-sm text-slate-600">
                We're committed to serving our customers with integrity and building lasting relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Roasting Process</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Selection</h3>
                <p className="text-slate-600">
                  We carefully select premium coffee beans that meet our standards for quality and character.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Small-Batch Roasting</h3>
                <p className="text-slate-600">
                  Each batch is roasted with precision to bring out the unique flavors and aromas that define our blends.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality Control</h3>
                <p className="text-slate-600">
                  Every batch is tested and evaluated to ensure it meets our high standards before packaging.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fresh Delivery</h3>
                <p className="text-slate-600">
                  We ship your coffee within 2-5 business days so it arrives at your door at peak freshness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
          <p className="text-xl text-slate-300 mb-8">
            Taste the quality, craftsmanship, and Alaska spirit in every cup.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Shop Our Coffee
          </button>
        </div>
      </section>
    </div>
  );
}
