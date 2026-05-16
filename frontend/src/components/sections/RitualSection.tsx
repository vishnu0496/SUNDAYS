"use client";

import { motion } from "framer-motion";

export function RitualSection() {
  return (
    <section id="ritual" className="py-section bg-forest relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse gap-gap-lg items-center">
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative rounded-[48px] overflow-hidden border border-gold/10 aspect-[4/5]"
            >
              <img 
                src="/images/ritual.jpg" 
                alt="The Sunday Ritual" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/60 via-transparent to-transparent" />
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <p className="text-tan tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">THE RITUAL</p>
            <h2 className="text-5xl md:text-7xl font-serif text-cream mb-gap-md leading-[1.1]">
              The Sunday Afternoon <br/> <span className="italic text-tan">Slowdown</span>
            </h2>
            <p className="text-cream/60 text-lg md:text-xl font-serif leading-relaxed max-w-xl mb-gap-md italic">
              "We don't just bake cookies. We curate a moment. A soft chair, a hot espresso, and the molten center of The Legend. This is the Sunday you deserve."
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-[1px] bg-gold/20" />
                <p className="text-tan text-[11px] tracking-[0.3em] uppercase font-bold">100% Handcrafted</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-[1px] bg-gold/20" />
                <p className="text-tan text-[11px] tracking-[0.3em] uppercase font-bold">Baked to Order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
