"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const FEATURES = [
  {
    icon: "⚡",
    title: "Zero Auth Required",
    description: "Hit any endpoint instantly. No API keys, no sign-ups, no rate limits to start. Just pure, open access.",
    tag: "FREE FOREVER",
    tagColor: "text-[#00ff9d] border-[#00ff9d]/30 bg-[#00ff9d]/5",
  },
  {
    icon: "🌍",
    title: "Global Coverage",
    description: "Accurate geolocation data for 99.8% of IPv4 and IPv6 addresses across 240+ countries and territories.",
    tag: "240+ COUNTRIES",
    tagColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
  },
  {
    icon: "⚙️",
    title: "Single Endpoint",
    description: "One clean REST endpoint. Pass any IP or omit it to auto-detect the caller. Works with fetch, axios, curl — anything.",
    tag: "REST API",
    tagColor: "text-violet-400 border-violet-400/30 bg-violet-400/5",
  },
  {
    icon: "🏙️",
    title: "Rich Data",
    description: "City, region, country, ISP, ASN, coordinates, timezone, currency, and calling code — all in one response.",
    tag: "15+ FIELDS",
    tagColor: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  },
  {
    icon: "🔒",
    title: "No Logs, No Tracking",
    description: "We don't store queries or build profiles. Your lookups are ephemeral — privacy first by design.",
    tag: "PRIVACY FIRST",
    tagColor: "text-rose-400 border-rose-400/30 bg-rose-400/5",
  },
  {
    icon: "🚀",
    title: "Sub-50ms Responses",
    description: "Backed by a global edge network. Responses are cached and served from the closest node to your request.",
    tag: "EDGE NETWORK",
    tagColor: "text-sky-400 border-sky-400/30 bg-sky-400/5",
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, borderColor: "rgba(0,255,157,0.3)" }}
      className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-6 transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/0 to-[#00ff9d]/0 group-hover:from-[#00ff9d]/[0.03] group-hover:to-transparent transition-all duration-500 rounded-xl" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#00ff9d]/40 to-transparent" />
        <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-[#00ff9d]/40 to-transparent" />
      </div>

      <div className="relative">
        <div className="text-3xl mb-4">{feature.icon}</div>
        <span className={`inline-block font-mono text-[10px] tracking-widest border rounded-full px-2.5 py-0.5 mb-3 ${feature.tagColor}`}>
          {feature.tag}
        </span>
        <h3 className="font-mono text-white font-bold text-base mb-2 tracking-wide">
          {feature.title}
        </h3>
        <p className="font-mono text-zinc-500 text-xs leading-6">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff9d]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
            <span className="font-mono text-zinc-500 text-xs tracking-widest">WHY IPGEO.API</span>
          </div>
          <h2 className="font-mono text-4xl lg:text-5xl font-black text-white mb-4">
            Everything You Need,{" "}
            <span className="text-[#00ff9d]">Nothing You Don't.</span>
          </h2>
          <p className="font-mono text-zinc-500 text-sm max-w-xl mx-auto leading-7">
            Built for developers who want accurate IP data without the enterprise overhead.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
