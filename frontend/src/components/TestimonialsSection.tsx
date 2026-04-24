"use client";

const REVIEWS = [
  {
    quote: "The Nutella stuffed cookie is absolute heaven. I've never had anything like it in Hyderabad.",
    name: "Ananya",
    area: "Jubilee Hills"
  },
  {
    quote: "Perfectly crispy edges and a soft, fudgy centre. You can really taste the quality of the chocolate.",
    name: "Rahul",
    area: "Gachibowli"
  },
  {
    quote: "The 24-hour rest really makes a difference. These are world-class cookies.",
    name: "Priya",
    area: "Banjara Hills"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-forest relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <div key={i} className="glass-card p-10 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-cream/80 font-serif italic text-xl leading-relaxed mb-12">
                  &quot;{review.quote}&quot;
                </p>
              </div>
              <div>
                <p className="text-cream font-bold tracking-widest uppercase text-xs mb-1">{review.name}</p>
                <p className="text-gold text-[10px] tracking-widest uppercase opacity-60">{review.area}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
