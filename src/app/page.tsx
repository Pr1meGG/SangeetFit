"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import UploadPanel from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";
import GarmentPicker from "@/components/GarmentPicker";
import LogPanel from "@/components/LogPanel";

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
  };

  const handleVTO = async (userId: string, garmentId: string, category: string) => {
    setLoading(true);
    setResult(null);
    addLog(`Starting VTO: user=${userId}, garment=${garmentId}, category=${category}`);

    try {
      const res = await fetch("/api/vto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, garmentId, category }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.resultUrl || `Result: ${garmentId} rendered successfully`);
        addLog(`SUCCESS: ${garmentId} rendered`);
      } else {
        setResult(`Error: ${data.error}`);
        addLog(`FAIL: ${data.error}`);
      }
    } catch (err) {
      const msg = "API request failed";
      setResult(msg);
      addLog(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <UploadPanel onLog={addLog} />
            <GarmentPicker onLog={addLog} onSelect={handleVTO} loading={loading} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ResultPanel result={result} loading={loading} />
            <LogPanel logs={logs} />
          </div>
        </div>
      </div>
    </main>
  );
}
