"use client";

import { motion } from "framer-motion";

export function StorySection() {
  return (
    <section id="story" className="py-section bg-forest relative">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <p className="text-gold-muted tracking-[0.5em] uppercase text-[10px] font-bold mb-gap-sm">OUR STORY</p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-bone mb-gap-md leading-[1.05]">
          Made in Hyderabad, <br /> 
          <span className="font-serif-display text-white">with love.</span>
        </h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="space-y-10 text-cream/70 text-lg md:text-xl font-sans leading-relaxed max-w-3xl mx-auto font-light"
        >
          <p>
            SUNDAYS started as a simple obsession — finding the perfect chocolate chip cookie in Hyderabad and never quite being satisfied. So I started baking. Batch after batch, tweak after tweak, until one Sunday afternoon I pulled out a tray that stopped everyone in the room.
          </p>
          <p>
            Every cookie is baked fresh in small batches from my home kitchen. No preservatives, no shortcuts. Just quality ingredients, browned butter, and a process I&apos;ve spent months perfecting.
          </p>
          
          <div className="pt-12 flex flex-col items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="text-white font-signature text-5xl mb-2 opacity-80"
            >
              Vishnu
            </motion.p>
            <p className="text-gold-muted text-[10px] tracking-[0.3em] uppercase font-bold">
              Founder, Sundays Hyderabad
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
