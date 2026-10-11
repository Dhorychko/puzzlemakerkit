export const SITE = {
  name: "PuzzleMakerKit",
  domain: "puzzlemakerkit.com",
  url: (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://puzzlemakerkit.com").replace(/\/$/, ""),
  description: "Free puzzle makers: custom bingo cards, word searches, crosswords, sudoku and mazes. Print themed puzzles with answer keys as PDFs.",
  updated: "October 2026",
};

/** Shared Open Graph fields; page metadata replaces the whole openGraph object, so pages spread this in. */
export const OG_BASE = { siteName: SITE.name, type: "website" as const, locale: "en_US", images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }] };
