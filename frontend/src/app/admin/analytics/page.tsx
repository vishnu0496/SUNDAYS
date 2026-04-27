import React from 'react';
import { getBoutiqueAnalytics } from '@/lib/admin-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default async function BoutiqueGrowthPage() {
  const analytics = await getBoutiqueAnalytics();
  const { hero, bestSellers } = analytics;

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-[1600px] mx-auto pb-40 text-[#F6F0E7]">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#C7A44C]/20 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-serif tracking-tight leading-none">
            Boutique <span className="text-[#C7A44C]">Growth</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#7A8970] italic">
            Long-term Brand Performance & Revenue Velocity
          </p>
        </div>
        
        <div className="flex gap-12 items-end">
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-2">Total Treasury</p>
            <span className="text-5xl font-serif italic text-[#C7A44C]">₹{hero.totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Revenue Velocity Chart (Visual Placeholder for real chart) */}
        <section className="glass-panel p-12 border border-[#C7A44C]/10 rounded-[4rem] bg-white/[0.01] flex flex-col gap-10 min-h-[500px]">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-[#7A8970]">Revenue Velocity</h3>
            <div className="flex gap-4 text-[8px] font-black uppercase tracking-widest text-[#C7A44C]">
              <span>7D</span>
              <span className="opacity-30">30D</span>
              <span className="opacity-30">ALL</span>
            </div>
          </div>
          
          <div className="flex-grow flex items-end gap-4 pb-10">
            {/* Simple CSS-based bar chart for visual feel */}
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div 
                  className="w-full bg-[#C7A44C]/10 border border-[#C7A44C]/20 rounded-2xl group-hover:bg-[#C7A44C]/30 transition-all duration-700" 
                  style={{ height: `${h}%` }}
                />
                <span className="text-[8px] font-black text-[#7A8970] opacity-0 group-hover:opacity-100 transition-opacity">Day {i+1}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#C7A44C]/10">
            <div>
              <p className="text-[8px] uppercase font-black text-[#7A8970] mb-2">Today</p>
              <p className="text-2xl font-serif italic">₹{hero.today.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase font-black text-[#7A8970] mb-2">Avg. Order</p>
              <p className="text-2xl font-serif italic">₹{Math.round(hero.month.acv).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase font-black text-[#7A8970] mb-2">Growth Rate</p>
              <p className="text-2xl font-serif italic text-emerald-400">+12%</p>
            </div>
          </div>
        </section>

        {/* Product Mastery */}
        <section className="glass-panel p-12 border border-[#C7A44C]/10 rounded-[4rem] bg-white/[0.01] flex flex-col gap-10">
           <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-[#7A8970]">Product Mastery</h3>
           <div className="space-y-10">
              {bestSellers.map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-2xl font-serif italic leading-tight">{item.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#C7A44C] font-black">{Math.round((item.quantity / hero.totalOrders) * 100)}% of total volume</p>
                    </div>
                    <span className="text-xl font-serif text-[#7A8970]">{item.quantity} units</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C7A44C] rounded-full shadow-[0_0_10px_rgba(199,164,76,0.5)]" 
                      style={{ width: `${(item.quantity / bestSellers[0].quantity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Ritualist Loyalty (LTV) */}
        <section className="lg:col-span-2 glass-panel p-16 border border-[#C7A44C]/10 rounded-[4rem] bg-[#C7A44C]/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A44C]/10 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
           
           <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="max-w-md space-y-6">
                <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-[#C7A44C]">Ritualist Loyalty</h3>
                <p className="text-4xl font-serif leading-snug">
                  <span className="text-white italic">{Math.round(analytics.repeatRate)}%</span> of your patrons are <span className="text-[#C7A44C]">Sundays Ritualists.</span>
                </p>
                <p className="text-sm font-serif italic text-[#7A8970] leading-relaxed">
                  Boutique success is built on the second box. Your ritual rate is the ultimate indicator of your brand's soul.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12 flex-grow md:pl-20">
                 <div className="space-y-2">
                   <p className="text-[8px] uppercase tracking-widest text-[#7A8970] font-black">Ritualist Count</p>
                   <p className="text-4xl font-serif italic">42</p>
                 </div>
                 <div className="space-y-2">
                   <p className="text-[8px] uppercase tracking-widest text-[#7A8970] font-black">LTV (Boutique Average)</p>
                   <p className="text-4xl font-serif italic text-[#C7A44C]">₹2,140</p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
