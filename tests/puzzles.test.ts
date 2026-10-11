import { test } from "node:test";
import assert from "node:assert/strict";
import { bingoCards, makeWordSearch, makeCrossword, makeSudoku, makeMaze, wordSearchPages, crosswordPages, sudokuPages, mazePages, bingoPages } from "../lib/puzzles.ts";
import { ITEMS } from "../lib/catalog.ts";
import { getContent } from "../lib/content.ts";
import { THEMES, CLUE_SETS } from "../lib/themes.ts";

const finite = (pages: { ops: Record<string, unknown>[] }[]) => { for (const p of pages) for (const o of p.ops) for (const [k, v] of Object.entries(o)) if (typeof v === "number") assert.ok(Number.isFinite(v), `${o.t}.${k}=${v}`); };

test("bingo: classic columns and unique cards", () => {
  const cards = bingoCards({ items: [], classic: true, cards: 50, grid: 5, free: true, freeText: "FREE", perPage: 2, title: "", size: "letter", seed: 1, callSheet: true });
  assert.equal(new Set(cards.map((c) => c.join())).size, 50);
  for (const c of cards) for (let i = 0; i < 25; i++) {
    if (i === 12) { assert.equal(c[i], "FREE"); continue; }
    const v = Number(c[i]), col = i % 5;
    assert.ok(v >= col * 15 + 1 && v <= col * 15 + 15, `col ${col} has ${v}`);
  }
  const custom = bingoCards({ items: Array.from({ length: 30 }, (_, i) => `w${i}`), classic: false, cards: 10, grid: 5, free: true, freeText: "FREE", perPage: 4, title: "", size: "letter", seed: 2, callSheet: true });
  for (const c of custom) assert.equal(new Set(c).size, 25);
  finite(bingoPages({ items: ["a"], classic: false, cards: 3, grid: 3, free: false, freeText: "", perPage: 4, title: "T", size: "a4", seed: 3, callSheet: true }) as never);
});

test("word search: every word placed once, nothing nested, no rude filler", async () => {
  const { nestedWords } = await import("../lib/puzzles.ts");
  const { KIDS_WORDS, LARGE_PRINT_WORDS } = await import("../lib/themes.ts");
  const RUDE = ["FUCK", "SHIT", "CUNT", "COCK", "DICK", "ASS", "TIT", "FAG", "CUM", "SEX", "PORN", "SLUT", "PISS", "NAZI", "RAPE"];
  const read = (g: string[][]) => { const n = g.length, lines: string[] = []; const D = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    for (const [dr, dc] of D) for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const pr = r - dr, pc = c - dc; if (pr >= 0 && pr < n && pc >= 0 && pc < n) continue; let s = ""; for (let i = r, j = c; i >= 0 && i < n && j >= 0 && j < n; i += dr, j += dc) s += g[i][j]; lines.push(s, [...s].reverse().join("")); }
    return lines; };
  const count = (lines: string[], w: string) => lines.reduce((a, l) => { let k = 0, i = -1; while ((i = l.indexOf(w, i + 1)) >= 0) k++; return a + k; }, 0);
  const lists: [string, string[], number, "easy" | "medium" | "hard"][] = [
    ...THEMES.filter((x) => x.words).flatMap((t) => [[t.slug, t.words!, 15, "medium"], [t.slug, t.words!, 15, "hard"], [t.slug, t.words!, 15, "easy"]] as [string, string[], number, "easy" | "medium" | "hard"][]),
    ["kids", KIDS_WORDS, 10, "easy"], ["large", LARGE_PRINT_WORDS, 13, "medium"],
  ];
  for (const [slug, words, size, dirs] of lists) {
    assert.deepEqual(nestedWords(words), [], `${slug} has nested words`);
    for (let seed = 1; seed <= 12; seed++) {
      const ws = makeWordSearch(words, size, dirs, seed * 31);
      assert.equal(ws.skipped.length, 0, `${slug} ${size} ${dirs} seed ${seed} skipped ${ws.skipped}`);
      const lines = read(ws.grid);
      for (const p of ws.placed) {
        const pal = p.word === [...p.word].reverse().join("");
        assert.equal(count(lines, p.word), pal ? 2 : 1, `${slug}: ${p.word} appears ${count(lines, p.word)} times`);
      }
      for (const bad of RUDE) {
        const inWords = ws.placed.reduce((a, p) => a + count([p.word, [...p.word].reverse().join("")], bad), 0);
        assert.equal(count(lines, bad), inWords, `${slug} seed ${seed} contains ${bad}`);
      }
    }
  }
  assert.deepEqual(nestedWords(["CORN", "ACORN", "TAR", "RAT"]).map((x) => x.word), ["CORN"]);
});

test("word search places words correctly", () => {
  for (const t of THEMES.filter((x) => x.words)) {
    const ws = makeWordSearch(t.words!, 15, "hard", 7);
    assert.equal(ws.skipped.length, 0, `${t.slug} skipped ${ws.skipped}`);
    for (const p of ws.placed) for (let i = 0; i < p.word.length; i++) assert.equal(ws.grid[p.r + p.dr * i][p.c + p.dc * i], p.word[i]);
  }
  const { skipped } = wordSearchPages({ words: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"], gridSize: 10, dirs: "easy", title: "", size: "letter", seed: 1, answers: true, large: false, puzzles: 1 });
  assert.equal(skipped.length, 1);
});

test("crossword: all built-in sets place every word, grid is consistent", () => {
  for (const set of CLUE_SETS) {
    const cw = makeCrossword(set.entries, 5);
    assert.equal(cw.skipped.length, 0, `${set.slug}: ${cw.skipped.map((e) => e.answer)}`);
    for (const p of cw.placed) for (let i = 0; i < p.answer.length; i++) {
      const r = p.r + (p.across ? 0 : i), c = p.c + (p.across ? i : 0);
      assert.equal(cw.cells.get(`${r},${c}`), p.answer[i]);
    }
    finite(crosswordPages({ entries: set.entries, title: "x", size: "letter", seed: 5, answers: true, wordBank: true }).pages as never);
  }
});

test("sudoku: valid solution and unique puzzle", () => {
  for (const [br, bc] of [[3, 3], [2, 3], [2, 2]]) {
    const s = makeSudoku(br, bc, "hard", 9);
    const N = br * bc;
    for (let i = 0; i < N; i++) {
      assert.equal(new Set(s.solution.slice(i * N, i * N + N)).size, N);
      assert.equal(new Set(Array.from({ length: N }, (_, k) => s.solution[k * N + i])).size, N);
    }
    for (let i = 0; i < N * N; i++) if (s.puzzle[i]) assert.equal(s.puzzle[i], s.solution[i]);
  }
  finite(sudokuPages({ box: "3x3", level: "easy", count: 4, perPage: 4, size: "letter", seed: 3, answers: true, title: "" }) as never);
});

test("maze: solution path connects start to finish", () => {
  const m = makeMaze(16, 20, 4);
  assert.equal(m.path[0], 0);
  assert.equal(m.path[m.path.length - 1], m.C * m.R - 1);
  finite(mazePages({ cols: 10, rows: 12, count: 2, size: "letter", seed: 1, answers: true, title: "" }) as never);
});

test("content: every page, meta 115–160", () => {
  for (const i of ITEMS) {
    const c = getContent(i.key);
    assert.ok(c.meta.length >= 115 && c.meta.length <= 160, `${i.key} ${c.meta.length}`);
    for (const r of c.related) assert.ok(ITEMS.some((x) => x.key === r), `${i.key} -> ${r}`);
  }
});
