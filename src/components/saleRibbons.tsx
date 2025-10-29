"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SaleRibbons() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000); // show for 10s
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const ribbons = Array.from({ length: 6 }); // number of ribbons

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-transparent">
      {ribbons.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: "100vw", // start from right outside
            y: `-${100 + i * 20}vh`, // staggered top positions
            rotate: 45,
          }}
          animate={{
            x: `-${120}vw`, // move to left outside
            y: `120vh`,     // move down
          }}
          transition={{
            duration: 12,       // slower movement
            ease: "linear",
            delay: i * 0.5,     // stagger ribbons
            repeat: Infinity,   // loop
          }}
          className="absolute w-[300%] bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-center py-2 font-semibold text-sm uppercase tracking-[0.3em] shadow-lg"
          style={{
            opacity: 0.9,
          }}
        >
          🔥 Mega Sale • Limited Time • Hurry Up! 🔥
        </motion.div>
      ))}
    </div>
  );
}
