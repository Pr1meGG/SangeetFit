"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  onLog: (msg: string) => void;
  onSelect: (userId: string, garmentId: string, category: string) => void;
  loading: boolean;
}

const GARMENTS = [
  { id: "saree", name: "Saree", cat: "ethnic", img: "🥻" },
  { id: "kurta_set", name: "Kurta Set", cat: "full_body", img: "👘" },
  { id: "lehenga_ethnic", name: "Lehenga", cat: "full_body", img: "👗" },
  { id: "western_dress", name: "Western Dress", cat: "full_body", img: "👗" },
];

export default function GarmentPicker({ onLog, onSelect, loading }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (g: typeof GARMENTS[0]) => {
    setSelected(g.id);
    onLog(`Selected garment: ${g.name} (${g.cat})`);
    onSelect("user_fullbody_hd", g.id, g.cat);
  };

  return (
    <div className="glass rounded-xl p-5">
      <h2 className="font-semibold mb-4">Select Garment</h2>
      <div className="grid grid-cols-2 gap-3">
        {GARMENTS.map(g => (
          <button
            key={g.id}
            onClick={() => handleClick(g)}
            disabled={loading}
            className={`p-3 rounded-lg border text-left transition-all ${
              selected === g.id
                ? "border-violet-500 bg-violet-500/10"
                : "border-gray-700 hover:border-gray-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="text-2xl mb-1">{g.img}</div>
            <div className="text-sm font-medium">{g.name}</div>
            <div className="text-xs text-gray-500">{g.cat}</div>
          </button>
        ))}
      </div>
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Processing via YouCam API...
        </div>
      )}
    </div>
  );
}
