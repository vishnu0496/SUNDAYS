"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PRODUCT_NAMES, PRODUCT_PRICES, NUTELLA_SURCHARGE_PER_COOKIE } from "@/lib/products";
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
  compareAt?: number;
  savings?: string;
  priceNote?: string;
}

interface MiniOption {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  count: number;
  badge: string;
  compareAt?: number;
  savings?: string;
}

interface Combo {
  id: string;
  name: string;
  contents: string;
  price: number;
  compareAt: number;
  savings: string;
  tag: string;
  badge: string;
  regularCookies: number;
  miniBites: number;
  featured?: boolean;
}

const MINI_COOKIE_NAME = "Bite-Size Chocolate Chip";

const COOKIES: { name: CookieType; flavor: string; description: string }[] = [
  { name: "The Legend", flavor: "Classic Choco-Chip", description: "Hand-chopped dark chocolate, sea salt finish" },
  { name: "The Naughty Nutella", flavor: "Nutella Stuffed", description: "Molten hazelnut core, creamy Belgian base" },
];

const PACKS: Pack[] = [
  {
    id: "trio",
    name: PRODUCT_NAMES.trio,
    subtitle: "Mix any 3 cookies you love",
    price: PRODUCT_PRICES.trio,
    maxCookies: 3,
    image: "/images/real-cookie-styled.png",
    badge: "BEST STARTER",
    priceNote: `Nutella +${NUTELLA_SURCHARGE_PER_COOKIE} each`,
  },
  {
    id: "half-dozen",
    name: PRODUCT_NAMES.halfDozen,
    subtitle: "Mix any 6 cookies you love",
    price: PRODUCT_PRICES.halfDozen,
    maxCookies: 6,
    image: "/images/real-cookie-clean.png",
    badge: "BEST VALUE",
    compareAt: PRODUCT_PRICES.trio * 2,
    savings: "Save \u20b9199 vs 2 Trios",
    priceNote: `Nutella +${NUTELLA_SURCHARGE_PER_COOKIE} each`,
  },
];

const MINI_OPTIONS: MiniOption[] = [
  {
    id: "12-mini-bites",
    name: PRODUCT_NAMES.mini12,
    subtitle: "Classic Sundays chocolate chip, baked bite-sized for sharing.",
    price: PRODUCT_PRICES.mini12,
    count: 12,
    badge: "CHIP MINIS",
  },
  {
    id: "24-mini-bites",
    name: PRODUCT_NAMES.mini24,
    subtitle: "A bigger box of bite-size chocolate chip cookies for gifting and parties.",
    price: PRODUCT_PRICES.mini24,
    count: 24,
    badge: "BEST VALUE",
    compareAt: PRODUCT_PRICES.mini12 * 2,
    savings: "Save \u20b9139 vs 2x12 packs",
  },
];

const COMBOS: Combo[] = [
  {
    id: "sunday-starter",
    name: PRODUCT_NAMES.starter,
    contents: "3 regular cookies + 12 mini bites",
    price: PRODUCT_PRICES.starter,
    compareAt: PRODUCT_PRICES.trio + PRODUCT_PRICES.mini12,
    savings: "Save \u20b969",
    tag: "Perfect first order",
    badge: "STARTER",
    regularCookies: 3,
    miniBites: 12,
  },
  {
    id: "full-sunday",
    name: PRODUCT_NAMES.fullSunday,
    contents: "6 regular cookies + 24 mini bites",
    price: PRODUCT_PRICES.fullSunday,
    compareAt: PRODUCT_PRICES.halfDozen + PRODUCT_PRICES.mini24,
    savings: "Save \u20b999",
    tag: "Best Deal - Free delivery included",
    badge: "BEST DEAL",
    regularCookies: 6,
    miniBites: 24,
    featured: true,
  },
  {
    id: "gift-box",
    name: PRODUCT_NAMES.giftBox,
    contents: "6 regular cookies + 12 mini bites",
    price: PRODUCT_PRICES.giftBox,
    compareAt: PRODUCT_PRICES.halfDozen + PRODUCT_PRICES.mini12,
    savings: "Save \u20b969",
    tag: "Perfect for gifting",
    badge: "GIFT BOX",
    regularCookies: 6,
    miniBites: 12,
  },
];

const EMPTY_COOKIE_SELECTION: Record<CookieType, number> = {
  "The Legend": 0,
  "The Naughty Nutella": 0,
};

const EMPTY_SELECTIONS: Record<string, Record<CookieType, number>> = PACKS.reduce(
  (acc, pack) => ({ ...acc, [pack.id]: { ...EMPTY_COOKIE_SELECTION } }),
  {} as Record<string, Record<CookieType, number>>
);

const EMPTY_COMBO_SELECTIONS: Record<string, Record<CookieType, number>> = COMBOS.reduce(
  (acc, combo) => ({ ...acc, [combo.id]: { ...EMPTY_COOKIE_SELECTION } }),
  {} as Record<string, Record<CookieType, number>>
);

function getSelectionTotal(selection: Record<CookieType, number>) {
  return Object.values(selection).reduce((a, b) => a + b, 0);
}

function getNutellaSurcharge(selection: Record<CookieType, number>) {
  return (selection["The Naughty Nutella"] || 0) * NUTELLA_SURCHARGE_PER_COOKIE;
}

function getActiveSelections(selection: Record<CookieType, number>, miniBites = 0) {
  const entries: [string, number][] = Object.entries(selection).filter(([, count]) => count > 0);

  if (miniBites > 0) {
    entries.push([MINI_COOKIE_NAME, miniBites]);
  }

  return Object.fromEntries(entries);
}

export function PackSection({ onAddToCart }: { onAddToCart: (pack: Pack, selections: Record<string, number>) => void }) {
  const [selections, setSelections] = useState<Record<string, Record<CookieType, number>>>(EMPTY_SELECTIONS);
  const [comboSelections, setComboSelections] = useState<Record<string, Record<CookieType, number>>>(EMPTY_COMBO_SELECTIONS);

  const updatePackQuantity = (packId: string, cookieName: CookieType, delta: number) => {
    const pack = PACKS.find((p) => p.id === packId);
    if (!pack) return;

    const current = selections[packId];
    const currentTotal = getSelectionTotal(current);

    if (delta > 0 && currentTotal >= pack.maxCookies) return;
    if (delta < 0 && current[cookieName] <= 0) return;

    setSelections((prev) => ({
      ...prev,
      [packId]: {
        ...prev[packId],
        [cookieName]: prev[packId][cookieName] + delta,
      },
    }));
  };

  const updateComboQuantity = (comboId: string, cookieName: CookieType, delta: number) => {
    const combo = COMBOS.find((item) => item.id === comboId);
    if (!combo) return;

    const current = comboSelections[comboId];
    const currentTotal = getSelectionTotal(current);

    if (delta > 0 && currentTotal >= combo.regularCookies) return;
    if (delta < 0 && current[cookieName] <= 0) return;

    setComboSelections((prev) => ({
      ...prev,
      [comboId]: {
        ...prev[comboId],
        [cookieName]: prev[comboId][cookieName] + delta,
      },
    }));
  };

  const resetPack = (packId: string) => {
    setSelections((prev) => ({
      ...prev,
      [packId]: { ...EMPTY_COOKIE_SELECTION },
    }));
  };

  const resetCombo = (comboId: string) => {
    setComboSelections((prev) => ({
      ...prev,
      [comboId]: { ...EMPTY_COOKIE_SELECTION },
    }));
  };

  const addRegularPack = (pack: Pack) => {
    const selected = selections[pack.id];
    const surcharge = getNutellaSurcharge(selected);

    onAddToCart(
      { ...pack, price: pack.price + surcharge },
      getActiveSelections(selected)
    );
    resetPack(pack.id);
  };

  const addCombo = (combo: Combo) => {
    const selected = comboSelections[combo.id];
    const surcharge = getNutellaSurcharge(selected);

    onAddToCart(
      {
        id: combo.id,
        name: combo.name,
        subtitle: combo.contents,
        price: combo.price + surcharge,
        maxCookies: combo.regularCookies + combo.miniBites,
        image: "/images/mini-chocolate-chip-bites.png",
        badge: combo.badge,
      },
      getActiveSelections(selected, combo.miniBites)
    );
    resetCombo(combo.id);
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
      { [MINI_COOKIE_NAME]: option.count }
    );
  };

  return (
    <section id="menu" className="py-20 md:py-24 bg-forest relative overflow-hidden">
      <div className="container mx-auto px-5 md:px-6">
        <div className="text-center mb-12 md:mb-14">
          <p className="text-gold-muted tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">CHOOSE YOUR PACK</p>
          <h2 className="text-5xl md:text-7xl font-serif text-cream">Pick. Mix. Devour.</h2>
          <p className="text-cream/60 mt-gap-sm font-serif italic text-lg max-w-xl mx-auto leading-relaxed">
            Choose your big-cookie mix, or add bite-size chocolate chip boxes for sharing and gifting.
          </p>
          <div className="flex justify-center mt-7">
            <BatchIndicator />
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-8 md:mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px flex-1 bg-gold/15" />
            <p className="text-tan text-[11px] tracking-[0.35em] uppercase font-bold">Combos</p>
            <span className="h-px flex-1 bg-gold/15" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
            {COMBOS.map((combo, idx) => {
              const selected = comboSelections[combo.id];
              const selectedCount = getSelectionTotal(selected);
              const surcharge = getNutellaSurcharge(selected);
              const isComplete = selectedCount === combo.regularCookies;

              return (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.12 }}
                  className={`rounded-[8px] border bg-white/[0.03] p-5 lg:p-5 flex flex-col ${
                    combo.featured
                      ? "border-tan/70 shadow-[0_0_35px_rgba(199,164,76,0.16)]"
                      : "border-gold/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="bg-tan text-forest text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] uppercase">
                      {combo.badge}
                    </span>
                    <span className="text-tan text-[11px] tracking-widest uppercase font-bold">{combo.savings}</span>
                  </div>

                  <h3 className="text-[1.75rem] lg:text-[2rem] font-serif text-cream leading-tight">{combo.name}</h3>
                  <p className="font-serif-display text-cream/50 italic mt-2">{combo.contents}</p>
                  <p className="text-tan/80 text-[11px] tracking-[0.18em] uppercase font-bold mt-3">{combo.tag}</p>

                  <div className="flex items-end justify-between gap-3 py-5 my-5 border-y border-gold/10">
                    <div>
                      <p className="text-cream/35 text-[10px] tracking-widest uppercase">Worth</p>
                      <p className="text-cream/45 text-lg font-serif line-through">&#8377;{combo.compareAt + surcharge}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cream/35 text-[10px] tracking-widest uppercase">Now</p>
                      <p className="text-tan text-[2.15rem] lg:text-[2.35rem] font-serif">&#8377;{combo.price + surcharge}</p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow">
                    <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase font-bold text-gold-muted">
                      <span>Choose {combo.regularCookies}</span>
                      <span>{selectedCount}/{combo.regularCookies}</span>
                    </div>
                    {COOKIES.map((cookie) => (
                      <div key={cookie.name} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-cream text-[15px] font-medium">{cookie.name}</p>
                          <p className="text-cream/35 text-[10px] tracking-widest uppercase">{cookie.flavor}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateComboQuantity(combo.id, cookie.name, -1)}
                            className="w-8 h-8 rounded-full border border-gold/15 text-gold/50 hover:text-gold hover:border-gold transition-colors"
                            aria-label={`Remove ${cookie.name}`}
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-cream font-bold tabular-nums">{selected[cookie.name]}</span>
                          <button
                            onClick={() => updateComboQuantity(combo.id, cookie.name, 1)}
                            disabled={selectedCount >= combo.regularCookies}
                            className="w-8 h-8 rounded-full border border-gold/15 text-gold/50 hover:text-gold hover:border-gold transition-colors disabled:opacity-20"
                            aria-label={`Add ${cookie.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <p className="text-cream/35 text-xs font-serif italic pt-1">
                      Includes {combo.miniBites} chocolate chip mini bites. Nutella +&#8377;{NUTELLA_SURCHARGE_PER_COOKIE} each.
                    </p>
                  </div>

                  <button
                    onClick={() => addCombo(combo)}
                    disabled={!isComplete}
                  className="premium-button w-full mt-5 disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    Add Combo
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {PACKS.map((pack, idx) => {
            const selected = selections[pack.id];
            const selectedCount = getSelectionTotal(selected);
            const surcharge = getNutellaSurcharge(selected);

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: idx * 0.16 }}
                className="glass-card group overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] lg:aspect-[16/7.5] overflow-hidden">
                  <img
                    src={pack.image}
                    alt={pack.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-80" />

                  <VegSeal className="absolute top-5 left-5 z-10" />

                  {pack.badge && (
                    <span className="absolute top-5 right-5 bg-tan text-forest text-[9px] font-bold px-4 py-2 rounded-full tracking-[0.2em] uppercase shadow-2xl">
                      {pack.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-7 lg:p-7 flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h3 className="text-[1.9rem] lg:text-[2rem] font-serif text-cream leading-tight">{pack.name}</h3>
                      {pack.savings && (
                        <p className="text-tan text-[11px] tracking-widest uppercase font-bold mt-2">{pack.savings}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {pack.compareAt && (
                        <p className="text-cream/35 text-base font-serif line-through">&#8377;{pack.compareAt + surcharge}</p>
                      )}
                      <span className="text-tan text-[2rem] lg:text-[2.1rem] font-serif">&#8377;{pack.price + surcharge}</span>
                    </div>
                  </div>
                  <p className="font-serif-display text-cream/50 text-[15px] mb-5">{pack.subtitle}</p>

                  <div className="space-y-4 flex-grow">
                    <div className="flex justify-between items-end border-b border-gold/10 pb-4 mb-4">
                      <p className="text-tan text-[11px] tracking-[0.3em] uppercase font-bold">
                        CHOOSE {pack.maxCookies} COOKIES
                      </p>
                      <p className="text-cream/80 text-[11px] tracking-widest uppercase">
                        <span className="text-tan font-bold">{selectedCount} / {pack.maxCookies}</span>
                      </p>
                    </div>

                    {COOKIES.map((cookie) => (
                      <div key={cookie.name} className="flex items-center justify-between py-0.5 group/row">
                        <div className="max-w-[64%]">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-cream font-medium text-base group-hover/row:text-tan transition-colors duration-300">
                              {cookie.name}
                            </p>
                            <span className="text-[9px] text-gold/40 font-bold tracking-widest uppercase">
                              [{cookie.flavor}]
                            </span>
                          </div>
                          <p className="font-serif-display text-cream-dim/40 text-sm italic">
                            {cookie.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePackQuantity(pack.id, cookie.name, -1)}
                            className="w-8 h-8 rounded-full border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold hover:bg-gold/5 transition-all duration-300"
                            aria-label={`Remove ${cookie.name}`}
                          >
                            -
                          </motion.button>
                          <span className="text-cream font-bold text-base w-4 text-center tabular-nums">
                            {selected[cookie.name] || 0}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePackQuantity(pack.id, cookie.name, 1)}
                            disabled={selectedCount >= pack.maxCookies}
                            className="w-8 h-8 rounded-full border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold hover:bg-gold/5 transition-all duration-300 disabled:opacity-10"
                            aria-label={`Add ${cookie.name}`}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-5 border-t border-gold/10">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gold-muted">
                        Box Progress
                      </p>
                      <p className="text-cream/35 text-xs font-serif italic">{pack.priceNote}</p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[...Array(pack.maxCookies)].map((_, i) => {
                        const filledSlots: string[] = [];
                        Object.entries(selected).forEach(([name, count]) => {
                          for (let j = 0; j < count; j++) filledSlots.push(name);
                        });

                        const cookieType = filledSlots[i];

                        return (
                          <motion.div
                            key={i}
                            initial={false}
                            animate={{
                              scale: cookieType ? 1.08 : 1,
                              backgroundColor:
                                cookieType === "The Legend"
                                  ? "#C7A44C"
                                  : cookieType === "The Naughty Nutella"
                                    ? "#4B3621"
                                    : "transparent",
                            }}
                            className={`w-7 h-7 rounded-full border ${
                              cookieType ? "border-transparent" : "border-gold/20"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addRegularPack(pack)}
                    disabled={selectedCount < pack.maxCookies}
                    className="premium-button w-full mt-6 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500"
                  >
                    Seal & Add Box
                  </motion.button>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.32 }}
            className="glass-card group overflow-hidden flex flex-col lg:col-span-2"
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[280px] lg:min-h-[300px] overflow-hidden">
                <img
                  src="/images/mini-chocolate-chip-bites.png"
                  alt="Bite-size chocolate chip cookies"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-forest/90 via-forest/20 to-transparent opacity-90" />
                <VegSeal className="absolute top-5 left-5 z-10" />
                <span className="absolute top-5 right-5 bg-tan text-forest text-[9px] font-bold px-4 py-2 rounded-full tracking-[0.2em] uppercase shadow-2xl">
                  CHIP MINIS
                </span>
              </div>

              <div className="p-6 md:p-7 lg:p-7 flex flex-col justify-center">
                <p className="text-tan text-[11px] tracking-[0.3em] uppercase font-bold mb-3">
                  Chocolate chip only
                </p>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-3xl md:text-[2.4rem] font-serif text-cream">Bite-Size Chocolate Chip</h3>
                    <p className="font-serif-display text-cream/50 text-base mt-2 max-w-2xl">
                      No stuffing, just classic Sundays chocolate chip baked bite-sized for sharing.
                    </p>
                    <p className="text-tan/75 text-[11px] tracking-[0.18em] uppercase font-bold mt-3">
                      Standalone mini boxes are Zone 1 only
                    </p>
                  </div>
                  <span className="text-tan text-2xl md:text-3xl font-serif whitespace-nowrap">From &#8377;269</span>
                </div>

                <div className="mt-5 space-y-4">
                  {MINI_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-[8px] border border-gold/10 bg-white/[0.03] p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-[1.7rem] md:text-[1.9rem] font-serif text-cream">{option.name}</h4>
                          <span className="bg-tan/10 text-tan text-[9px] font-bold px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                            {option.badge}
                          </span>
                        </div>
                        <p className="font-serif-display text-cream/45 italic">{option.subtitle}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-cream/50 text-[12px] tracking-widest uppercase">
                          <span>Included: <span className="text-tan font-bold">{option.count} cookies</span></span>
                          {option.savings && <span className="text-tan font-bold">{option.savings}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="text-right">
                          {option.compareAt && (
                            <p className="text-cream/35 text-lg font-serif line-through">&#8377;{option.compareAt}</p>
                          )}
                          <span className="text-tan text-[2rem] md:text-[2.2rem] font-serif">&#8377;{option.price}</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => addMiniBox(option)}
                          className="premium-button min-w-[140px] py-4 px-5 flex items-center justify-center gap-2"
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

        <div className="max-w-5xl mx-auto mt-8 rounded-[8px] border border-gold/10 bg-white/[0.03] p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-tan text-[11px] tracking-[0.35em] uppercase font-bold mb-2">Delivery Info</p>
              <p className="font-serif-display text-cream/50 italic">
                Delivery is calculated by Hyderabad pincode at checkout.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                ["Zone 1", "₹49", "No min."],
                ["Zone 2", "₹99", "₹399 min."],
                ["Zone 3", "₹149", "₹599 min."],
                ["Free", "₹899+", "Any zone"],
              ].map(([zone, fee, min]) => (
                <div key={zone} className="rounded-[8px] border border-gold/10 bg-forest/40 px-4 py-3">
                  <p className="text-cream font-bold">{zone}</p>
                  <p className="text-tan font-serif text-xl">{fee}</p>
                  <p className="text-cream/40 text-xs uppercase tracking-widest">{min}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
