import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="sf-app"><section className="sf-empty"><h1>This look took a different turn.</h1><p>That page is unavailable. Explore the collection or start with an occasion.</p><Link href="/" className="sf-button sf-button-primary">Choose an occasion</Link><Link href="/library" className="sf-text-link">Explore the collection</Link></section></main>;
}
