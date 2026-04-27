'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MergedOrder } from '@/lib/admin-data';

export default function VIPRegistryPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const orders: MergedOrder[] = await res.json();

      // Group by email to create VIP profiles
      const profiles: Record<string, any> = {};
      orders.forEach(order => {
        const email = order.customer.email.toLowerCase();
        if (!profiles[email]) {
          profiles[email] = {
            name: `${order.customer.firstName} ${order.customer.lastName}`,
            email: email,
            phone: order.customer.phone,
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: order.timestamp,
            location: order.customer.address,
            orders: []
          };
        }
        profiles[email].totalOrders += 1;
        profiles[email].totalSpent += order.total;
        profiles[email].orders.push(order);
      });

      const sortedProfiles = Object.values(profiles).sort((a: any, b: any) => b.totalSpent - a.totalSpent);
      setCustomers(sortedProfiles);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#C7A44C] uppercase tracking-[0.6em] text-[10px] font-black animate-pulse">Syncing VIP Registry...</div>
    </div>
  );

  return (
    <div className="p-8 lg:p-16 space-y-16 max-w-[1600px] mx-auto pb-40 text-[#F6F0E7]">

      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#C7A44C]/20 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-serif tracking-tight leading-none">
            The <span className="text-[#C7A44C]">VIP</span> Registry
          </h1>
          <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#7A8970] italic">
            Customer Relationship Intelligence & Patron History
          </p>
        </div>

        <div className="flex gap-12 items-end">
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-2">Total Patrons</p>
            <span className="text-4xl font-serif italic text-[#C7A44C]">{customers.length}</span>
          </div>
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-2">Boutique VIPs</p>
            <span className="text-4xl font-serif italic text-white">{customers.filter(c => c.totalOrders > 1).length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {customers.map((customer, idx) => (
          <motion.div
            key={customer.email}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel group rounded-[3rem] border border-[#C7A44C]/10 overflow-hidden bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#C7A44C]/40 transition-all duration-700 p-10 flex flex-wrap items-center justify-between gap-12 shadow-2xl"
          >
            <div className="flex gap-10 items-center">
              <div className="w-20 h-20 rounded-full bg-[#C7A44C]/10 border border-[#C7A44C]/20 flex items-center justify-center text-3xl font-serif text-[#C7A44C] shadow-inner">
                {customer.name.charAt(0)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-serif text-[#F6F0E7] tracking-tight group-hover:translate-x-2 transition-transform duration-700">{customer.name}</h3>
                  {customer.totalOrders > 2 && (
                    <span className="px-4 py-1 bg-[#C7A44C] text-[#030A08] text-[8px] uppercase tracking-[0.4em] font-black rounded-full shadow-[0_0_20px_rgba(199,164,76,0.4)]">
                      Top Patron
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#7A8970]">
                  <span>{customer.email}</span>
                  <span className="opacity-20">|</span>
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-16">
              <div className="text-center">
                <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-3">Total Rituals</p>
                <p className="text-3xl font-serif italic text-white">{customer.totalOrders}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-3">Treasury Contribution</p>
                <p className="text-3xl font-serif italic text-[#C7A44C]">₹{customer.totalSpent}</p>
              </div>
              <div className="text-center hidden xl:block">
                <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mb-3">Last Active</p>
                <p className="text-lg font-serif text-[#F6F0E7]/60 italic">
                  {new Date(customer.lastOrder).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={`https://wa.me/91${customer.phone}`}
                target="_blank"
                className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
              >
                💬
              </a>
              <button className="px-8 py-4 rounded-full border border-[#C7A44C]/30 text-[9px] uppercase tracking-[0.4em] font-black text-[#C7A44C] hover:bg-[#C7A44C] hover:text-[#030A08] transition-all">
                Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
