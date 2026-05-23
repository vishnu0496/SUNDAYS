'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PRODUCT_NAMES, PRODUCT_PRICES } from '@/lib/products';

interface Product {
  id: string;
  name: string;
  flavor: string;
  description: string;
  price: number;
  status: 'active' | 'sold-out' | 'archived';
  isBestseller: boolean;
  category: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'trio',
    name: PRODUCT_NAMES.trio,
    flavor: '3 big cookies',
    description: 'Mix any 3 regular cookies. Nutella is charged +₹10 per cookie.',
    price: PRODUCT_PRICES.trio,
    status: 'active',
    isBestseller: true,
    category: 'Core Pack',
  },
  {
    id: 'half-dozen',
    name: PRODUCT_NAMES.halfDozen,
    flavor: '6 big cookies',
    description: 'Mix any 6 regular cookies. Best-value box with the new premium anchor.',
    price: PRODUCT_PRICES.halfDozen,
    status: 'active',
    isBestseller: true,
    category: 'Core Pack',
  },
  {
    id: 'starter',
    name: PRODUCT_NAMES.starter,
    flavor: '3 big + 12 mini',
    description: 'First-order combo with regular cookies plus chocolate chip mini bites.',
    price: PRODUCT_PRICES.starter,
    status: 'active',
    isBestseller: false,
    category: 'Combo',
  },
  {
    id: 'gift-box',
    name: PRODUCT_NAMES.giftBox,
    flavor: '6 big + 12 mini',
    description: 'Gifting-friendly combo built around the new pack pricing strategy.',
    price: PRODUCT_PRICES.giftBox,
    status: 'active',
    isBestseller: false,
    category: 'Combo',
  },
  {
    id: 'full-sunday',
    name: PRODUCT_NAMES.fullSunday,
    flavor: '6 big + 24 mini',
    description: 'Hero combo for customers who want the biggest Sundays box.',
    price: PRODUCT_PRICES.fullSunday,
    status: 'active',
    isBestseller: true,
    category: 'Combo',
  },
  {
    id: 'mini-24',
    name: PRODUCT_NAMES.mini24,
    flavor: '24 mini bites',
    description: 'Chocolate chip mini bites for sharing. Standalone only for nearby orders.',
    price: PRODUCT_PRICES.mini24,
    status: 'active',
    isBestseller: false,
    category: 'Mini Bites',
  },
];

export default function LaboratoryPage() {
  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-[1600px] mx-auto pb-40 text-[#F6F0E7]">
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#C7A44C]/20 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-serif tracking-tight leading-none">
            The <span className="text-[#C7A44C]">Laboratory</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#7A8970] italic">
            Flavor Architecture & Product Registry
          </p>
        </div>

        <button className="px-10 py-5 rounded-full border border-[#C7A44C]/30 text-[10px] uppercase tracking-[0.4em] font-black text-[#C7A44C] hover:bg-[#C7A44C] hover:text-[#030A08] transition-all">
          Engineer New Flavor
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            layoutId={product.id}
            className="glass-panel group rounded-[3rem] border border-[#C7A44C]/10 overflow-hidden bg-white/[0.02] hover:border-[#C7A44C]/40 transition-all duration-700 p-10 flex flex-col gap-8 shadow-2xl"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-[#C7A44C]">{product.category}</span>
                <h3 className="text-3xl font-serif leading-tight">{product.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A8970] font-black italic">[{product.flavor}]</p>
              </div>
              <div
                className={cn(
                  'w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]',
                  product.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'
                )}
              />
            </div>

            <p className="text-sm font-serif italic text-[#F6F0E7]/60 leading-relaxed min-h-[3rem]">
              &quot;{product.description}&quot;
            </p>

            <div className="flex justify-between items-end border-t border-[#C7A44C]/10 pt-8 mt-auto">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-widest text-[#7A8970] font-black">Boutique Price</p>
                <p className="text-3xl font-serif text-[#C7A44C]">&#8377;{product.price}</p>
              </div>

              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-[#C7A44C]/20 flex items-center justify-center text-sm hover:bg-[#C7A44C] hover:text-[#030A08] transition-all">
                  Edit
                </button>
                <button
                  className={cn(
                    'px-6 py-3 rounded-full text-[9px] uppercase tracking-widest font-black border transition-all',
                    product.status === 'active'
                      ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                      : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
                  )}
                >
                  {product.status === 'active' ? 'Live' : 'Sold Out'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
