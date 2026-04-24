"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image - Strict Coverage */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/hero.jpg")' }}
      />
      
      {/* Strict Cinematic Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)'
        }}
      />
      
      {/* Content Container - Exact Screenshot Spacing */}
      <div className="relative z-20 container mx-auto px-6 text-center max-w-5xl flex flex-col items-center pt-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-tan tracking-[0.4em] uppercase text-[9px] md:text-[10px] font-bold mb-8"
        >
          HYDERABAD&apos;S HANDCRAFTED COOKIE
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-white text-7xl md:text-8xl lg:text-[11rem] font-serif font-light leading-[1.1] mb-6 tracking-[-0.01em]"
        >
          Sundays
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="font-serif-display text-bone/90 text-2xl md:text-3xl mb-12 tracking-wide"
        >
          Calories don&apos;t count on Sundays.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="flex flex-col items-center"
        >
          <a 
            href="#menu"
            className="premium-button"
          >
            ORDER NOW
          </a>
          
          <div className="mt-12 flex flex-col items-center">
            <a 
              href="#menu"
              className="text-white/60 text-[10px] tracking-[0.3em] uppercase font-bold flex flex-col items-center gap-2 border-b border-white/20 pb-1 hover:text-white transition-all"
            >
              SEE THE MENU ↓
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Label and Line */}
      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center z-20">
        <span className="text-tan text-[9px] tracking-[0.5em] uppercase font-bold mb-4">SCROLL</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
