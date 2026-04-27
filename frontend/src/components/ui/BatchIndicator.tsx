"use client";

import { motion } from "framer-motion";

export function BatchIndicator() {
  return (
    <div className="flex items-center gap-3 bg-gold/10 border border-gold/30 px-6 py-3 rounded-full w-max shadow-xl backdrop-blur-md">
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
      </div>
      <span className="text-[11px] font-black tracking-[0.3em] text-gold uppercase">
        Batch: Baked Fresh Today
      </span>
    </div>
  );
}
