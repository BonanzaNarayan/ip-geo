"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";

const SNIPPETS = {
  JavaScript: {
    icon: "JS",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    code: `const res = await fetch('https://ip-geo-backend.onrender.com/api/ip-geo/v1');
const data = await res.json();

console.log(data.geo.city);    // "San Francisco"
console.log(data.geo.country); // "United States"
console.log(data.geo.lat);     // 37.7749`,
  },
  Python: {
    icon: "PY",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    code: `import requests

res = requests.get('https://ip-geo-backend.onrender.com/api/ip-geo/v1')
data = res.json()

print(data['geo']['city'])     # San Francisco
print(data['geo']['country'])  # United States
print(data['geo']['lat'])      # 37.7749`,
  },
  cURL: {
    icon: "//",
    color: "text-[#00ff9d]",
    bg: "bg-[#00ff9d]/10 border-[#00ff9d]/20",
    code: `curl https://ip-geo-backend.onrender.com/api/ip-geo/v1

# Specific IP
curl https://ip-geo-backend.onrender.com/api/ip-geo/v1/{8.8.8.8}`,
  },
  PHP: {
    icon: "PHP",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
    code: `<?php
$res = file_get_contents('https://ip-geo-backend.onrender.com/api/ip-geo/v1');
$data = json_decode($res, true);

echo $data['geo']['city'];    // San Francisco
echo $data['geo']['country']; // United States
echo $data['geo']['lat'];     // 37.7749`,
  },
};

function CodeLine({ line }) {
  const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
  const isKeyword = /\b(const|let|var|import|from|await|fetch|echo|print|curl)\b/.test(line);

  return (
    <div className={`font-mono text-xs leading-6 ${isComment ? "text-zinc-600 italic" : "text-zinc-300"}`}>
      {line || "\u00A0"}
    </div>
  );
}

export default function CodeSnippets() {
  const [active, setActive] = useState("JavaScript");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [copied, setCopied] = useState(false);

  const snippet = SNIPPETS[active];

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative py-32 bg-zinc-950 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
              <span className="font-mono text-zinc-500 text-xs tracking-widest">INTEGRATIONS</span>
            </div>

            <h2 className="font-mono text-4xl font-black text-white mb-6 leading-tight">
              Works With
              <br />
              <span className="text-[#00ff9d]">Any Stack.</span>
            </h2>

            <p className="font-mono text-zinc-500 text-sm leading-7 mb-10">
              Standard HTTP. JSON responses. No SDKs, no wrappers, no lock-in.
              If your language can make a network request, it works.
            </p>

            {/* Language tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(SNIPPETS).map(([lang, meta]) => (
                <motion.button
                  key={lang}
                  onClick={() => setActive(lang)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`font-mono text-xs px-4 py-2 rounded border transition-all duration-200 ${
                    active === lang
                      ? `${meta.color} ${meta.bg}`
                      : "text-zinc-500 border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <span className="font-bold mr-1.5">{meta.icon}</span>
                  {lang}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: code window */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-linear-to-br from-[#00ff9d]/10 to-cyan-500/10 rounded-xl blur-lg" />
              <div className="relative bg-black border border-zinc-800 rounded-xl overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className={`ml-3 font-mono text-xs font-bold ${snippet.color}`}>
                      {active}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {copied ? "✓ COPIED" : "COPY"}
                  </button>
                </div>

                {/* Code lines with line numbers */}
                <div className="flex">
                  {/* Line numbers */}
                  <div className="px-4 py-5 border-r border-zinc-800/50 select-none">
                    {snippet.code.split("\n").map((_, i) => (
                      <div key={i} className="font-mono text-xs text-zinc-700 leading-6 text-right">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code */}
                  <div className="flex-1 px-5 py-5 overflow-x-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {snippet.code.split("\n").map((line, i) => (
                          <CodeLine key={i} line={line} />
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
