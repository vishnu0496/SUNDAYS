"use client";

const STEPS = [
  {
    num: "01",
    title: "Pick Your Pack",
    desc: "Choose between our 3-cookie starter or 5+1 value pack."
  },
  {
    num: "02",
    title: "Fill Your Details",
    desc: "Give us your delivery address and contact info."
  },
  {
    num: "03",
    title: "Receive & Enjoy",
    desc: "We bake fresh and deliver cookie bliss to your door."
  }
];

export function StepsSection() {
  return (
    <section className="py-section bg-deep-forest relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-gap-lg">
          <p className="text-gold-muted tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">HOW IT WORKS</p>
          <h2 className="text-4xl md:text-6xl font-serif text-white">Three Steps to Cookie Bliss</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {STEPS.map((step) => (
            <div key={step.num} className="glass-card p-12 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 text-[10rem] font-serif font-bold text-white/[0.03] select-none group-hover:text-tan/10 transition-colors duration-700">
                {step.num}
              </div>
              <div className="relative z-10">
                <span className="text-tan font-serif text-2xl mb-6 block">{step.num}</span>
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
