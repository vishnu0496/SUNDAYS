'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LogoutButton } from './LogoutButton';

const NAV_ITEMS = [
  { label: 'The Pulse', href: '/admin/overview', icon: '🏛️' },
  { label: 'Fulfillment Hub', href: '/admin/orders', icon: '📦' },
  { label: 'VIP Registry', href: '/admin/customers', icon: '👑' },
  { label: 'Laboratory', href: '/admin/menu', icon: '🧪' },
  { label: 'Growth', href: '/admin/analytics', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) return <div className="min-h-screen bg-[#F5F0E8] font-sans text-[#163126]">{children}</div>;

  return (
    <div className="flex min-h-screen bg-[#030A08] text-[#F6F0E7] selection:bg-[#C7A44C] selection:text-[#030A08]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0D1A14] border-r border-[#C7A44C]/10 flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-10">
          <Link href="/" className="group block">
            <h1 className="text-2xl font-serif tracking-[0.3em] text-[#C7A44C] group-hover:text-[#F6F0E7] transition-colors">
              SUNDAYS
            </h1>
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[#7A8970] mt-2 group-hover:text-[#C7A44C] transition-colors">
              Boutique Operations
            </p>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 group relative",
                  isActive 
                    ? "bg-[#C7A44C] text-[#030A08]" 
                    : "text-[#7A8970] hover:text-[#C7A44C] hover:bg-white/5"
                )}
              >
                <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-[#C7A44C] rounded-2xl -z-10 shadow-[0_0_20px_rgba(199,164,76,0.3)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-[#C7A44C]/10 space-y-4">
          <div className="flex items-center gap-3 px-6 text-[#7A8970]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest font-black">Live Ops</span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-5 pointer-events-none" />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
