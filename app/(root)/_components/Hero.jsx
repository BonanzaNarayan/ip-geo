"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const TERMINAL_LINES = [
  '> GET /api/ip-geo/v1 HTTP/1.1',
  '> Host: https://ip-geo-backend.onrender.com',
  '',
  '< HTTP/1.1 200 OK',
  '< Content-Type: application/json',
  '',
  '{',
  '  "ip": "203.0.113.42",',
  '  "city": "San Francisco",',
  '  "region": "California",',
  '  "country": "US",',
  '  "lat": 37.7749,',
  '  "lon": -122.4194,',
  '  "isp": "Comcast Cable",',
  '  "timezone": "America/Los_Angeles"',
  '...',
];

function TerminalLine({ text, delay }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDone(true); return; }
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, 18);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  const color = text.startsWith(">") ? "text-[#00ff9d]"
    : text.startsWith("<") ? "text-cyan-400"
    : text.startsWith("{") || text.startsWith("}") ? "text-zinc-300"
    : text.includes('"ip"') || text.includes('"city"') || text.includes('"country"') || text.includes('"lat"') || text.includes('"lon"') || text.includes('"isp"') || text.includes('"timezone"') || text.includes('"region"') ? "text-zinc-300"
    : "text-zinc-400";

  return (
    <div className={`font-mono text-xs leading-5 ${color}`}>
      {displayed}
      {!done && <span className="animate-pulse">█</span>}
    </div>
  );
}

function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,157,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,157,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Fade edges */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />
    </div>
  );
}

export default function Hero() {
  const [lineDelays] = useState(() =>
    TERMINAL_LINES.map((_, i) => i * 120 + 600)
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 30);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 30);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      <GridBackground />
      <FloatingOrb className="w-96 h-96 bg-[#00ff9d] -top-20 -left-20" delay={0} />
      <FloatingOrb className="w-80 h-80 bg-cyan-500 bottom-0 right-0" delay={2} />
      <FloatingOrb className="w-64 h-64 bg-emerald-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={4} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Copy */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-[#00ff9d]/30 bg-[#00ff9d]/5 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="font-mono text-[#00ff9d] text-xs tracking-widest">FREE — NO API KEY REQUIRED</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-mono text-5xl lg:text-6xl font-black leading-tight mb-6"
          >
            <span className="text-white">Know Every</span>
            <br />
            <span className="text-[#00ff9d] relative">
              IP Address
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-[#00ff9d]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
            <br />
            <span className="text-zinc-500">In Milliseconds.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-zinc-400 text-sm leading-7 mb-10 max-w-lg"
          >
            Instant IP geolocation — country, city, coordinates, ISP, timezone and more.
            One endpoint. Zero auth. Free forever.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={'/docs'}>
                <motion.div
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,255,157,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="font-mono text-sm text-black bg-[#00ff9d] px-7 py-3.5 rounded font-bold tracking-widest transition-all"
                >
                VIEW DOCS →
                </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Right: Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ rotateX: springY, rotateY: springX }}
          className="perspective-1000"
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#00ff9d]/20 to-cyan-500/20 rounded-xl blur-xl" />

            {/* Terminal Window */}
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 font-mono text-xs text-zinc-500 tracking-wider">TERMINAL — ipgeo.api</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-0.5 min-h-85">
                {TERMINAL_LINES.map((line, i) => (
                  <TerminalLine key={i} text={line} delay={lineDelays[i]} />
                ))}
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-3">
                <span className="font-mono text-xs text-[#00ff9d]">✓ 200 OK</span>
                <span className="font-mono text-xs text-zinc-600">·</span>
                <span className="font-mono text-xs text-zinc-500">43ms</span>
                <span className="font-mono text-xs text-zinc-600">·</span>
                <span className="font-mono text-xs text-zinc-500">application/json</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}