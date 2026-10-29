"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Heart, Layers2, Pause, Play, Plus, ShieldCheck, Shirt } from "lucide-react";
import type { NavigationView } from "@/components/Navbar";
import StepIllustration from "@/components/StepIllustration";

const QUESTIONS = [
  ["Can I explore without uploading a photo?", "Yes. Browse the collection, save a shortlist and build your five-event plan without a photo. A clear head-to-toe photo is needed only for a personal virtual try-on."],
  ["Can I try clothes I already own?", "Yes. Add a clear garment reference, give it a name and choose its occasions. Adding clothes does not start an AI task. To preview one on you, open its fitting room, review the photo permission and tap Generate try-on."],
  ["What does Mock Mode mean?", "Mock Mode shows sample or reference imagery so you can explore the workflow. It does not generate a personal try-on. Live AI results are labelled separately when YouCam generation is available."],
  ["Will a preview tell me how an outfit fits?", "A virtual preview can help you explore a look. It cannot establish physical fit or guarantee that your face and garment details will be preserved. Check the result carefully before making a decision."],
  ["Where do my photos and saved looks go?", "Your photos, clothes, shortlist and plan stay in this page session on our side. Leaving or reloading can clear them. If you turn on optional automatic saving before Generate, the generated look is saved for 24 hours and can be viewed by the creator. You can remove it sooner using its private link. Source photos and garment uploads are not archived. Anyone with that private link can view the saved look until it expires or is removed. Clearing this page does not remove saved looks. For a live try-on, your person and garment photos are sent to YouCam after permission and a Generate try-on tap. If you choose optional colour analysis, your selfie is sent when you tap Analyze selfie. The provider handles its own retention."],
  ["How can I keep my wedding-week plan?", "Open Plan my week and use Print / Save as PDF. The export includes event and outfit text; it excludes photos, generated result images and private result links. Save any result image separately before leaving."],
] as const;

export default function HomeGuide({ view = "home", onNavigate, onBrowse }: {
  view?: "home" | "how-it-works" | "faq";
  onNavigate: (view: NavigationView) => void;
  onBrowse: () => void;
}) {
  const [paused, setPaused] = useState(false);

  return <>
    {view !== "home" && <button type="button" className="sf-back sf-guide-back" onClick={() => onNavigate("home")}><ArrowLeft size={17} aria-hidden="true" />Back to celebrations</button>}
    {view === "how-it-works" && <div id="how-it-works" tabIndex={-1} className="sf-guide-surface" data-motion={paused ? "paused" : "playing"}>
      <section id="features" className="sf-feature-section" aria-labelledby="features-heading">
      <div className="sf-guide-heading"><span className="sf-context">A little less outfit overthinking</span><h1 id="features-heading">Your celebration, brought together.</h1><p>From the clothes you love to the looks you’re curious about.</p></div>
      <div className="sf-feature-grid">
        <article className="sf-feature"><span className="sf-feature-icon"><Shirt size={25} strokeWidth={1.3} aria-hidden="true" /></span><span className="sf-feature-number">01</span><div className="sf-feature-body"><span className="sf-feature-label">The wardrobe</span><h2>Something already yours.</h2><p>Add a piece you love. Give a favourite another moment.</p></div><button type="button" className="sf-feature-action" onClick={() => onNavigate("clothes")}>Add my clothes <ArrowRight size={17} aria-hidden="true" /></button></article>
        <article className="sf-feature"><span className="sf-feature-icon"><Layers2 size={25} strokeWidth={1.3} aria-hidden="true" /></span><span className="sf-feature-number">02</span><div className="sf-feature-body"><span className="sf-feature-label">The fitting room</span><h2>A little imagination.</h2><p>See a look on your photo. Compare up to two results, side by side.</p></div><button type="button" className="sf-feature-action" onClick={onBrowse}>Find a look <ArrowRight size={17} aria-hidden="true" /></button></article>
        <article className="sf-feature"><span className="sf-feature-icon"><Heart size={25} strokeWidth={1.3} aria-hidden="true" /></span><span className="sf-feature-number">03</span><div className="sf-feature-body"><span className="sf-feature-label">The favourites</span><h2>That feels like you.</h2><p>Keep the pieces you love in a shortlist for this session.</p></div><button type="button" className="sf-feature-action" onClick={() => onNavigate("shortlist")}>Open my shortlist <ArrowRight size={17} aria-hidden="true" /></button></article>
        <article className="sf-feature"><span className="sf-feature-icon"><CalendarDays size={25} strokeWidth={1.3} aria-hidden="true" /></span><span className="sf-feature-number">04</span><div className="sf-feature-body"><span className="sf-feature-label">The celebration plan</span><h2>Every moment, considered.</h2><p>Choose your five looks, plan a rewear and keep a text-only PDF.</p></div><button type="button" className="sf-feature-action" onClick={() => onNavigate("plan")}>Build my plan <ArrowRight size={17} aria-hidden="true" /></button></article>
      </div>
      </section>
      <section className="sf-how-section" aria-labelledby="how-heading">
      <div className="sf-guide-heading"><span className="sf-context">From a maybe to your moment</span><h2 id="how-heading">A few steps. A look that’s yours.</h2><button type="button" className="sf-motion-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}{paused ? "Play animations" : "Pause animations"}</button></div>
      <ol className="sf-how-steps">
        <li><StepIllustration variant="wardrobe" /><span>01</span><h3>Find your starting point</h3><p>Pick an occasion. Browse outfit ideas or add a piece from your wardrobe.</p></li>
        <li><StepIllustration variant="mirror" /><span>02</span><h3>Try it, when you’re ready</h3><p>Add your photo, review the permission and generate a preview. Every result shows its mode.</p></li>
        <li><StepIllustration variant="plan" /><span>03</span><h3>Choose your celebration looks</h3><p>Compare, shortlist and assign your outfits across five events. Save your plan before you go.</p></li>
      </ol>
      <div className="sf-guide-privacy"><ShieldCheck size={18} aria-hidden="true" /><p>Browse first. A photo is only needed for a personal try-on.</p></div>
      </section>
    </div>}
    {view === "faq" && <section id="faq" tabIndex={-1} className="sf-faq-section" aria-labelledby="faq-heading">
      <div className="sf-guide-heading"><span className="sf-context">Before you get dressed</span><h1 id="faq-heading">A few things you might wonder.</h1><p>Your photos, your choices and what to expect.</p></div>
      <div className="sf-faq-list">{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
    </section>}
    {view === "home" && <section className="sf-final-invite" aria-labelledby="invite-heading"><span className="sf-season">Made for every kind of celebration</span><h2 id="invite-heading">One less thing to wonder.<br /><em>One more reason to dance.</em></h2><button className="sf-button sf-button-primary" onClick={() => onNavigate("plan")}>Create my celebration plan <ArrowRight size={18} aria-hidden="true" /></button><p>No photo needed to start planning.</p></section>}
    <footer className="sf-site-footer"><div><strong>SangeetFit</strong><p>Your clothes. Your celebrations.</p></div><nav aria-label="Footer navigation"><Link href="/library">Explore collection</Link><button onClick={() => onNavigate("how-it-works")}>How it works</button><button onClick={() => onNavigate("faq")}>FAQs & privacy</button><button onClick={() => onNavigate("home")}>Back to top ↑</button></nav><p className="sf-footer-note">AI-generated outfit concepts · review status shown per look<br />Virtual try-on powered by YouCam when live generation is available.</p></footer>
  </>;
}
