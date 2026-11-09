import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return <main className="entry-page"><div className="entry-card"><Image className="large-mark" src="/brand/angel-option-a.svg" alt="" width={64} height={64} unoptimized /><p className="eyebrow">404</p><h1>Page not found</h1><p className="lead">This archive page is not available.</p><div className="entry-links"><Link className="button button-primary" href="/en/">English home</Link><Link className="button button-outline" href="/uk/">Українська</Link></div></div></main>;
}
