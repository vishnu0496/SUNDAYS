"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Sparkles, Snowflake } from "lucide-react";

interface RitualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RitualModal({ isOpen, onClose }: RitualModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] md:h-auto max-h-[85vh] bg-[#050D0A] border border-gold/15 rounded-[32px] z-[201] shadow-2xl overflow-y-auto flex flex-col font-sans selection:bg-gold selection:text-forest"
          >
            {/* Header */}
            <div className="p-8 border-b border-gold/10 flex justify-between items-center bg-[#07110E] sticky top-0 z-10">
              <div>
                <span className="text-gold tracking-[0.3em] uppercase text-[9px] font-bold block mb-1">
                  The Sundays Guide
                </span>
                <h2 className="text-3xl font-serif text-white tracking-tight">
                  Rituals & Ingredients
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gold/15 flex items-center justify-center text-gold-muted hover:text-white hover:border-gold/40 transition-colors"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-10 overflow-y-auto">
              
              {/* Section 1: The Reheating Ritual */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gold/5 pb-3">
                  <Flame className="w-5 h-5 text-gold" />
                  <h3 className="text-lg tracking-wider uppercase font-bold text-cream">
                    The Reheating Ritual
                  </h3>
                </div>
                
                <p className="text-cream/50 text-sm leading-relaxed font-serif italic">
                  "Our cookies are baked with pure couverture butter and premium sugars. To experience them fresh-from-the-oven, we strongly recommend warming them before devouring."
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Option A: Air Fryer or Oven */}
                  <div className="bg-white/[0.02] border border-gold/10 rounded-2xl p-5 space-y-3">
                    <p className="text-[10px] tracking-[0.25em] uppercase font-black text-gold">
                      Oven / Air Fryer (Best)
                    </p>
                    <p className="text-cream font-serif text-2xl">
                      160°C (320°F)
                    </p>
                    <p className="text-cream/60 text-xs leading-relaxed font-light">
                      Warm for <strong className="text-white font-medium">2 to 3 minutes</strong>. This restores the signature crispy, golden shell while keeping the core soft and gooey.
                    </p>
                  </div>

                  {/* Option B: Microwave */}
                  <div className="bg-white/[0.02] border border-gold/10 rounded-2xl p-5 space-y-3">
                    <p className="text-[10px] tracking-[0.25em] uppercase font-black text-gold">
                      Microwave (Quick)
                    </p>
                    <p className="text-cream font-serif text-2xl">
                      10 - 15 Seconds
                    </p>
                    <p className="text-cream/60 text-xs leading-relaxed font-light">
                      Warm for <strong className="text-white font-medium">10 to 15 seconds</strong>. This makes the couverture chocolate pools completely molten and rich. Do not exceed 15s.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-xs text-red-300/80 leading-relaxed font-serif italic">
                  <strong>Important Caution:</strong> Do not guess or search generic temperatures on Google! Higher temperatures will burn the couverture white and dark chocolates, turning them dry and bitter. Never leave cookies unattended while reheating.
                </div>
              </div>

              {/* Section 2: Ingredients & Transparency */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gold/5 pb-3">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <h3 className="text-lg tracking-wider uppercase font-bold text-cream">
                    Our Ingredients
                  </h3>
                </div>

                <p className="text-cream/50 text-sm leading-relaxed font-serif italic">
                  We use uncompromised, professional-grade raw ingredients. 100% Eggless & Vegetarian.
                </p>

                <div className="space-y-4">
                  {/* Double Chocolate */}
                  <div className="border-l-2 border-gold/20 pl-4 space-y-1">
                    <h4 className="text-sm font-bold text-[#F6F0E7] uppercase tracking-wider">Double Chocolate</h4>
                    <p className="text-cream/50 text-xs leading-relaxed font-light">
                      Unsalted French Butter (browned to Beurre Noisette), Organic Sugars, Premium Wheat Flour, Van Houten 55% Couverture Dark Chocolate (pure cocoa butter, zero vegetable fats), Sea Salt, Coffee, Curd (Yoghurt).
                    </p>
                  </div>

                  {/* Oreo Strong */}
                  <div className="border-l-2 border-gold/20 pl-4 space-y-1">
                    <h4 className="text-sm font-bold text-[#F6F0E7] uppercase tracking-wider">Oreo Strong</h4>
                    <p className="text-cream/50 text-xs leading-relaxed font-light">
                      Unsalted French Butter (browned to Beurre Noisette), Organic Sugars, Premium Wheat Flour, Premium White Chocolate, Crushed Oreo Biscuits, Sea Salt, Curd (Yoghurt).
                    </p>
                  </div>

                  {/* Bite-Size Chocolate Chip */}
                  <div className="border-l-2 border-gold/20 pl-4 space-y-1">
                    <h4 className="text-sm font-bold text-[#F6F0E7] uppercase tracking-wider">Bite-Size Chocolate Chip</h4>
                    <p className="text-cream/50 text-xs leading-relaxed font-light">
                      Unsalted French Butter, Organic Sugars, Premium Wheat Flour, Van Houten 55% Couverture Dark Chocolate, Sea Salt, Curd (Yoghurt).
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Storage Instructions */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gold/5 pb-3">
                  <Snowflake className="w-5 h-5 text-gold" />
                  <h3 className="text-lg tracking-wider uppercase font-bold text-cream">
                    Storage Guidelines
                  </h3>
                </div>
                <p className="text-cream/60 text-xs leading-relaxed font-light">
                  Cookies are best eaten fresh on Sunday. Store in an airtight container at room temperature for up to 3 days, or freeze for up to 1 month. Warm directly from the freezer at 160°C (320°F) for 4 to 5 minutes.
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
