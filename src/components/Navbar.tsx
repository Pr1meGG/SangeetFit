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
    <header className="sf-navbar sticky top-0 z-50">
      <nav aria-label="Main navigation" className="sf-navbar-inner">
        <Link href="/" className="sf-brand">
          <img src="/brand/logo-symbol.svg" alt="" className="h-10 w-10 rounded-xl" width={40} height={40} />
          <span className="sf-brand-copy">
            <span className="sf-wordmark">SangeetFit</span>
            <span className="sf-brand-tagline">A little occasion. A lot of you.</span>
          </span>
        </Link>
        <Link href="/library" className="sf-navbar-explore">Explore collection</Link>
        <div className="sf-navbar-state">
          <span role="status" className={`sf-mode ${label?.className ?? "text-[#78665E]"}`}>
            {label?.icon === "zap" ? <Zap className="h-3 w-3" aria-hidden="true" /> : <Cpu className="h-3 w-3" aria-hidden="true" />}
            {label?.text ?? "Checking…"}
          </span>
        </div>
      </nav>
    </header>
  );
}
