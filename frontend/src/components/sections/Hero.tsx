"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90svh] lg:min-h-[100svh] flex items-center bg-[#163126] overflow-hidden pt-20 lg:pt-0">
      <div className="container mx-auto px-6 lg:px-12 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-col justify-center items-start text-left z-10 order-2 lg:order-1"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#C7A44C] tracking-[0.4em] uppercase text-xs font-bold font-sans mb-8"
            >
              PRE-LAUNCH WAITLIST
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#F6F0E7] mb-8 font-normal tracking-tight leading-[1.1]"
            >
              Calories don't count <br className="hidden md:block" /> on Sundays.
            </motion.h1>
    
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-[#F6F0E7]/70 font-sans text-lg md:text-xl max-w-lg mb-12 leading-relaxed"
            >
              Obsessively crafted, small-batch cookies. We spent a year perfecting the ultimate indulgence. You just have to wait a little longer.
            </motion.p>
    
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <Button 
                variant="secondary"
                className="bg-[#C7A44C] text-[#163126] font-bold px-12 py-6 text-sm tracking-[0.2em] shadow-2xl hover:bg-[#D8B45C] transition-all rounded-full"
                onClick={() => document.getElementById('drop')?.scrollIntoView({ behavior: 'smooth' })}
              >
                JOIN THE FIRST DROP
              </Button>
            </motion.div>
          </motion.div>
    
          {/* Right Column: Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="relative aspect-square lg:aspect-[4/5] w-full order-1 lg:order-2"
          >
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/5">
              <img 
                src="/hero-cookie.png" 
                alt="Premium Sunday Cookie" 
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[3s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163126]/40 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Subtle floating accent - Branded element */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#C7A44C] flex items-center justify-center shadow-2xl border-4 border-[#163126] z-20"
            >
              <span className="text-[#163126] font-serif italic text-xl md:text-2xl">S.</span>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
