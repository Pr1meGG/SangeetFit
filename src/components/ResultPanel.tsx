"use client";

import { Image as ImageIcon, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Props {
  result: string | null;
  loading: boolean;
}

export default function ResultPanel({ result, loading }: Props) {
  return (
    <div className="glass rounded-xl p-5">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-violet-400" /> : <ImageIcon className="w-4 h-4 text-violet-400" />}
        Try-On Result
      </h2>

      {loading ? (
        <div className="h-48 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm">Polling YouCam API...</p>
          <p className="text-xs text-gray-600 mt-1">This may take 10-30 seconds</p>
        </div>
      ) : result ? (
        <div className="space-y-3">
          {result.startsWith("Error") ? (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" /> {result}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {result}
            </div>
          )}
          <p className="text-xs text-gray-600">
            Mock mode active — connect YOUCAM_API_KEY for real renders.
          </p>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
          Select a garment to see the try-on result
        </div>
      )}
    </div>
  );
}
