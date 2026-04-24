"use client";

import { motion } from "framer-motion";

const ITEMS = [
  {
    num: "01",
    title: "Browned Butter",
    desc: "We brown every gram of butter until it smells of toffee and hazelnuts — a depth of flavour regular butter can't match."
  },
  {
    num: "02",
    title: "24-Hour Cold Rest",
    desc: "The dough rests a full 24 hours in the fridge — developing complex flavour, crispy edges, and a fudgy centre."
  },
  {
    num: "03",
    title: "Premium Chocolate",
    desc: "Real chocolate, chopped into uneven chunks — so every bite has a different ratio of dough to molten chocolate."
  }
];

export function CraftSection() {
  return (
    <section id="craft" className="py-section bg-deep-forest relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-gap-lg items-center">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-[48px] overflow-hidden border border-gold/10 aspect-[4/5] md:aspect-square">
              <img 
                src="/images/craft.jpg" 
                alt="The Craft" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 to-transparent" />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <p className="text-tan tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">THE CRAFT</p>
            <h2 className="text-5xl md:text-7xl font-serif text-cream mb-gap-md leading-tight">
              Why Our Cookies Taste Different
            </h2>
            
            <div className="space-y-12">
              {ITEMS.map((item) => (
                <div key={item.num} className="group relative pl-12">
                  <span className="absolute left-0 top-0 text-tan font-serif text-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    {item.num}
                  </span>
                  <h3 className="text-2xl md:text-3xl text-cream mb-3 font-serif tracking-wide group-hover:translate-x-2 transition-transform duration-500">
                    {item.title}
                  </h3>
                  <p className="text-cream-dim/50 leading-relaxed text-base max-w-lg font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
