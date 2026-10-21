import type { Outfit } from "@/data/outfits";

export default function GarmentCredit({ source }: { source?: Outfit["source"] }) {
  if (!source) return null;
  return (
    <p className="mt-2 text-[11px] text-[#78665E] leading-relaxed" onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}>
      Photo: <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-[#C9B8AA] underline-offset-2 hover:text-[#6B1E3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1E3A]" title={source.title}>{source.author}</a>
      {" · "}<a href={source.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[#C9B8AA] underline-offset-2 hover:text-[#6B1E3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1E3A]">{source.license}</a>
      <span className="block text-[#78665E]">{source.changes}</span>
    </p>
  );
}
