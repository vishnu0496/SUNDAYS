"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Review = {
  id: string;
  name: string;
  rating: number;
  message: string;
};

type ReviewResponse = {
  success?: boolean;
  reviews?: Review[];
};

const fallbackReview: Review = {
  id: "fallback",
  name: "Sundays Customer",
  rating: 5,
  message: "Fresh, soft, beautifully homemade, and definitely a 5-star treat.",
};

function truncateReview(message: string) {
  if (message.length <= 110) return message;
  return `${message.slice(0, 107).trim()}...`;
}

export function ReviewSpotlight() {
  const [reviews, setReviews] = useState<Review[]>([]);

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

  const fiveStarReviews = reviews.filter((review) => review.rating === 5);
  const featuredReview = fiveStarReviews[0] || reviews[0] || fallbackReview;
  const reviewCount = reviews.length;
  const headline = reviewCount > 0 ? `${reviewCount} reviews` : "customer reviews";

  return (
    <section className="relative z-20 bg-[#030A08] px-4 py-6 sm:px-6">
      <motion.a
        href="#reviews"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto block max-w-5xl border-y border-gold/15 py-5 transition-colors hover:border-gold/35"
        aria-label="Read Sundays customer reviews"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-muted">
            <span className="text-base tracking-[0.12em] text-tan">{"\u2605".repeat(5)}</span>
            <span>Rated 5.0 by {headline}</span>
          </div>

          <blockquote className="max-w-2xl font-serif text-base italic leading-relaxed text-cream/65 md:text-lg">
            &quot;{truncateReview(featuredReview.message)}&quot;
            <span className="ml-2 text-[10px] font-bold not-italic uppercase tracking-[0.2em] text-gold-muted">
              {featuredReview.name}
            </span>
          </blockquote>

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cream/45">
            Read reviews
          </span>
        </div>
      </motion.a>
    </section>
  );
}
