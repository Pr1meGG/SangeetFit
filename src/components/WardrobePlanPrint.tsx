import type { WardrobePlanSummary } from "@/lib/session";

/** Receives text-only data, never photos, result links or access credentials. */
export default function WardrobePlanPrint({ summary }: { summary: WardrobePlanSummary }) {
  return <section className="sf-plan-print" aria-label="Printable wedding wardrobe plan">
    <h1>SangeetFit · My celebration wardrobe</h1>
    <p>{summary.plannedCount} of {summary.entries.length} events planned · {summary.ownedOutfitCount} owned outfit{summary.ownedOutfitCount === 1 ? "" : "s"} used · {summary.plannedRewears} planned rewear{summary.plannedRewears === 1 ? "" : "s"}</p>
    {summary.entries.map(entry => <article key={entry.occasion}>
      <h2>{entry.label}</h2>
      <p>{entry.garmentName}</p>
      <p>{entry.sourceLabel}</p>
    </article>)}
    <p>Planned rewears count repeat assignments of your own clothes. This plan does not establish physical fit or purchases avoided.</p>
  </section>;
}
