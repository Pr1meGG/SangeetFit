"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

interface SharedLook {
  id: string;
  outfitLabel: string;
  createdAt: number;
  expiresAt: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<SharedLook[] | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  async function loadResults(signal: AbortSignal) {
    const response = await fetch("/api/shared-results", { cache: "no-store", signal });
    if (response.status === 401) {
      setResults(null);
      return;
    }
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (!Array.isArray(data.results)) throw new Error();
    setResults(data.results);
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadResults(AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]))
      .catch(() => {
        if (!controller.signal.aborted) setError("Could not load shared looks. Try signing in again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setBusy(false);
      });
    return () => controller.abort();
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const body = JSON.stringify({ password });
    setPassword("");
    try {
      const signal = AbortSignal.timeout(15_000);
      const response = await fetch("/api/shared-results/admin", {
        method: "POST", headers: { "Content-Type": "application/json" }, body, signal,
      });
      if (!response.ok) {
        setError(response.status === 401 ? "That password did not work." : "Could not sign in. Try again.");
        return;
      }
      await loadResults(signal);
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/shared-results/admin", { method: "DELETE", signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error();
      setResults(null);
    } catch {
      setError("Could not sign out. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeLook(id: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/shared-results/${encodeURIComponent(id)}`, { method: "DELETE", signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error();
      setResults(current => current?.filter(result => result.id !== id) ?? null);
    } catch {
      setError("Could not remove that shared look. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main-content" tabIndex={-1} className="sf-app sf-main py-8 sm:py-12" aria-busy={busy}>
      <Link href="/" className="sf-text-link">Back to SangeetFit</Link>
      <header className="my-8 space-y-3">
        <p className="sf-editorial-eyebrow">Creator gallery</p>
        <h1>Shared looks.</h1>
        <p>Only looks people choose to share. Each is kept for 24 hours.</p>
      </header>
      {error && <p role="alert" className="mb-5 text-[var(--sf-burgundy)]">{error}</p>}
      {results === null ? (
        <form onSubmit={event => void signIn(event)} className="sf-form-stack max-w-md">
          <label htmlFor="gallery-password">Creator password
            <input id="gallery-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required maxLength={512} disabled={busy} />
          </label>
          <button type="submit" className="sf-button sf-button-primary" disabled={busy || !password}>
            {busy ? "Please wait…" : "Sign in"}
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
            <p role="status">{results.length} shared {results.length === 1 ? "look" : "looks"}</p>
            <button type="button" className="sf-button sf-button-secondary" disabled={busy} onClick={() => void signOut()}>Sign out</button>
          </div>
          {results.length === 0 ? <p>No shared looks yet.</p> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(result => (
                <article key={result.id} className="border border-[var(--sf-line)] rounded-[var(--sf-panel-radius)] overflow-hidden">
                  {/* Private API images require the signed same-origin session cookie. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/shared-results/${encodeURIComponent(result.id)}?image=1`} alt={result.outfitLabel} className="w-full aspect-[3/4] object-contain bg-[var(--sf-night)]" loading="lazy" />
                  <div className="p-4 space-y-3">
                    <h2 className="!text-2xl">{result.outfitLabel}</h2>
                    <p className="text-sm">Expires <time dateTime={new Date(result.expiresAt * 1000).toISOString()}>{new Date(result.expiresAt * 1000).toLocaleString()}</time></p>
                    <button type="button" className="sf-button sf-button-secondary" disabled={busy} aria-label={`Remove shared look: ${result.outfitLabel}`} onClick={() => void removeLook(result.id)}>Remove shared look</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
