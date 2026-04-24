import React from "react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Ticker Bar */}
      <div className="bg-[#030A08] text-gold h-10 flex items-center overflow-hidden border-b border-gold/5 select-none">
        <div className="flex w-max animate-ticker-seamless">
          <div className="flex items-center whitespace-nowrap px-4 text-[11px] tracking-[0.2em] uppercase font-medium">
            <span className="mx-12">CALORIES DON’T COUNT ON SUNDAYS</span>
            <span className="text-gold/30">✦</span>
            <span className="mx-12">FREE DELIVERY ABOVE ₹899</span>
            <span className="text-gold/30">✦</span>
            <span className="mx-12">HYDERABAD ONLY</span>
            <span className="text-gold/30">✦</span>
            <span className="mx-12">FREE TOTE BAG ABOVE ₹1099</span>
            <span className="text-gold/30">✦</span>
          </div>
          <div className="flex items-center whitespace-nowrap px-4 text-[11px] tracking-[0.2em] uppercase font-medium">
            <span className="mx-12">CALORIES DON’T COUNT ON SUNDAYS</span>
            <span className="text-gold/30">✦</span>
            <span className="mx-12">FREE DELIVERY ABOVE ₹899</span>
            <span className="text-gold/30">✦</span>
            <span className="mx-12">HYDERABAD ONLY</span>
            <span className="text-gold/30">✦</span>
            <span className="mx-12">FREE TOTE BAG ABOVE ₹1099</span>
            <span className="text-gold/30">✦</span>
          </div>
        </div>
      </div>

      <nav className="h-16 flex items-center border-b border-gold/5 bg-forest/90 backdrop-blur-md sticky top-10 z-[100] will-change-transform">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.h1 
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0.5em", opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="text-xl md:text-2xl font-serif font-bold flex items-center uppercase"
          >
            <span className="text-white">SUN</span>
            <span className="text-gold ml-2">DAYS</span>
          </motion.h1>

          <div className="hidden md:flex gap-12 items-center text-[11px] tracking-[0.4em] uppercase font-bold text-gold-muted">
            <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            <a href="#craft" className="hover:text-white transition-colors">The Craft</a>
            <a href="#story" className="hover:text-white transition-colors">Our Story</a>
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-cart'));
              }}
              className="relative hover:text-white transition-colors flex items-center gap-2 text-tan"
            >
              Cart
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(199,164,76,0.8)]"></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
