import Link from "next/link";

export default function EntryPage() {
  return <main className="entry-page">
    <div className="entry-card">
      <span className="brand-mark large-mark" aria-hidden="true">✳</span>
      <p className="eyebrow">A travelling memorial</p>
      <h1>Angels of Ukraine</h1>
      <p className="lead">A respectful archive of memorial events and a guide for communities who wish to organize.</p>
      <div className="entry-links"><Link className="button button-primary" href="/en/">English</Link><Link className="button button-outline" href="/uk/" lang="uk">Українська</Link></div>
    </div>
  </main>;
}
