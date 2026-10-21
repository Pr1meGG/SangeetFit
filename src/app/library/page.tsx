"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import GarmentCredit from "@/components/GarmentCredit";
import { INDIAN_WEAR_LIBRARY } from "@/data/indian-wear";

export default function GarmentLibrary() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("all");
  const [occasion, setOccasion] = useState("all");
  const [referencesOnly, setReferencesOnly] = useState(false);
  const outfits = INDIAN_WEAR_LIBRARY.filter(outfit =>
    (audience === "all" || outfit.audience === audience) &&
    (occasion === "all" || outfit.occasionTags.includes(occasion as typeof outfit.occasion)) &&
    (!referencesOnly || outfit.vtoSupported) &&
    `${outfit.name} ${outfit.garmentType}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const candidateCount = INDIAN_WEAR_LIBRARY.filter(outfit => outfit.vtoSupported && outfit.tryOnStatus !== "blocked").length;
  const fieldClass = "w-full min-h-12 rounded-xl border border-[#E8DED1] bg-white px-3 py-3 text-sm text-[#33231F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1E3A]";

  return (
    <main className="min-h-screen bg-[#FBF7EF] text-[#33231F]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-8 sm:py-10 space-y-7">
        <Link href="/" className="inline-flex gap-2 items-center min-h-11 text-sm text-[#6B1E3A] hover:underline py-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1E3A]"><ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to your looks</Link>
        <header className="space-y-4 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B1E3A]">SangeetFit collection</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#6B1E3A]">Reference candidates.</h1>
          <p className="text-[#78665E] leading-relaxed">These references are being evaluated. A wired reference is not proof of generated quality. Your main recommendations show only live-reviewed references or your own clothes.</p>
          <p className="text-sm text-[#78665E]">{INDIAN_WEAR_LIBRARY.length} sourced photos · {candidateCount} matching try-on references. AI quality for these new references has not been tested. Browse-only pieces need a clearer photo.</p>
        </header>

        <section aria-label="Filter garments" className="rounded-2xl border border-[#E8DED1] bg-[#F5EEE4] p-4 sm:p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2 text-sm text-[#78665E]">
            <span className="inline-flex gap-2 items-center"><Search className="w-4 h-4" aria-hidden="true" /> Search garments</span>
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Saree, kurta, lehenga…" className={fieldClass} />
          </label>
          <div className="space-y-2 text-sm text-[#78665E]">
            <label htmlFor="library-collection" className="block">Collection</label>
            <select id="library-collection" value={audience} onChange={event => setAudience(event.target.value)} className={fieldClass}>
              <option value="all">All styles</option><option value="women">Women&apos;s wear</option><option value="men">Men&apos;s wear</option>
            </select>
          </div>
          <div className="space-y-2 text-sm text-[#78665E]">
            <label htmlFor="library-occasion" className="block">Occasion</label>
            <select id="library-occasion" value={occasion} onChange={event => setOccasion(event.target.value)} className={fieldClass}>
              <option value="all">All occasions</option>
              {["sangeet", "mehendi", "haldi", "wedding", "reception"].map(value => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-3 text-sm text-[#78665E] min-h-11 cursor-pointer">
            <input type="checkbox" checked={referencesOnly} onChange={event => setReferencesOnly(event.target.checked)} className="w-5 h-5 accent-[#6B1E3A]" /> Try-on references only
          </label>
        </section>

        <p role="status" className="text-sm text-[#78665E]">Showing {outfits.length} of {INDIAN_WEAR_LIBRARY.length} garments</p>
        {outfits.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DED1] bg-white p-10 text-center space-y-4">
            <p>No garments match these filters.</p>
            <button type="button" onClick={() => { setQuery(""); setAudience("all"); setOccasion("all"); setReferencesOnly(false); }} className="min-h-11 px-5 rounded-xl border border-[#6B1E3A] text-[#6B1E3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B1E3A]">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outfits.map(outfit => (
              <article key={outfit.id} className="rounded-2xl overflow-hidden border border-[#E8DED1] bg-white flex flex-col">
                <div className="relative bg-[#F1E9DE] aspect-[3/4]">
                  <img src={outfit.imageUrl} alt={outfit.name} width={outfit.source.width} height={outfit.source.height} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-3" />
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                  <p className="text-xs text-[#78665E] capitalize">{outfit.audience === "men" ? "Men’s wear" : "Women’s wear"} · {outfit.occasionTags.join(", ")}</p>
                  <h2 className="font-semibold text-lg leading-snug text-[#33231F]">{outfit.name}</h2>
                  <p className="text-sm text-[#78665E]">{outfit.description}</p>
                  <p className={`text-xs ${outfit.vtoSupported ? "text-[#6B1E3A]" : "text-[#78665E]"}`}>{outfit.vtoSupported ? "Try-on reference · AI quality untested" : "Browse only"}</p>
                  <p className="text-xs text-[#78665E]">{outfit.referenceNotes}</p>
                  <GarmentCredit source={outfit.source} />
                  {outfit.vtoSupported && outfit.tryOnStatus !== "blocked" && (
                    <Link href={`/?step=3&occasion=${occasion === "all" ? outfit.occasion : occasion}&vto=${outfit.id}`} className="mt-auto min-h-12 text-center rounded-xl bg-[#6B1E3A] text-[#FBF7EF] font-medium text-sm px-4 py-3 hover:bg-[#54162D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B1E3A]">Try reference (unreviewed)</Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
