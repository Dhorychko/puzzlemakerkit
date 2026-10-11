import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "./JsonLd";
import ToolFor from "./ToolFor";
import { CAT_BY_SLUG, ITEMS, ITEM_BY_KEY, type Item } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import { SITE, OG_BASE } from "@/lib/site";

export function itemMetadata(item: Item): Metadata {
  const c = getContent(item.key);
  const title = `${item.title} (Free PDF)`;
  return { title, description: c.meta, alternates: { canonical: item.path }, openGraph: { ...OG_BASE, title: `${title} | ${SITE.name}`, description: c.meta, url: item.path } };
}

export default function ItemPage({ item }: { item: Item }) {
  const c = getContent(item.key);
  const cat = CAT_BY_SLUG[item.category];
  const parent = item.parent ? ITEM_BY_KEY[item.parent] : undefined;
  const crumbs: [string, string][] = [["Home", "/"], [cat.name, `/category/${cat.slug}/`], ...(parent ? [[parent.title, parent.path] as [string, string]] : []), [item.title, item.path]];
  const related = c.related.map((k) => ITEM_BY_KEY[k]).filter(Boolean);
  const more = ITEMS.filter((i) => i.category === item.category && !i.parent && i.key !== item.key && !c.related.includes(i.key));
  const children = ITEMS.filter((i) => i.parent === item.key);
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "WebApplication", name: item.h1 ?? item.title, url: `${SITE.url}${item.path}`, applicationCategory: "GameApplication", operatingSystem: "Any", description: c.meta, isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${p}` })) },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ]} />
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">{crumbs.slice(0, -1).map(([n, p], i) => <span key={p}>{i > 0 && " / "}<Link href={p}>{n}</Link></span>)}</nav>
          <h1>{item.h1 ?? item.title}</h1>
          <p className="lede">{c.intro}</p>
        </div>
      </div>
      <div className="wrap tool-area"><ToolFor item={item} /></div>
      <div className="wrap article">
        <article className="prose">
          {children.length > 0 && (
            <>
              <h2>{item.category === "bingo" ? "Themed bingo cards" : item.category === "word-search" ? "Themed word searches" : "More versions"}</h2>
              <ul className="chip-list">{children.map((x) => <li key={x.key}><Link href={x.path}>{x.title}</Link></li>)}</ul>
            </>
          )}
          <h2>How to use it</h2>
          <ol>{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          {c.table && (
            <>
              <h2>{c.table.caption}</h2>
              <div className="table-scroll"><table className="data"><thead><tr>{c.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>{c.table.rows.map((r) => <tr key={r[0]}>{r.map((v, i) => <td key={i}>{v}</td>)}</tr>)}</tbody></table></div>
            </>
          )}
          <h2>Good to know</h2>
          <ul>{c.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          <h2>Questions</h2>
          {c.faq.map((f) => <details className="faq" key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </article>
        <aside className="side">
          <h2>Related</h2>
          <ul>{related.map((r) => <li key={r.key}><Link href={r.path}>{r.title}</Link></li>)}</ul>
          {more.length > 0 && <><h2>More {cat.name.toLowerCase()}</h2><ul>{more.map((r) => <li key={r.key}><Link href={r.path}>{r.title}</Link></li>)}</ul></>}
        </aside>
      </div>
    </>
  );
}
