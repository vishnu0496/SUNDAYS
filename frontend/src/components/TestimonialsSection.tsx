"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Review = {
  id: string;
  name: string;
  rating: number;
  message: string;
  imageDataUrl?: string;
  createdAt: string;
};

type ReviewResponse = {
  success?: boolean;
  reviews?: Review[];
  review?: Review;
  error?: string;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function Stars({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (rating: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating;
        if (!onChange) {
          return (
            <span key={star} className={`text-2xl leading-none ${active ? "text-tan" : "text-cream/20"}`}>
              ★
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`h-12 w-12 rounded-full border text-xl leading-none transition-all ${
              active
                ? "border-tan bg-tan text-forest shadow-[0_0_18px_rgba(199,164,76,0.18)]"
                : "border-gold/15 bg-white/[0.03] text-cream/35 hover:border-tan/50 hover:text-tan"
            }`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: ReviewResponse) => {
        if (mounted && data.success && data.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setStatus("");

    if (!file) {
      setImageDataUrl("");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setStatus("Please upload an image under 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    if (!name.trim() || !message.trim()) {
      setStatus("Please add your name and review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, message, imageDataUrl }),
      });
      const data = (await response.json()) as ReviewResponse;

      if (!response.ok || !data.success || !data.review) {
        throw new Error(data.error || "Could not save review.");
      }

      setReviews((current) => [data.review!, ...current].slice(0, 6));
      setName("");
      setRating(5);
      setMessage("");
      setImageDataUrl("");
      setStatus("Review added. Thank you for sharing your Sunday.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredReviews = reviews.slice(0, 3);

  return (
    <section id="reviews" className="py-32 bg-deep-forest relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(199,164,76,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-14"
        >
          <div className="flex items-center gap-6 justify-center mb-12">
            <div className="h-px w-20 bg-gold/20" />
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase font-bold">Reviews</span>
            <div className="h-px w-20 bg-gold/20" />
          </div>

          <h2 className="text-4xl md:text-6xl font-serif text-cream mb-6 leading-tight">
            Share your<br />
            <span className="font-serif-display text-tan italic">Sunday bite.</span>
          </h2>

          <p className="text-cream/50 text-lg md:text-xl font-serif leading-relaxed max-w-2xl mx-auto font-light italic">
            Tell us how the box arrived, what you tasted first, and which flavour deserves a comeback.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 items-start">
          <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-7">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">
                  Your Name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input-premium h-14 text-base"
                  placeholder="Name"
                  maxLength={80}
                />
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold">
                    Tap to Rate
                  </label>
                  <span className="text-tan text-[11px] tracking-[0.2em] uppercase font-bold">
                    {rating}/5
                  </span>
                </div>
                <Stars rating={rating} onChange={setRating} />
              </div>
            </div>

            <div>
              <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">
                Review
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="input-premium min-h-[150px] py-4 text-base"
                placeholder="The cookie was..."
                maxLength={700}
              />
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <label className="flex cursor-pointer items-center justify-between gap-5 rounded-[8px] border border-gold/15 bg-white/[0.03] px-6 py-5 hover:border-gold/40 hover:bg-gold/[0.03] transition-colors">
                <span>
                  <span className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-2">
                    Add Photo
                  </span>
                  <span className="block text-cream/45 font-serif italic">
                    {imageDataUrl ? "Photo selected" : "Show us your cookie picture"}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-tan px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-forest">
                  ↑ Choose Photo
                </span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
              </label>

              {imageDataUrl && (
                <div className="h-24 w-24 overflow-hidden rounded-[8px] border border-gold/20">
                  <img src={imageDataUrl} alt="Review preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {status && (
              <p className="rounded-[8px] border border-gold/10 bg-gold/5 px-4 py-3 text-sm text-cream/70">
                {status}
              </p>
            )}

            <button disabled={isSubmitting} className="premium-button w-full py-6 disabled:opacity-50">
              {isSubmitting ? "Saving Review..." : "Submit Review"}
            </button>
          </form>

          <div className="space-y-5">
            {featuredReviews.length === 0 ? (
              <div className="glass-card p-8 md:p-10 min-h-[280px] flex flex-col justify-center">
                <Stars rating={5} />
                <p className="mt-8 text-3xl md:text-4xl font-serif text-cream leading-tight">
                  First reviews are coming soon.
                </p>
                <p className="mt-5 text-cream/45 font-serif italic text-lg leading-relaxed">
                  Your photo and words will appear here after you submit them.
                </p>
              </div>
            ) : (
              featuredReviews.map((review) => (
                <article key={review.id} className="glass-card p-6 flex gap-5">
                  {review.imageDataUrl && (
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[8px] border border-gold/10">
                      <img src={review.imageDataUrl} alt={`${review.name} review`} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div>
                    <Stars rating={review.rating} />
                    <p className="mt-3 text-cream/70 font-serif italic leading-relaxed">&ldquo;{review.message}&rdquo;</p>
                    <p className="mt-4 text-gold-muted text-[10px] tracking-[0.2em] uppercase font-bold">
                      {review.name}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
