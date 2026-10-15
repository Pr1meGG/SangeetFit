"use client";

import { useState, useRef } from "react";
import { Upload, Camera, AlertCircle } from "lucide-react";

interface Props {
  onLog: (msg: string) => void;
}

const SAMPLE_USER = "/garment_test/user_fullbody_hd.jpg";

export default function UploadPanel({ onLog }: Props) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    onLog(`Uploaded user photo: ${file.name}`);
  };

  const useSample = () => {
    setUserPhoto(SAMPLE_USER);
    onLog("Using sample full-body photo");
  };

  return (
    <div className="glass rounded-xl p-5">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-4 h-4 text-violet-400" /> Upload User Photo
      </h2>
      <p className="text-xs text-gray-500 mb-4">Full-body, frontal, even lighting. HD ≥1080px preferred.</p>

      {userPhoto ? (
        <div className="space-y-3">
          <img src={userPhoto} alt="User" className="w-full max-h-64 object-contain rounded-lg bg-gray-900" />
          <p className="text-xs text-green-400">✓ Photo loaded</p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-violet-500 transition-colors cursor-pointer"
             onClick={() => fileRef.current?.click()}>
          <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Click to upload or use sample</p>
          <p className="text-xs text-gray-600 mt-1">JPG/PNG under 10MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}

      <button onClick={useSample} className="mt-3 w-full py-2 text-xs text-gray-400 border border-gray-700 rounded-lg hover:border-violet-500 hover:text-violet-400 transition-colors">
        Use Sample Photo
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
