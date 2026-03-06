"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function DocsNavbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/90 backdrop-blur-md border-b border-zinc-800 flex items-center"
    >
      <div className="w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-[#00ff9d]/60 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#00ff9d] rounded-sm animate-pulse" />
            </div>
            <span className="font-mono text-sm font-bold text-[#00ff9d] tracking-widest">
              IPGEO<span className="text-white">.API</span>
            </span>
          </Link>

          {/* Divider */}
          <span className="text-zinc-700 font-mono text-lg font-thin">/</span>

          {/* Page label */}
          <span className="font-mono text-sm text-zinc-400 tracking-wider">Docs</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-zinc-200 transition-colors tracking-wider">
            ← Back to Home
          </Link>
          <a
            href="#"
            className="font-mono text-xs text-black bg-[#00ff9d] px-4 py-2 rounded font-bold tracking-widest hover:bg-[#00ffb3] transition-colors"
          >
            GITHUB
          </a>
        </div>
      </div>
    </motion.header>
  );
}
