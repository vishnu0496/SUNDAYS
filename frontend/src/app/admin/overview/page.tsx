import React from 'react';
import { getBoutiqueAnalytics } from '@/lib/admin-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default async function FounderPulsePage() {
  const analytics = await getBoutiqueAnalytics();
  const { hero, actionItems, bestSellers, recentOrders } = analytics;

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-[1600px] mx-auto pb-40 text-[#F6F0E7]">
      
      {/* Cinematic Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#C7A44C]/20 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-serif tracking-tight leading-none">
            The <span className="text-[#C7A44C]">Pulse</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#7A8970] italic">
            Sundays Boutique &middot; Real-Time Operations Registry
          </p>
        </div>
        
        <div className="flex gap-12 items-end">
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-2">Boutique Vibe</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif italic text-[#C7A44C]">High Growth</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={cn("w-1 h-6 rounded-full", i < 5 ? "bg-[#C7A44C]" : "bg-white/10")} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Glassmorphic Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <GlassMetric 
          label="Today's Harvest" 
          value={`₹${hero.today.revenue.toLocaleString()}`} 
          sub={`${hero.today.count} orders received`}
          icon="✨"
        />
        <GlassMetric 
          label="Weekly Flow" 
          value={`₹${hero.week.revenue.toLocaleString()}`} 
          sub="Past 7 days performance"
          icon="🌊"
        />
        <GlassMetric 
          label="The Treasury" 
          value={`₹${hero.totalRevenue.toLocaleString()}`} 
          sub="Lifetime brand value"
          icon="🏛️"
        />
        <GlassMetric 
          label="Ritual Rate" 
          value={`${Math.round(analytics.repeatRate)}%`} 
          sub="Repeat customer love"
          icon="❤️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Fulfillment Engine Status */}
        <div className="lg:col-span-1 space-y-12">
          <section className="glass-panel p-10 space-y-10 border border-[#C7A44C]/10 rounded-[3rem] relative overflow-hidden group hover:border-[#C7A44C]/30 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A44C]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            <h3 className="text-[10px] uppercase font-black text-[#C7A44C] tracking-[0.4em] mb-4">Operations Engine</h3>
            
            <div className="space-y-8">
              <LiveIndicator label="Orders to Pack" count={actionItems.readyForFulfillment} color="gold" />
              <LiveIndicator label="In the Oven" count={actionItems.inProduction} color="white" />
              <LiveIndicator label="Awaiting Treasury" count={actionItems.unpaidCount} color="red" />
            </div>
          </section>

          <section className="glass-panel p-10 border border-[#C7A44C]/10 rounded-[3rem] space-y-8">
             <h3 className="text-[10px] uppercase font-black text-[#7A8970] tracking-[0.4em]">Flavor Velocity</h3>
             <div className="space-y-6">
                {bestSellers.map((item, i) => (
                  <div key={i} className="flex justify-between items-end">
                    <p className="font-serif text-xl italic">{item.name}</p>
                    <div className="flex items-end gap-3">
                      <span className="text-xs font-black text-[#C7A44C]">{item.quantity}</span>
                      <div className="w-1 bg-[#C7A44C]/20 h-8 rounded-full overflow-hidden">
                        <div 
                          className="w-full bg-[#C7A44C] rounded-full" 
                          style={{ height: `${(item.quantity / bestSellers[0].quantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Live Registry Feed */}
        <div className="lg:col-span-2 glass-panel rounded-[3rem] border border-[#C7A44C]/10 overflow-hidden flex flex-col shadow-2xl">
          <div className="px-12 py-10 border-b border-[#C7A44C]/10 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-[#7A8970]">The Live Registry</h3>
            <a href="/admin/orders" className="text-[10px] uppercase font-black tracking-widest text-[#C7A44C] hover:text-[#F6F0E7] transition-all border-b border-[#C7A44C] pb-1">
              Full Registry
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-[0.4em] text-[#7A8970]/40 border-b border-[#C7A44C]/5">
                  <th className="px-12 py-8 font-black">Registry Ref</th>
                  <th className="px-5 py-8 font-black">Patron</th>
                  <th className="px-12 py-8 text-right font-black">Treasury Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C7A44C]/5">
                {recentOrders.map((order) => (
                  <tr key={order.orderNumber} className="group hover:bg-white/[0.03] transition-all duration-500">
                    <td className="px-12 py-10">
                      <span className="font-mono text-[11px] text-[#C7A44C] font-black tracking-tighter">#{order.orderNumber}</span>
                    </td>
                    <td className="px-5 py-10">
                       <span className="font-serif text-2xl text-[#F6F0E7] block leading-tight group-hover:translate-x-2 transition-transform duration-700">{order.customer.firstName}</span>
                       <div className="flex items-center gap-3 mt-3">
                         <span className="text-[9px] font-black uppercase text-[#7A8970] tracking-[0.2em]">
                           {order.meta.fulfillmentStatus}
                         </span>
                         {order.isRepeat && <span className="w-1 h-1 rounded-full bg-[#C7A44C]" />}
                         {order.isRepeat && <span className="text-[8px] font-black text-[#C7A44C] uppercase tracking-widest">Ritualist</span>}
                       </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <span className="font-serif text-3xl text-[#F6F0E7]">₹{order.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassMetric({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: string }) {
  return (
    <div className="glass-panel p-10 border border-[#C7A44C]/10 rounded-[3rem] shadow-xl group hover:border-[#C7A44C]/40 transition-all duration-700 hover:-translate-y-2 relative overflow-hidden bg-white/[0.01]">
      <div className="absolute bottom-0 right-0 opacity-10 text-6xl translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-1000 grayscale select-none">{icon}</div>
      <p className="text-[10px] uppercase font-black text-[#7A8970] tracking-[0.4em] mb-10">{label}</p>
      <p className="text-5xl font-serif text-[#F6F0E7] mb-4 tracking-tighter group-hover:text-[#C7A44C] transition-colors duration-500">{value}</p>
      <p className="text-[9px] font-black text-[#7A8970]/60 uppercase tracking-[0.3em] leading-relaxed">{sub}</p>
    </div>
  );
}

function LiveIndicator({ label, count, color }: { label: string; count: number; color: string }) {
  const colors = {
    gold: 'text-[#C7A44C] bg-[#C7A44C]/5 border-[#C7A44C]/10',
    white: 'text-white bg-white/5 border-white/10',
    red: 'text-rose-400 bg-rose-400/5 border-rose-400/10'
  };
  
  return (
    <div className={cn("flex justify-between items-center p-6 rounded-[2rem] border transition-all hover:bg-white/5", colors[color as keyof typeof colors])}>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{label}</span>
      <span className="text-3xl font-serif italic leading-none">{count}</span>
    </div>
  );
}
