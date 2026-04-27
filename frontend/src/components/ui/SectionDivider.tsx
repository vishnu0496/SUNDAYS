"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div className="flex justify-center items-center py-10 opacity-30">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        className="h-[1px] bg-gold" 
      />
      <motion.div 
        initial={{ scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        className="w-1.5 h-1.5 bg-gold mx-6" 
      />
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        className="h-[1px] bg-gold" 
      />
    </div>
  );
}
