"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, Check, Sun, AlertTriangle } from "lucide-react";

const GUIDE = [
  "Fill the oval with your face",
  "Light in front of you, not behind",
  "Remove hats & sunglasses",
  "No filters — a clear photo works",
];

const HINTS = {
  none: { text: "Bring your face into the oval", tone: "" },
  far: { text: "Move a little closer", tone: "warn" },
  near: { text: "Move back a bit", tone: "warn" },
  off: { text: "Center your face in the oval", tone: "warn" },
  ok: { text: "Perfect — hold still ✨", tone: "ok" },
  dark: { text: "Find brighter light in front of you", tone: "bad" },
} as const;

type HintKey = keyof typeof HINTS;
type Phase = "loading-model" | "live" | "static" | "confirm" | "error";

interface Detected {
  boundingBox: { origin: { x: number; y: number }; width: number; height: number };
}

interface FaceDetectorLike {
  detect(video: HTMLVideoElement): Detected[] | null;
}

interface FaceCameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function FaceCameraCapture({ onCapture, onClose }: FaceCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<FaceDetectorLike | null>(null);
  const timerRef = useRef<number>(0);
  const [phase, setPhase] = useState<Phase>("loading-model");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hint, setHint] = useState<HintKey>("none");
  const [flash, setFlash] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const start = useCallback(async () => {
    setCameraError(null);
    setPhase("loading-model");
    setHint("none");
    setPreview(null);
    window.clearTimeout(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported in this browser");
      }
      if (!window.isSecureContext) {
        throw new Error("Camera needs a secure (https) connection — open the preview URL on your phone.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => undefined);
      await startDetector();
      setPhase(detectorRef.current ? "live" : "static");
      if (detectorRef.current) scheduleDetect();
    } catch (err) {
      const name = (err as DOMException)?.name;
      setCameraError(
        name === "NotAllowedError"
          ? "Camera permission denied. Allow access in the address bar, or upload a photo instead."
          : (err as Error).message || "Camera could not be started.",
      );
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void start();
    return () => {
      window.clearTimeout(timerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [start]);

  async function startDetector() {
    if (detectorRef.current) return;
    try {
      // ponytail: runtime CDN import keeps the ~1MB tasks-vision wasm/model out
      // of the npm bundle; falls back to static oval when CDN is unreachable.
      const cdnUrl = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
      const tasksVision = (await import(/* webpackIgnore: true */ /* @vite-ignore */ cdnUrl)) as unknown as {
        FaceDetector: new (options: object) => FaceDetectorLike;
        FilesetResolver: { forVisionTasks: (path: string) => Promise<{ faceDetector: (o: object) => Promise<FaceDetectorLike> }> };
      };
      const fileset = await tasksVision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
      );
      const detector = await fileset.faceDetector({
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
      });
      detectorRef.current = detector;
    } catch {
      detectorRef.current = null; // static oval + brightness fallback
    }
  }

  function scheduleDetect() {
    timerRef.current = window.setTimeout(runDetect, 200);
  }

  const runDetect = useCallback(() => {
    const video = videoRef.current;
    const detector = detectorRef.current;
    if (!video?.videoWidth || !detector) return;
    let next: HintKey = "none";
    try {
      const dets = detector.detect(video) ?? [];
      const box = dets[0]?.boundingBox;
      if (!box) {
        next = "none";
      } else {
        const faceCx = (box.origin.x + box.width / 2) / video.videoWidth;
        const faceCy = (box.origin.y + box.height / 2) / video.videoHeight;
        const faceSize = box.width / video.videoWidth;
        if (faceSize < 0.3) next = "far";
        else if (faceSize > 0.62) next = "near";
        else if (Math.abs(faceCx - 0.5) > 0.18 || Math.abs(faceCy - 0.42) > 0.2) next = "off";
        else next = "ok";
      }
      if (next !== "ok" && sampledBrightness(video) < 42) next = "dark";
    } catch {
      next = "none";
    }
    setHint(next);
    scheduleDetect();
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      blob => {
        if (!blob) return;
        setFlash(true);
        window.setTimeout(() => setFlash(false), 120);
        setPreview(canvas.toDataURL("image/jpeg", 0.9));
        setPhase("confirm");
        window.clearTimeout(timerRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
      },
      "image/jpeg",
      0.9,
    );
  };

  const confirm = () => {
    if (!preview) return;
    fetch(preview)
      .then(r => r.blob())
      .then(b => onCapture(new File([b], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" })));
  };

  return (
    <div className="space-y-4">
      <div className="cap-stage max-w-xs mx-auto">
        <video ref={videoRef} playsInline muted />
        {flash && <div className="cap-flash active" />}
        {phase === "confirm" && preview && (
          <img src={preview} alt="Captured selfie preview" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {(phase === "live" || phase === "static") && (
          <>
            <div className={`cap-oval ${hint === "ok" ? "ok oval-live" : ""} ${phase === "static" ? "dashed" : ""}`} />
            <p className={`cap-hint absolute inset-x-3 bottom-3 ${HINTS[hint].tone}`}>
              {phase === "static"
                ? "Live face tracking unavailable — center your face in the oval"
                : HINTS[hint].text}
            </p>
          </>
        )}
        {phase === "loading-model" && !cameraError && (
          <p className="absolute inset-0 grid place-items-center text-xs text-gray-400">Starting camera…</p>
        )}
        {cameraError && (
          <div className="absolute inset-0 grid place-items-center p-4 text-center">
            <p className="text-xs cap-hint bad flex items-start gap-1 text-left">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" /> {cameraError}
            </p>
          </div>
        )}
      </div>

      {phase === "confirm" && preview ? (
        <div className="flex items-center justify-center gap-3">
          <button onClick={confirm} className="cap-btn-primary">
            <Check className="w-4 h-4" /> Use this photo
          </button>
          <button onClick={() => void start()} className="cap-btn-ghost">
            <RefreshCw className="w-4 h-4" /> Retake
          </button>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300">Cancel</button>
        </div>
      ) : (
        <>
          <div className="max-w-xs mx-auto grid gap-2">
            {GUIDE.map(g => (
              <div key={g} className="cap-card">
                <Sun className="w-3 h-3 text-[var(--cap-accent)] shrink-0 mt-0.5" />
                {g}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={capture} disabled={phase !== "live" && phase !== "static"} className="cap-btn-primary">
              <Camera className="w-4 h-4" /> {phase === "static" ? "Capture anyway" : "Capture selfie"}
            </button>
            <button onClick={() => void start()} className="cap-btn-ghost">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300">Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

function sampledBrightness(video: HTMLVideoElement): number {
  const sample = document.createElement("canvas");
  sample.width = 32;
  sample.height = 32;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  if (!ctx || !video.videoWidth) return 0;
  ctx.drawImage(video, 0, 0, 32, 32);
  const px = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 0; i < px.length; i += 4) sum += px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
  return sum / (px.length / 4);
}
