"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

function GlitchText({ text }) {
  return (
    <span className="relative inline-block">
      {text}
      <motion.span
        className="absolute inset-0 text-cyan-400 opacity-0"
        animate={{
          opacity: [0, 0.8, 0, 0.6, 0],
          x: [0, -2, 0, 3, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative py-40 bg-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#00ff9d]/30 to-transparent" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,157,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black pointer-events-none" />

      {/* Orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-[#00ff9d] opacity-10 blur-3xl"
        animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ left: "20%", top: "30%" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-cyan-500 opacity-10 blur-3xl"
        animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ right: "20%", bottom: "30%" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 border border-[#00ff9d]/30 bg-[#00ff9d]/5 rounded-full px-4 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="font-mono text-[#00ff9d] text-xs tracking-widest">NO CREDIT CARD · NO ACCOUNT</span>
          </div>

          <h2 className="font-mono text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Start Resolving IPs
            <br />
            <GlitchText text="In Seconds." />
          </h2>

          <p className="font-mono text-zinc-500 text-sm max-w-lg mx-auto leading-7 mb-12">
            Open. Free. Forever. Just make the request — no setup required.
            Built for developers who ship fast.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,255,157,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="font-mono text-sm text-black bg-[#00ff9d] px-10 py-4 rounded-lg font-black tracking-widest transition-all"
            >
              TRY THE API NOW →
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              className="font-mono text-sm text-zinc-400 border border-zinc-700 px-10 py-4 rounded-lg tracking-widest hover:border-zinc-500 transition-colors"
            >
              VIEW DOCUMENTATION
            </motion.a>
          </div>

          {/* Curl example */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 inline-flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3"
          >
            <span className="text-zinc-600 font-mono text-xs">$</span>
            <span className="font-mono text-xs text-[#00ff9d]">curl https://ip-geo-backend.onrender.com/api/geo</span>
            <motion.span
              className="w-1.5 h-4 bg-[#00ff9d]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded border border-[#00ff9d] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#00ff9d] rounded-sm" />
              </div>
              <span className="font-mono text-[#00ff9d] font-bold tracking-widest text-sm">
                IPGEO<span className="text-white">.API</span>
              </span>
            </div>
            <p className="font-mono text-zinc-600 text-xs leading-6">
              Free IP geolocation for every developer.
            </p>
          </div>


        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs text-zinc-700">
            © {new Date().getFullYear()} IPGEO.API — Free forever.
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="font-mono text-xs text-zinc-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
