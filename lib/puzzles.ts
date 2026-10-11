// Puzzle generators. All randomness comes from a seeded RNG, so the preview and the PDF always match.
import { footer, header, pageSize, textWidth, type Op, type Page, type SizeKey } from "./draw.ts";

export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));
const INK = "#12343b", SOFT = "#5b6f73", LINE = "#12343b";

/** Wrap text into lines that fit `maxW`, shrinking the font until it fits in `maxH`. */
function fitText(s: string, maxW: number, maxH: number, start: number, bold = false): { lines: string[]; size: number } {
  const font = bold ? "sansBold" : "sans";
  for (let size = start; size >= 5; size -= 0.5) {
    const words = s.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let cur = "";
    let ok = true;
    for (const w of words) {
      if (textWidth(w, font, size) > maxW) { ok = false; break; }
      const next = cur ? `${cur} ${w}` : w;
      if (textWidth(next, font, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
    }
    if (cur) lines.push(cur);
    if (ok && lines.length * size * 1.15 <= maxH) return { lines, size };
  }
  return { lines: [s.slice(0, 14)], size: 5 };
}

function cellText(ops: Op[], s: string, x: number, y: number, w: number, h: number, start: number, bold = false, color = INK, left = false) {
  const { lines, size } = fitText(s, w - 6, h - 6, start, bold);
  const lh = size * 1.15;
  const top = y + h / 2 - (lines.length * lh) / 2 + size * 0.85;
  lines.forEach((ln, i) => ops.push({ t: "text", x: left ? x : x + w / 2, y: top + i * lh, s: ln, size, font: bold ? "sansBold" : "sans", c: color, align: left ? "left" : "center" }));
}

// ======================================================================== Bingo
export type BingoOpts = {
  items: string[]; classic: boolean; cards: number; grid: 3 | 4 | 5; free: boolean; freeText: string; perPage: 1 | 2 | 4;
  title: string; size: SizeKey; seed: number; callSheet: boolean; blank?: boolean;
};

export function bingoCards(o: BingoOpts): string[][] {
  const r = rng(o.seed);
  const n = o.grid, total = n * n, mid = n % 2 === 1 && o.free ? Math.floor(total / 2) : -1;
  const count = clamp(Math.round(o.cards), 1, 200);
  const out: string[][] = [];
  const seen = new Set<string>();
  for (let k = 0; k < count; k++) {
    let card: string[] = [];
    for (let attempt = 0; attempt < 20; attempt++) {
      if (o.blank) card = Array(total).fill("");
      else if (o.classic && n === 5) {
        const cols = [0, 1, 2, 3, 4].map((c) => shuffle(Array.from({ length: 15 }, (_, i) => String(c * 15 + i + 1)), r).slice(0, 5));
        card = Array.from({ length: 25 }, (_, i) => cols[i % 5][Math.floor(i / 5)]);
      } else {
        const pool = o.items.length ? o.items : ["Add your words"];
        const need = total - (mid >= 0 ? 1 : 0);
        let pick = shuffle(pool, r);
        while (pick.length < need) pick = pick.concat(shuffle(pool, r)); // not enough items: repeats across the card are unavoidable
        pick = pick.slice(0, need);
        card = [];
        let j = 0;
        for (let i = 0; i < total; i++) card.push(i === mid ? "" : pick[j++]);
      }
      if (mid >= 0) card[mid] = o.freeText || "FREE";
      const key = card.join("|");
      if (!seen.has(key) || o.blank) { seen.add(key); break; }
    }
    out.push(card);
  }
  return out;
}

export function bingoPages(o: BingoOpts): Page[] {
  const { w, h } = pageSize(o.size, false);
  const cards = bingoCards(o);
  const per = o.perPage;
  const m = 30;
  const pages: Page[] = [];
  const n = o.grid;
  for (let i = 0; i < cards.length; i += per) {
    const ops: Op[] = [];
    const slots = per === 1 ? [[m, m, w - 2 * m, h - 2 * m - 10]] : per === 2
      ? [[m, m, w - 2 * m, (h - 3 * m) / 2], [m, h / 2 + m / 2, w - 2 * m, (h - 3 * m) / 2]]
      : [[m, m, (w - 3 * m) / 2, (h - 3 * m) / 2], [w / 2 + m / 2, m, (w - 3 * m) / 2, (h - 3 * m) / 2], [m, h / 2 + m / 2, (w - 3 * m) / 2, (h - 3 * m) / 2], [w / 2 + m / 2, h / 2 + m / 2, (w - 3 * m) / 2, (h - 3 * m) / 2]];
    cards.slice(i, i + per).forEach((card, k) => {
      const [sx, sy, sw, sh] = slots[k];
      const titleH = Math.min(sh * 0.16, 54);
      const cell = Math.min(sw / n, (sh - titleH - 6) / n);
      const gx = sx + (sw - cell * n) / 2, gy = sy + titleH + 6;
      // Header: BINGO letters over a 5-wide card, otherwise the title
      if (n === 5 && !o.title.trim()) {
        "BINGO".split("").forEach((L, c) => ops.push({ t: "text", x: gx + c * cell + cell / 2, y: sy + titleH * 0.82, s: L, size: Math.min(titleH * 0.95, cell * 0.7), font: "sansBold", c: "#d6336c", align: "center" }));
      } else {
        cellText(ops, o.title.trim() || "BINGO", gx, sy, cell * n, titleH, Math.min(titleH * 0.6, 30), true, "#d6336c");
      }
      // One text size for the whole card (the size the longest entry needs), so squares look even.
      const start = Math.min(cell * (o.classic ? 0.42 : 0.2), o.classic ? 34 : 16);
      const midIdx = n % 2 === 1 && o.free ? Math.floor((n * n) / 2) : -1;
      const even = o.classic ? start : Math.min(start, ...card.map((s, idx) => (s && idx !== midIdx ? fitText(s, cell - 6, cell - 6, start).size : start)));
      for (let rr = 0; rr < n; rr++) for (let cc = 0; cc < n; cc++) {
        const x = gx + cc * cell, y = gy + rr * cell, idx = rr * n + cc;
        const isFree = n % 2 === 1 && o.free && idx === Math.floor((n * n) / 2);
        ops.push({ t: "rect", x, y, w: cell, h: cell, stroke: LINE, lw: 1.2, fill: isFree ? "#ffe9a8" : undefined });
        const s = card[idx];
        if (s) cellText(ops, s, x, y, cell, cell, isFree ? start : even, isFree || o.classic, INK);
      }
      ops.push({ t: "rect", x: gx, y: gy, w: cell * n, h: cell * n, stroke: LINE, lw: 2.4 });
      if (cards.length > 1) ops.push({ t: "text", x: gx + cell * n, y: gy + cell * n + 10, s: `Card ${i + k + 1}`, size: 7, font: "sans", c: SOFT, align: "right" });
    });
    footer(ops, w, h);
    pages.push({ w, h, ops });
  }
  if (o.callSheet && !o.blank) pages.push(callSheet(o, w, h));
  return pages;
}

function callSheet(o: BingoOpts, w: number, h: number): Page {
  const ops: Op[] = [];
  const m = 40;
  let y = header(ops, w, m, "Caller's sheet: cut out and draw, or tick as you call", false);
  if (o.classic && o.grid === 5) {
    const cw = (w - 2 * m) / 5, ch = Math.min(28, (h - y - 60) / 16);
    "BINGO".split("").forEach((L, c) => ops.push({ t: "text", x: m + c * cw + cw / 2, y: y + ch * 0.75, s: L, size: 16, font: "sansBold", c: "#d6336c", align: "center" }));
    for (let c = 0; c < 5; c++) for (let i = 0; i < 15; i++) {
      const x = m + c * cw, yy = y + ch * (i + 1);
      ops.push({ t: "rect", x: x + 4, y: yy, w: cw - 8, h: ch, stroke: "#9fb4b8", lw: 0.6 });
      ops.push({ t: "text", x: x + cw / 2, y: yy + ch * 0.7, s: `${"BINGO"[c]} ${c * 15 + i + 1}`, size: 11, font: "sans", c: INK, align: "center" });
    }
  } else {
    const items = Array.from(new Set(o.items)).sort((a, b) => a.localeCompare(b));
    const cols = items.length > 40 ? 3 : 2;
    const rows = Math.ceil(items.length / cols);
    const ch = Math.min(26, (h - y - 50) / Math.max(rows, 1)), cw = (w - 2 * m) / cols;
    items.forEach((it, i) => {
      const c = Math.floor(i / rows), r = i % rows;
      const x = m + c * cw, yy = y + r * ch;
      ops.push({ t: "rect", x: x + 2, y: yy + ch * 0.25, w: ch * 0.5, h: ch * 0.5, stroke: "#9fb4b8", lw: 0.7 });
      cellText(ops, it, x + ch * 0.8, yy, cw - ch, ch, 11, false, INK, true);
    });
  }
  footer(ops, w, h);
  return { w, h, ops };
}

// ======================================================================== Word search
export type Dirs = "easy" | "medium" | "hard";
export type WordSearch = { grid: string[][]; placed: { word: string; r: number; c: number; dr: number; dc: number }[]; skipped: string[] };
const DIRS: Record<Dirs, [number, number][]> = {
  easy: [[0, 1], [1, 0]],
  medium: [[0, 1], [1, 0], [1, 1], [-1, 1]],
  hard: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]],
};
export const cleanWord = (w: string) => w.toUpperCase().replace(/[^A-Z]/g, "");

/** Words that must never appear by accident in the random filler letters (checked in all 8 directions). */
const FILLER_BLOCK = "FUCK SHIT CUNT COCK DICK PISS ASS TIT TITS FAG CUM SEX PORN SLUT WHORE BITCH NAZI KKK RAPE HOMO JAP NIGGER NIGGA FAGGOT DAMN CRAP PENIS ANUS ANAL BOOB BOOBS TWAT WANK PUSSY DYKE SPIC KIKE COON GOOK PRICK TURD DILDO JIZZ HELL KILL DIE".split(" ");
const ALL8: [number, number][] = DIRS.hard;

/** Every place `word` can be read in the grid, in any of the 8 directions, as lists of cells. */
function occurrences(grid: string[][], word: string): [number, number][][] {
  const n = grid.length, out: [number, number][][] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (grid[r][c] !== word[0]) continue;
    for (const [dr, dc] of ALL8) {
      const r1 = r + dr * (word.length - 1), c1 = c + dc * (word.length - 1);
      if (r1 < 0 || r1 >= n || c1 < 0 || c1 >= n) continue;
      let ok = true;
      for (let i = 1; i < word.length && ok; i++) ok = grid[r + dr * i][c + dc * i] === word[i];
      if (ok && (word.length > 1 || dr === 0 && dc === 1)) out.push(Array.from({ length: word.length }, (_, i) => [r + dr * i, c + dc * i] as [number, number]));
    }
  }
  return out;
}

/** Words that are part of a longer word in the list (CORN in ACORN) can't be found unambiguously, so they're left out. */
export function nestedWords(words: string[]): { word: string; inside: string }[] {
  const list = Array.from(new Set(words.map(cleanWord).filter((w) => w.length >= 2)));
  const out: { word: string; inside: string }[] = [];
  for (const w of list) {
    const host = list.find((o) => o !== w && o.length > w.length && (o.includes(w) || o.includes([...w].reverse().join(""))));
    if (host) out.push({ word: w, inside: host });
  }
  return out;
}

function fillAndClean(res: { grid: string[][]; placed: WordSearch["placed"]; clean: boolean }, r: () => number) {
  const { grid, placed } = res, n = grid.length;
  const filler = new Set<string>();
  const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!grid[i][j]) { grid[i][j] = AZ[Math.floor(r() * 26)]; filler.add(`${i},${j}`); }
  // No rude words in the filler, and every listed word appears exactly once.
  const placedKeys = new Set(placed.map((p) => `${p.word}|${p.r},${p.c},${p.dr},${p.dc}`));
  const pathOf = new Map<string, number[]>();
  placed.forEach((p, k) => { for (let i = 0; i < p.word.length; i++) { const key = `${p.r + p.dr * i},${p.c + p.dc * i}`; pathOf.set(key, [...(pathOf.get(key) ?? []), k]); } });
  /** True when the cells lie along a single answer (GRATITUDE contains TIT): that is part of the word, not an accident. */
  const insideAnswer = (cells: [number, number][]) => placed.some((_, k) => cells.every(([i, j]) => pathOf.get(`${i},${j}`)?.includes(k)));
  const reroll = (cells: [number, number][]) => {
    const free = cells.filter(([i, j]) => filler.has(`${i},${j}`));
    if (!free.length) { if (!insideAnswer(cells)) res.clean = false; return false; }
    const [i, j] = free[Math.floor(r() * free.length)];
    grid[i][j] = AZ[Math.floor(r() * 26)];
    return true;
  };
  for (let pass = 0; pass < 300; pass++) {
    res.clean = true;
    let fixed = false;
    for (const bad of FILLER_BLOCK) for (const occ of occurrences(grid, bad)) if (reroll(occ)) fixed = true;
    for (const p of placed) for (const occ of occurrences(grid, p.word)) {
      const [r0, c0] = occ[0];
      const dr = occ.length > 1 ? occ[1][0] - r0 : 0, dc = occ.length > 1 ? occ[1][1] - c0 : 1;
      if (placedKeys.has(`${p.word}|${r0},${c0},${dr},${dc}`)) continue;
      // Palindromes read the same backwards along their own path: not a second copy.
      const [er, ec] = occ[occ.length - 1];
      if (placedKeys.has(`${p.word}|${er},${ec},${-dr},${-dc}`)) continue;
      if (reroll(occ)) fixed = true;
    }
    if (!fixed) break;
  }
}

function placeAll(list: string[], n: number, dirs: Dirs, r: () => number) {
  const grid: string[][] = Array.from({ length: n }, () => Array(n).fill(""));
  const placed: WordSearch["placed"] = [];
  const skipped: string[] = [];
  const fits = (word: string, r0: number, c0: number, dr: number, dc: number) => {
    const r1 = r0 + dr * (word.length - 1), c1 = c0 + dc * (word.length - 1);
    if (r1 < 0 || r1 >= n || c1 < 0 || c1 >= n) return false;
    for (let i = 0; i < word.length; i++) { const g = grid[r0 + dr * i][c0 + dc * i]; if (g && g !== word[i]) return false; }
    return true;
  };
  const put = (word: string, r0: number, c0: number, dr: number, dc: number) => {
    for (let i = 0; i < word.length; i++) grid[r0 + dr * i][c0 + dc * i] = word[i];
    placed.push({ word, r: r0, c: c0, dr, dc });
  };
  for (const word of list) {
    if (word.length > n) { skipped.push(word); continue; }
    let done = false;
    for (let t = 0; t < 300 && !done; t++) {
      const [dr, dc] = DIRS[dirs][Math.floor(r() * DIRS[dirs].length)];
      const r0 = Math.floor(r() * n), c0 = Math.floor(r() * n);
      if (fits(word, r0, c0, dr, dc)) { put(word, r0, c0, dr, dc); done = true; }
    }
    if (!done) {
      // Exhaustive fallback: try every start cell and direction, in random order.
      const starts = shuffle(Array.from({ length: n * n }, (_, i) => i), r);
      outer: for (const s0 of starts) for (const [dr, dc] of shuffle(DIRS[dirs], r)) {
        const r0 = Math.floor(s0 / n), c0 = s0 % n;
        if (fits(word, r0, c0, dr, dc)) { put(word, r0, c0, dr, dc); done = true; break outer; }
      }
    }
    if (!done) skipped.push(word);
  }
  return { grid, placed, skipped };
}

export function makeWordSearch(words: string[], size: number, dirs: Dirs, seed: number): WordSearch & { nested: { word: string; inside: string }[] } {
  const n = clamp(Math.round(size), 6, 25);
  const nested = nestedWords(words);
  const drop = new Set(nested.map((x) => x.word));
  const list = Array.from(new Set(words.map(cleanWord).filter((w) => w.length >= 2 && !drop.has(w)))).sort((a, b) => b.length - a.length);
  // A dead end (a word that won't fit, or a rude word formed by the answers themselves) is retried with a new layout.
  type Res = ReturnType<typeof placeAll> & { clean: boolean };
  let best: Res | null = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    const r = rng(seed + attempt * 104729);
    const res = { ...placeAll(list, n, dirs, r), clean: true } as Res;
    fillAndClean(res, r);
    const score = (x: Res) => x.skipped.filter((w) => w.length <= n).length * 2 + (x.clean ? 0 : 1);
    if (!best || score(res) < score(best)) best = res;
    if (score(best) === 0) break;
  }
  const { grid, placed, skipped } = best!;
  return { grid, placed, skipped, nested };
}

export type WSOpts = { words: string[]; gridSize: number; dirs: Dirs; title: string; size: SizeKey; seed: number; answers: boolean; large: boolean; puzzles: number };

export function wordSearchPages(o: WSOpts): { pages: Page[]; skipped: string[]; nested: { word: string; inside: string }[] } {
  const { w, h } = pageSize(o.size, false);
  const m = 40;
  const pages: Page[] = [], keys: Page[] = [];
  let skipped: string[] = [], nested: { word: string; inside: string }[] = [];
  for (let p = 0; p < clamp(Math.round(o.puzzles), 1, 10); p++) {
    const ws = makeWordSearch(o.words, o.gridSize, o.dirs, o.seed + p * 7919);
    if (p === 0) { skipped = ws.skipped; nested = ws.nested; }
    const n = ws.grid.length;
    const draw = (key: boolean): Page => {
      const ops: Op[] = [];
      const y0 = header(ops, w, m, `${o.title || "Word search"}${key ? " — answers" : ""}`, !key);
      const listRows = Math.ceil(ws.placed.length / (o.large ? 2 : 3));
      const listH = key ? 0 : Math.min(200, listRows * (o.large ? 22 : 16) + 30);
      const cell = Math.min((w - 2 * m) / n, (h - y0 - listH - 40) / n);
      const gx = (w - cell * n) / 2, gy = y0 + 6;
      if (key) for (const pl of ws.placed) {
        // Bars run a little past the first and last letter so the whole word is covered.
        const len = Math.hypot(pl.dr, pl.dc), ex = (pl.dc / len) * cell * 0.32, ey = (pl.dr / len) * cell * 0.32;
        const x1 = gx + pl.c * cell + cell / 2 - ex, y1 = gy + pl.r * cell + cell / 2 - ey;
        const x2 = x1 + pl.dc * (pl.word.length - 1) * cell + 2 * ex, y2 = y1 + pl.dr * (pl.word.length - 1) * cell + 2 * ey;
        ops.push({ t: "line", x1, y1, x2, y2, w: cell * 0.62, c: "#ffd43b" });
      }
      const onPath = new Set<string>();
      if (key) for (const pl of ws.placed) for (let i = 0; i < pl.word.length; i++) onPath.add(`${pl.r + pl.dr * i},${pl.c + pl.dc * i}`);
      const fs = cell * (o.large ? 0.62 : 0.55);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const hit = onPath.has(`${i},${j}`);
        ops.push({ t: "text", x: gx + j * cell + cell / 2, y: gy + i * cell + cell / 2 + fs * 0.36, s: ws.grid[i][j], size: fs, font: hit ? "sansBold" : "sans", c: key && !hit ? "#b8c4c6" : INK, align: "center" });
      }
      ops.push({ t: "rect", x: gx - 4, y: gy - 4, w: cell * n + 8, h: cell * n + 8, stroke: "#12343b", lw: 1.4, r: 6 });
      if (!key) {
        const words = ws.placed.map((x) => x.word).sort();
        const cols = o.large ? 2 : 3, cw = (w - 2 * m) / cols, rows = Math.ceil(words.length / cols);
        const ly = gy + cell * n + 26;
        const fsz = o.large ? 15 : 11;
        words.forEach((wd, i) => {
          const c = Math.floor(i / rows), r = i % rows;
          ops.push({ t: "rect", x: m + c * cw, y: ly + r * (fsz * 1.45) - fsz * 0.8, w: fsz * 0.7, h: fsz * 0.7, stroke: "#9fb4b8", lw: 0.7 });
          ops.push({ t: "text", x: m + c * cw + fsz * 1.1, y: ly + r * (fsz * 1.45), s: wd, size: fsz, font: "sans", c: INK });
        });
      }
      footer(ops, w, h);
      return { w, h, ops };
    };
    pages.push(draw(false));
    if (o.answers) keys.push(draw(true));
  }
  return { pages: [...pages, ...keys], skipped, nested };
}

// ======================================================================== Crossword
export type Entry = { answer: string; clue: string };
export type Placed = { answer: string; clue: string; r: number; c: number; across: boolean; num?: number };
export type Crossword = { placed: Placed[]; skipped: Entry[]; rows: number; cols: number; cells: Map<string, string> };

export function makeCrossword(entries: Entry[], seed: number, tries = 40): Crossword {
  const clean = entries.map((e) => ({ answer: cleanWord(e.answer), clue: e.clue.trim() })).filter((e) => e.answer.length >= 2);
  const uniq = Array.from(new Map(clean.map((e) => [e.answer, e])).values());
  const r = rng(seed);
  let best: Crossword | null = null;
  for (let t = 0; t < tries; t++) {
    const order = t === 0 ? [...uniq].sort((a, b) => b.answer.length - a.answer.length) : [uniq.sort((a, b) => b.answer.length - a.answer.length)[0], ...shuffle(uniq.slice(1), r)];
    const res = build(order.filter(Boolean));
    const area = res.rows * res.cols;
    if (!best || res.placed.length > best.placed.length || (res.placed.length === best.placed.length && area < best.rows * best.cols)) best = res;
    if (best.skipped.length === 0 && t > 10) break;
  }
  return best ?? { placed: [], skipped: uniq, rows: 0, cols: 0, cells: new Map() };
}

function build(order: Entry[]): Crossword {
  const cells = new Map<string, string>();
  const dirAt = new Map<string, number>(); // bit 1 = across, 2 = down
  const placed: Placed[] = [];
  const skipped: Entry[] = [];
  const k = (r: number, c: number) => `${r},${c}`;
  const fits = (word: string, r: number, c: number, across: boolean): number => {
    const dr = across ? 0 : 1, dc = across ? 1 : 0;
    if (cells.has(k(r - dr, c - dc)) || cells.has(k(r + dr * word.length, c + dc * word.length))) return -1;
    let cross = 0;
    for (let i = 0; i < word.length; i++) {
      const rr = r + dr * i, cc = c + dc * i, key = k(rr, cc);
      const g = cells.get(key);
      if (g) {
        if (g !== word[i]) return -1;
        if ((dirAt.get(key) ?? 0) & (across ? 1 : 2)) return -1;
        cross++;
      } else {
        // no side neighbours for new letters
        if (cells.has(k(rr + dc, cc + dr)) || cells.has(k(rr - dc, cc - dr))) return -1;
      }
    }
    return cross;
  };
  const put = (e: Entry, r: number, c: number, across: boolean) => {
    const dr = across ? 0 : 1, dc = across ? 1 : 0;
    for (let i = 0; i < e.answer.length; i++) {
      const key = k(r + dr * i, c + dc * i);
      cells.set(key, e.answer[i]);
      dirAt.set(key, (dirAt.get(key) ?? 0) | (across ? 1 : 2));
    }
    placed.push({ ...e, r, c, across });
  };
  order.forEach((e, idx) => {
    if (idx === 0) { put(e, 0, 0, true); return; }
    let bestPos: [number, number, boolean, number] | null = null;
    for (const p of placed) {
      for (let i = 0; i < p.answer.length; i++) {
        const pr = p.r + (p.across ? 0 : i), pc = p.c + (p.across ? i : 0);
        for (let j = 0; j < e.answer.length; j++) {
          if (e.answer[j] !== p.answer[i]) continue;
          const across = !p.across;
          const r = across ? pr : pr - j, c = across ? pc - j : pc;
          const score = fits(e.answer, r, c, across);
          if (score > 0 && (!bestPos || score > bestPos[3])) bestPos = [r, c, across, score];
        }
      }
    }
    if (bestPos) put(e, bestPos[0], bestPos[1], bestPos[2]); else skipped.push(e);
  });
  // normalize to 0,0 and number
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  for (const key of cells.keys()) { const [r, c] = key.split(",").map(Number); minR = Math.min(minR, r); minC = Math.min(minC, c); maxR = Math.max(maxR, r); maxC = Math.max(maxC, c); }
  if (!cells.size) return { placed: [], skipped, rows: 0, cols: 0, cells };
  const norm = new Map<string, string>();
  for (const [key, v] of cells) { const [r, c] = key.split(",").map(Number); norm.set(k(r - minR, c - minC), v); }
  const np = placed.map((p) => ({ ...p, r: p.r - minR, c: p.c - minC }));
  const starts = Array.from(new Set(np.map((p) => k(p.r, p.c)))).map((s) => s.split(",").map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const numAt = new Map(starts.map(([r, c], i) => [k(r, c), i + 1]));
  for (const p of np) p.num = numAt.get(k(p.r, p.c));
  return { placed: np, skipped, rows: maxR - minR + 1, cols: maxC - minC + 1, cells: norm };
}

export type CWOpts = { entries: Entry[]; title: string; size: SizeKey; seed: number; answers: boolean; wordBank: boolean };
export function crosswordPages(o: CWOpts): { pages: Page[]; cw: Crossword } {
  const cw = makeCrossword(o.entries, o.seed);
  const { w, h } = pageSize(o.size, false);
  const m = 36;
  const draw = (key: boolean): Page => {
    const ops: Op[] = [];
    const y0 = header(ops, w, m, `${o.title || "Crossword"}${key ? " — answers" : ""}`, !key);
    const across = cw.placed.filter((p) => p.across).sort((a, b) => (a.num ?? 0) - (b.num ?? 0));
    const down = cw.placed.filter((p) => !p.across).sort((a, b) => (a.num ?? 0) - (b.num ?? 0));
    const clueLines = Math.max(across.length, down.length) + 2;
    const clueH = key ? 0 : Math.min(h * 0.45, clueLines * 15 + 20 + (o.wordBank ? 40 : 0));
    const cell = cw.cols ? Math.min(30, (w - 2 * m) / cw.cols, (h - y0 - clueH - 40) / Math.max(cw.rows, 1)) : 20;
    const gx = (w - cell * cw.cols) / 2, gy = y0 + 6;
    const nums = new Map(cw.placed.map((p) => [`${p.r},${p.c}`, p.num]));
    for (const [keyRC, letter] of cw.cells) {
      const [r, c] = keyRC.split(",").map(Number);
      const x = gx + c * cell, y = gy + r * cell;
      ops.push({ t: "rect", x, y, w: cell, h: cell, stroke: LINE, lw: 0.9, fill: "#ffffff" });
      const num = nums.get(keyRC);
      if (num) ops.push({ t: "text", x: x + 1.6, y: y + cell * 0.3, s: String(num), size: Math.max(5, cell * 0.27), font: "sans", c: INK });
      if (key) ops.push({ t: "text", x: x + cell / 2, y: y + cell * 0.74, s: letter, size: cell * 0.55, font: "sansBold", c: INK, align: "center" });
    }
    if (!key) {
      let y = gy + cell * cw.rows + 26;
      const colW = (w - 2 * m - 20) / 2;
      const list = (title: string, items: Placed[], x: number) => {
        let yy = y;
        ops.push({ t: "text", x, y: yy, s: title, size: 12, font: "sansBold", c: INK });
        yy += 16;
        for (const p of items) {
          const { lines, size } = fitText(`${p.num}. ${p.clue} (${p.answer.length})`, colW, 40, 11);
          for (const ln of lines) { ops.push({ t: "text", x, y: yy, s: ln, size, font: "sans", c: INK }); yy += size * 1.3; }
          yy += 2;
        }
        return yy;
      };
      const e1 = list("Across", across, m), e2 = list("Down", down, m + colW + 20);
      if (o.wordBank) {
        y = Math.max(e1, e2) + 10;
        const bank = cw.placed.map((p) => p.answer).sort().join("   ");
        const { lines, size } = fitText(`Word bank:  ${bank}`, w - 2 * m, 60, 10);
        lines.forEach((ln, i) => ops.push({ t: "text", x: m, y: y + i * size * 1.3, s: ln, size, font: "sans", c: SOFT }));
      }
    }
    footer(ops, w, h);
    return { w, h, ops };
  };
  return { pages: o.answers ? [draw(false), draw(true)] : [draw(false)], cw };
}

// ======================================================================== Sudoku
export type Level = "easy" | "medium" | "hard" | "expert";
const TARGET: Record<number, Record<Level, number>> = {
  4: { easy: 8, medium: 6, hard: 5, expert: 4 },
  6: { easy: 18, medium: 14, hard: 12, expert: 11 },
  9: { easy: 40, medium: 32, hard: 28, expert: 25 },
};

export function makeSudoku(br: number, bc: number, level: Level, seed: number) {
  const N = br * bc, r = rng(seed);
  const grid = Array(N * N).fill(0);
  const ok = (g: number[], i: number, v: number) => {
    const row = Math.floor(i / N), col = i % N;
    for (let k = 0; k < N; k++) if (g[row * N + k] === v || g[k * N + col] === v) return false;
    const r0 = row - (row % br), c0 = col - (col % bc);
    for (let a = 0; a < br; a++) for (let b = 0; b < bc; b++) if (g[(r0 + a) * N + c0 + b] === v) return false;
    return true;
  };
  const fill = (i: number): boolean => {
    if (i === N * N) return true;
    for (const v of shuffle(Array.from({ length: N }, (_, k) => k + 1), r)) {
      if (ok(grid, i, v)) { grid[i] = v; if (fill(i + 1)) return true; grid[i] = 0; }
    }
    return false;
  };
  fill(0);
  const solution = [...grid];
  const count = (g: number[], limit: number): number => {
    let best = -1, bestC: number[] = [];
    for (let i = 0; i < N * N; i++) if (!g[i]) {
      const cands: number[] = [];
      for (let v = 1; v <= N; v++) if (ok(g, i, v)) cands.push(v);
      if (!cands.length) return 0;
      if (best < 0 || cands.length < bestC.length) { best = i; bestC = cands; if (cands.length === 1) break; }
    }
    if (best < 0) return 1;
    let total = 0;
    for (const v of bestC) { g[best] = v; total += count(g, limit - total); g[best] = 0; if (total >= limit) break; }
    return total;
  };
  const puzzle = [...solution];
  let clues = N * N;
  const target = TARGET[N]?.[level] ?? Math.round(N * N * 0.4);
  for (const i of shuffle(Array.from({ length: N * N }, (_, k) => k), r)) {
    if (clues <= target) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (count([...puzzle], 2) !== 1) puzzle[i] = keep; else clues--;
  }
  return { puzzle, solution, N, br, bc, clues };
}

export type SudokuOpts = { box: "2x2" | "2x3" | "3x3"; level: Level; count: number; perPage: 1 | 2 | 4 | 6; size: SizeKey; seed: number; answers: boolean; title: string };
// Generating a hard puzzle takes a moment; layout changes (per page, paper size) reuse the same puzzles.
const SUDOKU_CACHE = new Map<string, ReturnType<typeof makeSudoku>>();
function cachedSudoku(br: number, bc: number, level: Level, seed: number) {
  const k = `${br}x${bc}|${level}|${seed}`;
  let s = SUDOKU_CACHE.get(k);
  if (!s) { s = makeSudoku(br, bc, level, seed); if (SUDOKU_CACHE.size > 200) SUDOKU_CACHE.clear(); SUDOKU_CACHE.set(k, s); }
  return s;
}
export function sudokuPages(o: SudokuOpts): Page[] {
  const [br, bc] = o.box === "2x2" ? [2, 2] : o.box === "2x3" ? [2, 3] : [3, 3];
  const list = Array.from({ length: clamp(Math.round(o.count), 1, 24) }, (_, i) => cachedSudoku(br, bc, o.level, o.seed + i * 104729));
  const { w, h } = pageSize(o.size, false);
  const m = 36;
  const slots = (per: number, y0: number) => {
    const cols = per === 1 ? 1 : 2, rows = Math.ceil(per / cols);
    const sw = (w - 2 * m) / cols, sh = (h - y0 - 36) / rows;
    return Array.from({ length: per }, (_, i) => [m + (i % cols) * sw, y0 + Math.floor(i / cols) * sh, sw, sh]);
  };
  const drawGrid = (ops: Op[], s: ReturnType<typeof makeSudoku>, x: number, y: number, size: number, key: boolean, label: string) => {
    const N = s.N, cell = size / N;
    ops.push({ t: "text", x, y: y - 6, s: label, size: 9, font: "sansBold", c: SOFT });
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const v = s.puzzle[i * N + j], sol = s.solution[i * N + j];
      if (v || key) ops.push({ t: "text", x: x + j * cell + cell / 2, y: y + i * cell + cell * 0.7, s: String(v || sol), size: cell * 0.55, font: v ? "sansBold" : "sans", c: v ? INK : "#d6336c", align: "center" });
    }
    for (let k = 0; k <= N; k++) {
      const thickR = k % s.br === 0, thickC = k % s.bc === 0;
      ops.push({ t: "line", x1: x, y1: y + k * cell, x2: x + size, y2: y + k * cell, w: thickR ? 2 : 0.6, c: LINE });
      ops.push({ t: "line", x1: x + k * cell, y1: y, x2: x + k * cell, y2: y + size, w: thickC ? 2 : 0.6, c: LINE });
    }
  };
  const pages: Page[] = [];
  const LV = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert" }[o.level];
  const render = (key: boolean, per: number) => {
    for (let i = 0; i < list.length; i += per) {
      const ops: Op[] = [];
      const y0 = header(ops, w, m, `${o.title || "Sudoku"} (${LV})${key ? " — solutions" : ""}`, !key) + 14;
      slots(per, y0).slice(0, list.length - i).forEach(([sx, sy, sw, sh], k) => {
        const size = Math.min(sw, sh) - 28;
        drawGrid(ops, list[i + k], sx + (sw - size) / 2, sy + 14, size, key, `#${i + k + 1}`);
      });
      footer(ops, w, h);
      pages.push({ w, h, ops });
    }
  };
  render(false, o.perPage);
  if (o.answers) render(true, Math.max(o.perPage, 4) as number);
  return pages;
}

// ======================================================================== Maze
export function makeMaze(cols: number, rows: number, seed: number) {
  const C = clamp(Math.round(cols), 4, 60), R = clamp(Math.round(rows), 4, 80);
  const r = rng(seed);
  // walls: bit 1 top, 2 right, 4 bottom, 8 left
  const walls = Array(C * R).fill(15);
  const seen = Array(C * R).fill(false);
  const stack = [0];
  seen[0] = true;
  const moves: [number, number, number, number][] = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]];
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const x = cur % C, y = Math.floor(cur / C);
    const opts = moves.filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < C && ny < R && !seen[ny * C + nx]; });
    if (!opts.length) { stack.pop(); continue; }
    const [dx, dy, wb, nb] = opts[Math.floor(r() * opts.length)];
    const nxt = (y + dy) * C + x + dx;
    walls[cur] &= ~wb; walls[nxt] &= ~nb; seen[nxt] = true; stack.push(nxt);
  }
  walls[0] &= ~1; walls[C * R - 1] &= ~4; // entrance top-left, exit bottom-right
  // BFS for the solution
  const prev = Array(C * R).fill(-1); prev[0] = 0;
  const q = [0];
  while (q.length) {
    const cur = q.shift()!;
    const x = cur % C, y = Math.floor(cur / C);
    for (const [dx, dy, wb] of moves) {
      if (walls[cur] & wb) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= C || ny >= R) continue;
      const nxt = ny * C + nx;
      if (prev[nxt] === -1) { prev[nxt] = cur; q.push(nxt); }
    }
  }
  const path: number[] = [];
  for (let c = C * R - 1; c !== 0; c = prev[c]) { path.push(c); if (prev[c] === -1) break; }
  path.push(0);
  return { C, R, walls, path: path.reverse() };
}

export type MazeOpts = { cols: number; rows: number; count: number; size: SizeKey; seed: number; answers: boolean; title: string };
export function mazePages(o: MazeOpts): Page[] {
  const { w, h } = pageSize(o.size, false);
  const m = 40;
  const pages: Page[] = [], keys: Page[] = [];
  for (let p = 0; p < clamp(Math.round(o.count), 1, 10); p++) {
    const mz = makeMaze(o.cols, o.rows, o.seed + p * 31337);
    const draw = (key: boolean): Page => {
      const ops: Op[] = [];
      const y0 = header(ops, w, m, `${o.title || "Maze"}${key ? " — solution" : ""}`, !key) + 18;
      const cell = Math.min((w - 2 * m) / mz.C, (h - y0 - 50) / mz.R);
      const gx = (w - cell * mz.C) / 2, gy = y0;
      const lw = Math.max(0.8, Math.min(2.2, cell * 0.09));
      if (key) for (let i = 1; i < mz.path.length; i++) {
        const a = mz.path[i - 1], b = mz.path[i];
        ops.push({ t: "line", x1: gx + (a % mz.C) * cell + cell / 2, y1: gy + Math.floor(a / mz.C) * cell + cell / 2, x2: gx + (b % mz.C) * cell + cell / 2, y2: gy + Math.floor(b / mz.C) * cell + cell / 2, w: Math.max(1.2, cell * 0.25), c: "#d6336c" });
      }
      for (let i = 0; i < mz.C * mz.R; i++) {
        const x = gx + (i % mz.C) * cell, y = gy + Math.floor(i / mz.C) * cell, wl = mz.walls[i];
        if (wl & 1) ops.push({ t: "line", x1: x, y1: y, x2: x + cell, y2: y, w: lw, c: LINE });
        if (wl & 8) ops.push({ t: "line", x1: x, y1: y, x2: x, y2: y + cell, w: lw, c: LINE });
        if (i % mz.C === mz.C - 1 && wl & 2) ops.push({ t: "line", x1: x + cell, y1: y, x2: x + cell, y2: y + cell, w: lw, c: LINE });
        if (Math.floor(i / mz.C) === mz.R - 1 && wl & 4) ops.push({ t: "line", x1: x, y1: y + cell, x2: x + cell, y2: y + cell, w: lw, c: LINE });
      }
      ops.push({ t: "text", x: gx + cell / 2, y: gy - 6, s: "Start", size: 9, font: "sansBold", c: "#d6336c", align: "center" });
      ops.push({ t: "text", x: gx + cell * (mz.C - 0.5), y: gy + cell * mz.R + 14, s: "Finish", size: 9, font: "sansBold", c: "#d6336c", align: "center" });
      footer(ops, w, h);
      return { w, h, ops };
    };
    pages.push(draw(false));
    if (o.answers) keys.push(draw(true));
  }
  return [...pages, ...keys];
}
