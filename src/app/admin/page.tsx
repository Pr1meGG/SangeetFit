"use client";

import { useEffect, useState, type FormEvent } from "react";

interface AutoSavedResult {
  id: string;
  outfitLabel: string;
  mode: "live";
  expiresAt: number;
}

export default function AdminAutoSavedPage() {
  const [results, setResults] = useState<AutoSavedResult[] | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(signal: AbortSignal) {
    const response = await fetch("/api/auto-saved", { cache: "no-store", signal });
    if (response.status === 401) { setResults(null); return; }
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (!Array.isArray(data.results)) throw new Error();
    setResults(data.results);
  }

  useEffect(() => {
    const controller = new AbortController();
    void load(AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]))
      .catch(() => { if (!controller.signal.aborted) setError("Failed to load auto-saved results. Try again."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError("");
    const body = JSON.stringify({ password });
    setPassword("");
    try {
      const signal = AbortSignal.timeout(15_000);
      const response = await fetch("/api/shared-results/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body, signal });
      if (!response.ok) throw new Error();
      await load(signal);
    } catch { setError("Could not sign in. Check the password and try again."); }
    finally { setLoading(false); }
  }

  async function signOut() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/shared-results/admin", { method: "DELETE", signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error();
      setResults(null);
    } catch { setError("Could not sign out. Try again."); }
    finally { setLoading(false); }
  }

  async function refresh() {
    setLoading(true); setError("");
    try { await load(AbortSignal.timeout(15_000)); }
    catch { setError("Failed to load auto-saved results. Try again."); }
    finally { setLoading(false); }
  }

  async function remove(id: string) {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/auto-saved?id=${encodeURIComponent(id)}`, { method: "DELETE", signal: AbortSignal.timeout(15_000) });
      if (response.status === 401 || response.status === 404) { await load(AbortSignal.timeout(15_000)); return; }
      if (!response.ok) throw new Error();
      setResults(current => current?.filter(result => result.id !== id) ?? null);
    } catch { setError("Could not remove this saved look. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <main id="main-content" tabIndex={-1} className="p-8" aria-busy={loading}>
      <h1 className="text-2xl font-bold mb-6">Auto-Saved VTO Results</h1>
      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
      {results === null ? (
        <form onSubmit={event => void signIn(event)} className="sf-form-stack max-w-md">
          <label htmlFor="autosave-password">Creator password
            <input id="autosave-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required maxLength={512} disabled={loading} />
          </label>
          <button type="submit" className="sf-button sf-button-primary" disabled={loading || !password}>{loading ? "Please wait…" : "Sign in"}</button>
        </form>
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <button type="button" className="sf-button sf-button-secondary" disabled={loading} onClick={() => void refresh()}>Refresh saved looks</button>
            <button type="button" className="sf-button sf-button-secondary" disabled={loading} onClick={() => void signOut()}>Sign out</button>
          </div>
          {results.length === 0 ? <p>No auto-saved results yet.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(result => (
                <article key={result.id} className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">{result.outfitLabel}</h2>
                  {(["person", "garment", "result"] as const).map(image => (
                    // Authenticated API URLs keep photo bytes out of the listing response.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={image} src={`/api/auto-saved?id=${encodeURIComponent(result.id)}&image=${image}`} alt={`${image} for ${result.outfitLabel}`} className="w-full h-32 object-contain rounded mt-2" loading="lazy" />
                  ))}
                  <p className="text-xs mt-2">Mode: {result.mode}</p>
                  <p className="text-xs">Expires: <time dateTime={new Date(result.expiresAt * 1000).toISOString()}>{new Date(result.expiresAt * 1000).toLocaleString()}</time></p>
                  <button type="button" className="sf-button sf-button-secondary mt-3" disabled={loading} aria-label={`Remove saved look: ${result.outfitLabel}`} onClick={() => void remove(result.id)}>Remove saved look</button>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
