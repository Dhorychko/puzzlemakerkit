// Shared logic for the item routes app/[slug] and app/[slug]/[sub].
// (Two plain dynamic folders instead of a catch-all "[...path]" folder, whose name GitHub's web upload rejects.)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemPage, { itemMetadata } from "@/components/ItemPage";
import { ITEMS, ITEM_BY_PATH } from "@/lib/catalog";

const segs = (path: string) => path.split("/").filter(Boolean);
export const paramsAtDepth = (depth: 1 | 2) =>
  ITEMS.map((i) => segs(i.path)).filter((p) => p.length === depth).map((p) => (depth === 1 ? { slug: p[0] } : { slug: p[0], sub: p[1] }));
const find = (p: string[]) => ITEM_BY_PATH[`/${p.join("/")}/`];

export function metadataFor(p: string[]): Metadata {
  const item = find(p);
  return item ? itemMetadata(item) : {};
}
export function render(p: string[]) {
  const item = find(p);
  if (!item) notFound();
  return <ItemPage item={item} />;
}
