"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X, Check } from "lucide-react";

const SELFIE_GUIDE = [
  "Fill the frame with your face — too far away and the AI can't read it.",
  "Face a window or light in front of you, never behind you.",
  "Remove hats and sunglasses. Both eyes visible, one face only.",
  "No filters or edits — a clear phone selfie works.",
];

const RETRY_HINT =
  "Your photo didn't work — try a brighter spot and hold the camera closer, then retake.";

interface FaceCameraCaptureProps {
  /** Called with the captured image as a File, ready for upload/compression. */
  onCapture: (file: File) => void;
  onClose: () => void;
  /** Show the retry hint above the camera (parent sets it when analysis failed). */
  showRetryHint?: boolean;
}

/**
 * In-browser face capture for the selfie skin-analysis step.
 * getUserMedia requires a secure context (localhost or HTTPS) — on insecure
 * hosts the browser simply rejects the stream and we surface the reason.
 */
export function FaceCameraCapture({ onCapture, onClose, showRetryHint }: FaceCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  const start = useCallback(async () => {
    setCameraError(null);
    setStarting(true);
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (err) {
      const message = (err as DOMException)?.name === "NotAllowedError"
        ? "Camera permission was denied. Allow camera access, or upload a photo instead."
        : ((err as Error).message || "Camera could not be started.");
      setCameraError(message);
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => {
    void start();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [start]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      blob => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        streamRef.current?.getTracks().forEach(t => t.stop());
        onCapture(file);
      },
      "image/jpeg",
      0.9,
    );
  };

  const retake = () => void start();

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-w-xs mx-auto">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
        {starting && !cameraError && (
          <p className="absolute inset-0 grid place-items-center text-xs text-gray-400">Starting camera…</p>
        )}
        {cameraError && (
          <div className="absolute inset-0 grid place-items-center p-4 text-center">
            <p className="text-xs text-red-400 flex items-start gap-1 text-left">
              <X className="w-3 h-3 shrink-0 mt-0.5" /> {cameraError}
            </p>
          </div>
        )}
        {!cameraError && (
          <div className="absolute inset-x-6 top-6 bottom-6 rounded-2xl border-2 border-dashed border-white/40 pointer-events-none" />
        )}
      </div>

      <ul className="text-xs text-gray-400 space-y-1 max-w-xs mx-auto">
        {SELFIE_GUIDE.map(line => (
          <li key={line} className="flex gap-1.5">
            <Check className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
            {line}
          </li>
        ))}
      </ul>

      {showRetryHint && <p className="text-xs text-amber-400 text-center max-w-xs mx-auto">{RETRY_HINT}</p>}

      <div className="flex items-center justify-center gap-3">
        <button onClick={capture} disabled={!!cameraError}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-400 disabled:opacity-40 transition-colors">
          <Camera className="w-4 h-4" /> Capture selfie
        </button>
        <button onClick={retake}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-700 text-gray-300 rounded-lg hover:border-gray-500 transition-colors">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
        <button onClick={onClose}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
