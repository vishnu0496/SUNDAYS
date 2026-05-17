"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VegSeal } from "./ui/VegSeal";
import { BatchIndicator } from "./ui/BatchIndicator";

type CookieType = "The Legend" | "The Naughty Nutella" | "Bite-Size Chocolate Chip";

interface Pack {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  maxCookies: number;
  image: string;
  badge?: string;
  fixedSelections?: Record<string, number>;
  fixedDescription?: string;
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
  {
    id: "12-mini-pack",
    name: "12 Bite-Size Box",
    subtitle: "Snack-size chocolate chip cookies for easy sharing",
    price: 219,
    maxCookies: 12,
    image: "/images/mini-chocolate-chip-bites.png",
    badge: "CHIP MINIS",
    fixedSelections: { "Bite-Size Chocolate Chip": 12 },
    fixedDescription: "Classic Sundays chocolate chip, baked bite-sized for sharing, gifting, and late-night snacking.",
  },
  {
    id: "24-mini-pack",
    name: "24 Bite-Size Box",
    subtitle: "A bigger bite-size chocolate chip box",
    price: 399,
    maxCookies: 24,
    image: "/images/mini-chocolate-chip-bites.png",
    badge: "PARTY BOX",
    fixedSelections: { "Bite-Size Chocolate Chip": 24 },
    fixedDescription: "A bigger box of bite-size chocolate chip cookies for gifting, parties, and serious snacking.",
  },
];

const EMPTY_SELECTIONS: Record<string, Partial<Record<CookieType, number>>> = {
  "3-pack": { "The Legend": 0, "The Naughty Nutella": 0 },
  "6-pack": { "The Legend": 0, "The Naughty Nutella": 0 },
  "12-mini-pack": { "The Legend": 0, "The Naughty Nutella": 0, "Bite-Size Chocolate Chip": 0 },
  "24-mini-pack": { "The Legend": 0, "The Naughty Nutella": 0, "Bite-Size Chocolate Chip": 0 },
};

export function PackSection({ onAddToCart }: { onAddToCart: (pack: Pack, selections: Record<string, number>) => void }) {
  const [selections, setSelections] = useState<Record<string, Partial<Record<CookieType, number>>>>(EMPTY_SELECTIONS);

  const getPackTotal = (packId: string) => {
    const pack = PACKS.find((p) => p.id === packId);
    if (pack?.fixedSelections) {
      return Object.values(pack.fixedSelections).reduce((a, b) => a + b, 0);
    }
    return Object.values(selections[packId]).reduce((a, b) => a + b, 0);
  };

  const updateQuantity = (packId: string, cookieName: CookieType, delta: number) => {
    const pack = PACKS.find((p) => p.id === packId)!;
    if (pack.fixedSelections) return;
    const currentTotal = getPackTotal(packId);

    if (delta > 0 && currentTotal >= pack.maxCookies) return;
    if (delta < 0 && selections[packId][cookieName] <= 0) return;

    setSelections((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId],
        [cookieName]: (prev[packId][cookieName] || 0) + delta,
      },
    }));
  };

  const resetPack = (packId: string) => {
    setSelections((prev) => ({
      ...prev,
      [packId]: { "The Legend": 0, "The Naughty Nutella": 0 },
    }));
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

                {pack.fixedSelections ? (
                  <div className="flex-grow rounded-[8px] border border-gold/10 bg-white/[0.03] p-6">
                    <p className="text-tan text-[12px] tracking-[0.3em] uppercase font-bold mb-4">
                      Chocolate chip only
                    </p>
                    <h4 className="text-2xl font-serif text-cream mb-3">Bite-Size Chocolate Chip</h4>
                    <p className="font-serif-display text-cream/50 text-base italic leading-relaxed">
                      {pack.fixedDescription}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-gold/10 pt-5">
                      <span className="text-cream/60 text-[12px] tracking-widest uppercase">Included</span>
                      <span className="text-tan font-bold">{pack.maxCookies} cookies</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6 flex-grow">
                      <div className="flex justify-between items-end border-b border-gold/10 pb-5 mb-5">
                        <p className="text-tan text-[12px] tracking-[0.3em] uppercase font-bold">
                          CHOOSE {pack.maxCookies} COOKIES
                        </p>
                        <p className="text-cream/80 text-[12px] tracking-widest uppercase">
                          Selected: <span className="text-tan font-bold">{getPackTotal(pack.id)} / {pack.maxCookies}</span>
                        </p>
                      </div>

                      {COOKIES.filter((cookie) => cookie.name !== "Bite-Size Chocolate Chip").map((cookie) => (
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
                  </>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const chosenSelections =
                      pack.fixedSelections ||
                      Object.fromEntries(
                        Object.entries(selections[pack.id]).filter(([, count]) => (count || 0) > 0)
                      );
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
                    onAddToCart(pack, chosenSelections);
                    if (!pack.fixedSelections) resetPack(pack.id);
                  }}
                  id={`add-${pack.id}`}
                  disabled={!pack.fixedSelections && getPackTotal(pack.id) < pack.maxCookies}
                  className="premium-button w-full mt-8 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500"
                >
                  {pack.fixedSelections ? "Add Bite-Size Box" : "Seal & Add Box"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
