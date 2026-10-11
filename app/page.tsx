import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES, ITEMS, ITEM_BY_KEY } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" }, description: SITE.description };

const FEATURED: [string, string, string][] = [
  ["bingo-card-generator", "tile-bingo", "B I N G O"], ["word-search-maker", "tile-ws", "W O R D S"], ["crossword-maker", "tile-cw", "ACROSS"],
  ["printable-sudoku", "tile-sudoku", "5 3 · · 7"], ["maze-generator", "tile-maze", ""], ["printable-bingo-cards", "tile-balls", "B 7  N 42  O 68"],
];

export default function Home() {
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: `${SITE.url}/`, description: SITE.description },
        { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: `${SITE.url}/`, logo: `${SITE.url}/icon.svg` },
      ]} />
      <div className="hero home-hero">
        <div className="wrap">
          <h1>Free Printable Puzzle Maker: Bingo, Word Search, Crossword &amp; Sudoku</h1>
          <p className="lede">Bingo cards with your own words, word searches from any list, crosswords from your clues, plus sudoku and mazes at every level. Free PDFs with answer keys, no sign-up.</p>
        </div>
      </div>
      <div className="wrap">
        <ul className="featured">
          {FEATURED.map(([k, cls, txt]) => {
            const i = ITEM_BY_KEY[k];
            return <li key={k}><Link href={i.path}><span className={`tile ${cls}`} aria-hidden="true">{txt}</span><b>{i.title}</b><span className="muted small">{i.short}</span></Link></li>;
          })}
        </ul>
        <div className="index">
          {CATEGORIES.map((c) => (
            <section key={c.slug}>
              <h2><Link href={`/category/${c.slug}/`}>{c.name}</Link></h2>
              <p className="blurb">{c.blurb}</p>
              <ul>{ITEMS.filter((i) => i.category === c.slug).slice(0, 12).map((i) => <li key={i.key}><Link href={i.path}><span>{i.title}</span><span>{i.short}</span></Link></li>)}</ul>
            </section>
          ))}
        </div>
        <section className="prose home-about">
          <h2>Puzzles made for your group</h2>
          <p>Store-bought puzzle books can&apos;t use your spelling list, your team&apos;s inside jokes or the gifts on a baby shower registry. Here you type the words, and the generator builds the puzzle: shuffled bingo cards so no two players match, word searches with a matching answer key, and crosswords numbered for you.</p>
          <p>Sudoku puzzles are checked by a solver so each one has exactly one solution, and every maze has exactly one path from start to finish.</p>
        </section>
      </div>
    </>
  );
}
