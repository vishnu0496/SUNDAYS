'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

export default function LaboratoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // For demo/initial state, we'll use the products.json data
  // In a real app, this would be a fetch to /api/admin/menu
  useEffect(() => {
    // Initializing with the data we just created
    setProducts([
      {
        id: "the-legend",
        name: "The Legend",
        flavor: "Classic Choco-Chip",
        description: "Hand-chopped dark chocolate · Sea salt finish",
        price: 349,
        status: "active",
        isBestseller: true,
        category: "Classic"
      },
      {
        id: "naughty-nutella",
        name: "The Naughty Nutella",
        flavor: "Nutella Stuffed",
        description: "Molten hazelnut core · Creamy Belgian base",
        price: 349,
        status: "active",
        isBestseller: false,
        category: "Indulgent"
      },
      {
        id: "citrus-cloud",
        name: "The Citrus Cloud",
        flavor: "Lemon Crinkle",
        description: "Zesty organic lemons · Melt-in-your-mouth texture",
        price: 349,
        status: "active",
        isBestseller: false,
        category: "Zesty"
      }
    ]);
    setLoading(false);
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((product) => (
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
              <div className={cn(
                "w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                product.status === 'active' ? "bg-emerald-500 shadow-emerald-500/50" : "bg-rose-500 shadow-rose-500/50"
              )} />
            </div>

            <p className="text-sm font-serif italic text-[#F6F0E7]/60 leading-relaxed min-h-[3rem]">
              "{product.description}"
            </p>

            <div className="flex justify-between items-end border-t border-[#C7A44C]/10 pt-8 mt-auto">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-widest text-[#7A8970] font-black">Boutique Price</p>
                <p className="text-3xl font-serif text-[#C7A44C]">₹{product.price}</p>
              </div>
              
              <div className="flex gap-4">
                 <button className="w-12 h-12 rounded-full border border-[#C7A44C]/20 flex items-center justify-center text-sm hover:bg-[#C7A44C] hover:text-[#030A08] transition-all">
                   ⚙️
                 </button>
                 <button className={cn(
                   "px-6 py-3 rounded-full text-[9px] uppercase tracking-widest font-black border transition-all",
                   product.status === 'active' ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : "border-rose-500/20 text-rose-400 bg-rose-500/5"
                 )}>
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
