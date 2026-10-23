"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, House, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import GarmentCredit from "@/components/GarmentCredit";
import { INDIAN_WEAR_LIBRARY } from "@/data/indian-wear";
import { EDITORIAL_LOOKS } from "@/data/editorial";

const TRY_ON_LABELS: Record<string, string> = {
  "live-reviewed": "Pilot-reviewed · one source photo",
  "candidate": "Try-on reference · unreviewed quality",
  "blocked": "Browse only",
};

export default function GarmentLibrary() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("all");
  const [occasion, setOccasion] = useState("all");
  const [referencesOnly, setReferencesOnly] = useState(true);
  const [showArchive, setShowArchive] = useState(false);
  const visibleCollection = showArchive || query.trim() ? [...EDITORIAL_LOOKS, ...INDIAN_WEAR_LIBRARY] : EDITORIAL_LOOKS;
  const outfits = visibleCollection.filter(outfit =>
    (audience === "all" || outfit.audience === audience) &&
    (occasion === "all" || outfit.occasionTags.includes(occasion as typeof outfit.occasion)) &&
    (!referencesOnly || outfit.vtoSupported) &&
    `${outfit.name} ${outfit.garmentType}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const fieldClass = "w-full min-h-12 rounded-xl border border-[var(--sf-line)] bg-white px-3 py-3 text-sm text-[var(--sf-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sf-burgundy)]";

  return (
    <main id="main-content" className="sf-app sf-library">
      <Navbar />
      <div className="sf-library-content max-w-7xl mx-auto px-4 py-6 sm:px-8 sm:py-10 space-y-7">
        <Link href="/" className="sf-text-link inline-flex gap-2 items-center min-h-11 py-2"><ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to your looks</Link>
        <header className="sf-library-header">
          <p className="sf-editorial-eyebrow">SangeetFit collection</p>
          <h1>The celebration edit.</h1>
          <p className="sf-editorial-subhead">Browse without a photo. To try a look, add a clear head-to-toe photo and tap Generate.</p>
          <p className="sf-editorial-subhead sf-library-note">{EDITORIAL_LOOKS.length} original outfit concepts. Two passed a live pilot on one photo; the rest remain unreviewed. Older sourced references are in filters.</p>
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

        <details className="rounded-2xl border border-[var(--sf-line)] p-4 sm:p-5">
          <summary className="cursor-pointer min-h-11 flex items-center font-medium text-[var(--sf-burgundy)]">Search and filter outfits</summary>
          <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-[var(--sf-muted)]">
              <span className="inline-flex gap-2 items-center"><Search className="w-4 h-4" aria-hidden="true" /> Search garments</span>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Saree, kurta, lehenga…" className={fieldClass} />
            </label>
            <label className="flex items-center gap-3 text-sm text-[var(--sf-muted)] min-h-11 cursor-pointer">
              <input type="checkbox" checked={referencesOnly} onChange={event => setReferencesOnly(event.target.checked)} className="w-5 h-5 accent-[var(--sf-burgundy)]" /> Try-on references only
            </label>
            <label className="flex items-center gap-3 text-sm text-[var(--sf-muted)] min-h-11 cursor-pointer">
              <input type="checkbox" checked={showArchive} onChange={event => setShowArchive(event.target.checked)} className="w-5 h-5 accent-[var(--sf-burgundy)]" /> Include 14 sourced reference photos
            </label>
          </div>
        </details>

        <p role="status" className="sf-library-status">Showing {outfits.length} of {visibleCollection.length} looks</p>
        {outfits.length === 0 ? (
          <div className="sf-library-empty">
            <p>No garments match these filters.</p>
            <p>Try a different occasion, audience, or search term.</p>
            <button type="button" onClick={() => { setQuery(""); setAudience("all"); setOccasion("all"); setReferencesOnly(true); setShowArchive(false); }} className="sf-button sf-button-secondary">Clear filters</button>
          </div>
        ) : (
          <div className="sf-library-grid">
            {outfits.map((outfit, index) => (
              <article key={outfit.id} className="sf-library-card">
                <div className="sf-library-image relative aspect-[3/4]">
                  <img src={outfit.imageUrl} alt={outfit.name} width={outfit.source?.width ?? 1086} height={outfit.source?.height ?? 1448} loading={index === 0 ? "eager" : "lazy"} className="absolute inset-0 w-full h-full object-contain" />
                  {outfit.generatedConcept && <span className="absolute left-3 top-3 rounded-full bg-[var(--sf-paper)] px-3 py-1.5 text-xs font-medium">AI outfit concept</span>}
                </div>
                <div className="sf-library-info">
                  <p className="text-xs text-[var(--sf-muted)]">{outfit.audience === "men" ? "Men’s wear" : "Women’s wear"} · {outfit.occasionTags.join(", ")}</p>
                  <h2>{outfit.name}</h2>
                  <p>{outfit.description}</p>
                  <p className="sf-library-status">{TRY_ON_LABELS[outfit.tryOnStatus] ?? "Browse only"}</p>
                  {outfit.generatedConcept ? <p className="text-xs text-[var(--sf-muted)]">Original concept · no retail listing</p> : (
                    <>
                      <p className="text-xs text-[var(--sf-muted)]">{outfit.referenceNotes}</p>
                      <GarmentCredit source={outfit.source} />
                    </>
                  )}
                  {outfit.vtoSupported && outfit.tryOnStatus !== "blocked" && (
                    <Link href={`/?step=3&occasion=${occasion === "all" ? outfit.occasion : occasion}&vto=${outfit.id}`} className="sf-button sf-button-primary mt-auto">Try with your photo</Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <nav className="sf-bottom-nav sf-bottom-nav-library" aria-label="App navigation"><Link href="/"><House size={20} />For you</Link><Link href="/library" aria-current="page"><Search size={20} />Explore</Link></nav>
    </main>
  );
}
