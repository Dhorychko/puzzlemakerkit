import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES, CAT_BY_SLUG, ITEMS, type CatSlug } from "@/lib/catalog";
import { SITE } from "@/lib/site";

const META: Record<CatSlug, string> = {
  bingo: "Free printable bingo cards: a custom bingo card generator, classic 1–75 number cards, blank templates, a 2026 goals card and themed cards for parties.",
  "word-search": "Free printable word searches: make your own from any word list, or print themed puzzles for holidays, seasons, animals and sports, with answer keys.",
  crosswords: "Free crossword puzzle maker and printable crosswords: turn your words and clues into a numbered crossword with an answer key, or print a themed one.",
  "sudoku-mazes": "Free printable sudoku from easy to expert, 4×4 and 6×6 sudoku for kids, and a maze generator with solutions. New puzzles every time you click.",
};

export const dynamicParams = false;
export function generateStaticParams() { return CATEGORIES.map((c) => ({ cat: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const c = CAT_BY_SLUG[cat as CatSlug];
  return c ? { title: c.name, description: META[c.slug], alternates: { canonical: `/category/${c.slug}/` } } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const c = CAT_BY_SLUG[cat as CatSlug];
  if (!c) notFound();
  const list = ITEMS.filter((i) => i.category === c.slug && !i.parent);
  return (
    <div className="wrap" style={{ paddingBlock: "8px 48px" }}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Home", "/"], [c.name, `/category/${c.slug}/`]].map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${p}` })) }} />
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link></nav>
      <h1>{c.name}</h1>
      <p className="lede">{c.blurb}</p>
      <div className="cards">
        {list.map((x) => (
          <Link key={x.key} href={x.path} className="card-link">
            <b>{x.title}</b>
            <span>{x.short}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
