import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, ShoppingBag, Instagram, Minus, Plus, Egg, Check, ChevronUp, Star, X, ArrowRight } from "lucide-react";
import { Toaster, toast } from "sonner";
import CartPanel from "./components/CartPanel";
import OrderModal from "./components/OrderModal";
import "./App.css";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const C = {
  bg: "#0A140E",
  surface: "#1C3A2A",
  elevated: "#254836",
  gold: "#C9A84C",
  goldHover: "#DCC275",
  goldDim: "rgba(201,168,76,0.15)",
  text: "#FDFBF7",
  muted: "#A9B8AF",
  border: "rgba(201,168,76,0.18)",
};

// ── Cookie Data ────────────────────────────────────────────────────────────────

const alwaysAvailableCookies = [
  {
    id: "lazy-legend",
    name: "The Lazy Legend",
    flavor: "Classic Choco Chip",
    price: 89,
    weight: "65g",
    description: "Brown butter, two types of sugar, and Valrhona chocolate chips. The one that started it all. The cookie by which all others are judged.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=900&q=85",
    bestseller: true,
  },
  {
    id: "little-rebels",
    name: "Little Rebels",
    flavor: "Mini Choco Bites",
    price: 219,
    weight: "12g each",
    description: "All the soul, half the size. Perfect for when you want just a little something — and then four more. A whole pack of mini indulgence.",
    image: "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=900",
    isMini: true,
  },
];

const exclusiveCookies = [
  {
    id: "dark-side",
    name: "The Dark Side",
    flavor: "Oreo Cookies & Cream",
    price: 99,
    weight: "65g",
    description: "Crushed Oreos folded into a dark chocolate base. Rich, crunchy, unapologetically indulgent. Once you go dark, you don't go back.",
    image: "https://images.pexels.com/photos/13143739/pexels-photo-13143739.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "after-hours",
    name: "The After Hours",
    flavor: "Double Dark & Sea Salt",
    price: 89,
    weight: "65g",
    description: "Double chocolate dough, 72% dark chips, finished with a pinch of fleur de sel. The best kind of midnight snack.",
    image: "https://images.pexels.com/photos/33650331/pexels-photo-33650331.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "golden-affair",
    name: "The Golden Affair",
    flavor: "Lotus Biscoff",
    price: 109,
    weight: "65g",
    description: "Biscoff spread swirled into the dough, whole Biscoff pieces pressed on top. Caramel, spice, and warmth in every bite.",
    image: "https://images.unsplash.com/photo-1643116312392-353ab025768b?w=900&q=85",
  },
  {
    id: "midnight-meltdown",
    name: "The Midnight Meltdown",
    flavor: "S'mores",
    price: 109,
    weight: "65g",
    description: "Toasted marshmallow, milk chocolate, and a graham cracker crumble. Campfire dreams in cookie form.",
    image: "https://images.unsplash.com/photo-1690976991784-517d7763e0fa?w=900&q=85",
  },
  {
    id: "nutella-lava",
    name: "Nutella Lava",
    flavor: "Hazelnut Chocolate",
    price: 109,
    weight: "65g",
    description: "A pure Nutella core hidden inside a deep chocolate cookie. Break it open. Watch it pour. Try not to eat three.",
    image: "https://images.unsplash.com/photo-1741542164717-5f5f13cbfcd2?w=900&q=85",
  },
];

const allRegularCookies = [alwaysAvailableCookies[0], ...exclusiveCookies];

const processSteps = [
  { step: "01", title: "Browning", subtitle: "Where depth begins", body: "We slowly brown European-style butter until it turns deep amber and fills the kitchen with the scent of toasted hazelnuts.", time: "~15 min", image: "https://images.unsplash.com/photo-1758874960608-f0d7f38d9846?w=900&q=85" },
  { step: "02", title: "Mixing", subtitle: "Art in every fold", body: "Cold eggs, two types of sugar, still-warm browned butter. The fold is everything — overwork it and you lose the magic.", time: "~20 min", image: "https://images.unsplash.com/photo-1772915516557-2d57f94b0bd0?w=900&q=85" },
  { step: "03", title: "24 hr Chilling", subtitle: "The wait is the recipe", body: "The dough rests in cold for a full 24 hours. Flavours meld. Moisture redistributes. Patience is the technique.", time: "24 hours", image: "https://images.unsplash.com/photo-1687549181635-e795cefee8b5?w=900&q=85" },
  { step: "04", title: "Baking", subtitle: "Golden hour", body: "Pulled two minutes before they look done. They finish cooking on the hot pan — soft centre, barely-there crisp edge.", time: "~11 min", image: "https://images.unsplash.com/photo-1737674879060-7be2f5198aab?w=900&q=85" },
];

const QTY_OPTIONS = [1, 2, 4, 6];

// ── Active Section Hook ────────────────────────────────────────────────────────

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const ids = ["hero-section", "process-section", "shop-section", "assorted-section"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px 0px 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// ── Navbar ─────────────────────────────────────────────────────────────────────

const Navbar = ({ cartCount, onCartClick, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLink = (id, label) => {
    const isActive = activeSection === id;
    return (
      <button key={id} onClick={() => scrollTo(id)} data-testid={`nav-${label.toLowerCase()}`}
        className="hidden md:block text-xs uppercase tracking-[0.2em] transition-all duration-300 relative pb-1"
        style={{ color: isActive ? C.gold : C.muted, fontFamily: "Manrope, sans-serif", opacity: isActive ? 1 : 0.7 }}>
        {label}
        {isActive && (
          <motion.div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: C.gold }}
            layoutId="navUnderline" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
        )}
      </button>
    );
  };

  return (
    <motion.nav data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-20"
      style={{
        background: scrolled ? "rgba(10,20,14,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "background 0.4s, border 0.4s",
      }}
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
      <button onClick={() => scrollTo("hero-section")}
        className="sundays-logo text-xl md:text-2xl tracking-[0.35em] text-[#FDFBF7] hover:opacity-80 transition-opacity">
        SUNDAYS
      </button>
      <div className="flex items-center gap-2 md:gap-6">
        {navLink("process-section", "Process")}
        {navLink("shop-section", "Menu")}
        <a href="https://www.instagram.com/sundays.hyd/" target="_blank" rel="noopener noreferrer"
          data-testid="nav-instagram" className="p-2 transition-colors hover:opacity-100" style={{ color: C.muted, opacity: 0.7 }}>
          <Instagram size={18} />
        </a>
        <motion.button onClick={onCartClick} data-testid="nav-cart-btn"
          className="relative flex items-center gap-2 text-[#0A140E] font-semibold text-sm tracking-wider px-5 py-2.5"
          style={{ background: C.gold, fontFamily: "Manrope, sans-serif" }}
          whileHover={{ background: C.goldHover }} whileTap={{ scale: 0.97 }}>
          <ShoppingBag size={15} />
          <span className="hidden sm:inline">Cart</span>
          <AnimatePresence mode="wait">
            {cartCount > 0 && (
              <motion.span key={cartCount}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full"
                style={{ background: "#FDFBF7", color: C.bg }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.nav>
  );
};

// ── Hero ───────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.75], ["0%", "-8%"]);

  return (
    <section ref={ref} id="hero-section" data-testid="hero-section" className="relative h-screen overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: videoY }}>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1620499634096-3dfa6ecdc5c7?w=1920&q=85">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-baking-chocolate-chip-cookies-39424-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,20,14,0.45) 0%, rgba(10,20,14,0.35) 50%, rgba(10,20,14,0.95) 100%)" }} />
      </motion.div>
      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}>
        <motion.span className="block text-xs sm:text-sm uppercase tracking-[0.4em] mb-8 font-medium"
          style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}>
          The 24-Hour Cookie
        </motion.span>
        <motion.h1 className="sundays-display text-[#FDFBF7]"
          style={{ fontSize: "clamp(5rem, 14vw, 11rem)", lineHeight: 0.88 }}
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
          Sundays
        </motion.h1>
        <motion.p className="mt-8 text-base sm:text-lg max-w-xs font-light tracking-wide"
          style={{ color: "rgba(253,251,247,0.65)", fontFamily: "Manrope, sans-serif" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9 }}>
          Made slowly. Tasted once. Never forgotten.
        </motion.p>
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}>
          <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "Manrope, sans-serif" }}>Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={22} color="rgba(201,168,76,0.6)" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── Intro ──────────────────────────────────────────────────────────────────────

const IntroSection = () => (
  <section data-testid="intro-section" className="py-36 md:py-52 px-6 md:px-16 lg:px-32" style={{ background: C.bg }}>
    <div className="max-w-5xl mx-auto">
      <motion.span className="block text-xs sm:text-sm uppercase tracking-[0.35em] mb-8 font-medium"
        style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        Our philosophy
      </motion.span>
      <motion.h2 className="sundays-heading text-[#FDFBF7] leading-[1.05]"
        style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)" }}
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        We don&apos;t bake faster.<br /><span style={{ color: C.gold }}>We bake better.</span>
      </motion.h2>
      <motion.p className="mt-10 text-base sm:text-lg font-light max-w-2xl leading-relaxed"
        style={{ color: "rgba(253,251,247,0.6)", fontFamily: "Manrope, sans-serif" }}
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay: 0.2 }}>
        Every Sundays cookie begins 24 hours before you taste it. The secret isn't in the recipe — it's in the patience.
        Browned butter. Chilled dough. Time. These things can't be rushed, and we'd never try.
      </motion.p>
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 pt-12 border-t" style={{ borderColor: C.border }}>
        {[
          { num: "24h", label: "Chill Time" },
          { num: "7", label: "Signatures" },
          { num: "0", label: "Shortcuts" },
          { num: "Fresh", label: "Daily Batch" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}>
            <div className="sundays-heading" style={{ fontSize: "3.2rem", color: C.gold, lineHeight: 1 }}>{s.num}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── Process ────────────────────────────────────────────────────────────────────

const ProcessStep = ({ step, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 40%"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const isEven = index % 2 === 0;

  return (
    <motion.div ref={ref} data-testid={`process-step-${step.step}`}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
      <motion.div className={`relative overflow-hidden ${!isEven ? "lg:order-2" : ""}`} style={{ y: imgY, opacity: imgOpacity }}>
        <img src={step.image} alt={step.title} className="w-full object-cover" style={{ height: "480px", filter: "brightness(0.82)" }} loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(10,20,14,0.5) 100%)" }} />
        <div className="absolute bottom-6 right-6 text-xs uppercase tracking-[0.22em] px-4 py-2"
          style={{ background: "rgba(201,168,76,0.12)", border: `1px solid ${C.border}`, color: C.gold, fontFamily: "Manrope, sans-serif" }}>
          {step.time}
        </div>
      </motion.div>
      <motion.div className={!isEven ? "lg:order-1" : ""}
        initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <span className="text-xs uppercase tracking-[0.35em]" style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}>Step {step.step}</span>
        <h3 className="sundays-heading mt-4 text-[#FDFBF7] leading-none" style={{ fontSize: "clamp(2.8rem, 5vw, 4rem)" }}>{step.title}</h3>
        <p className="mt-3 text-sm font-semibold tracking-wide uppercase"
          style={{ color: C.gold, fontFamily: "Manrope, sans-serif", letterSpacing: "0.1em" }}>{step.subtitle}</p>
        <p className="mt-7 text-base sm:text-lg font-light leading-relaxed"
          style={{ color: "rgba(253,251,247,0.6)", fontFamily: "Manrope, sans-serif" }}>{step.body}</p>
      </motion.div>
    </motion.div>
  );
};

const ProcessSection = () => (
  <section id="process-section" data-testid="process-section" className="py-36 md:py-52" style={{ background: C.surface }}>
    <div className="px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
      <div className="mb-24">
        <motion.span className="block text-xs sm:text-sm uppercase tracking-[0.35em] mb-6 font-medium"
          style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          The Process
        </motion.span>
        <motion.h2 className="sundays-heading text-[#FDFBF7]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)" }}
          initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          Slow by design.
        </motion.h2>
      </div>
      <div className="space-y-36 md:space-y-48">
        {processSteps.map((step, i) => <ProcessStep key={step.step} step={step} index={i} />)}
      </div>
    </div>
  </section>
);

// ── Cookie Card ────────────────────────────────────────────────────────────────

const CookieCard = ({ cookie, index, onAddToCart, onViewDetail }) => {
  const [hovered, setHovered] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAddToCart({
      cookieId: cookie.id,
      name: cookie.name,
      flavor: cookie.flavor,
      price: cookie.price,
      quantity: cookie.isMini ? 1 : qty,
      subtotal: cookie.isMini ? cookie.price : cookie.price * qty,
      isMini: cookie.isMini || false,
    });
    toast.success(`${cookie.name} added to cart`, {
      description: cookie.isMini ? `1 pack — \u20B9${cookie.price}` : `${qty} cookie${qty > 1 ? "s" : ""} — \u20B9${cookie.price * qty}`,
    });
    setQty(1);
  };

  return (
    <motion.div data-testid={`cookie-card-${cookie.id}`} className="relative overflow-hidden group"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
      initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer" style={{ height: "260px" }}
        onClick={() => onViewDetail(cookie)}>
        <motion.img src={cookie.image} alt={cookie.name} className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1, filter: hovered ? "brightness(1.15)" : "brightness(0.78)" }}
          transition={{ duration: 0.55, ease: "easeOut" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,20,14,0.92) 0%, rgba(10,20,14,0.1) 55%, transparent 100%)" }} />
        {/* Price badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5" style={{ background: "rgba(10,20,14,0.85)", border: `1px solid ${C.border}` }}>
          <span className="sundays-heading text-xl" style={{ color: C.gold }}>{"\u20B9"}{cookie.price}</span>
          <span className="text-[10px] uppercase tracking-wider ml-1" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>
            {cookie.isMini ? "/pack" : "/cookie"}
          </span>
        </div>
        {/* Bestseller badge */}
        {cookie.bestseller && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: C.gold, color: C.bg }}>
            <Star size={11} fill={C.bg} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>Bestseller</span>
          </div>
        )}
        {/* View detail hint */}
        <motion.div className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <span className="text-xs uppercase tracking-[0.2em] px-4 py-2 backdrop-blur-sm"
            style={{ background: "rgba(10,20,14,0.7)", color: C.gold, fontFamily: "Manrope, sans-serif", border: `1px solid ${C.border}` }}>
            View Details
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.25em] mb-1.5" style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}>{cookie.flavor}</p>
        <h4 className="sundays-heading text-2xl text-[#FDFBF7] mb-3 leading-tight">{cookie.name}</h4>
        <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.5)", fontFamily: "Manrope, sans-serif" }}>
          {cookie.description.split(".").slice(0, 2).join(".") + "."}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider px-2 py-1"
            style={{ color: C.muted, fontFamily: "Manrope, sans-serif", background: "rgba(253,251,247,0.05)", border: `1px solid rgba(253,251,247,0.08)` }}>
            {cookie.weight} before baking
          </span>
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider px-2 py-1"
            style={{ color: C.muted, fontFamily: "Manrope, sans-serif", background: "rgba(253,251,247,0.05)", border: `1px solid rgba(253,251,247,0.08)` }}>
            <Egg size={10} /> Contains Eggs
          </span>
        </div>

        {/* Quantity Selector */}
        {!cookie.isMini && (
          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>Quantity</p>
            <div className="flex gap-2">
              {QTY_OPTIONS.map((q) => (
                <button key={q} data-testid={`qty-${cookie.id}-${q}`} onClick={() => setQty(q)}
                  className="flex-1 py-2 text-sm font-semibold tracking-wide transition-all duration-200"
                  style={{ fontFamily: "Manrope, sans-serif", background: qty === q ? C.gold : "transparent", color: qty === q ? C.bg : C.muted, border: `1px solid ${qty === q ? C.gold : C.border}` }}>
                  {q}
                </button>
              ))}
            </div>
            {qty > 1 && (
              <motion.p className="mt-2 text-sm" style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                {"\u20B9"}{cookie.price * qty}
              </motion.p>
            )}
          </div>
        )}

        <motion.button onClick={handleAdd} data-testid={`add-cart-${cookie.id}`}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold tracking-[0.12em] uppercase text-[#0A140E]"
          style={{ background: C.gold, fontFamily: "Manrope, sans-serif" }}
          whileHover={{ background: C.goldHover }} whileTap={{ scale: 0.97 }}>
          <ShoppingBag size={14} />
          {cookie.isMini ? "Add Pack to Cart" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ── Cookie Detail Modal ────────────────────────────────────────────────────────

const CookieDetailModal = ({ cookie, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  if (!cookie) return null;

  const handleAdd = () => {
    onAddToCart({
      cookieId: cookie.id, name: cookie.name, flavor: cookie.flavor,
      price: cookie.price, quantity: cookie.isMini ? 1 : qty,
      subtotal: cookie.isMini ? cookie.price : cookie.price * qty,
      isMini: cookie.isMini || false,
    });
    toast.success(`${cookie.name} added to cart`);
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(10,20,14,0.92)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        <div className="relative" style={{ minHeight: "320px" }}>
          <img src={cookie.image} alt={cookie.name} className="w-full h-full object-cover" style={{ filter: "brightness(0.85)" }} />
          {cookie.bestseller && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5" style={{ background: C.gold, color: C.bg }}>
              <Star size={11} fill={C.bg} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>Bestseller</span>
            </div>
          )}
        </div>
        {/* Details */}
        <div className="p-8 flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 transition-opacity hover:opacity-70 z-10"
            style={{ color: C.muted }} data-testid="detail-close">
            <X size={20} />
          </button>
          <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}>{cookie.flavor}</p>
          <h3 className="sundays-heading text-3xl text-[#FDFBF7] mb-4 leading-tight">{cookie.name}</h3>
          <div className="sundays-heading text-3xl mb-4" style={{ color: C.gold }}>
            {"\u20B9"}{cookie.price}<span className="text-sm ml-1" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>{cookie.isMini ? "/pack" : "/cookie"}</span>
          </div>
          <p className="text-sm font-light leading-relaxed mb-6" style={{ color: "rgba(253,251,247,0.6)", fontFamily: "Manrope, sans-serif" }}>{cookie.description}</p>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider px-2.5 py-1.5"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif", background: "rgba(253,251,247,0.05)", border: `1px solid rgba(253,251,247,0.08)` }}>
              {cookie.weight} before baking
            </span>
            <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider px-2.5 py-1.5"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif", background: "rgba(253,251,247,0.05)", border: `1px solid rgba(253,251,247,0.08)` }}>
              <Egg size={10} /> Contains Eggs
            </span>
          </div>
          <div className="mt-auto">
            {!cookie.isMini && (
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>Quantity</p>
                <div className="flex gap-2">
                  {QTY_OPTIONS.map((q) => (
                    <button key={q} onClick={() => setQty(q)}
                      className="flex-1 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200"
                      style={{ fontFamily: "Manrope, sans-serif", background: qty === q ? C.gold : "transparent", color: qty === q ? C.bg : C.muted, border: `1px solid ${qty === q ? C.gold : C.border}` }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <motion.button onClick={handleAdd} data-testid="detail-add-cart"
              className="flex items-center justify-center gap-2.5 w-full py-4 text-sm font-bold tracking-[0.12em] uppercase text-[#0A140E]"
              style={{ background: C.gold, fontFamily: "Manrope, sans-serif" }}
              whileHover={{ background: C.goldHover }} whileTap={{ scale: 0.97 }}>
              <ShoppingBag size={14} />
              Add to Cart {!cookie.isMini && qty > 1 ? `— \u20B9${cookie.price * qty}` : `— \u20B9${cookie.price}`}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Shop Section ───────────────────────────────────────────────────────────────

const ShopSection = ({ onAddToCart, onViewDetail }) => (
  <section id="shop-section" data-testid="shop-section" className="py-36 md:py-52" style={{ background: C.bg }}>
    <div className="px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
      <div className="mb-20">
        <motion.span className="block text-xs sm:text-sm uppercase tracking-[0.35em] mb-6 font-medium"
          style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          The Menu
        </motion.span>
        <motion.h2 className="sundays-heading text-[#FDFBF7]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)" }}
          initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          Choose your vice.
        </motion.h2>
        <motion.p className="mt-4 text-base font-light max-w-xl"
          style={{ color: "rgba(253,251,247,0.45)", fontFamily: "Manrope, sans-serif" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          Limited fresh batch baked daily. All cookies contain eggs.
        </motion.p>
      </div>

      {/* Always Available */}
      <motion.div className="mb-20 md:mb-28" data-testid="section-always-available"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-40px" }}>
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <h3 className="text-sm font-semibold tracking-[0.22em] uppercase" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>Always Available</h3>
          <span className="text-xs uppercase tracking-[0.18em] px-3 py-1.5" style={{ color: C.gold, border: `1px solid ${C.border}`, fontFamily: "Manrope, sans-serif" }}>Fresh Daily</span>
          <div className="flex-1 h-px min-w-[20px]" style={{ background: C.border }} />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {alwaysAvailableCookies.map((cookie, i) => (
            <CookieCard key={cookie.id} cookie={cookie} index={i} onAddToCart={onAddToCart} onViewDetail={onViewDetail} />
          ))}
        </div>
      </motion.div>

      {/* Exclusive Flavours */}
      <motion.div className="mb-8" data-testid="section-exclusive"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-40px" }}>
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <h3 className="text-sm font-semibold tracking-[0.22em] uppercase" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>Exclusive Flavours</h3>
          <span className="text-xs uppercase tracking-[0.18em] px-3 py-1.5" style={{ color: C.gold, border: `1px solid ${C.border}`, fontFamily: "Manrope, sans-serif" }}>Limited</span>
          <div className="flex-1 h-px min-w-[20px]" style={{ background: C.border }} />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exclusiveCookies.map((cookie, i) => (
            <CookieCard key={cookie.id} cookie={cookie} index={i} onAddToCart={onAddToCart} onViewDetail={onViewDetail} />
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ── Assorted Box ───────────────────────────────────────────────────────────────

const AssortedBuilder = ({ onAddAssorted }) => {
  const [selections, setSelections] = useState({});
  const totalSelected = Object.values(selections).reduce((a, b) => a + b, 0);

  const updateCount = (cookieId, delta) => {
    setSelections((prev) => {
      const current = prev[cookieId] || 0;
      const next = Math.max(0, current + delta);
      const otherTotal = totalSelected - current;
      if (next + otherTotal > 6) return prev;
      const updated = { ...prev, [cookieId]: next };
      if (updated[cookieId] === 0) delete updated[cookieId];
      return updated;
    });
  };

  const handleAdd = () => {
    const items = Object.entries(selections).map(([id, count]) => {
      const cookie = allRegularCookies.find((c) => c.id === id);
      return { cookieId: id, name: cookie.name, count };
    });
    onAddAssorted(items);
    setSelections({});
    toast.success("Assorted Box added to cart", { description: "6 cookies for \u20B9649" });
  };

  return (
    <section id="assorted-section" data-testid="assorted-section" className="py-36 md:py-44" style={{ background: C.surface }}>
      <div className="px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <motion.span className="block text-xs sm:text-sm uppercase tracking-[0.35em] mb-6 font-medium"
              style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Build Your Box
            </motion.span>
            <motion.h2 className="sundays-heading text-[#FDFBF7] leading-tight"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              Assorted Box <span style={{ color: C.gold }}>of 6</span>
            </motion.h2>
            <motion.div className="mt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <div className="sundays-heading text-5xl md:text-6xl" style={{ color: C.gold }}>{"\u20B9"}649</div>
              <p className="mt-4 text-base font-light leading-relaxed" style={{ color: "rgba(253,251,247,0.55)", fontFamily: "Manrope, sans-serif" }}>
                Pick any 6 cookies from our menu. Mix and match your favourites into one perfect box.
              </p>
            </motion.div>
            <div className="mt-10">
              <img src="https://images.unsplash.com/photo-1772651392135-b891a5e4f8a3?w=700&q=85"
                alt="Assorted cookies box" className="w-full object-cover" style={{ height: "280px", filter: "brightness(0.75)" }} loading="lazy" />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm uppercase tracking-[0.18em] font-semibold" style={{ color: C.text, fontFamily: "Manrope, sans-serif" }}>Pick your flavours</p>
              <span className="text-sm font-bold px-3 py-1"
                style={{ fontFamily: "Manrope, sans-serif", color: totalSelected === 6 ? C.bg : C.gold, background: totalSelected === 6 ? C.gold : "transparent", border: `1px solid ${C.border}` }}>
                {totalSelected} / 6
              </span>
            </div>
            <div className="space-y-3">
              {allRegularCookies.map((cookie) => {
                const count = selections[cookie.id] || 0;
                return (
                  <div key={cookie.id} data-testid={`assorted-pick-${cookie.id}`}
                    className="flex items-center gap-4 p-3"
                    style={{ background: count > 0 ? C.goldDim : "rgba(253,251,247,0.03)", border: `1px solid ${count > 0 ? C.border : "rgba(253,251,247,0.06)"}`, transition: "all 0.2s" }}>
                    <img src={cookie.image} alt={cookie.name} className="w-14 h-14 object-cover shrink-0" style={{ filter: "brightness(0.85)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#FDFBF7] truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{cookie.name}</p>
                      <p className="text-xs" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>{cookie.flavor}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateCount(cookie.id, -1)} disabled={count === 0}
                        className="w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-20"
                        style={{ border: `1px solid ${C.border}`, color: C.text }}><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm font-bold"
                        style={{ color: count > 0 ? C.gold : C.muted, fontFamily: "Manrope, sans-serif" }}>{count}</span>
                      <button onClick={() => updateCount(cookie.id, 1)} disabled={totalSelected >= 6}
                        className="w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-20"
                        style={{ border: `1px solid ${C.border}`, color: C.text }}><Plus size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <motion.button onClick={handleAdd} disabled={totalSelected !== 6} data-testid="add-assorted-btn"
              className="mt-8 flex items-center justify-center gap-2.5 w-full py-4 text-sm font-bold tracking-[0.12em] uppercase transition-all"
              style={{ fontFamily: "Manrope, sans-serif", background: totalSelected === 6 ? C.gold : "rgba(201,168,76,0.15)", color: totalSelected === 6 ? C.bg : "rgba(201,168,76,0.4)", cursor: totalSelected === 6 ? "pointer" : "not-allowed" }}
              whileHover={totalSelected === 6 ? { background: C.goldHover } : {}}
              whileTap={totalSelected === 6 ? { scale: 0.97 } : {}}>
              <ShoppingBag size={14} /> Add Box to Cart — {"\u20B9"}649
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ── Promo Section ──────────────────────────────────────────────────────────────

const PromoSection = () => (
  <section data-testid="promo-section" className="py-24 md:py-32 px-6 md:px-16 lg:px-32" style={{ background: C.bg }}>
    <motion.div className="max-w-3xl mx-auto text-center"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-8"
        style={{ border: `1px solid ${C.border}`, color: C.gold, fontFamily: "Manrope, sans-serif" }}>
        <Instagram size={14} />
        <span className="text-xs uppercase tracking-[0.2em] font-semibold">First-time offer</span>
      </div>
      <h3 className="sundays-heading text-[#FDFBF7] leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
        Tag us. Get <span style={{ color: C.gold }}>10% off</span> your next order.
      </h3>
      <p className="mt-5 text-base font-light max-w-lg mx-auto leading-relaxed"
        style={{ color: "rgba(253,251,247,0.5)", fontFamily: "Manrope, sans-serif" }}>
        First-time customer? Share an honest review on Instagram and tag
        <a href="https://www.instagram.com/sundays.hyd/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center mx-1 font-medium hover:underline" style={{ color: C.gold }}>@sundays.hyd</a>
        — we'll send you a 10% discount code for your next order.
      </p>
    </motion.div>
  </section>
);

// ── Footer ─────────────────────────────────────────────────────────────────────

const FooterSection = () => (
  <footer data-testid="footer" className="py-36 md:py-44 px-6 md:px-16 lg:px-32"
    style={{ background: "#060E08", borderTop: `1px solid ${C.border}` }}>
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">
        <div className="flex-1">
          <motion.div className="sundays-display text-[#FDFBF7] leading-none"
            style={{ fontSize: "clamp(5rem, 12vw, 10rem)", lineHeight: 0.88 }}
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
            Sun<br /><span style={{ color: C.gold }}>days.</span>
          </motion.div>
          <motion.p className="mt-8 text-base font-light max-w-sm leading-relaxed"
            style={{ color: "rgba(253,251,247,0.35)", fontFamily: "Manrope, sans-serif" }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 }}>
            Made with patience. Ordered online. Delivered fresh. Always worth the wait.
          </motion.p>
          <motion.div className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <a href="https://www.instagram.com/sundays.hyd/" target="_blank" rel="noopener noreferrer" data-testid="footer-instagram"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
              style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}>
              <Instagram size={16} /> @sundays.hyd
            </a>
          </motion.div>
        </div>
        <motion.div className="shrink-0" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.9 }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>Delivery only</p>
          <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: "rgba(253,251,247,0.4)", fontFamily: "Manrope, sans-serif" }}>
            Order on the site. Pay via UPI. We bake fresh and deliver to your door.
          </p>
        </motion.div>
      </div>
      <div className="mt-24 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        style={{ borderTop: `1px solid ${C.border}`, color: "rgba(253,251,247,0.22)", fontFamily: "Manrope, sans-serif" }}>
        <span>&copy; 2025 Sundays. All rights reserved.</span>
        <span>The 24-Hour Cookie.</span>
      </div>
    </div>
  </footer>
);

// ── Back to Top ────────────────────────────────────────────────────────────────

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-testid="back-to-top"
          className="fixed bottom-8 left-8 z-40 w-10 h-10 flex items-center justify-center"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.gold }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          whileHover={{ background: C.elevated }}>
          <ChevronUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ── Main App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [detailCookie, setDetailCookie] = useState(null);
  const [upiConfig, setUpiConfig] = useState(null);
  const activeSection = useActiveSection();

  const cartCount = cart.length;

  useEffect(() => {
    fetch(`${API_URL}/api/config`).then((r) => r.json()).then(setUpiConfig).catch(() => {});
  }, []);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.cookieId === item.cookieId && !c.isAssorted && !item.isAssorted);
      if (existing) {
        return prev.map((c) =>
          c.cookieId === item.cookieId && !c.isAssorted
            ? { ...c, quantity: c.quantity + item.quantity, subtotal: (c.quantity + item.quantity) * c.price }
            : c
        );
      }
      return [...prev, item];
    });
  }, []);

  const addAssorted = useCallback((items) => {
    setCart((prev) => [
      ...prev,
      {
        cookieId: `assorted-${Date.now()}`,
        name: "Assorted Box",
        flavor: items.map((i) => `${i.count}x ${i.name}`).join(", "),
        price: 649, quantity: 1, subtotal: 649,
        isAssorted: true, assortedItems: items,
      },
    ]);
  }, []);

  const removeFromCart = useCallback((cookieId) => {
    setCart((prev) => prev.filter((c) => c.cookieId !== cookieId));
  }, []);

  const updateCartQty = useCallback((cookieId, qty) => {
    setCart((prev) =>
      prev.map((c) => c.cookieId === cookieId && !c.isAssorted ? { ...c, quantity: qty, subtotal: qty * c.price } : c)
    );
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleOrder = async (customerInfo) => {
    const orderItems = cart.filter((c) => !c.isAssorted).map((c) => ({
      cookie_id: c.cookieId, cookie_name: c.name, flavor: c.flavor,
      quantity: c.quantity, price_per_unit: c.price, subtotal: c.subtotal,
    }));
    const assortedBoxes = cart.filter((c) => c.isAssorted);
    const assortedSelections = assortedBoxes.flatMap((box) =>
      (box.assortedItems || []).map((item) => ({ cookie_id: item.cookieId, cookie_name: item.name, count: item.count }))
    );
    const payload = {
      customer_name: customerInfo.name, phone: customerInfo.phone, address: customerInfo.address,
      items: orderItems, assorted_boxes: assortedBoxes.length, assorted_selections: assortedSelections,
      total: cartTotal, notes: customerInfo.notes || "",
      payment_reference: customerInfo.paymentRef || "", payment_method: "upi",
    };
    try {
      const res = await fetch(`${API_URL}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      setCart([]);
      setOrderOpen(false);
      setCartOpen(false);
      setOrderResult(order);
      return order;
    } catch {
      toast.error("Something went wrong. Please try again.");
      return null;
    }
  };

  return (
    <div style={{ background: C.bg }}>
      <Toaster theme="dark" position="top-right"
        toastOptions={{ style: { background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: "Manrope, sans-serif" } }} />

      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} activeSection={activeSection} />
      <HeroSection />
      <IntroSection />
      <ProcessSection />
      <ShopSection onAddToCart={addToCart} onViewDetail={setDetailCookie} />
      <AssortedBuilder onAddAssorted={addAssorted} />
      <PromoSection />
      <FooterSection />
      <BackToTop />

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} cart={cart}
        onRemove={removeFromCart} onUpdateQty={updateCartQty} cartTotal={cartTotal}
        onCheckout={() => { setCartOpen(false); setOrderOpen(true); }} />

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)}
        cart={cart} cartTotal={cartTotal} onSubmit={handleOrder} upiConfig={upiConfig} />

      {/* Cookie Detail Modal */}
      <AnimatePresence>
        {detailCookie && (
          <CookieDetailModal cookie={detailCookie} onClose={() => setDetailCookie(null)} onAddToCart={addToCart} />
        )}
      </AnimatePresence>

      {/* Order Success */}
      <AnimatePresence>
        {orderResult && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: "rgba(10,20,14,0.95)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="max-w-md w-full text-center p-10"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full" style={{ background: C.goldDim }}>
                <Check size={28} style={{ color: C.gold }} />
              </div>
              <h3 className="sundays-heading text-2xl text-[#FDFBF7] mb-2">Order Placed!</h3>
              <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: C.gold, fontFamily: "Manrope, sans-serif" }}>
                Order #{orderResult.id?.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-sm font-light leading-relaxed mb-3"
                style={{ color: "rgba(253,251,247,0.6)", fontFamily: "Manrope, sans-serif" }}>
                Thank you for your order! We'll reach out on WhatsApp to confirm delivery details. Fresh batch coming your way!
              </p>
              <div className="inline-block px-4 py-2 mb-8"
                style={{ background: C.goldDim, border: `1px solid ${C.border}` }}>
                <span className="sundays-heading text-xl" style={{ color: C.gold }}>{"\u20B9"}{orderResult.total}</span>
                <span className="text-xs ml-2" style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}>paid via UPI</span>
              </div>
              <motion.button onClick={() => setOrderResult(null)} data-testid="order-success-close"
                className="block w-full py-3 text-sm font-bold tracking-[0.12em] uppercase text-[#0A140E]"
                style={{ background: C.gold, fontFamily: "Manrope, sans-serif" }}
                whileHover={{ background: C.goldHover }} whileTap={{ scale: 0.97 }}>
                Continue Browsing
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
