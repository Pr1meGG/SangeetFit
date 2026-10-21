"use client";

import { useEffect, useRef, useState } from "react";
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
type Phase = "starting" | "loading-model" | "live" | "static" | "capturing" | "confirm" | "error";

interface Detected {
  boundingBox?: { originX: number; originY: number; width: number; height: number };
}

interface FaceDetectorLike {
  detectForVideo(video: HTMLVideoElement, timestamp: number): { detections: Detected[] };
  close(): void;
}

interface FaceCameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function FaceCameraCapture({ onCapture, onClose }: FaceCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const sessionRef = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>("starting");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hint, setHint] = useState<HintKey>("none");
  const [photo, setPhoto] = useState<{ preview: string; file: File } | null>(null);

  useEffect(() => {
    const session = ++sessionRef.current;
    const video = videoRef.current;
    let stopped = false;
    let stream: MediaStream | null = null;
    let detector: FaceDetectorLike | null = null;
    let timer = 0;
    let lastVideoTime = -1;
    const sample = document.createElement("canvas");
    sample.width = sample.height = 32;
    const sampleContext = sample.getContext("2d", { willReadFrequently: true });

    const stop = () => {
      stopped = true;
      window.clearTimeout(timer);
      stream?.getTracks().forEach(track => track.stop());
      stream = null;
      detector?.close();
      detector = null;
      if (video) video.srcObject = null;
    };
    stopRef.current = stop;
    setCameraError(null);
    setPhase("starting");
    setHint("none");
    setPhoto(null);

    function runDetect() {
      if (stopped || !video) return;
      if (video.videoWidth && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        let next: HintKey = "none";
        try {
          const box = detector?.detectForVideo(video, performance.now()).detections[0]?.boundingBox;
          if (box) {
            // Match the object-cover crop that the user sees in the portrait stage.
            const rect = video.getBoundingClientRect();
            const scale = Math.max(rect.width / video.videoWidth, rect.height / video.videoHeight);
            const faceCx = ((box.originX + box.width / 2) * scale - (video.videoWidth * scale - rect.width) / 2) / rect.width;
            const faceCy = ((box.originY + box.height / 2) * scale - (video.videoHeight * scale - rect.height) / 2) / rect.height;
            const faceSize = box.width * scale / rect.width;
            if (faceSize < 0.3) next = "far";
            else if (faceSize > 0.62) next = "near";
            else if (Math.abs(faceCx - 0.5) > 0.18 || Math.abs(faceCy - 0.42) > 0.2) next = "off";
            else next = "ok";
          }
        } catch {
          detector?.close();
          detector = null;
          setPhase("static");
        }
        if (sampleContext && sampledBrightness(video, sampleContext) < 42) next = "dark";
        setHint(next);
      }
      timer = window.setTimeout(runDetect, 200);
    }

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera is not supported in this browser");
        }
        if (!window.isSecureContext) {
          throw new Error("Camera needs a secure (https) connection — open the preview URL on your phone.");
        }
        const acquiredStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (stopped || !video) {
          acquiredStream.getTracks().forEach(track => track.stop());
          return;
        }
        // Keep ownership local so a late permission response cannot outlive this session.
        stream = acquiredStream;
        video.srcObject = stream;
        await video.play();
        if (stopped) return;
        setPhase("loading-model");
        runDetect();
        try {
          // ponytail: pinned CDN import avoids a new bundle dependency; capture
          // remains available while tracking loads or when the CDN is unreachable.
          const cdnUrl = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
          const tasksVision = (await import(/* webpackIgnore: true */ cdnUrl)) as {
            FaceDetector: { createFromOptions: (fileset: unknown, options: object) => Promise<FaceDetectorLike> };
            FilesetResolver: { forVisionTasks: (path: string) => Promise<unknown> };
          };
          if (stopped) return;
          const fileset = await tasksVision.FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
          );
          if (stopped) return;
          const loaded = await tasksVision.FaceDetector.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            },
            runningMode: "VIDEO",
          });
          if (stopped) { loaded.close(); return; }
          detector = loaded;
          setPhase("live");
        } catch {
          if (!stopped) setPhase("static");
        }
      } catch (err) {
        if (stopped) return;
        stop();
        const name = (err as DOMException)?.name;
        setCameraError(
          name === "NotAllowedError"
            ? "Camera permission denied. Allow access in the address bar, or upload a photo instead."
            : (err as Error).message || "Camera could not be started.",
        );
        setPhase("error");
      }
    }
    void start();
    return () => {
      if (sessionRef.current === session) sessionRef.current++;
      stop();
    };
  }, [attempt]);

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !canCapture) return;
    const session = sessionRef.current;
    const canvas = document.createElement("canvas");
    const rect = video.getBoundingClientRect();
    const scale = Math.max(rect.width / video.videoWidth, rect.height / video.videoHeight);
    canvas.width = Math.round(rect.width / scale);
    canvas.height = Math.round(rect.height / scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, (video.videoWidth - canvas.width) / 2, (video.videoHeight - canvas.height) / 2,
      canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    setPhase("capturing");
    stopRef.current();
    const preview = canvas.toDataURL("image/jpeg", 0.9);
    canvas.toBlob(
      blob => {
        if (sessionRef.current !== session) return;
        if (!blob) {
          setCameraError("Could not capture this photo. Please retry or upload a photo instead.");
          setPhase("error");
          return;
        }
        setPhoto({ preview, file: new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" }) });
        setPhase("confirm");
      },
      "image/jpeg",
      0.9,
    );
  };

  const canCapture = phase === "live" || phase === "static" || phase === "loading-model";
  const retry = () => { stopRef.current(); setAttempt(value => value + 1); };
  const close = () => { stopRef.current(); onClose(); };

  return (
    <div className="space-y-4">
      <div className="cap-stage max-w-xs mx-auto">
        <video ref={videoRef} playsInline muted aria-label="Live selfie camera" />
        {phase === "confirm" && photo && (
          <img src={photo.preview} alt="Captured selfie preview" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {canCapture && (
          <>
            <div className={`cap-oval ${hint === "ok" ? "ok oval-live" : ""} ${phase === "static" ? "dashed" : ""}`} />
            <p role="status" className={`cap-hint absolute inset-x-3 bottom-3 ${HINTS[hint].tone}`}>
              {hint === "dark" ? HINTS.dark.text : phase === "loading-model"
                ? "Center your face while tracking loads — you can capture now"
                : phase === "static"
                ? "Live face tracking unavailable — center your face in the oval"
                : HINTS[hint].text}
            </p>
          </>
        )}
        {(phase === "starting" || phase === "capturing") && !cameraError && (
          <p role="status" className="absolute inset-0 grid place-items-center text-xs text-gray-400">
            {phase === "capturing" ? "Preparing photo…" : "Starting camera…"}
          </p>
        )}
        {cameraError && (
          <div className="absolute inset-0 grid place-items-center p-4 text-center">
            <p role="alert" className="text-xs cap-hint bad flex items-start gap-1 text-left">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" /> {cameraError}
            </p>
          </div>
        )}
      </div>

      {phase === "confirm" && photo ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => onCapture(photo.file)} className="cap-btn-primary">
            <Check className="w-4 h-4" /> Use this photo
          </button>
          <button type="button" onClick={retry} className="cap-btn-ghost">
            <RefreshCw className="w-4 h-4" /> Retake
          </button>
          <button type="button" onClick={close} className="min-h-11 text-sm text-gray-400 hover:text-gray-300">Cancel</button>
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={capture} disabled={!canCapture} className="cap-btn-primary">
              <Camera className="w-4 h-4" /> {phase === "static" ? "Capture anyway" : "Capture selfie"}
            </button>
            <button type="button" onClick={retry} disabled={phase === "starting" || phase === "capturing"} className="cap-btn-ghost">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <button type="button" onClick={close} className="min-h-11 text-sm text-gray-400 hover:text-gray-300">Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

function sampledBrightness(video: HTMLVideoElement, ctx: CanvasRenderingContext2D): number {
  ctx.drawImage(video, 0, 0, 32, 32);
  const px = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 0; i < px.length; i += 4) sum += px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
  return sum / (px.length / 4);
}
