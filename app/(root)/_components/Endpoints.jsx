"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/ip-geo/v1",
    desc: "Auto-detect the caller's IP and return full geo data.",
    response: `
      {
  "timestamp": 1772823460945,
  "data": {
    "ip": "185.153.11.146",
    "geo": {
      "ip": null,
      "country": "FR",
      "countryName": "France",
      "region": "HDF",
      "regionName": "Hauts-de-France",
      "city": "Sainghin-en-Mélantois",
      "zip": "59262",
      "ll": [48.8582, 2.3387],
      "lat": 48.8582,
      "lon": 2.3387,
      "timezone": "Europe/Paris",
      ...
    `,
  },
  {
    method: "GET",
    path: "/api/ip-geo/v1/{185.153.11.146}",
    desc: "Look up any specific IPv4 or IPv6 address by param.",
    response: `
      {
  "timestamp": 1772823460945,
  "data": {
    "ip": "185.153.11.146",
    "geo": {
      "ip": null,
      "country": "FR",
      "countryName": "France",
      "region": "HDF",
      "regionName": "Hauts-de-France",
      "city": "Sainghin-en-Mélantois",
      "zip": "59262",
      "ll": [48.8582, 2.3387],
      "lat": 48.8582,
      "lon": 2.3387,
      "timezone": "Europe/Paris",
      ...
    `,
  },
//   {
//     method: "GET",
//     path: "/api/geo?fields=ip,city,country",
//     desc: "Request only the fields you need to keep responses lean.",
//     response: `{
//   "ip": "203.0.113.42",
//   "city": "San Francisco",
//   "country": "United States"
// }`,
//   },
];

function CodeBlock({ code }) {
  const lines = code.trim().split("\n");
  return (
    <div className="font-mono text-xs leading-6 overflow-x-auto">
      {lines.map((line, i) => {
        const isKey = /^\s+"[^"]+":/.test(line);
        const isString = /:\s*"/.test(line);
        const isNumber = /:\s*-?\d/.test(line);

        let colored = line;
        if (isKey) {
          colored = line.replace(
            /(".*?"):/,
            `<span class="text-cyan-400">$1</span>:`
          );
        }
        if (isString) {
          colored = colored.replace(
            /: (".+?")(,?)$/,
            `: <span class="text-[#00ff9d]">$1</span>$2`
          );
        } else if (isNumber) {
          colored = colored.replace(
            /: (-?\d+\.?\d*)(,?)$/,
            `: <span class="text-amber-400">$1</span>$2`
          );
        }

        return (
          <div
            key={i}
            className="text-zinc-300"
            dangerouslySetInnerHTML={{ __html: colored }}
          />
        );
      })}
    </div>
  );
}

export default function Endpoints() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(ENDPOINTS[active].response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="relative py-32 bg-zinc-950 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
            <span className="font-mono text-zinc-500 text-xs tracking-widest">ENDPOINTS</span>
          </div>
          <h2 className="font-mono text-4xl font-black text-white mb-4">
            Three Ways to{" "}
            <span className="text-[#00ff9d]">Query.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-3">
            {ENDPOINTS.map((ep, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  active === i
                    ? "border-[#00ff9d]/40 bg-[#00ff9d]/5"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-[#00ff9d] bg-[#00ff9d]/10 border border-[#00ff9d]/20 px-2 py-0.5 rounded">
                    {ep.method}
                  </span>
                </div>
                <div className="font-mono text-xs text-zinc-300 break-all mb-1">{ep.path}</div>
                <div className="font-mono text-xs text-zinc-600">{ep.desc}</div>
              </motion.button>
            ))}
          </div>

          {/* Response panel */}
          <div className="lg:col-span-3">
            <div className="relative h-full bg-black border border-zinc-800 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                  <span className="font-mono text-xs text-zinc-400 tracking-wider">RESPONSE</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[#00ff9d]">200 OK · 43ms</span>
                  <button
                    onClick={handleCopy}
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {copied ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
              </div>

              {/* Code */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CodeBlock code={ENDPOINTS[active].response} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Scan line effect */}
              <motion.div
                className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-[#00ff9d]/20 to-transparent pointer-events-none"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
