"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VegSeal } from "./ui/VegSeal";
import { BatchIndicator } from "./ui/BatchIndicator";

type CookieType = "The Legend" | "The Naughty Nutella";

interface Pack {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  maxCookies: number;
  image: string;
  badge?: string;
}

interface MiniOption {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  count: number;
  badge: string;
}

const COOKIES: { name: CookieType; flavor: string; description: string }[] = [
  { name: "The Legend", flavor: "Classic Choco-Chip", description: "Hand-chopped dark chocolate, sea salt finish" },
  { name: "The Naughty Nutella", flavor: "Nutella Stuffed", description: "Molten hazelnut core, creamy Belgian base" },
];

const PACKS: Pack[] = [
  {
    id: "3-pack",
    name: "3-Cookie Pack",
    subtitle: "Mix any 3 cookies you love",
    price: 349,
    maxCookies: 3,
    image: "/images/real-cookie-styled.png",
    badge: "BEST STARTER",
  },
  {
    id: "6-pack",
    name: "6-Cookie Pack",
    subtitle: "Mix any 6 cookies you love",
    price: 599,
    maxCookies: 6,
    image: "/images/real-cookie-clean.png",
    badge: "BEST VALUE",
  },
];

const MINI_OPTIONS: MiniOption[] = [
  {
    id: "12-mini-pack",
    name: "12 Bite-Size Box",
    subtitle: "Snack-size chocolate chip cookies for easy sharing",
    price: 219,
    count: 12,
    badge: "CHIP MINIS",
  },
  {
    id: "24-mini-pack",
    name: "24 Bite-Size Box",
    subtitle: "A bigger bite-size chocolate chip box",
    price: 399,
    count: 24,
    badge: "PARTY BOX",
  },
];

const EMPTY_SELECTIONS: Record<string, Record<CookieType, number>> = {
  "3-pack": { "The Legend": 0, "The Naughty Nutella": 0 },
  "6-pack": { "The Legend": 0, "The Naughty Nutella": 0 },
};

export function PackSection({ onAddToCart }: { onAddToCart: (pack: Pack, selections: Record<string, number>) => void }) {
  const [selections, setSelections] = useState<Record<string, Record<CookieType, number>>>(EMPTY_SELECTIONS);

  const getPackTotal = (packId: string) => {
    return Object.values(selections[packId]).reduce((a, b) => a + b, 0);
  };

  const updateQuantity = (packId: string, cookieName: CookieType, delta: number) => {
    const pack = PACKS.find((p) => p.id === packId)!;
    const currentTotal = getPackTotal(packId);

    if (delta > 0 && currentTotal >= pack.maxCookies) return;
    if (delta < 0 && selections[packId][cookieName] <= 0) return;

    setSelections((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId],
        [cookieName]: prev[packId][cookieName] + delta,
      },
    }));
  };

  const resetPack = (packId: string) => {
    setSelections((prev) => ({
      ...prev,
      [packId]: { "The Legend": 0, "The Naughty Nutella": 0 },
    }));
  };

  const addMiniBox = (option: MiniOption) => {
    onAddToCart(
      {
        id: option.id,
        name: option.name,
        subtitle: option.subtitle,
        price: option.price,
        maxCookies: option.count,
        image: "/images/mini-chocolate-chip-bites.png",
        badge: option.badge,
      },
      { "Bite-Size Chocolate Chip": option.count }
    );
  };

  return (
    <section id="menu" className="py-section bg-forest relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-gap-lg">
          <p className="text-gold-muted tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">CHOOSE YOUR PACK</p>
          <h2 className="text-5xl md:text-7xl font-serif text-cream">Pick. Mix. Devour.</h2>
          <p className="text-cream/60 mt-gap-sm font-serif italic text-lg max-w-xl mx-auto leading-relaxed">
            Choose your big-cookie mix, or add bite-size chocolate chip boxes for sharing and gifting.
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
                  <span className="text-tan text-3xl md:text-4xl font-serif">&#8377;{pack.price}</span>
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

                <div className="mt-8 pt-8 border-t border-gold/10">
                  <p className="text-[11px] tracking-[0.3em] uppercase font-bold text-gold-muted mb-5 text-center">
                    YOUR BOX PROGRESS
                  </p>
                  <div className="flex justify-center gap-3">
                    {[...Array(pack.maxCookies)].map((_, i) => {
                      const filledSlots: string[] = [];
                      Object.entries(selections[pack.id]).forEach(([name, count]) => {
                        for (let j = 0; j < count; j++) filledSlots.push(name);
                      });

                      const cookieType = filledSlots[i];

                      return (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={{
                            scale: cookieType ? 1.1 : 1,
                            backgroundColor:
                              cookieType === "The Legend"
                                ? "#C7A44C"
                                : cookieType === "The Naughty Nutella"
                                  ? "#4B3621"
                                  : "transparent",
                            boxShadow: cookieType
                              ? `0 0 15px ${
                                  cookieType === "The Legend" ? "rgba(199,164,76,0.3)" : "rgba(75,54,33,0.3)"
                                }`
                              : "none",
                          }}
                          className={`w-8 h-8 rounded-full border ${
                            cookieType ? "border-transparent" : "border-gold/20"
                          }`}
                        />
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
                    onAddToCart(
                      pack,
                      Object.fromEntries(Object.entries(selections[pack.id]).filter(([, count]) => count > 0))
                    );
                    resetPack(pack.id);
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

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card group overflow-hidden flex flex-col lg:col-span-2"
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[340px] overflow-hidden">
                <img
                  src="/images/mini-chocolate-chip-bites.png"
                  alt="Bite-size chocolate chip cookies"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-forest/90 via-forest/20 to-transparent opacity-90" />
                <VegSeal className="absolute top-6 left-6 z-10" />
                <span className="absolute top-6 right-6 bg-tan text-forest text-[9px] font-bold px-4 py-2 rounded-full tracking-[0.2em] uppercase shadow-2xl">
                  CHIP MINIS
                </span>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-tan text-[12px] tracking-[0.3em] uppercase font-bold mb-4">
                  Chocolate chip only
                </p>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-serif text-cream">Bite-Size Chocolate Chip</h3>
                    <p className="font-serif-display text-cream/50 text-base mt-3 max-w-2xl">
                      Classic Sundays chocolate chip, baked bite-sized for easy sharing.
                    </p>
                  </div>
                  <span className="text-tan text-2xl md:text-3xl font-serif whitespace-nowrap">From &#8377;219</span>
                </div>

                <div className="mt-6 space-y-4">
                  {MINI_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-[8px] border border-gold/10 bg-white/[0.03] p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-2xl md:text-3xl font-serif text-cream">{option.name}</h4>
                          <span className="bg-tan/10 text-tan text-[9px] font-bold px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                            {option.badge}
                          </span>
                        </div>
                        <p className="font-serif-display text-cream/45 italic">{option.subtitle}</p>
                        <p className="text-cream/50 text-[12px] tracking-widest uppercase mt-3">
                          Included: <span className="text-tan font-bold">{option.count} cookies</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <span className="text-tan text-3xl md:text-4xl font-serif">&#8377;{option.price}</span>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => addMiniBox(option)}
                          className="premium-button min-w-[150px] py-4 px-5 flex items-center justify-center gap-2"
                        >
                          <span className="text-lg leading-none">+</span>
                          Add Box
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
