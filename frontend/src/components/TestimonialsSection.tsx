"use client";

import { motion } from "framer-motion";

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-deep-forest relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(199,164,76,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Decorative line */}
          <div className="flex items-center gap-6 justify-center mb-12">
            <div className="h-px w-20 bg-gold/20" />
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase font-bold">Early Orders</span>
            <div className="h-px w-20 bg-gold/20" />
          </div>

          <h2 className="text-4xl md:text-6xl font-serif text-cream mb-8 leading-tight">
            Be among the<br />
            <span className="font-serif-display text-tan italic">first fifty.</span>
          </h2>

          <p className="text-cream/50 text-lg md:text-xl font-serif leading-relaxed max-w-2xl mx-auto mb-16 font-light italic">
            &ldquo;No reviews yet — because we just started. Every batch is limited to fifty orders. 
            You&apos;d be ordering before anyone else in Hyderabad knows about this.&rdquo;
          </p>

          <a href="#menu" className="premium-button inline-block">
            ORDER NOW
          </a>

          <p className="text-cream/20 text-[10px] tracking-[0.3em] uppercase font-bold mt-12">
            100% Eggless &nbsp;·&nbsp; Baked to Order &nbsp;·&nbsp; Hyderabad Only
          </p>
        </motion.div>
      </div>
    </section>
  );
}
