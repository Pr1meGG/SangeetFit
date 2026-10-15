"use client";

import { ScrollText } from "lucide-react";

interface Props {
  logs: string[];
}

export default function LogPanel({ logs }: Props) {
  return (
    <div className="glass rounded-xl p-5">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <ScrollText className="w-4 h-4 text-violet-400" /> Activity Log
      </h2>
      <div className="h-40 overflow-y-auto space-y-1 text-xs font-mono">
        {logs.length === 0 ? (
          <p className="text-gray-600">No activity yet...</p>
        ) : (
          logs.map((log, i) => (
            <p key={i} className="text-gray-400">{log}</p>
          ))
        )}
      </div>
    </div>
  );
}
