import Link from "next/link";
import { CATEGORIES, ITEMS } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import Analytics from "./Analytics";

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#12343b" />
      <path d="M11 2v28M21 2v28M2 11h28M2 21h28" stroke="#3d6a72" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6.5" fill="#d6336c" opacity="0.92" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="site-head">
      <div className="wrap">
        <Link href="/" className="logo"><Logo />{SITE.name}</Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/bingo-card-generator/">Bingo</Link>
          <Link href="/word-search-maker/">Word search</Link>
          <Link href="/crossword-maker/">Crossword</Link>
          <Link href="/printable-sudoku/">Sudoku</Link>
          <Link href="/maze-generator/">Mazes</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div>
          <h2>{SITE.name}</h2>
          <p className="small">Free puzzle makers for classrooms, parties and puzzle lovers. Everything is generated in your browser; nothing to sign up for.</p>
          <p className="small"><Link href="/about/">About and terms of use</Link> · <Link href="/privacy/">Privacy</Link> · <Link href="/contact/">Contact</Link></p>
        </div>
        {CATEGORIES.map((c) => (
          <div key={c.slug}>
            <h2><Link href={`/category/${c.slug}/`}>{c.name}</Link></h2>
            <ul>{ITEMS.filter((i) => i.category === c.slug && !i.parent).slice(0, 6).map((i) => <li key={i.key}><Link href={i.path}>{i.title}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <Analytics />
    </footer>
  );
}
