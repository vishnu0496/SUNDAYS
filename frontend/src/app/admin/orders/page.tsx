"use client";

import React, { useState, useEffect } from 'react';
import { MergedOrder } from '@/lib/admin-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LabelGenerator from '@/components/admin/LabelGenerator';

export default function FulfillmentHubPage() {
  const [orders, setOrders] = useState<MergedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [kitchenMode, setKitchenMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<MergedOrder | null>(null);
  const [labelNote, setLabelNote] = useState('Baked with love in Hyderabad.');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderNumber: string, fulfillmentStatus: string) => {
    try {
      await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus })
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getKitchenStats = () => {
    const stats: Record<string, number> = {};
    orders
      .filter(o => ['Reserved', 'Queued', 'Baking'].includes(o.meta.fulfillmentStatus))
      .forEach(o => {
        o.items.forEach(i => {
          stats[i.name] = (stats[i.name] || 0) + i.quantity;
        });
      });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="text-[#C7A44C] uppercase tracking-[0.6em] text-[10px] font-black animate-pulse">Syncing Fulfillment Hub...</div>
    </div>
  );

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-[1600px] mx-auto pb-40 text-[#F6F0E7]">
      
      {/* Label Modal */}
      {selectedOrder && (
        <LabelGenerator 
          order={selectedOrder} 
          handwrittenNote={labelNote}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#C7A44C]/20 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-serif tracking-tight leading-none">
            The <span className="text-[#C7A44C]">Hub</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#7A8970] italic">
            Fulfillment Logistics & Operational Registry
          </p>
        </div>
        
        <div className="flex gap-6 items-end">
          <div className="flex flex-col gap-2">
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] text-right">Fulfillment Message</p>
            <input 
              type="text" 
              value={labelNote}
              onChange={(e) => setLabelNote(e.target.value)}
              className="bg-white/5 border border-[#C7A44C]/20 rounded-full px-8 py-4 text-[10px] text-[#C7A44C] outline-none focus:border-[#C7A44C] w-72 transition-all"
              placeholder="Handwritten Note..."
            />
          </div>
          <button 
            onClick={() => setKitchenMode(!kitchenMode)}
            className={cn(
              "px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all border shadow-2xl",
              kitchenMode 
                ? "bg-[#C7A44C] text-[#030A08] border-[#C7A44C]" 
                : "bg-white/5 text-[#7A8970] border-[#C7A44C]/20 hover:border-[#C7A44C] hover:text-[#C7A44C]"
            )}
          >
            {kitchenMode ? "Exit Kitchen View" : "Kitchen View"}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {kitchenMode ? (
          <motion.div 
            key="kitchen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {getKitchenStats().map(([name, count]) => (
              <div key={name} className="glass-panel p-16 rounded-[4rem] border-2 border-[#C7A44C]/20 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#C7A44C]/20" />
                <span className="text-[10px] uppercase tracking-[0.6em] text-[#7A8970] font-black mb-10">Flavor Batch</span>
                <span className="text-9xl font-serif text-[#C7A44C] mb-6 group-hover:scale-110 transition-transform duration-700">{count}</span>
                <span className="text-3xl font-serif italic text-[#F6F0E7]">{name}</span>
              </div>
            ))}
            {getKitchenStats().length === 0 && (
              <div className="col-span-full py-40 text-center border-2 border-dashed border-[#C7A44C]/10 rounded-[4rem]">
                <p className="font-serif text-4xl text-[#7A8970] italic">The Laboratory is silent.</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8970]/50 mt-8 font-black">All pending orders are fulfilled.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="registry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {orders.map((order) => (
              <OrderRow 
                key={order.orderNumber} 
                order={order} 
                onUpdateStatus={updateStatus}
                onSelectOrder={setSelectedOrder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderRow({ 
  order, 
  onUpdateStatus, 
  onSelectOrder 
}: { 
  order: MergedOrder, 
  onUpdateStatus: (id: string, s: string) => void,
  onSelectOrder: (o: MergedOrder) => void
}) {
  const isPaid = order.meta.paymentStatus === 'Paid';
  const isVIP = order.isRepeat;

  return (
    <div className="glass-panel border border-[#C7A44C]/10 rounded-[3rem] p-10 hover:border-[#C7A44C]/40 transition-all group bg-white/[0.01] hover:bg-white/[0.03] shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-12">
        <div className="flex gap-12 items-center">
          <div className="space-y-3">
            <p className="text-[10px] font-mono text-[#C7A44C] font-black tracking-widest opacity-60 uppercase">Registry #{order.orderNumber}</p>
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-serif text-[#F6F0E7] tracking-tight group-hover:translate-x-2 transition-transform duration-700">{order.customer.firstName} {order.customer.lastName}</h3>
              {isVIP && (
                <span className="px-4 py-1 bg-[#C7A44C]/10 border border-[#C7A44C]/30 text-[#C7A44C] text-[8px] uppercase tracking-[0.4em] font-black rounded-full shadow-[0_0_15px_rgba(199,164,76,0.2)]">
                  Ritualist
                </span>
              )}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#7A8970]">
              {new Date(order.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="hidden xl:block h-16 w-px bg-[#C7A44C]/10" />

          <div className="space-y-2 max-w-md">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#7A8970] opacity-40">Box Composition</p>
            <p className="text-[#F6F0E7] font-serif italic text-xl leading-snug">
              {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8">
          {/* Status Indicator */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isPaid ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-pulse"
            )} />
            <span className={cn(
              "text-[10px] uppercase tracking-[0.4em] font-black",
              isPaid ? "text-emerald-400" : "text-rose-400"
            )}>
              {order.meta.paymentStatus}
            </span>
          </div>

          <div className="h-8 w-px bg-[#C7A44C]/10" />

          {/* Fulfillment Action */}
          <div className="flex items-center gap-6">
            <select 
              value={order.meta.fulfillmentStatus}
              onChange={(e) => onUpdateStatus(order.orderNumber, e.target.value)}
              className="bg-transparent border border-[#C7A44C]/20 rounded-2xl px-6 py-4 text-[9px] uppercase tracking-[0.3em] font-black text-[#F6F0E7] outline-none focus:border-[#C7A44C] transition-all cursor-pointer hover:bg-white/5"
            >
              <option value="Reserved">Reserved</option>
              <option value="Queued">Queued</option>
              <option value="Baking">Baking</option>
              <option value="Packed">Packed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button 
              onClick={() => onSelectOrder(order)}
              className="px-10 py-4 rounded-2xl bg-[#C7A44C] text-[#030A08] text-[9px] uppercase tracking-[0.4em] font-black hover:bg-[#F6F0E7] transition-all shadow-xl active:scale-95"
            >
              Seal Label
            </button>
            
            <a 
              href={`https://wa.me/91${order.customer.phone}`}
              target="_blank"
              className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
              title="WhatsApp Concierge"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
