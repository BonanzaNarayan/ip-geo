"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";

// ─── Config ────────────────────────────────────────────────────────────────────
const API_BASE = "https://ip-geo-backend.onrender.com/api/ip-geo/v1";

// ─── Data mapping ──────────────────────────────────────────────────────────────

/**
 * Flattens the API response into ordered, grouped display rows.
 * Uses geo.lat / geo.lon directly for full decimal precision.
 * Shape: { data: { ip, geo: { ...all fields } } }
 */
function flattenResponse(raw) {
  const ip  = raw.data.ip;
  const geo = raw.data.geo;

  const [rangeStart, rangeEnd] = geo.range ?? [null, null];

  // Prefer top-level lat/lon over ll[] — ll can be rounded integers
  const lat = geo.lat ?? geo.ll?.[0] ?? null;
  const lon = geo.lon ?? geo.ll?.[1] ?? null;

  return {
    ip,
    countryName: geo.countryName || "—",
    country:     geo.country     || "—",
    regionName:  geo.regionName  || "—",
    region:      geo.region      || "—",
    city:        geo.city        || "—",
    zip:         geo.zip         || "—",
    latitude:    lat !== null ? String(lat) : "—",
    longitude:   lon !== null ? String(lon) : "—",
    timezone:    geo.timezone    || "—",
    isp:         geo.isp         || "—",
    org:         geo.org         || "—",
    as:          geo.as          || "—",
    eu:          geo.eu === "1"  ? "Yes" : "No",
    mobile:      geo.mobile      ? "Yes" : "No",
    proxy:       geo.proxy       ? "Yes" : "No",
    hosting:     geo.hosting     ? "Yes" : "No",
    area:        geo.area        ? `${geo.area} km²` : "—",
    range:       rangeStart != null ? `${rangeStart} – ${rangeEnd}` : "—",
  };
}

const FIELD_LABELS = {
  ip:          "IP ADDRESS",
  countryName: "COUNTRY",
  country:     "COUNTRY CODE",
  regionName:  "REGION",
  region:      "REGION CODE",
  city:        "CITY",
  zip:         "ZIP / POSTAL",
  latitude:    "LATITUDE",
  longitude:   "LONGITUDE",
  timezone:    "TIMEZONE",
  isp:         "ISP",
  org:         "ORGANIZATION",
  as:          "AS NUMBER",
  eu:          "EU MEMBER",
  mobile:      "MOBILE",
  proxy:       "PROXY",
  hosting:     "HOSTING",
  area:        "AREA RADIUS",
  range:       "IP RANGE",
};

// Fields rendered as colour pills
const BADGE_STYLES = {
  mobile:  { Yes: "bg-sky-500/15 text-sky-400 border border-sky-500/30",      No: "bg-zinc-800/60 text-zinc-500 border border-zinc-700" },
  proxy:   { Yes: "bg-amber-500/15 text-amber-400 border border-amber-500/30", No: "bg-zinc-800/60 text-zinc-500 border border-zinc-700" },
  hosting: { Yes: "bg-violet-500/15 text-violet-400 border border-violet-500/30", No: "bg-zinc-800/60 text-zinc-500 border border-zinc-700" },
  eu:      { Yes: "bg-blue-500/15 text-blue-400 border border-blue-500/30",    No: "bg-zinc-800/60 text-zinc-500 border border-zinc-700" },
};

// Coord fields get a distinct teal colour
const COORD_FIELDS = new Set(["latitude", "longitude"]);

// Grouped sections for the fields view
const SECTIONS = [
  { label: "Identity",    keys: ["ip"] },
  { label: "Location",    keys: ["countryName", "country", "regionName", "region", "city", "zip"] },
  { label: "Coordinates", keys: ["latitude", "longitude", "timezone"] },
  { label: "Network",     keys: ["isp", "org", "as"] },
  { label: "Flags",       keys: ["eu", "mobile", "proxy", "hosting"] },
  { label: "Range",       keys: ["area", "range"] },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function DataRow({ label, fieldKey, value, delay }) {
  const isBadge = fieldKey in BADGE_STYLES;
  const isCoord = COORD_FIELDS.has(fieldKey);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, ease: "easeOut" }}
      className="flex items-center justify-between py-2.5 border-b border-zinc-800/50 last:border-0"
    >
      <span className="font-mono text-[11px] text-zinc-500 tracking-wider min-w-35">
        {label}
      </span>

      {isBadge ? (
        <span className={`font-mono text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full ${BADGE_STYLES[fieldKey][value]}`}>
          {value}
        </span>
      ) : (
        <span className={`font-mono text-xs text-right max-w-[55%] break-all ${isCoord ? "text-cyan-400 tabular-nums" : "text-[#00ff9d]"}`}>
          {value}
        </span>
      )}
    </motion.div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 pt-3 pb-1">
      <span className="font-mono text-[9px] text-zinc-600 tracking-[0.2em] uppercase whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  );
}

function RawJSON({ data }) {
  return (
    <pre className="font-mono text-xs text-zinc-400 leading-6 overflow-x-auto whitespace-pre-wrap break-all">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LiveDemo() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [tried,   setTried]   = useState(false);
  const [result,  setResult]  = useState(null);
  const [rawJson, setRawJson] = useState(null);
  const [error,   setError]   = useState(null);
  const [timing,  setTiming]  = useState(null);
  const [view,    setView]    = useState("fields");

  const handleTry = async () => {
    setLoading(true);
    setResult(null);
    setRawJson(null);
    setError(null);
    setTried(true);

    const trimmed = input.trim();
    const url = trimmed
      ? `${API_BASE}/${encodeURIComponent(trimmed)}`
      : `${API_BASE}/`;

    const t0 = performance.now();
    try {
      const res = await fetch(url);
      const ms  = Math.round(performance.now() - t0);
      setTiming(ms);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} — ${text || res.statusText}`);
      }

      const json = await res.json();
      setRawJson(json);
      setResult(flattenResponse(json));
    } catch (err) {
      setTiming(Math.round(performance.now() - t0));
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#00ff9d]/20 to-transparent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-[#00ff9d]/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="font-mono text-zinc-500 text-xs tracking-widest">LIVE PLAYGROUND</span>
          </div>
          <h2 className="font-mono text-4xl font-black text-white mb-4">
            Try It{" "}
            <span className="text-[#00ff9d]">Right Now.</span>
          </h2>
          <p className="font-mono text-zinc-500 text-sm max-w-lg mx-auto">
            Enter any IPv4 / IPv6 address, or leave blank to auto-detect your own IP.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex gap-3 mb-8"
          >
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-600 select-none">
                /v1/
              </span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleTry()}
                placeholder="154.161.0.53  (blank = your IP)"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-10 pr-4 py-3.5 font-mono text-xs text-[#00ff9d] placeholder-zinc-700 focus:outline-none focus:border-[#00ff9d]/50 transition-colors"
              />
            </div>
            <motion.button
              onClick={handleTry}
              disabled={loading}
              whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(0,255,157,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="font-mono text-xs text-black bg-[#00ff9d] px-8 py-3.5 rounded-lg font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-25"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ...
                </span>
              ) : "RUN →"}
            </motion.button>
          </motion.div>

          {/* Idle */}
          {!tried && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-10 text-center"
            >
              <div className="font-mono text-zinc-700 text-sm flex items-center justify-center gap-1">
                <span>{">"} waiting for query</span>
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>_</motion.span>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-10 flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-xs text-zinc-500 animate-pulse tracking-widest">RESOLVING...</span>
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-950 border border-red-500/30 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-mono text-xs text-red-400 font-bold tracking-widest">ERROR</span>
                  {timing != null && <span className="ml-auto font-mono text-xs text-zinc-600">{timing}ms</span>}
                </div>
                <p className="font-mono text-xs text-red-400/70 leading-6 break-all">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {result && !loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-950 border border-[#00ff9d]/20 rounded-xl overflow-hidden"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
                    <span className="font-mono text-xs text-[#00ff9d] font-bold">200 OK</span>
                    {timing != null && (
                      <>
                        <span className="font-mono text-xs text-zinc-700">·</span>
                        <span className="font-mono text-xs text-zinc-500">{timing}ms</span>
                      </>
                    )}
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center gap-0.5 bg-zinc-800 rounded-md p-0.5">
                    {["fields", "raw"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`font-mono text-[10px] tracking-widest px-3 py-1 rounded transition-all ${
                          view === v ? "bg-[#00ff9d] text-black font-bold" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {v.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    {view === "fields" ? (
                      <motion.div key="fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        {SECTIONS.map((section) => {
                          const rows = section.keys.filter((k) => result[k] !== undefined);
                          if (!rows.length) return null;
                          return (
                            <div key={section.label}>
                              <SectionDivider label={section.label} />
                              {rows.map((key, i) => (
                                <DataRow
                                  key={key}
                                  fieldKey={key}
                                  label={FIELD_LABELS[key] || key.toUpperCase()}
                                  value={result[key]}
                                  delay={i * 0.035}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div key="raw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <RawJSON data={rawJson} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}