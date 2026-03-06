"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";

const NAV = [
  {
    group: "GETTING STARTED",
    items: [
      { id: "introduction",    label: "Introduction" },
      { id: "quickstart",      label: "Quick Start" },
      { id: "authentication",  label: "Authentication" },
    ],
  },
  {
    group: "ENDPOINTS",
    items: [
      { id: "auto-detect",     label: "GET /v1/",       badge: "GET",  color: "text-[#00ff9d]" },
      { id: "lookup-ip",       label: "GET /v1/{ip}",   badge: "GET",  color: "text-[#00ff9d]" },
    ],
  },
  {
    group: "RESPONSE",
    items: [
      { id: "data-structure",  label: "Data Structure" },
      { id: "field-reference", label: "Field Reference" },
      { id: "error-codes",     label: "Error Codes" },
    ],
  },
  {
    group: "GUIDES",
    items: [
      { id: "code-examples",   label: "Code Examples" },
      { id: "rate-limits",     label: "Rate Limits" },
    ],
  },
];

export default function DocsSidebar({ active, onSelect }) {
  return (
    <aside className="w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-zinc-800 bg-black">
      <div className="px-5 py-8 space-y-7">
        {/* Logo back link */}
        <Link href="/" className="flex items-center gap-2 mb-2 group">
          <div className="w-6 h-6 rounded border border-[#00ff9d]/60 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#00ff9d] rounded-sm" />
          </div>
          <span className="font-mono text-sm font-bold text-[#00ff9d] tracking-widest">
            IPGEO<span className="text-white">.API</span>
          </span>
        </Link>

        <div className="h-px bg-zinc-800" />

        {NAV.map((section) => (
          <div key={section.group}>
            <p className="font-mono text-[9px] tracking-[0.2em] text-zinc-600 mb-3 uppercase">
              {section.group}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-150 font-mono text-xs tracking-wide ${
                        isActive
                          ? "bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                      }`}
                    >
                      {item.badge && (
                        <span className={`text-[9px] font-black tracking-widest ${item.color}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-dot"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff9d]"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
