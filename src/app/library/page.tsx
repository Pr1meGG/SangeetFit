"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, House, Search, Shirt, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { EDITORIAL_LOOKS } from "@/data/editorial";

const TRY_ON_LABELS: Record<string, string> = {
  "live-reviewed": "Tested on a real photo",
  "candidate": "Inspiration · not yet tried on",
  "blocked": "Browse only",
};

export default function GarmentLibrary() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("all");
  const [occasion, setOccasion] = useState("all");
  const [referencesOnly, setReferencesOnly] = useState(true);
  const [generationMode, setGenerationMode] = useState<"checking" | "mock" | "live" | "unconfigured" | "error">("checking");
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/mode", { signal: controller.signal });
        const data: { mode?: string } = await response.json();
        if (!response.ok || !["mock", "live", "unconfigured"].includes(data.mode ?? "")) throw new Error("Mode unavailable");
        if (!controller.signal.aborted) setGenerationMode(data.mode as "mock" | "live" | "unconfigured");
      } catch {
        if (!controller.signal.aborted) setGenerationMode("error");
      }
    })();
    return () => controller.abort();
  }, []);
  const visibleCollection = EDITORIAL_LOOKS;
  const outfits = visibleCollection.filter(outfit =>
    (audience === "all" || outfit.audience === audience) &&
    (occasion === "all" || outfit.occasionTags.includes(occasion as typeof outfit.occasion)) &&
    (!referencesOnly || outfit.vtoSupported) &&
    `${outfit.name} ${outfit.garmentType}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const fieldClass = "w-full min-h-12 rounded-[var(--sf-r-sm)] border border-[var(--sf-line)] bg-[var(--sf-paper)] px-3 py-3 text-base text-[var(--sf-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sf-burgundy)]";

  return (
    <main className="sf-app sf-library">
      <Navbar activeView="collection" />
      <div id="main-content" tabIndex={-1} className="sf-library-content py-6 sm:py-10 space-y-7">
        <Link href="/" className="sf-text-link inline-flex gap-2 items-center min-h-11 py-2"><ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to your looks</Link>
        <header className="sf-library-header">
          <p className="sf-editorial-eyebrow">SangeetFit collection</p>
          <h1>The celebration edit.</h1>
          <p className="sf-editorial-subhead" role="status">{generationMode === "live" || generationMode === "mock"
            ? "Browse without a photo. To try a look, add a clear head-to-toe photo and tap Generate."
            : generationMode === "checking"
              ? "Browse without a photo. Checking whether virtual try-on is available…"
              : generationMode === "error"
                ? "Browse without a photo. Try-on availability could not be checked. You can still explore outfit ideas."
                : "Browse without a photo. Virtual try-on is unavailable on this preview, but you can still explore the collection."}</p>
          <p className="sf-editorial-subhead sf-library-note">{EDITORIAL_LOOKS.length} original AI outfit concepts. Two have been tried on a real photo; the rest are inspiration.</p>
        </header>

        <div className="sf-library-toolbar flex flex-wrap gap-6">
          <div>
            <p className="text-sm font-medium mb-2">Occasion</p>
            <div role="group" aria-label="Choose occasion" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {["all", "sangeet", "mehendi", "haldi", "wedding", "reception"].map(value => (
                <button key={value} type="button" aria-pressed={occasion === value} onClick={() => setOccasion(value)} className={`sf-chip min-h-11 min-w-0 px-2 text-xs sm:px-4 sm:text-sm ${occasion === value ? "is-active" : ""}`}>{value === "all" ? "All occasions" : value.charAt(0).toUpperCase() + value.slice(1)}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Collection</p>
            <div role="group" aria-label="Choose collection" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {[["all", "Everyone"], ["women", "Women’s wear"], ["men", "Men’s wear"]].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={audience === value} onClick={() => setAudience(value)} className={`sf-chip min-h-11 min-w-0 px-2 text-xs sm:px-4 sm:text-sm ${audience === value ? "is-active" : ""}`}>{label}</button>
              ))}
            </div>
          </div>
        </div>

        <details className="rounded-[var(--sf-panel-radius)] border border-[var(--sf-line)] p-4 sm:p-5">
          <summary className="cursor-pointer min-h-11 flex items-center font-medium text-[var(--sf-burgundy)]">Search and filter outfits</summary>
          <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-[var(--sf-muted)]">
              <span className="inline-flex gap-2 items-center"><Search className="w-4 h-4" aria-hidden="true" /> Search garments</span>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Saree, kurta, lehenga…" className={fieldClass} />
            </label>
            <label className="flex items-center gap-3 text-sm text-[var(--sf-muted)] min-h-11 cursor-pointer">
              <input type="checkbox" checked={referencesOnly} onChange={event => setReferencesOnly(event.target.checked)} className="w-5 h-5 accent-[var(--sf-burgundy)]" /> Try-on references only
            </label>
          </div>
        </details>

        <p role="status" className="sf-library-status">Showing {outfits.length} of {visibleCollection.length} looks</p>
        {outfits.length === 0 ? (
          <div className="sf-library-empty">
            <p>No garments match these filters.</p>
            <p>Try a different occasion, audience, or search term.</p>
            <button type="button" onClick={() => { setQuery(""); setAudience("all"); setOccasion("all"); setReferencesOnly(true); }} className="sf-button sf-button-secondary">Clear filters</button>
          </div>
        ) : (
          <div className="sf-library-grid">
            {outfits.map((outfit, index) => (
              <article key={outfit.id} className="sf-library-card">
                <div className="sf-library-image relative aspect-[3/4]">
                  <img src={outfit.imageUrl} alt={outfit.name} loading={index === 0 ? "eager" : "lazy"} className="absolute inset-0 w-full h-full object-contain" />
                  {outfit.generatedConcept && <span className="absolute left-3 top-3 rounded-full bg-[var(--sf-paper)] px-3 py-1.5 text-xs font-medium">AI outfit concept</span>}
                </div>
                <div className="sf-library-info">
                  <p className="text-xs text-[var(--sf-muted)]">{outfit.audience === "men" ? "Men’s wear" : "Women’s wear"} · {outfit.occasionTags.join(", ")}</p>
                  <h2>{outfit.name}</h2>
                  <p>{outfit.description}</p>
                  <p className="sf-library-status">{TRY_ON_LABELS[outfit.tryOnStatus] ?? "Browse only"}</p>
                  <p className="text-xs text-[var(--sf-muted)]">Original concept · no retail listing</p>
                  {outfit.vtoSupported && outfit.tryOnStatus !== "blocked" && (
                    <Link href={`/?step=3&occasion=${occasion === "all" ? outfit.occasion : occasion}&vto=${outfit.id}`} className="sf-button sf-button-primary mt-auto">Try with your photo</Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <nav className="sf-bottom-nav sf-bottom-nav-library" aria-label="App navigation">
        <Link href="/"><House size={20} />For you</Link>
        <Link href="/library" aria-current="page"><Search size={20} />Explore</Link>
        <Link href="/?step=3&view=clothes"><Shirt size={20} />My clothes</Link>
        <Link href="/?step=3&view=shortlist"><Heart size={20} />Shortlist</Link>
      </nav>
    </main>
  );
}
