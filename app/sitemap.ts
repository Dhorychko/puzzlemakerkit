import type { MetadataRoute } from "next";
import { CATEGORIES, ITEMS } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-09");
  return [
    { url: `${SITE.url}/`, lastModified },
    ...ITEMS.map((i) => ({ url: `${SITE.url}${i.path}`, lastModified })),
    ...CATEGORIES.map((c) => ({ url: `${SITE.url}/category/${c.slug}/`, lastModified })),
    { url: `${SITE.url}/about/`, lastModified },
    { url: `${SITE.url}/privacy/`, lastModified },
    { url: `${SITE.url}/contact/`, lastModified },
  ];
}
