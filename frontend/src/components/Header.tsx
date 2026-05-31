import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const [cartCount, setCartCount] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number }>).detail;
      setCartCount(detail?.count || 0);
    };

    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const openRitualGuide = () => {
    closeMenu();
    window.dispatchEvent(new CustomEvent("open-ritual-modal"));
  };

  const openCart = () => {
    closeMenu();
    window.dispatchEvent(new CustomEvent("open-cart"));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="bg-[#030A08] text-gold h-10 flex items-center overflow-hidden border-b border-gold/5 select-none">
        <div className="flex w-max animate-ticker-seamless">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center whitespace-nowrap gap-12 pr-12 text-[11px] tracking-[0.2em] uppercase font-medium">
              <span>100% EGGLESS & VEGETARIAN</span>
              <span className="text-gold/30 text-[14px]">*</span>
              <span>HYDERABAD DELIVERY FROM &#8377;49</span>
              <span className="text-gold/30 text-[14px]">*</span>
              <span>FREE DELIVERY ABOVE &#8377;1099</span>
              <span className="text-gold/30 text-[14px]">*</span>
              <span>SUNDAYS - COOKIES, MASTERED.</span>
              <span className="text-gold/30 text-[14px]">*</span>
            </div>
          ))}
        </div>
      </div>

      <nav className="h-16 flex items-center border-b border-gold/5 bg-deep-forest sticky top-10 z-[100]">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.h1
            initial={{ letterSpacing: "0.05em", opacity: 0 }}
            animate={{ letterSpacing: "0.15em", opacity: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl font-serif font-bold flex items-center uppercase"
          >
            <span className="text-white">SUN</span>
            <motion.span
              initial={{ marginLeft: "0.05em" }}
              animate={{ marginLeft: "0.15em" }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="text-gold"
            >
              DAYS
            </motion.span>
          </motion.h1>

          <div className="hidden md:flex gap-10 items-center text-[12px] tracking-widest font-bold text-cream uppercase">
            <a href="#menu" className="hover:text-gold transition-colors">Menu</a>
            <a href="#reviews" className="hover:text-gold transition-colors">Reviews</a>
            <a href="#craft" className="hover:text-gold transition-colors">The Craft</a>
            <a href="#story" className="hover:text-gold transition-colors">Our Story</a>
            <button
              onClick={openRitualGuide}
              className="hover:text-gold transition-colors text-[12px] tracking-widest font-bold uppercase"
            >
              Ritual Guide
            </button>
            <button
              onClick={openCart}
              className="relative hover:text-gold transition-colors flex items-center gap-2"
            >
              Cart
              {cartCount > 0 && (
                <span className="w-1.5 h-1.5 bg-tan rounded-full shadow-[0_0_8px_rgba(194,163,93,0.8)]" />
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <a
              href="#menu"
              onClick={closeMenu}
              className="rounded-full bg-tan px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-forest shadow-[0_0_18px_rgba(199,164,76,0.16)]"
            >
              Order
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="rounded-full border border-gold/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gold transition-colors hover:border-gold/35 hover:bg-white/[0.03]"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? "Close" : "More"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute right-4 top-[4.2rem] w-60 md:hidden rounded-2xl border border-gold/15 bg-[#07110D]/95 p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="divide-y divide-gold/10 text-[11px] font-bold uppercase tracking-[0.18em] text-cream">
                <a onClick={closeMenu} href="#menu" className="block px-4 py-3.5 hover:text-gold">
                  Order Menu
                </a>
                <a onClick={closeMenu} href="#reviews" className="block px-4 py-3.5 text-gold">
                  Reviews
                </a>
                <a onClick={closeMenu} href="#craft" className="block px-4 py-3.5 hover:text-gold">
                  The Craft
                </a>
                <a onClick={closeMenu} href="#story" className="block px-4 py-3.5 hover:text-gold">
                  Our Story
                </a>
                <button
                  type="button"
                  onClick={openRitualGuide}
                  className="block w-full px-4 py-3.5 text-left hover:text-gold"
                >
                  Ritual Guide
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="block w-full px-4 py-3.5 text-left hover:text-gold"
                >
                  Cart{cartCount > 0 ? ` (${cartCount})` : ""}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
