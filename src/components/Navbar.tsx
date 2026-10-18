"use client";

import { useEffect, useState } from "react";
import { Shirt, Cpu, Zap } from "lucide-react";

type Mode = "mock" | "live" | "unconfigured";

const MODE_LABELS: Record<Mode, { text: string; className: string; icon: "zap" | "cpu" }> = {
  live: { text: "Live AI", className: "text-green-400", icon: "zap" },
  mock: { text: "Mock Mode", className: "text-yellow-400", icon: "zap" },
  unconfigured: { text: "API Not Configured", className: "text-gray-500", icon: "cpu" },
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
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">SangeetFit</h1>
            <p className="text-xs text-gray-500">Indian Wedding Styling · YouCam API</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {label && label.icon === "zap" && (
            <span className={`flex items-center gap-1 ${label.className}`}>
              <Zap className="w-3 h-3" /> {label.text}
            </span>
          )}
          {label && label.icon === "cpu" && (
            <span className="flex items-center gap-1 text-gray-500">
              <Cpu className="w-3 h-3" /> {label.text}
            </span>
          )}
          {!label && (
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Checking…</span>
          )}
        </div>
      </div>
    </nav>
  );
}
