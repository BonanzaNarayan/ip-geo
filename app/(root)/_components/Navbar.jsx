"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-[#00ff9d]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <div className="w-7 h-7 rounded border border-[#00ff9d] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#00ff9d] rounded-sm animate-pulse" />
          </div>
          <span className="font-mono text-[#00ff9d] font-bold text-lg tracking-widest">
            IPGEO<span className="text-white">.API</span>
          </span>
        </motion.div>

        {/* CTA */}
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="font-mono text-xs text-black bg-[#00ff9d] px-4 py-2 rounded tracking-widest font-bold hover:bg-[#00ffb3] transition-colors"
        >
          GitHub
        </motion.a>
      </div>
    </motion.nav>
  );
}