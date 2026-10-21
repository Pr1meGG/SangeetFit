"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, Zap } from "lucide-react";

type Mode = "mock" | "live" | "unconfigured";

const MODE_LABELS: Record<Mode, { text: string; className: string; icon: "zap" | "cpu" }> = {
  live: { text: "Live AI", className: "text-[#35634C]", icon: "zap" },
  mock: { text: "Mock Mode", className: "text-[#805522]", icon: "zap" },
  unconfigured: { text: "API Not Configured", className: "text-[#78665E]", icon: "cpu" },
};

export default function Navbar() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    fetch("/api/mode")
      .then(res => res.json())
      .then((data: { mode?: string }) => {
        if (data.mode === "mock" || data.mode === "live" || data.mode === "unconfigured") {
          setMode(data.mode);
        } else {
          setMode("unconfigured");
        }
      })
      .catch(() => setMode("unconfigured"));
  }, []);

  const label = mode ? MODE_LABELS[mode] : null;

  return (
    <header className="sf-navbar sticky top-0 z-50 border-b border-[#E8DED1] bg-[#FBF7EF]/95 px-4 py-3 backdrop-blur-md sm:px-8">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1E3A]">
          <img src="/brand/logo-symbol.svg" alt="" className="h-10 w-10 rounded-xl" width={40} height={40} />
          <span>
            <span className="block text-lg font-bold tracking-tight text-[#6B1E3A]">SangeetFit</span>
            <span className="hidden text-[11px] text-[#78665E] sm:block">A little occasion. A lot of you.</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 text-xs sm:gap-6 sm:text-sm">
          <Link href="/library" className="hidden min-h-11 items-center rounded-lg px-2 font-medium text-[#6B1E3A] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1E3A] sm:inline-flex">Explore collection</Link>
          <span role="status" className={`inline-flex items-center gap-1.5 rounded-full border border-[#E8DED1] bg-white/70 px-3 py-2 font-medium ${label?.className ?? "text-[#78665E]"}`}>
            {label?.icon === "zap" ? <Zap className="h-3 w-3" aria-hidden="true" /> : <Cpu className="h-3 w-3" aria-hidden="true" />}
            {label?.text ?? "Checking…"}
          </span>
        </div>
      </nav>
    </header>
  );
}
