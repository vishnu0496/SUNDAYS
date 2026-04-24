"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="w-4 h-4 bg-gold rounded-full mix-blend-difference"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
          scale: isHovering ? 2.5 : 1,
          opacity: 0.8
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.5 }}
      />
      <motion.div
        className="fixed w-10 h-10 border border-gold/30 rounded-full"
        animate={{
          x: mousePos.x - 20,
          y: mousePos.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: "spring", damping: 40, stiffness: 300, mass: 1 }}
      />
    </div>
  );
}
