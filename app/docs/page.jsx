"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DocsNavbar from "./_components/DocsNavbar";
import DocsSidebar from "./_components/DocsSidebar";
import DocsContent from "./_components/DocsContent";

export default function DocsPage() {
  const [active, setActive] = useState("introduction");

  return (
    <div className="min-h-screen bg-black text-white">
      <DocsNavbar />

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <DocsSidebar active={active} onSelect={setActive} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Subtle grid background */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,255,157,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,157,1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
          <div className="fixed inset-0 pointer-events-none bg-linear-to-b from-black via-transparent to-black opacity-60" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <DocsContent activeSection={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
