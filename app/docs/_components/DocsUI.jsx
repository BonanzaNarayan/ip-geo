"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, variant = "green" }) {
  const styles = {
    green:  "bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30",
    cyan:   "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    amber:  "bg-amber-500/10 text-amber-400 border-amber-500/30",
    red:    "bg-red-500/10 text-red-400 border-red-500/30",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    zinc:   "bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  return (
    <span className={`inline-flex items-center font-mono text-[10px] font-bold tracking-widest border rounded-full px-2.5 py-0.5 ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ─── Method badge ──────────────────────────────────────────────────────────────
export function MethodBadge({ method }) {
  const c = method === "GET" ? "bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30"
          : method === "POST" ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
          : "bg-zinc-800 text-zinc-400 border-zinc-700";
  return (
    <span className={`font-mono text-xs font-black px-2.5 py-1 rounded border ${c}`}>
      {method}
    </span>
  );
}

// ─── Endpoint URL bar ──────────────────────────────────────────────────────────
export function EndpointBar({ method, path }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 my-4">
      <MethodBadge method={method} />
      <code className="font-mono text-sm text-zinc-200 flex-1 break-all">{path}</code>
    </div>
  );
}

// ─── Code block with language tabs & copy ──────────────────────────────────────
export function CodeBlock({ tabs }) {
  // tabs: [{ lang: "cURL", code: "..." }, ...]
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden my-5">
      {/* Tab bar */}
      <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-2">
        <div className="flex gap-1">
          {tabs.map((t, i) => (
            <button
              key={t.lang}
              onClick={() => setActive(i)}
              className={`font-mono text-[10px] tracking-widest px-3 py-1.5 rounded transition-all ${
                active === i
                  ? "bg-[#00ff9d] text-black font-bold"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.lang}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 tracking-wider transition-colors"
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>

      {/* Code */}
      <div className="bg-black p-5 overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.pre
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="font-mono text-xs text-zinc-300 leading-6 whitespace-pre"
          >
            {tabs[active].code}
          </motion.pre>
        </AnimatePresence>
      </div>

      {/* Scan line */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-[#00ff9d]/15 to-transparent pointer-events-none"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

// ─── Parameter / field table ───────────────────────────────────────────────────
export function ParamTable({ rows }) {
  // rows: [{ name, type, required, description, example? }]
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden my-5">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800">
            <th className="text-left px-4 py-3 text-zinc-500 tracking-widest font-normal w-40">FIELD</th>
            <th className="text-left px-4 py-3 text-zinc-500 tracking-widest font-normal w-28">TYPE</th>
            <th className="text-left px-4 py-3 text-zinc-500 tracking-widest font-normal">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={`border-b border-zinc-800/60 last:border-0 ${i % 2 === 0 ? "bg-black" : "bg-zinc-950/40"}`}
            >
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                  <span className="text-[#00ff9d]">{row.name}</span>
                  {row.required && (
                    <span className="text-[8px] text-red-400 border border-red-400/30 bg-red-400/5 px-1.5 py-0.5 rounded tracking-widest">REQ</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 align-top text-cyan-400/80">{row.type}</td>
              <td className="px-4 py-3 align-top text-zinc-400 leading-5">
                {row.description}
                {row.example && (
                  <span className="block mt-1 text-zinc-600">e.g. <span className="text-zinc-500">{row.example}</span></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
export function DocSection({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-20">
      <div className="mb-6">
        {subtitle && (
          <p className="font-mono text-[10px] text-zinc-600 tracking-[0.2em] uppercase mb-2">{subtitle}</p>
        )}
        <h2 className="font-mono text-2xl font-black text-white">{title}</h2>
      </div>
      <div className="text-zinc-400 text-sm leading-7 space-y-4">{children}</div>
    </section>
  );
}

// ─── Inline code ───────────────────────────────────────────────────────────────
export function IC({ children }) {
  return (
    <code className="font-mono text-xs text-[#00ff9d] bg-[#00ff9d]/8 border border-[#00ff9d]/15 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

// ─── Callout box ───────────────────────────────────────────────────────────────
export function Callout({ type = "info", children }) {
  const styles = {
    info:    { border: "border-cyan-500/30",   bg: "bg-cyan-500/5",   icon: "ℹ", text: "text-cyan-400" },
    warning: { border: "border-amber-500/30",  bg: "bg-amber-500/5",  icon: "⚠", text: "text-amber-400" },
    tip:     { border: "border-[#00ff9d]/30",  bg: "bg-[#00ff9d]/5",  icon: "✦", text: "text-[#00ff9d]" },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 border ${s.border} ${s.bg} rounded-lg px-4 py-3.5 my-5`}>
      <span className={`${s.text} text-sm mt-0.5 shrink-0`}>{s.icon}</span>
      <div className={`font-mono text-xs leading-6 ${s.text}`}>{children}</div>
    </div>
  );
}
