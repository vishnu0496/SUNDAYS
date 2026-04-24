"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    id: "01",
    title: "Pick Your Pack",
    desc: "Select your preferred cookie pack and mix your favorite flavors."
  },
  {
    id: "02",
    title: "Place Your Order",
    desc: "Complete your order and choose your preferred Sunday for delivery."
  },
  {
    id: "03",
    title: "Enjoy the Bliss",
    desc: "Your cookies are baked fresh in small batches and delivered to your doorstep."
  }
];

export function HowItWorks() {
  return (
    <section className="py-section bg-deep-forest relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-gap-lg">
          <p className="text-tan tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">HOW IT WORKS</p>
          <h2 className="text-4xl md:text-6xl font-serif text-white">Three Steps to Cookie Bliss</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {STEPS.map((step) => (
            <div key={step.id} className="glass-card p-12 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 text-[10rem] font-serif font-bold text-white/[0.03] select-none group-hover:text-tan/10 transition-colors duration-700">
                {step.id}
              </div>
              <div className="relative z-10">
                <span className="text-tan font-serif text-2xl mb-6 block">{step.id}</span>
                <h3 className="text-2xl font-serif text-white mb-4">{step.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
