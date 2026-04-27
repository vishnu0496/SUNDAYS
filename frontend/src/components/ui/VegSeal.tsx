"use client";

import { motion } from "framer-motion";

export function VegSeal({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`flex items-center gap-2 bg-[#FAF7F2]/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold/30 shadow-lg ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* The Outer Gold Border */}
        <div className="absolute inset-0 border-[1.5px] border-[#163126] rounded-sm" />
        {/* The Inner Green Dot */}
        <div className="w-2 h-2 bg-[#163126] rounded-full" />
      </div>
      <span className="text-[8px] font-black tracking-[0.2em] text-[#163126] uppercase">
        100% Eggless
      </span>
    </motion.div>
  );
}
