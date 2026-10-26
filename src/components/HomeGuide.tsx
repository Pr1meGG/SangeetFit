import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, Layers2, Plus, ShieldCheck, Shirt } from "lucide-react";
import type { NavigationView } from "@/components/Navbar";

const QUESTIONS = [
  ["Can I explore without uploading a photo?", "Yes. Browse the collection, save a shortlist and build your five-event plan without a photo. A clear head-to-toe photo is needed only for a personal virtual try-on."],
  ["Can I try clothes I already own?", "Yes. Add a clear garment reference, give it a name and choose its occasions. Adding clothes does not start an AI task. To preview one on you, open its fitting room, review the photo permission and tap Generate try-on."],
  ["What does Mock Mode mean?", "Mock Mode shows sample or reference imagery so you can explore the workflow. It does not generate a personal try-on. Live AI results are labelled separately when YouCam generation is available."],
  ["Will a preview tell me how an outfit fits?", "A virtual preview can help you explore a look. It cannot establish physical fit or guarantee that your face and garment details will be preserved. Check the result carefully before making a decision."],
  ["Where do my photos and saved looks go?", "Your photos, clothes, shortlist and plan stay in this page session on our side. Leaving or reloading can clear them. In live mode, photos are sent to YouCam only after permission and an explicit Generate tap; the provider handles its own retention."],
  ["How can I keep my wedding-week plan?", "Open Plan my week and use Print / Save as PDF. The export includes event and outfit text; it excludes photos, generated result images and private result links. Save any result image separately before leaving."],
] as const;

export default function HomeGuide({ onNavigate, onBrowse }: {
  onNavigate: (view: NavigationView) => void;
  onBrowse: () => void;
}) {
  return <>
    <section id="features" className="sf-feature-section" aria-labelledby="features-heading">
      <div className="sf-guide-heading"><span className="sf-context">A little less outfit overthinking</span><h2 id="features-heading">Your celebration, brought together.</h2><p>From the clothes you love to the looks you’re curious about.</p></div>
      <div className="sf-feature-grid">
        <button className="sf-feature" onClick={() => onNavigate("clothes")}><Shirt size={24} strokeWidth={1.4} aria-hidden="true" /><span className="sf-feature-number">01</span><h3>Start with your wardrobe.</h3><p>Add something you own. Give a favourite another moment.</p><span className="sf-feature-action">Add my clothes <ArrowRight size={17} aria-hidden="true" /></span></button>
        <button className="sf-feature" onClick={onBrowse}><Layers2 size={24} strokeWidth={1.4} aria-hidden="true" /><span className="sf-feature-number">02</span><h3>See a look on you.</h3><p>Choose a reference, then try it on your photo. Compare up to two results.</p><span className="sf-feature-action">Find a look <ArrowRight size={17} aria-hidden="true" /></span></button>
        <button className="sf-feature" onClick={() => onNavigate("shortlist")}><Heart size={24} strokeWidth={1.4} aria-hidden="true" /><span className="sf-feature-number">03</span><h3>Keep what feels like you.</h3><p>Heart the pieces you love. Come back to your favourites in this session.</p><span className="sf-feature-action">Open my shortlist <ArrowRight size={17} aria-hidden="true" /></span></button>
        <button className="sf-feature" onClick={() => onNavigate("plan")}><CalendarDays size={24} strokeWidth={1.4} aria-hidden="true" /><span className="sf-feature-number">04</span><h3>Make a week of it.</h3><p>Choose a look for each event, plan a rewear and save a text-only PDF.</p><span className="sf-feature-action">Build my plan <ArrowRight size={17} aria-hidden="true" /></span></button>
      </div>
    </section>
    <section id="how-it-works" tabIndex={-1} className="sf-how-section" aria-labelledby="how-heading">
      <div className="sf-guide-heading"><span className="sf-context">From a maybe to your moment</span><h2 id="how-heading">A few steps. A look that’s yours.</h2></div>
      <ol className="sf-how-steps">
        <li><span>01</span><h3>Find your starting point</h3><p>Pick an occasion. Browse outfit ideas or add a piece from your wardrobe.</p></li>
        <li><span>02</span><h3>Try it, when you’re ready</h3><p>Add your photo, review the permission and generate a preview. Every result shows its mode.</p></li>
        <li><span>03</span><h3>Choose your celebration looks</h3><p>Compare, shortlist and assign your outfits across five events. Save your plan before you go.</p></li>
      </ol>
      <div className="sf-guide-privacy"><ShieldCheck size={18} aria-hidden="true" /><p>Browse first. A photo is only needed for a personal try-on.</p></div>
    </section>
    <section id="faq" tabIndex={-1} className="sf-faq-section" aria-labelledby="faq-heading">
      <div className="sf-guide-heading"><span className="sf-context">Before you get dressed</span><h2 id="faq-heading">A few things you might wonder.</h2><p>Your photos, your choices and what to expect.</p></div>
      <div className="sf-faq-list">{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
    </section>
    <section className="sf-final-invite" aria-labelledby="invite-heading"><span className="sf-season">Made for every kind of celebration</span><h2 id="invite-heading">One less thing to wonder.<br /><em>One more reason to dance.</em></h2><button className="sf-button sf-button-primary" onClick={() => onNavigate("plan")}>Create my celebration plan <ArrowRight size={18} aria-hidden="true" /></button><p>No photo needed to start planning.</p></section>
    <footer className="sf-site-footer"><div><strong>SangeetFit</strong><p>Your clothes. Your celebrations.</p></div><nav aria-label="Footer navigation"><Link href="/library">Explore collection</Link><button onClick={() => onNavigate("how-it-works")}>How it works</button><button onClick={() => onNavigate("faq")}>FAQs & privacy</button><button onClick={() => onNavigate("home")}>Back to top ↑</button></nav><p className="sf-footer-note">AI-generated outfit concepts · review status shown per look<br />Virtual try-on powered by YouCam when live generation is available.</p></footer>
  </>;
}
