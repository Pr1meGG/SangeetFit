"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PrivateLook {
  outfitLabel: string;
  expiresAt: number;
  imageUrl: string;
}

function PrivateResult({ id }: { id: string }) {
  const accessKey = useRef<string | null>(null);
  const [look, setLook] = useState<PrivateLook | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [copyFallback, setCopyFallback] = useState(false);
  const endpoint = `/api/shared-results/${encodeURIComponent(id)}`;

  useEffect(() => {
    const controller = new AbortController();
    let imageUrl: string | undefined;
    // Keep the key across Strict Mode's effect replay after removing the fragment.
    if (accessKey.current === null) accessKey.current = new URLSearchParams(window.location.hash.slice(1)).get("key") ?? "";
    if (window.location.hash) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    const key = accessKey.current;
    async function load() {
      try {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id) || !key || key.length > 12_000) throw new Error();
        const options = { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" as const, signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]) };
        const response = await fetch(endpoint, options);
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (result.id !== id || typeof result.outfitLabel !== "string" || !Number.isFinite(result.expiresAt) || result.expiresAt * 1000 <= Date.now()) throw new Error();
        const image = await fetch(`${endpoint}?image=1`, options);
        if (!image.ok || !["image/png", "image/jpeg"].includes(image.headers.get("content-type")?.split(";")[0] ?? "")) throw new Error();
        const blob = await image.blob();
        if (controller.signal.aborted) return;
        imageUrl = URL.createObjectURL(blob);
        setLook({ outfitLabel: result.outfitLabel, expiresAt: result.expiresAt, imageUrl });
      } catch {
        if (!controller.signal.aborted) setError("This look is unavailable or has expired. Reopen the full private link to try again.");
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }
    void load();
    return () => {
      controller.abort();
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [endpoint, id]);

  useEffect(() => {
    if (!look) return;
    const timer = setTimeout(() => {
      URL.revokeObjectURL(look.imageUrl);
      setLook(null);
      setCopyFallback(false);
      setError("This look has expired.");
    }, Math.max(0, look.expiresAt * 1000 - Date.now()));
    return () => clearTimeout(timer);
  }, [look]);

  const privateLink = () => `${window.location.origin}/view/${encodeURIComponent(id)}#key=${encodeURIComponent(accessKey.current ?? "")}`;
  async function copyLink() {
    try { await navigator.clipboard.writeText(privateLink()); }
    catch { setCopyFallback(true); }
  }
  async function removeLook() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(endpoint, { method: "DELETE", headers: { Authorization: `Bearer ${accessKey.current}` }, signal: AbortSignal.timeout(15_000) });
      if (!response.ok && response.status !== 404) throw new Error();
      if (look) URL.revokeObjectURL(look.imageUrl);
      setLook(null);
      setCopyFallback(false);
      setError("This look has been deleted.");
    } catch {
      setError("Could not delete this look. Try again.");
    } finally { setBusy(false); }
  }

  return (
    <main id="main-content" tabIndex={-1} className="sf-app sf-main py-8 sm:py-12" aria-busy={busy}>
      <Link href="/" className="sf-text-link">Back to SangeetFit</Link>
      <header className="my-8 space-y-3">
        <h1>{look?.outfitLabel ?? "Your private look."}</h1>
        <p>Anyone with this private link can view this look until it expires.</p>
      </header>
      {busy && !look && <p role="status">Opening your look…</p>}
      {error && <p role="alert" className="mb-5 text-[var(--sf-burgundy)]">{error}</p>}
      {look && (
        <section className="max-w-2xl space-y-5" aria-label="Private result">
          {/* Authenticated image bytes stay in a local object URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={look.imageUrl} alt={look.outfitLabel} className="w-full max-h-[70vh] object-contain bg-[var(--sf-night)]" onError={() => setError("This image could not be displayed.")} />
          <p>Expires <time dateTime={new Date(look.expiresAt * 1000).toISOString()}>{new Date(look.expiresAt * 1000).toLocaleString()}</time></p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="sf-button sf-button-secondary" disabled={busy} onClick={() => void copyLink()}>Copy private link</button>
            <button type="button" className="sf-button sf-button-secondary" disabled={busy} onClick={() => void removeLook()}>Delete this result</button>
          </div>
          {copyFallback && <label className="block">Private result link<input className="block w-full" readOnly value={privateLink()} onFocus={event => event.currentTarget.select()} /></label>}
        </section>
      )}
    </main>
  );
}

export default function PrivateResultPage() {
  const { id } = useParams<{ id: string }>();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const onHashChange = () => setRevision(value => value + 1);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return <PrivateResult key={`${id}:${revision}`} id={id} />;
}
