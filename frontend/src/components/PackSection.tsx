"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PRODUCT_NAMES, PRODUCT_PRICES, getAttaJaggeryBiteUpgrade } from "@/lib/products";
import { VegSeal } from "./ui/VegSeal";
import { BatchIndicator } from "./ui/BatchIndicator";

type CookieType = "Double Chocolate" | "Oreo Strong";
type ComboBiteChoice = "chocolate" | "atta";

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

interface BiteOption {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  count: number;
  badge: string;
  compareAt?: number;
  savings?: string;
}

interface BiteCollection {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  selectionName: string;
  options: BiteOption[];
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
  allowBiteChoice?: boolean;
  featured?: boolean;
}

const CHOCOLATE_BITE_NAME = "Chocolate Chip Bites";
const ATTA_JAGGERY_BITE_NAME = "Atta Jaggery Almond Bites";

const COOKIES: { name: CookieType; flavor: string; description: string }[] = [
  { name: "Double Chocolate", flavor: "Dark Chocolate", description: "Double chocolate chunks, brown sugar dough, sea salt finish" },
  { name: "Oreo Strong", flavor: "Oreo + White Chocolate", description: "Crushed Oreo, creamy white chocolate, soft bakery center" },
];

const PACKS: Pack[] = [
  {
    id: "trio",
    name: PRODUCT_NAMES.trio,
    subtitle: "Mix any 3 cookies you love",
    price: PRODUCT_PRICES.trio,
    maxCookies: 3,
    image: "/images/double-chocolate.png",
    badge: "BEST STARTER",
    priceNote: "Mix Double Chocolate and Oreo Strong",
  },
  {
    id: "half-dozen",
    name: PRODUCT_NAMES.halfDozen,
    subtitle: "Mix any 6 cookies you love",
    price: PRODUCT_PRICES.halfDozen,
    maxCookies: 6,
    image: "/images/oreo-strong.png",
    badge: "BEST VALUE",
    compareAt: PRODUCT_PRICES.trio * 2,
    savings: "Save \u20b9199 vs 2 Trios",
    priceNote: "Mix Double Chocolate and Oreo Strong",
  },
];

const BITE_COLLECTIONS: BiteCollection[] = [
  {
    id: "chocolate-chip-bites",
    title: "Chocolate Chip Bites",
    eyebrow: "Classic chocolate chip",
    description: "Classic chocolate chip cookies, baked for sharing.",
    image: "/images/mini-chocolate-chip-bites.png",
    selectionName: CHOCOLATE_BITE_NAME,
    options: [
      {
        id: "12-chocolate-chip-bites",
        name: PRODUCT_NAMES.mini12,
        subtitle: "12 bites box",
        price: PRODUCT_PRICES.mini12,
        count: 12,
        badge: "12 BITES",
      },
      {
        id: "24-chocolate-chip-bites",
        name: PRODUCT_NAMES.mini24,
        subtitle: "24 bites box",
        price: PRODUCT_PRICES.mini24,
        count: 24,
        badge: "BEST VALUE",
        compareAt: PRODUCT_PRICES.mini12 * 2,
        savings: "Save \u20b9149",
      },
    ],
  },
  {
    id: "atta-jaggery-almond-bites",
    title: "Atta Jaggery Almond Bites",
    eyebrow: "Whole wheat + jaggery",
    description: "Whole wheat cookies with jaggery, almonds, coconut and warm spices.",
    image: "/images/little-rebels.png",
    selectionName: "Atta Jaggery Almond Bites",
    options: [
      {
        id: "12-atta-jaggery-almond-bites",
        name: PRODUCT_NAMES.attaJaggery12,
        subtitle: "12 bites box",
        price: PRODUCT_PRICES.attaJaggery12,
        count: 12,
        badge: "12 BITES",
      },
      {
        id: "24-atta-jaggery-almond-bites",
        name: PRODUCT_NAMES.attaJaggery24,
        subtitle: "24 bites box",
        price: PRODUCT_PRICES.attaJaggery24,
        count: 24,
        badge: "BEST VALUE",
        compareAt: PRODUCT_PRICES.attaJaggery12 * 2,
        savings: "Save \u20b999",
      },
    ],
  },
];

const COMBOS: Combo[] = [
  {
    id: "sunday-starter",
    name: PRODUCT_NAMES.starter,
    contents: "3 big cookies + 12 bites",
    price: PRODUCT_PRICES.starter,
    compareAt: PRODUCT_PRICES.trio + PRODUCT_PRICES.mini12,
    savings: "Save \u20b999",
    tag: "Perfect first order",
    badge: "STARTER",
    regularCookies: 3,
    miniBites: 12,
    allowBiteChoice: true,
  },
  {
    id: "gift-box",
    name: PRODUCT_NAMES.giftBox,
    contents: "6 big cookies + 12 bites",
    price: PRODUCT_PRICES.giftBox,
    compareAt: PRODUCT_PRICES.halfDozen + PRODUCT_PRICES.mini12,
    savings: "Save \u20b999",
    tag: "Perfect for gifting",
    badge: "GIFT BOX",
    regularCookies: 6,
    miniBites: 12,
    allowBiteChoice: true,
  },
  {
    id: "full-sunday",
    name: PRODUCT_NAMES.fullSunday,
    contents: "6 big cookies + 24 Chocolate Chip Bites",
    price: PRODUCT_PRICES.fullSunday,
    compareAt: PRODUCT_PRICES.halfDozen + PRODUCT_PRICES.mini24,
    savings: "Save \u20b9149",
    tag: "Best Deal - biggest Sunday box",
    badge: "BEST DEAL",
    regularCookies: 6,
    miniBites: 24,
    allowBiteChoice: true,
    featured: true,
  },
];

const EMPTY_COOKIE_SELECTION: Record<CookieType, number> = {
  "Double Chocolate": 0,
  "Oreo Strong": 0,
};

const EMPTY_SELECTIONS: Record<string, Record<CookieType, number>> = PACKS.reduce(
  (acc, pack) => ({ ...acc, [pack.id]: { ...EMPTY_COOKIE_SELECTION } }),
  {} as Record<string, Record<CookieType, number>>
);

const EMPTY_COMBO_SELECTIONS: Record<string, Record<CookieType, number>> = COMBOS.reduce(
  (acc, combo) => ({ ...acc, [combo.id]: { ...EMPTY_COOKIE_SELECTION } }),
  {} as Record<string, Record<CookieType, number>>
);

const EMPTY_COMBO_BITE_CHOICES: Record<string, ComboBiteChoice> = COMBOS.reduce(
  (acc, combo) => ({ ...acc, [combo.id]: "chocolate" }),
  {} as Record<string, ComboBiteChoice>
);

function getSelectionTotal(selection: Record<CookieType, number>) {
  return Object.values(selection).reduce((a, b) => a + b, 0);
}

function getActiveSelections(selection: Record<CookieType, number>, biteName = CHOCOLATE_BITE_NAME, miniBites = 0) {
  const entries: [string, number][] = Object.entries(selection).filter(([, count]) => count > 0);

  if (miniBites > 0) {
    entries.push([biteName, miniBites]);
  }

  return Object.fromEntries(entries);
}

export function PackSection({ onAddToCart }: { onAddToCart: (pack: Pack, selections: Record<string, number>) => void }) {
  const [selections, setSelections] = useState<Record<string, Record<CookieType, number>>>(EMPTY_SELECTIONS);
  const [comboSelections, setComboSelections] = useState<Record<string, Record<CookieType, number>>>(EMPTY_COMBO_SELECTIONS);
  const [comboBiteChoices, setComboBiteChoices] = useState<Record<string, ComboBiteChoice>>(EMPTY_COMBO_BITE_CHOICES);

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
    setComboBiteChoices((prev) => ({
      ...prev,
      [comboId]: "chocolate",
    }));
  };

  const addRegularPack = (pack: Pack) => {
    const selected = selections[pack.id];

    onAddToCart(
      pack,
      getActiveSelections(selected)
    );
    resetPack(pack.id);
  };

  const addCombo = (combo: Combo) => {
    const selected = comboSelections[combo.id];
    const biteChoice = comboBiteChoices[combo.id] || "chocolate";
    const attaJaggeryUpgrade = biteChoice === "atta" ? getAttaJaggeryBiteUpgrade(combo.miniBites) : 0;
    const biteName = biteChoice === "atta" ? ATTA_JAGGERY_BITE_NAME : CHOCOLATE_BITE_NAME;
    const price = combo.price + attaJaggeryUpgrade;

    onAddToCart(
      {
        id: combo.id,
        name: combo.name,
        subtitle: combo.contents,
        price,
        maxCookies: combo.regularCookies + combo.miniBites,
        image: "/images/mini-chocolate-chip-bites.png",
        badge: combo.badge,
      },
      getActiveSelections(selected, biteName, combo.miniBites)
    );
    resetCombo(combo.id);
  };

  const addBiteBox = (collection: BiteCollection, option: BiteOption) => {
    onAddToCart(
      {
        id: option.id,
        name: option.name,
        subtitle: option.subtitle,
        price: option.price,
        maxCookies: option.count,
        image: collection.image,
        badge: option.badge,
      },
      { [collection.selectionName]: option.count }
    );
  };

  return (
    <section id="menu" className="py-20 md:py-24 bg-forest relative overflow-hidden">
      <div className="container mx-auto px-5 md:px-6">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-gold-muted tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">MOST ORDERED BOXES</p>
          <h2 className="text-5xl md:text-7xl font-serif text-cream">Choose your Sunday.</h2>
          <p className="text-cream/60 mt-gap-sm font-serif italic text-lg max-w-xl mx-auto leading-relaxed">
            Start with a curated combo, or build your own box if you already know what you love.
          </p>
          <div className="flex justify-center mt-7">
            <BatchIndicator />
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-10 rounded-[12px] border border-gold/10 bg-white/[0.025] p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-tan text-[11px] tracking-[0.32em] uppercase font-bold">Not sure what to pick?</p>
              <p className="mt-1 font-serif-display text-cream/50 italic">Choose by occasion. This is the fastest way to order.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:min-w-[620px]">
              {[
                ["First time", "Sunday Starter", "sunday-starter"],
                ["Gifting", "Gift Box", "gift-box"],
                ["Family sharing", "Full Sunday", "full-sunday"],
                ["Only big cookies", "Half Dozen", "half-dozen"],
              ].map(([occasion, pick, targetId]) => (
                <a
                  key={occasion}
                  href={`#${targetId}`}
                  className="rounded-[10px] border border-gold/10 bg-forest/50 px-3 py-3 transition-colors hover:border-tan/50"
                >
                  <p className="text-cream/35 text-[9px] tracking-[0.2em] uppercase font-bold">{occasion}</p>
                  <p className="mt-1 text-tan font-serif text-lg leading-tight">{pick}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-8 md:mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px flex-1 bg-gold/15" />
            <p className="text-tan text-[11px] tracking-[0.35em] uppercase font-bold">Most Ordered Boxes</p>
            <span className="h-px flex-1 bg-gold/15" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
            {COMBOS.map((combo, idx) => {
              const selected = comboSelections[combo.id];
              const selectedCount = getSelectionTotal(selected);
              const isComplete = selectedCount === combo.regularCookies;
              const biteChoice = comboBiteChoices[combo.id] || "chocolate";
              const attaJaggeryUpgrade = getAttaJaggeryBiteUpgrade(combo.miniBites);
              const isAttaJaggeryUpgrade = biteChoice === "atta";
              const displayedPrice = combo.price + (isAttaJaggeryUpgrade ? attaJaggeryUpgrade : 0);
              const displayedCompareAt = combo.compareAt + (isAttaJaggeryUpgrade ? attaJaggeryUpgrade : 0);

              return (
                <motion.div
                  key={combo.id}
                  id={combo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.12 }}
                  className={`scroll-mt-28 rounded-[8px] border bg-white/[0.03] p-5 lg:p-5 flex flex-col ${
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
                      <p className="text-cream/45 text-lg font-serif line-through">&#8377;{displayedCompareAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cream/35 text-[10px] tracking-widest uppercase">Now</p>
                      <p className="text-tan text-[2.15rem] lg:text-[2.35rem] font-serif">&#8377;{displayedPrice}</p>
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
                    {combo.allowBiteChoice && (
                      <div className="rounded-[8px] border border-gold/10 bg-forest/30 p-3 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-tan text-[10px] tracking-[0.2em] uppercase font-bold">
                            Choose Bites
                          </p>
                          {attaJaggeryUpgrade > 0 && (
                            <p className="text-cream/40 text-[11px] font-serif italic">
                              Atta Jaggery +&#8377;{attaJaggeryUpgrade}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "chocolate" as ComboBiteChoice, label: "Chocolate Chip" },
                            { id: "atta" as ComboBiteChoice, label: "Atta Jaggery" },
                          ].map((option) => {
                            const isSelected = biteChoice === option.id;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() =>
                                  setComboBiteChoices((prev) => ({
                                    ...prev,
                                    [combo.id]: option.id,
                                  }))
                                }
                                className={`rounded-[8px] border px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-colors ${
                                  isSelected
                                    ? "border-tan bg-tan text-forest"
                                    : "border-gold/10 bg-white/[0.03] text-cream/45 hover:border-tan/50 hover:text-tan"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <p className="text-cream/35 text-xs font-serif italic pt-1">
                      Includes {combo.miniBites} {biteChoice === "atta" ? "atta jaggery almond bites" : "chocolate chip bites"}.
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

        <div className="max-w-5xl mx-auto mb-5 md:mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px flex-1 bg-gold/15" />
            <p className="text-tan text-[11px] tracking-[0.35em] uppercase font-bold">Build Your Own Box</p>
            <span className="h-px flex-1 bg-gold/15" />
          </div>
          <p className="mx-auto max-w-2xl text-center font-serif-display text-cream/45 italic">
            Want only big cookies or a standalone bite box? Customize below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {PACKS.map((pack, idx) => {
            const selected = selections[pack.id];
            const selectedCount = getSelectionTotal(selected);

            return (
              <motion.div
                key={pack.id}
                id={pack.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: idx * 0.16 }}
                className="glass-card group overflow-hidden flex flex-col scroll-mt-28"
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
                        <p className="text-cream/35 text-base font-serif line-through">&#8377;{pack.compareAt}</p>
                      )}
                      <span className="text-tan text-[2rem] lg:text-[2.1rem] font-serif">&#8377;{pack.price}</span>
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
                                cookieType === "Double Chocolate"
                                  ? "#5B2D1F"
                                  : cookieType === "Oreo Strong"
                                    ? "#E8D9B8"
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

          {BITE_COLLECTIONS.map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.32 + idx * 0.12 }}
              className="glass-card group overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/25 to-transparent opacity-90" />
                <VegSeal className="absolute top-5 left-5 z-10" />
                <span className="absolute top-5 right-5 bg-tan text-forest text-[9px] font-bold px-4 py-2 rounded-full tracking-[0.2em] uppercase shadow-2xl">
                  BAKED FOR SHARING
                </span>
              </div>

              <div className="p-6 md:p-7 flex flex-col flex-grow">
                <p className="text-tan text-[11px] tracking-[0.3em] uppercase font-bold mb-3">
                  {collection.eyebrow}
                </p>
                <h3 className="text-3xl md:text-[2.2rem] font-serif text-cream leading-tight">{collection.title}</h3>
                <p className="font-serif-display text-cream/50 text-base mt-2">
                  {collection.description}
                </p>
                <p className="text-tan/75 text-[11px] tracking-[0.18em] uppercase font-bold mt-3">
                  Standalone bite boxes are Zone 1 only
                </p>

                <div className="mt-5 space-y-4">
                  {collection.options.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-[8px] border border-gold/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-[1.45rem] md:text-[1.65rem] font-serif text-cream">{option.subtitle}</h4>
                          <span className="bg-tan/10 text-tan text-[9px] font-bold px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                            {option.badge}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-cream/50 text-[12px] tracking-widest uppercase">
                          <span>Included: <span className="text-tan font-bold">{option.count} cookies</span></span>
                          {option.savings && <span className="text-tan font-bold">{option.savings}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          {option.compareAt && (
                            <p className="text-cream/35 text-base font-serif line-through">&#8377;{option.compareAt}</p>
                          )}
                          <span className="text-tan text-[2rem] font-serif">&#8377;{option.price}</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => addBiteBox(collection, option)}
                          className="premium-button min-w-[128px] py-4 px-5 flex items-center justify-center gap-2"
                        >
                          <span className="text-lg leading-none">+</span>
                          Add Box
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
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
                ["Free", "₹1099+", "Any zone"],
              ].map(([zone, fee, min]) => {
                const displayFee = zone === "Free" ? "\u20b91099+" : fee;
                const displayMinimum = zone === "Free" ? "Any zone" : min;

                return (
                <div key={zone} className="rounded-[8px] border border-gold/10 bg-forest/40 px-4 py-3">
                  <p className="text-cream font-bold">{zone}</p>
                  <p className="text-tan font-serif text-xl">{displayFee}</p>
                  <p className="text-cream/40 text-xs uppercase tracking-widest">{displayMinimum}</p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
