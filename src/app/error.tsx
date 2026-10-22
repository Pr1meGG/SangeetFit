"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main-content" className="sf-app"><section className="sf-empty"><h1>Your fitting room needs a moment.</h1><p>Try reopening this view. No new try-on will start automatically.</p><button className="sf-button sf-button-primary" onClick={reset}>Try this view again</button><button className="sf-text-link" onClick={() => window.location.assign("/")}>Start a fresh session</button><p className="sf-form-help">A fresh session clears photos and unsaved looks from this page.</p></section></main>;
}
