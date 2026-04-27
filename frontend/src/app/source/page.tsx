"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/FooterComponents";

const INGREDIENTS = [
  {
    title: "The Chocolate",
    brand: "Van Houten Couverture",
    story: "We use legendary Van Houten Couverture — the gold standard of chocolate since 1828. Unlike compound chocolate, our couverture is rich in pure cocoa butter, ensuring a silky, molten melt and a deep, complex snap in every bite.",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=1000", // VERIFIED DARK CHOCO
    details: ["70% Dark Profile", "Pure Cocoa Butter", "Zero Vegetable Fats"]
  },
  {
    title: "The Butter",
    brand: "Président French Butter",
    story: "We exclusively use Unsalted Président Butter from France. But we don't just melt it. we transform it. We cook it until the milk solids toast and turn amber — creating 'Beurre Noisette' (Brown Butter). This releases an intoxicating aroma of toasted hazelnuts and toffee.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=1000",
    details: ["French High-Fat Butter", "Hand-Browned Daily", "Rich Nutty Profile"]
  },
  {
    title: "The Sugars",
    brand: "Organic Origins",
    story: "We've replaced commercial sugars with Organic Brown and White Sugars. They provide a cleaner, deeper caramelization that gives our cookies their signature chewy heart and 'toffee-like' depth without any chemical aftertaste.",
    image: "https://images.unsplash.com/photo-1621532076042-4752c009d13c?auto=format&fit=crop&q=80&w=1000", // VERIFIED ORGANIC SUGAR
    details: ["Unrefined & Organic", "Deep Molasses Notes", "Zero Additives"]
  },
  {
    title: "The Architects",
    brand: "Coffee & Sea Salt",
    story: "The secret isn't more sugar, it's balance. A hint of instant coffee acts as a 'Flavor Architect' to amplify the dark cocoa, while flakes of premium sea salt cut through the richness to keep you coming back for more.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000",
    details: ["Flavor Amplification", "Maldon-style Finish", "Perfectly Balanced"]
  }
];

export default function SourcePage() {
  return (
    <main className="min-h-screen bg-deep-forest selection:bg-gold selection:text-forest">
      {/* Minimal Header */}
      <nav className="fixed top-0 left-0 w-full z-50 py-10 px-6 flex justify-center">
        <a href="/" className="text-2xl font-serif tracking-[0.2em] text-gold hover:text-cream transition-colors">
          SUNDAYS
        </a>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold tracking-[0.5em] uppercase text-[10px] font-bold mb-6"
        >
          Ingredient Transparency
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-serif text-cream leading-none"
        >
          The Sundays <br/> <span className="italic text-tan">Source.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-cream/40 mt-8 max-w-xl mx-auto font-serif italic text-lg"
        >
          "A masterpiece is only as good as its blueprint. Here is the DNA of The Legend."
        </motion.p>
      </section>

      {/* Ingredient Grid */}
      <section className="pb-40 px-6">
        <div className="max-w-6xl mx-auto space-y-40">
          {INGREDIENTS.map((item, i) => (
            <div 
              key={i} 
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative aspect-square rounded-[40px] overflow-hidden border border-gold/10"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 to-transparent" />
                  <div className="absolute bottom-10 left-10">
                    <p className="text-gold tracking-[0.3em] uppercase text-[10px] font-bold mb-2">The Standard</p>
                    <p className="text-cream font-serif text-2xl">{item.brand}</p>
                  </div>
                </motion.div>
              </div>

              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-gold tracking-[0.4em] uppercase text-[12px] font-bold mb-6">{item.title}</h2>
                  <p className="text-cream text-3xl md:text-5xl font-serif mb-8 leading-tight">{item.brand}</p>
                  <p className="text-cream/60 text-lg leading-relaxed font-serif italic mb-10">
                    "{item.story}"
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {item.details.map((detail, idx) => (
                      <span key={idx} className="border border-gold/20 px-4 py-2 rounded-full text-[10px] text-tan tracking-widest uppercase font-bold">
                        {detail}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
