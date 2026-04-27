"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VegSeal } from "./ui/VegSeal";
import { BatchIndicator } from "./ui/BatchIndicator";

type CookieType = "The Legend" | "The Naughty Nutella" | "The Citrus Cloud";

interface Pack {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  maxCookies: number;
  image: string;
  badge?: string;
}

const COOKIES: { name: CookieType; flavor: string; description: string }[] = [
  { name: "The Legend", flavor: "Classic Choco-Chip", description: "Hand-chopped dark chocolate · Sea salt finish" },
  { name: "The Naughty Nutella", flavor: "Nutella Stuffed", description: "Molten hazelnut core · Creamy Belgian base" },
  { name: "The Citrus Cloud", flavor: "Lemon Crinkle", description: "Zesty organic lemons · Melt-in-your-mouth texture" },
];

const PACKS: Pack[] = [
  {
    id: "3-pack",
    name: "3-Cookie Pack",
    subtitle: "Mix any 3 cookies you love",
    price: 349,
    maxCookies: 3,
    image: "/images/pack1.jpg",
    badge: "BEST STARTER",
  },
  {
    id: "6-pack",
    name: "5+1 Free Pack",
    subtitle: "Choose 5, get 1 The Legend free",
    price: 649,
    maxCookies: 5, // User chooses 5, 1 is auto-added
    image: "/images/pack2.jpg",
    badge: "BEST VALUE",
  },
];

export function PackSection({ onAddToCart }: { onAddToCart: (pack: Pack, selections: Record<string, number>) => void }) {
  const [selections, setSelections] = useState<Record<string, Record<string, number>>>({
    "3-pack": { "The Legend": 0, "The Naughty Nutella": 0, "The Citrus Cloud": 0 },
    "6-pack": { "The Legend": 0, "The Naughty Nutella": 0, "The Citrus Cloud": 0 },
  });

  const getPackTotal = (packId: string) => {
    return Object.values(selections[packId]).reduce((a, b) => a + b, 0);
  };

  const updateQuantity = (packId: string, cookieName: string, delta: number) => {
    const pack = PACKS.find(p => p.id === packId)!;
    const currentTotal = getPackTotal(packId);

    if (delta > 0 && currentTotal >= pack.maxCookies) return;
    if (delta < 0 && selections[packId][cookieName] <= 0) return;

    setSelections(prev => ({
      ...prev,
      [packId]: {
        ...prev[packId],
        [cookieName]: prev[packId][cookieName] + delta,
      }
    }));
  };

  return (
    <section id="menu" className="py-section bg-forest relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-gap-lg">
          <p className="text-gold-muted tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">CHOOSE YOUR PACK</p>
          <h2 className="text-5xl md:text-7xl font-serif text-cream">Pick. Mix. Devour.</h2>
          <p className="text-cream/60 mt-gap-sm font-serif italic text-lg max-w-xl mx-auto leading-relaxed">
            Mix any flavours. Each cookie is baked fresh on your chosen day.
          </p>
          <div className="flex justify-center mt-8">
            <BatchIndicator />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-gap-md max-w-7xl mx-auto">
          {PACKS.map((pack, idx) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="glass-card group overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-80" />
                
                {/* Premium Veg Seal */}
                <VegSeal className="absolute top-6 left-6 z-10" />

                {pack.badge && (
                  <span className="absolute top-6 right-6 bg-tan text-forest text-[9px] font-bold px-4 py-2 rounded-full tracking-[0.2em] uppercase shadow-2xl">
                    {pack.badge}
                  </span>
                )}
              </div>

              <div className="p-8 md:p-12 flex flex-col flex-grow">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-3xl md:text-4xl font-serif text-cream">{pack.name}</h3>
                  <span className="text-tan text-3xl md:text-4xl font-serif">₹{pack.price}</span>
                </div>
                <p className="font-serif-display text-cream/50 text-base mb-gap-md">{pack.subtitle}</p>

                <div className="space-y-6 flex-grow">
                  <div className="flex justify-between items-end border-b border-gold/10 pb-5 mb-5">
                    <p className="text-tan text-[12px] tracking-[0.3em] uppercase font-bold">
                      CHOOSE {pack.maxCookies} COOKIES
                    </p>
                    <p className="text-cream/80 text-[12px] tracking-widest uppercase">
                      Selected: <span className="text-tan font-bold">{getPackTotal(pack.id)} / {pack.maxCookies}</span>
                    </p>
                  </div>

                  {COOKIES.map((cookie) => (
                    <div key={cookie.name} className="flex items-center justify-between py-2 group/row">
                      <div className="max-w-[65%]">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-cream font-medium text-xl group-hover/row:text-tan transition-colors duration-300">
                            {cookie.name}
                          </p>
                          <span className="text-[10px] text-gold/40 font-bold tracking-widest uppercase mt-1">
                            [{cookie.flavor}]
                          </span>
                        </div>
                        <p className="font-serif-display text-cream-dim/40 text-sm italic">
                          {cookie.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(pack.id, cookie.name, -1)}
                          className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold hover:bg-gold/5 transition-all duration-300"
                        >
                          <span className="text-xl mt-[-2px]">&minus;</span>
                        </motion.button>
                        <span className="text-cream font-bold text-base w-4 text-center tabular-nums">
                          {selections[pack.id][cookie.name] || 0}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(pack.id, cookie.name, 1)}
                          disabled={getPackTotal(pack.id) >= pack.maxCookies}
                          className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold hover:bg-gold/5 transition-all duration-300 disabled:opacity-5"
                        >
                          <span className="text-xl mt-[-2px]">+</span>
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Box Builder */}
                <div className="mt-8 pt-8 border-t border-gold/10">
                  <p className="text-[11px] tracking-[0.3em] uppercase font-bold text-gold-muted mb-5 text-center">
                    YOUR BOX PROGRESS
                  </p>
                  <div className="flex justify-center gap-3">
                    {[...Array(pack.id === "6-pack" ? 6 : 3)].map((_, i) => {
                      const filledSlots: string[] = [];
                      Object.entries(selections[pack.id]).forEach(([name, count]) => {
                        for (let j = 0; j < count; j++) filledSlots.push(name);
                      });

                      const isFreeSlot = pack.id === "6-pack" && i === 5;
                      const cookieType = filledSlots[i];

                      return (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={{
                            scale: cookieType || (isFreeSlot && filledSlots.length >= 5) ? 1.1 : 1,
                          backgroundColor: cookieType === "The Legend" ? "#C7A44C" :
                              cookieType === "The Naughty Nutella" ? "#4B3621" :
                                cookieType === "The Citrus Cloud" ? "#FDFD96" :
                                  (isFreeSlot && filledSlots.length >= 5) ? "#C7A44C" : "transparent",
                            boxShadow: cookieType || (isFreeSlot && filledSlots.length >= 5) ? `0 0 15px ${cookieType === "The Legend" ? "rgba(199,164,76,0.3)" :
                                cookieType === "The Naughty Nutella" ? "rgba(75,54,33,0.3)" :
                                  "rgba(253,253,150,0.3)"
                              }` : "none"
                          }}
                          className={`w-8 h-8 rounded-full border ${cookieType || (isFreeSlot && filledSlots.length >= 5) ? "border-transparent" : "border-gold/20"} flex items-center justify-center text-[8px] font-bold`}
                        >
                          {isFreeSlot && filledSlots.length >= 5 && <span className="text-forest">FREE</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const btn = document.getElementById(`add-${pack.id}`);
                    if (btn) {
                      const originalText = btn.innerHTML;
                      btn.innerHTML = "Box Sealed!";
                      btn.style.borderColor = "#C7A44C";
                      setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.borderColor = "";
                      }, 2000);
                    }
                    onAddToCart(pack, selections[pack.id]);
                    setSelections(prev => ({
                      ...prev,
                      [pack.id]: { "The Legend": 0, "The Naughty Nutella": 0, "The Citrus Cloud": 0 }
                    }));
                  }}
                  id={`add-${pack.id}`}
                  disabled={getPackTotal(pack.id) < pack.maxCookies}
                  className="premium-button w-full mt-8 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500"
                >
                  Seal & Add Box
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
