import { ArrowUpRight, Printer, Shirt } from "lucide-react";
import type { Occasion } from "@/data/outfits";
import { summarizeWardrobePlan, type SessionOutfit } from "@/lib/session";

interface Props {
  occasions: readonly { id: Occasion; label: string }[];
  outfits: SessionOutfit[];
  plan: Partial<Record<Occasion, string>>;
  onChoose: (occasion: Occasion, outfitId: string) => void;
  onTryOn: (occasion: Occasion, outfit: SessionOutfit) => void;
  onAddOwn: (occasion: Occasion) => void;
}

export default function WeddingWeekBoard({ occasions, outfits, plan, onChoose, onTryOn, onAddOwn }: Props) {
  const owned = outfits.filter(outfit => outfit.origin === "upload");
  const summary = summarizeWardrobePlan(occasions, outfits, plan);

  return <section className="sf-week-board" aria-labelledby="week-board-title">
    <div className="sf-week-board-heading">
      <div><span className="sf-context">Your celebration wardrobe</span><h2 id="week-board-title">Five moments. One wardrobe.</h2><p>Plan each event with clothes you own or an inspiration look. Rewear a favourite wherever it fits; try it on when you’re ready.</p></div>
      <button type="button" className="sf-button sf-button-secondary" onClick={() => window.print()}><Printer size={17} />Print / Save as PDF</button>
    </div>
    <div className="sf-week-board-summary" role="status" aria-label="Wardrobe plan summary">
      <span>{summary.plannedCount} of {occasions.length} planned</span>
      <span>{summary.ownedOutfitCount} owned outfit{summary.ownedOutfitCount === 1 ? "" : "s"} used</span>
      <span>{summary.plannedRewears} planned rewear{summary.plannedRewears === 1 ? "" : "s"}</span>
    </div>
    <div className="sf-week-board-grid">
      {occasions.map(event => {
        const selected = outfits.find(outfit => outfit.id === plan[event.id]);
        const concepts = outfits.filter(outfit => outfit.generatedConcept && outfit.vtoSupported && outfit.tryOnReference && outfit.tryOnStatus !== "blocked" && outfit.occasionTags.includes(event.id));
        const selectedReferenceOutsideOptions = selected && selected.origin !== "upload" && !concepts.some(outfit => outfit.id === selected.id);
        const reused = selected?.origin === "upload" && occasions.filter(item => plan[item.id] === selected.id).length > 1;
        const entry = summary.entries.find(item => item.occasion === event.id)!;
        return <article className="sf-week-board-card" key={event.id}>
          <div className="sf-week-board-image">{selected ? <img src={selected.imageUrl} alt={selected.name} /> : <Shirt size={34} strokeWidth={1.2} aria-hidden="true" />}</div>
          <div className="sf-week-board-card-body">
            <span className="sf-week-board-event">{event.label}</span>
            <strong>{selected?.name || "Your look goes here"}</strong>
            <span className="sf-week-board-source">{selected ? entry.sourceLabel : "Choose a look below"}{reused ? " · Planned rewear" : ""}</span>
            {selected && !selected.occasionTags.includes(event.id) && <span className="sf-week-board-source">Outside this outfit’s occasion tags · chosen by you</span>}
            <label htmlFor={`week-board-${event.id}`} className="sr-only">Outfit for {event.label}</label>
            <select id={`week-board-${event.id}`} value={selected?.id || ""} onChange={e => onChoose(event.id, e.target.value)}>
              <option value="">Choose an outfit</option>
              {owned.length > 0 && <optgroup label="Your clothes">{owned.map(outfit => <option key={outfit.id} value={outfit.id}>{outfit.name}</option>)}</optgroup>}
              {selectedReferenceOutsideOptions && <optgroup label="Your selected reference"><option value={selected.id}>{selected.name}{selected.tryOnStatus === "live-reviewed" ? " · reviewed" : " · unreviewed"}</option></optgroup>}
              <optgroup label="AI outfit ideas">{concepts.map(outfit => <option key={outfit.id} value={outfit.id}>{outfit.name}{outfit.tryOnStatus === "live-reviewed" ? " · reviewed" : " · unreviewed"}</option>)}</optgroup>
            </select>
            {selected ? <button className="sf-week-board-action" onClick={() => onTryOn(event.id, selected)}>Try on this look <ArrowUpRight size={16} /></button> : <button className="sf-week-board-action" onClick={() => onAddOwn(event.id)}>Add my clothes <ArrowUpRight size={16} /></button>}
          </div>
        </article>;
      })}
    </div>
    <p className="sf-week-board-note">This plan stays in this page session. Print or save the text-only plan to keep it; photos and try-on results are excluded. Candidate inspiration results have not been quality-reviewed.</p>
  </section>;
}
