"use client";

import { useMemo, useState } from "react";
import { SIZES, type SizeKey } from "@/lib/draw";
import { bingoPages, cleanWord, crosswordPages, mazePages, sudokuPages, wordSearchPages, type Dirs, type Entry, type Level } from "@/lib/puzzles";
import { CLUE_SETS, CLUE_SET_BY_SLUG, DEFAULT_CUSTOM, KIDS_WORDS, LARGE_PRINT_WORDS, THEMES, THEME_BY_SLUG, YEARLY_GOALS, YEAR_END_GOALS } from "@/lib/themes";
import ToolShell from "./ToolShell";
import { Check, Group, Num, Select, Seg, Text, num } from "./ui";

const SIZE_OPTS: [SizeKey, string][] = (Object.keys(SIZES) as SizeKey[]).map((k) => [k, SIZES[k].label]);
// One item per line; commas separate items only when everything is on one line (so "10,000 steps" survives).
const lines = (s: string) => (s.includes("\n") ? s.split("\n") : s.split(",")).map((x) => x.trim()).filter(Boolean);
const newSeed = () => Math.floor(Math.random() * 1e9);

// ---------------------------------------------------------------- Bingo
export type BingoMode = "custom" | "classic" | "blank" | "theme" | "yearly";
export function BingoTool({ mode, theme, year = 2027, slug, title }: { mode: BingoMode; theme?: string; year?: number; slug: string; title: string }) {
  const th = theme ? THEME_BY_SLUG[theme] : undefined;
  const initialItems = mode === "theme" && th?.bingo ? th.bingo.join("\n") : mode === "yearly" ? (year <= 2026 ? YEAR_END_GOALS : YEARLY_GOALS).join("\n") : "Coffee\nPizza\nDog\nBeach\nGuitar\nPancakes\nSunset\nBicycle\nMovie night\nRainbow\nCamping\nIce cream\nBooks\nGarden\nRoad trip\nBaseball\nPopcorn\nPuppy\nPicnic\nSkateboard\nFireworks\nTacos\nKaraoke\nBirthday cake";
  const [items, setItems] = useState(initialItems);
  const [cards, setCards] = useState(mode === "yearly" ? "1" : mode === "blank" ? "2" : "4");
  const [grid, setGrid] = useState<"3" | "4" | "5">("5");
  const [free, setFree] = useState(mode !== "yearly");
  const [freeText, setFreeText] = useState("FREE");
  const [per, setPer] = useState<"1" | "2" | "4">(mode === "yearly" ? "1" : "2");
  const [cardTitle, setCardTitle] = useState(mode === "yearly" ? `${year} Bingo` : mode === "theme" && th ? `${th.name} Bingo` : "");
  const [size, setSize] = useState<SizeKey>("letter");
  const [seed, setSeed] = useState(year);
  const [call, setCall] = useState(mode !== "blank" && mode !== "yearly");
  const list = lines(items);
  const classic = mode === "classic";
  const g = classic ? 5 : (Number(grid) as 3 | 4 | 5);
  const need = g * g - (g % 2 === 1 && free ? 1 : 0);
  const pages = useMemo(() => bingoPages({
    items: list, classic, cards: num(cards), grid: g, free, freeText, perPage: Number(per) as 1 | 2 | 4, title: cardTitle, size, seed, callSheet: call, blank: mode === "blank",
  }), [list.join("|"), classic, cards, g, free, freeText, per, cardTitle, size, seed, call, mode]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ToolShell pages={pages} filename={`${slug}.pdf`} title={title} note={mode === "custom" || mode === "theme" ? "Every card is shuffled differently. The caller's sheet is the last page." : undefined}>
      {(mode === "custom" || mode === "theme" || mode === "yearly") && (
        <Group title={mode === "yearly" ? "Your goals" : "Words or phrases"}>
          <Text id="items" label="One per line" rows={8} value={items} onChange={(v) => setItems(v.slice(0, 6000))}
            help={list.length < need ? `${list.length} entered: add ${need - list.length} more so no square repeats on a card.` : `${list.length} entered; each card uses ${need}.`} />
        </Group>
      )}
      <Group title="Cards">
        {!classic && <Seg name="grid" label="Card size" value={grid} onChange={setGrid} options={[["5", "5 × 5"], ["4", "4 × 4"], ["3", "3 × 3"]]} />}
        {mode !== "blank" && mode !== "yearly" && <Num id="cards" label="Number of cards" value={cards} onChange={setCards} step="1" min={1} max={200} help="Up to 200, all different" />}
        {mode === "blank" && <Num id="cards" label="Number of cards" value={cards} onChange={setCards} step="1" min={1} max={40} />}
        {g % 2 === 1 && <Check label="Free space in the center" checked={free} onChange={setFree} />}
        {g % 2 === 1 && free && <Text id="freeText" label="Free space text" value={freeText} onChange={(v) => setFreeText(v.slice(0, 24))} />}
        <Text id="title" label="Title on the card" value={cardTitle} onChange={(v) => setCardTitle(v.slice(0, 40))} placeholder={g === 5 ? "Leave empty for B-I-N-G-O" : "BINGO"} />
        <Select id="per" label="Cards per page" value={per} onChange={setPer} options={[["1", "1 (large)"], ["2", "2"], ["4", "4 (small)"]]} />
        {mode !== "blank" && mode !== "yearly" && <Check label="Add a caller's sheet" checked={call} onChange={setCall} />}
        {mode !== "blank" && <button type="button" className="btn-ghost" onClick={() => setSeed(newSeed())}>Shuffle cards</button>}
      </Group>
      <Group title="Page"><Select id="size" label="Paper size" value={size} onChange={setSize} options={SIZE_OPTS} /></Group>
    </ToolShell>
  );
}

// ---------------------------------------------------------------- Word search
export function WordSearchTool({ theme, kind, slug, title, pick }: { theme?: string; kind?: "kids" | "large" | "custom"; slug: string; title: string; pick?: boolean }) {
  const th = theme ? THEME_BY_SLUG[theme] : undefined;
  const start = th?.words ?? (kind === "kids" ? KIDS_WORDS : kind === "large" ? LARGE_PRINT_WORDS : DEFAULT_CUSTOM);
  const [words, setWords] = useState(start.join("\n"));
  const [gridSize, setGridSize] = useState(kind === "kids" ? "10" : kind === "large" ? "13" : "15");
  const [dirs, setDirs] = useState<Dirs>(kind === "kids" ? "easy" : kind === "large" ? "medium" : "medium");
  const [puzzleTitle, setPuzzleTitle] = useState(th ? `${th.name} word search` : kind === "kids" ? "Word search for kids" : kind === "large" ? "Large print word search" : "My word search");
  const [size, setSize] = useState<SizeKey>("letter");
  const [answers, setAnswers] = useState(true);
  const [count, setCount] = useState("1");
  const [seed, setSeed] = useState(11);
  const wl = lines(words);
  const { pages, skipped, nested } = useMemo(() => wordSearchPages({ words: wl, gridSize: num(gridSize), dirs, title: puzzleTitle, size, seed, answers, large: kind === "large" || kind === "kids", puzzles: num(count) }), [wl.join("|"), gridSize, dirs, puzzleTitle, size, seed, answers, kind, count]); // eslint-disable-line react-hooks/exhaustive-deps
  const longest = Math.max(0, ...wl.map((x) => cleanWord(x).length));
  return (
    <ToolShell pages={pages} filename={`${slug}.pdf`} title={title} note={answers ? "Answer keys follow the puzzles in the PDF." : undefined}>
      <Group title="Words">
        {pick && (
          <Select id="theme" label="Theme" value={THEMES.find((t) => t.words?.join("\n") === words)?.slug ?? "custom"}
            onChange={(v) => {
              const t = THEME_BY_SLUG[v];
              if (!t?.words) return;
              setWords(t.words.join("\n")); setPuzzleTitle(`${t.name} word search`);
              // Make sure the grid has room: about 60% of cells for answers, and at least the longest word.
              const letters = t.words.join("").replace(/[^A-Za-z]/g, "").length, long = Math.max(...t.words.map((x) => cleanWord(x).length));
              const need = [10, 12, 13, 15, 18, 20, 25].find((n) => n >= long && letters <= n * n * 0.6) ?? 25;
              if (need > num(gridSize)) setGridSize(String(need));
            }}
            options={[...THEMES.filter((t) => t.words).map((t) => [t.slug, t.name] as [string, string]), ["custom", "My own words"]]} />
        )}
        <Text id="words" label="Words to hide (one per line)" rows={8} value={words} onChange={(v) => setWords(v.slice(0, 3000))}
          help={`${wl.length} words. Spaces and punctuation are removed.${longest > num(gridSize) ? ` Longest word has ${longest} letters: make the grid at least that big.` : ""}`} />
        {skipped.length > 0 && <p className="warn">Didn&apos;t fit: {skipped.join(", ")}. Make the grid bigger or remove some words.</p>}
        {nested.length > 0 && <p className="warn">Left out because they are hidden inside longer words: {nested.map((x) => `${x.word} (in ${x.inside})`).join(", ")}.</p>}
      </Group>
      <Group title="Puzzle">
        <Text id="ptitle" label="Title" value={puzzleTitle} onChange={(v) => setPuzzleTitle(v.slice(0, 50))} />
        <Select id="grid" label="Grid size" value={gridSize} onChange={setGridSize} options={[["8", "8 × 8"], ["10", "10 × 10"], ["12", "12 × 12"], ["13", "13 × 13"], ["15", "15 × 15"], ["18", "18 × 18"], ["20", "20 × 20"], ["25", "25 × 25"]]} />
        <Select id="dirs" label="Difficulty" value={dirs} onChange={setDirs} options={[["easy", "Easy: across and down"], ["medium", "Medium: plus diagonals"], ["hard", "Hard: all 8 directions, backwards too"]]} />
        <Select id="count" label="Different puzzles in the PDF" value={count} onChange={setCount} options={[["1", "1"], ["2", "2"], ["3", "3"], ["5", "5"], ["10", "10"]]} help="Same words, new layout each time" />
        <Check label="Include answer keys" checked={answers} onChange={setAnswers} />
        <button type="button" className="btn-ghost" onClick={() => setSeed(newSeed())}>New layout</button>
      </Group>
      <Group title="Page"><Select id="size" label="Paper size" value={size} onChange={setSize} options={SIZE_OPTS} /></Group>
    </ToolShell>
  );
}

// ---------------------------------------------------------------- Crossword
const parseEntries = (s: string): Entry[] => s.split("\n").map((ln) => {
  const m = ln.split(/\s*[-–—:|]\s+|\t/);
  return m.length >= 2 ? { answer: m[0], clue: m.slice(1).join(" - ") } : { answer: m[0] ?? "", clue: "" };
}).filter((e) => cleanWord(e.answer).length >= 2);
const toText = (e: Entry[]) => e.map((x) => `${x.answer.toLowerCase()} - ${x.clue}`).join("\n");

export function CrosswordTool({ set, slug, title }: { set?: string; slug: string; title: string }) {
  const [setSlug, setSetSlug] = useState(set ?? "animals");
  const [text, setText] = useState(toText(CLUE_SET_BY_SLUG[set ?? "animals"].entries));
  const [cwTitle, setCwTitle] = useState(set === undefined ? "My crossword" : `${CLUE_SET_BY_SLUG[set ?? "animals"].name} crossword`);
  const [answers, setAnswers] = useState(true);
  const [bank, setBank] = useState(false);
  const [size, setSize] = useState<SizeKey>("letter");
  const [seed, setSeed] = useState(5);
  const entries = parseEntries(text);
  const { pages, cw } = useMemo(() => crosswordPages({ entries, title: cwTitle, size, seed, answers, wordBank: bank }), [JSON.stringify(entries), cwTitle, size, seed, answers, bank]); // eslint-disable-line react-hooks/exhaustive-deps
  const chooseSet = (s: string) => { setSetSlug(s); setText(toText(CLUE_SET_BY_SLUG[s].entries)); setCwTitle(`${CLUE_SET_BY_SLUG[s].name} crossword`); };
  const missingClue = entries.filter((e) => !e.clue).length;
  return (
    <ToolShell pages={pages} filename={`${slug}.pdf`} title={title} note={`${cw.placed.length} of ${entries.length} words placed.`}>
      {set !== undefined && (
        <Group title="Puzzle set">
          <Select id="set" label="Theme" value={setSlug} onChange={chooseSet} options={CLUE_SETS.map((c) => [c.slug, c.name])} />
        </Group>
      )}
      <Group title="Words and clues">
        <Text id="cw" label="One per line: word - clue" rows={10} value={text} onChange={(v) => setText(v.slice(0, 5000))} help="Example: whale - Largest animal on Earth. Up to about 25 words works best." />
        {cw.skipped.length > 0 && <p className="warn">Couldn&apos;t fit: {cw.skipped.map((e) => cleanWord(e.answer)).join(", ")}. Try New layout, or add words that share letters.</p>}
        {missingClue > 0 && <p className="warn">{missingClue} word{missingClue > 1 ? "s have" : " has"} no clue yet.</p>}
      </Group>
      <Group title="Options">
        <Text id="cwtitle" label="Title" value={cwTitle} onChange={(v) => setCwTitle(v.slice(0, 50))} />
        <Check label="Word bank under the clues (easier)" checked={bank} onChange={setBank} />
        <Check label="Answer key page" checked={answers} onChange={setAnswers} />
        <button type="button" className="btn-ghost" onClick={() => setSeed(newSeed())}>New layout</button>
        <Select id="size" label="Paper size" value={size} onChange={setSize} options={SIZE_OPTS} />
      </Group>
    </ToolShell>
  );
}

// ---------------------------------------------------------------- Sudoku
export function SudokuTool({ level: level0 = "medium", box: box0 = "3x3", slug, title }: { level?: Level; box?: "2x2" | "2x3" | "3x3"; slug: string; title: string }) {
  const [level, setLevel] = useState<Level>(level0);
  const [box, setBox] = useState<"2x2" | "2x3" | "3x3">(box0);
  const [count, setCount] = useState(box0 === "3x3" ? "4" : "6");
  const [per, setPer] = useState<"1" | "2" | "4" | "6">(box0 === "3x3" ? "4" : "6");
  const [answers, setAnswers] = useState(true);
  const [size, setSize] = useState<SizeKey>("letter");
  const [seed, setSeed] = useState(level0 === "easy" ? 101 : level0 === "hard" ? 303 : 202);
  const pages = useMemo(() => sudokuPages({ box, level, count: num(count), perPage: Number(per) as 1 | 2 | 4 | 6, size, seed, answers, title: box === "3x3" ? "Sudoku" : box === "2x2" ? "4 × 4 Sudoku" : "6 × 6 Sudoku" }), [box, level, count, per, size, seed, answers]);
  return (
    <ToolShell pages={pages} filename={`${slug}.pdf`} title={title} note="Every puzzle has exactly one solution. Solutions are at the end of the PDF.">
      <Group title="Puzzles">
        <Seg name="box" label="Grid" value={box} onChange={setBox} options={[["3x3", "9 × 9"], ["2x3", "6 × 6 (kids)"], ["2x2", "4 × 4 (beginners)"]]} />
        <Select id="level" label="Difficulty" value={level} onChange={setLevel} options={[["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"], ["expert", "Expert"]]} />
        <Select id="count" label="How many puzzles" value={count} onChange={setCount} options={[["1", "1"], ["2", "2"], ["4", "4"], ["6", "6"], ["8", "8"], ["12", "12"]]} />
        <Select id="per" label="Puzzles per page" value={per} onChange={setPer} options={[["1", "1 (large)"], ["2", "2"], ["4", "4"], ["6", "6"]]} />
        <Check label="Solutions at the end" checked={answers} onChange={setAnswers} />
        <button type="button" className="btn-ghost" onClick={() => setSeed(newSeed())}>New puzzles</button>
      </Group>
      <Group title="Page"><Select id="size" label="Paper size" value={size} onChange={setSize} options={SIZE_OPTS} /></Group>
    </ToolShell>
  );
}

// ---------------------------------------------------------------- Maze
const MAZE_SIZES: Record<string, [number, number]> = { easy: [10, 12], medium: [16, 20], hard: [24, 30], expert: [36, 46] };
export function MazeTool({ slug, title }: { slug: string; title: string }) {
  const [level, setLevel] = useState("medium");
  const [count, setCount] = useState("1");
  const [answers, setAnswers] = useState(true);
  const [size, setSize] = useState<SizeKey>("letter");
  const [seed, setSeed] = useState(17);
  const [c, r] = MAZE_SIZES[level];
  const pages = useMemo(() => mazePages({ cols: c, rows: r, count: num(count), size, seed, answers, title: "Maze" }), [c, r, count, size, seed, answers]);
  return (
    <ToolShell pages={pages} filename={`${slug}.pdf`} title={title}>
      <Group title="Maze">
        <Select id="level" label="Difficulty" value={level} onChange={setLevel} options={[["easy", "Easy (10 × 12, ages 4–6)"], ["medium", "Medium (16 × 20, ages 6–9)"], ["hard", "Hard (24 × 30)"], ["expert", "Expert (36 × 46)"]]} />
        <Select id="count" label="How many mazes" value={count} onChange={setCount} options={[["1", "1"], ["2", "2"], ["3", "3"], ["5", "5"], ["10", "10"]]} />
        <Check label="Solution pages" checked={answers} onChange={setAnswers} />
        <button type="button" className="btn-ghost" onClick={() => setSeed(newSeed())}>New maze</button>
      </Group>
      <Group title="Page"><Select id="size" label="Paper size" value={size} onChange={setSize} options={SIZE_OPTS} /></Group>
    </ToolShell>
  );
}
