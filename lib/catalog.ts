import { CLUE_SETS, THEMES } from "./themes.ts";

export type CatSlug = "bingo" | "word-search" | "crosswords" | "sudoku-mazes";
export const CATEGORIES: { slug: CatSlug; name: string; blurb: string }[] = [
  { slug: "bingo", name: "Bingo cards", blurb: "Custom bingo cards with your own words, classic 1–75 number cards, blank templates and party themes." },
  { slug: "word-search", name: "Word searches", blurb: "Make a word search from any list, or print a ready-made themed puzzle with an answer key." },
  { slug: "crosswords", name: "Crosswords", blurb: "Turn words and clues into a crossword, or print a themed crossword for class." },
  { slug: "sudoku-mazes", name: "Sudoku & mazes", blurb: "Printable sudoku from easy to expert, kids' 4 × 4 and 6 × 6 sudoku, and mazes with solutions." },
];
export const CAT_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<CatSlug, (typeof CATEGORIES)[number]>;

export type Tool =
  | { k: "bingo"; mode: "custom" | "classic" | "blank" | "theme" | "yearly"; theme?: string; year?: number }
  | { k: "ws"; theme?: string; kind?: "kids" | "large" | "custom"; pick?: boolean }
  | { k: "cw"; set?: string }
  | { k: "sudoku"; level: "easy" | "medium" | "hard" | "expert"; box: "2x2" | "2x3" | "3x3" }
  | { k: "maze" };

export type Item = { key: string; path: string; title: string; h1?: string; short: string; category: CatSlug; tool: Tool; parent?: string };

const BINGO_THEMES = THEMES.filter((t) => t.bingo);
const WS_THEMES = THEMES.filter((t) => t.words);

export const ITEMS: Item[] = [
  { key: "bingo-card-generator", path: "/bingo-card-generator/", title: "Bingo Card Generator", h1: "Bingo Card Generator", short: "your own words, up to 200 unique cards", category: "bingo", tool: { k: "bingo", mode: "custom" } },
  { key: "printable-bingo-cards", path: "/printable-bingo-cards/", title: "Printable Bingo Cards (1–75)", h1: "Printable Bingo Cards 1–75", short: "classic number cards with a caller's sheet", category: "bingo", tool: { k: "bingo", mode: "classic" } },
  { key: "blank-bingo-card", path: "/blank-bingo-card/", title: "Blank Bingo Card Template", h1: "Blank Bingo Card Template", short: "empty 5 × 5, 4 × 4 or 3 × 3 cards", category: "bingo", tool: { k: "bingo", mode: "blank" } },
  { key: "2027-bingo-card", path: "/2027-bingo-card/", title: "2027 Bingo Card", h1: "2027 Bingo Card: Goals for the New Year", short: "25 goals for the new year", category: "bingo", tool: { k: "bingo", mode: "yearly", year: 2027 } },
  { key: "2026-bingo-card", path: "/2026-bingo-card/", title: "2026 Bingo Card", h1: "2026 Bingo Card: Goals for the Rest of the Year", short: "finish the year strong", category: "bingo", tool: { k: "bingo", mode: "yearly", year: 2026 }, parent: "2027-bingo-card" },
  ...BINGO_THEMES.map((t): Item => ({ key: `bingo-${t.slug}`, path: `/bingo/${t.slug}/`, title: `${t.name} Bingo`, h1: `Printable ${t.name} Bingo Cards`, short: `${t.bingo!.length} ${t.name.toLowerCase()} words`, category: "bingo", tool: { k: "bingo", mode: "theme", theme: t.slug }, parent: "bingo-card-generator" })),

  { key: "word-search-maker", path: "/word-search-maker/", title: "Word Search Maker", h1: "Word Search Maker", short: "type words, get a puzzle and answer key", category: "word-search", tool: { k: "ws", kind: "custom" } },
  { key: "printable-word-search", path: "/printable-word-search/", title: "Printable Word Searches", h1: "Printable Word Search Puzzles", short: "themed puzzles with answer keys", category: "word-search", tool: { k: "ws", theme: "animals", pick: true } },
  { key: "word-search-kids", path: "/word-search/kids/", title: "Word Search for Kids", h1: "Easy Word Search for Kids", short: "short words, across and down only", category: "word-search", tool: { k: "ws", kind: "kids" }, parent: "printable-word-search" },
  { key: "word-search-large-print", path: "/word-search/large-print/", title: "Large Print Word Search", h1: "Large Print Word Search Puzzles", short: "big letters for seniors and low vision", category: "word-search", tool: { k: "ws", kind: "large" }, parent: "printable-word-search" },
  ...WS_THEMES.map((t): Item => ({ key: `ws-${t.slug}`, path: `/word-search/${t.slug}/`, title: `${t.name} Word Search`, h1: `${t.name} Word Search (Printable)`, short: `${t.words!.length} ${t.name.toLowerCase()} words`, category: "word-search", tool: { k: "ws", theme: t.slug }, parent: "printable-word-search" })),

  { key: "crossword-maker", path: "/crossword-maker/", title: "Crossword Puzzle Maker", h1: "Crossword Puzzle Maker", short: "your words and clues, with an answer key", category: "crosswords", tool: { k: "cw" } },
  { key: "printable-crosswords", path: "/printable-crosswords/", title: "Printable Crossword Puzzles", h1: "Printable Crossword Puzzles", short: "themed crosswords for kids and classes", category: "crosswords", tool: { k: "cw", set: "animals" } },
  ...CLUE_SETS.filter((c) => c.slug !== "animals").map((c): Item => ({ key: `cw-${c.slug}`, path: `/crossword/${c.slug}/`, title: `${c.name} Crossword`, h1: `${c.name} Crossword Puzzle (Printable)`, short: `${c.entries.length} clues with an answer key`, category: "crosswords", tool: { k: "cw", set: c.slug }, parent: "printable-crosswords" })),

  { key: "printable-sudoku", path: "/printable-sudoku/", title: "Printable Sudoku", h1: "Printable Sudoku Puzzles", short: "easy to expert, with solutions", category: "sudoku-mazes", tool: { k: "sudoku", level: "medium", box: "3x3" } },
  { key: "sudoku-easy", path: "/printable-sudoku/easy/", title: "Easy Sudoku Printable", h1: "Easy Sudoku Puzzles to Print", short: "40 clues, good for beginners", category: "sudoku-mazes", tool: { k: "sudoku", level: "easy", box: "3x3" }, parent: "printable-sudoku" },
  { key: "sudoku-hard", path: "/printable-sudoku/hard/", title: "Hard Sudoku Printable", h1: "Hard Sudoku Puzzles to Print", short: "about 28 clues", category: "sudoku-mazes", tool: { k: "sudoku", level: "hard", box: "3x3" }, parent: "printable-sudoku" },
  { key: "sudoku-expert", path: "/printable-sudoku/expert/", title: "Expert Sudoku Printable", h1: "Expert Sudoku Puzzles to Print", short: "about 25 clues", category: "sudoku-mazes", tool: { k: "sudoku", level: "expert", box: "3x3" }, parent: "printable-sudoku" },
  { key: "sudoku-for-kids", path: "/sudoku-for-kids/", title: "Sudoku for Kids", h1: "Sudoku for Kids: 4 × 4 and 6 × 6", short: "small grids for beginners", category: "sudoku-mazes", tool: { k: "sudoku", level: "easy", box: "2x3" } },
  { key: "maze-generator", path: "/maze-generator/", title: "Maze Generator", h1: "Printable Maze Generator", short: "easy to expert mazes with solutions", category: "sudoku-mazes", tool: { k: "maze" } },
];

export const ITEM_BY_KEY = Object.fromEntries(ITEMS.map((i) => [i.key, i])) as Record<string, Item>;
export const ITEM_BY_PATH = Object.fromEntries(ITEMS.map((i) => [i.path, i])) as Record<string, Item>;
